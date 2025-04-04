import p5 from "p5";
import Grid from "Scene/Grid";
import DrawCall from "Scene/DrawCall";
import {Vector2} from "Utils/Vector2";
import Orientation from "Components/Orientation";
import UIElement from "UI/UIElement";
import {CreateUI} from "Scene/SceneUI";
import DraggingComponent from "Components/Dragging/DraggingComponent";
import SmartWire from "Components/Dragging/SmartWire";
import WireSegment from "Components/WireSegment";
import Settings, {EditMode} from "Settings/Settings";
import Connector from "Components/Connector";
import Component from "Components/Component";
import UIComponentRect from "UI/UIComponentRect";
import DraggingWire from "Components/Dragging/DraggingWire";

class SceneRenderer {
    DOUBLE_CLICK_THRESHOLD = 250;

    public p5Instance: p5;
    private canvasRef: HTMLDivElement;
    private grid: Grid;
    private uiRoot: UIElement | undefined = undefined;


    private renderScale = Vector2.One; // the scale factor applied to rendering to achieve the right rendering. Essentially the amount of pixels that equal one scene unit.
    public windowResolution = Vector2.One;
    private previousMousePosition: Vector2 | undefined = undefined;
    private previousClickPosition: Vector2 = Vector2.Zero;
    private previousClickTime: number = Date.now();

    // states
    private isTouching: boolean = false;
    private dragging: boolean = false;
    private draggingComponent: DraggingComponent | undefined = undefined;
    //private draggingConnector : Connector | undefined;
    //private draggingWire : { wire: WireSegment, position: Vector2 } | undefined;
    private draggingWire : DraggingWire | undefined;

    constructor(canvasRef: HTMLDivElement) {
        this.canvasRef = canvasRef;
        this.grid = new Grid();
        this.uiRoot = CreateUI(this.canvasRef);

        Settings.on("RenderSizeChanged", () => {
            this.resizeCanvas(this.windowResolution.x, this.windowResolution.y);
        });

        this.p5Instance = new p5((p: p5) => {
            p.setup = () => {
                p.createCanvas(this.canvasRef.offsetWidth, this.canvasRef.offsetHeight).parent(this.canvasRef);
            };

            p.draw = () => {
                p.background(200);
                const mousePos = this.getMousePosition();
                const drawCall = new DrawCall(p, this.renderScale, Settings.renderOffset, this.windowResolution);
                if(Settings.renderGrid)
                    this.grid.draw(drawCall);
                else
                    p.background(255);
                Settings.scene.draw(drawCall);
                this.uiRoot?.draw(drawCall);

                if(this.isInWindow(mousePos)) {
                    const scenePos = this.windowPointToScene(mousePos);
                    if (this.draggingComponent) {
                        this.draggingComponent.position = scenePos.snapToDualGrid();
                        const x = this.draggingComponent.position.x;
                        this.draggingComponent.orientation = Math.abs(Math.round(x) - x) < 0.01 ? Orientation.UP : Orientation.RIGHT;
                        this.draggingComponent.draw(drawCall);
                    }

                    if(this.draggingWire) {
                        this.draggingWire.draw(drawCall);
                    }
                }
            };

            p.touchMoved = () => {
                if(!this.isTouching) return;
                const clickPos = this.getMousePosition();
                this.handleClickDragged(clickPos);
            };

            p.touchEnded = () => {
                if(!this.isTouching) return;
                this.isTouching = false;
                const clickPos = this.getMousePosition();
                this.handleClickReleased(clickPos);
            };

            p.touchStarted = () => {
                if(this.isTouching) return;
                this.isTouching = true;
                const clickPos = this.getMousePosition();
                this.handleClickPressed(clickPos);
            };

            p.mouseDragged = () => {
                const clickPos = this.getMousePosition();
                this.handleClickDragged(clickPos);
            };

            p.mouseReleased = () => {
                const clickPos = this.getMousePosition();
                this.handleClickReleased(clickPos);
            };

            p.mousePressed = () => {
                const clickPos = this.getMousePosition();
                this.handleClickPressed(clickPos);
            };
        });
    }

    private handleClickPressed(clickPos: Vector2) {
        if(!this.isInWindow(clickPos)) return;
        this.previousClickPosition = clickPos;

        const uiElement = this.uiRoot?.getCollidedElement(clickPos);
        if (uiElement) {
            uiElement.onMousePressed(clickPos);
            if(uiElement instanceof UIComponentRect) {
                this.draggingComponent = new DraggingComponent((uiElement as UIComponentRect).getComponent(), true); // Start dragging a new component
            }
            Settings.selectedComponent = undefined;
            return;
        }

        switch (Settings.editMode) {
            case EditMode.SELECT:
            default: {
                const doubleClick = this.updateClickTime();
                const scenePos = this.windowPointToScene(clickPos);
                const sceneCast = Settings.scene.getObjectAtPosition(scenePos);
                if (sceneCast) {
                    if(sceneCast.connector) {
                        this.draggingWire = new DraggingWire();
                        Settings.selectedComponent = undefined;
                        return;
                    } else {
                        if(doubleClick) {
                            Settings.scene.removeObject(sceneCast.component);
                        }
                        if(sceneCast.component instanceof WireSegment) {
                            this.draggingWire = new DraggingWire();
                        } else if (sceneCast.component instanceof Component) {
                            Settings.selectedComponent = sceneCast.component;
                            this.draggingComponent = new DraggingComponent(sceneCast.component, false); // Start dragging the existing component
                            sceneCast.component.dragged = true;
                        } else {
                            Settings.selectedComponent = undefined;
                        }
                        return;
                    }
                }
                Settings.selectedComponent = undefined;
                this.dragging = true;
                return;
            }
            case EditMode.DRAW: {
                this.draggingWire = new DraggingWire();
                return;
            }
            case EditMode.ERASE: {
                this.dragging = true;
                return;
            }
        }



    };

    private handleClickDragged(clickPos: Vector2) {
        const dxdy = this.handleMouseDrag(clickPos);
        switch (Settings.editMode) {
            case EditMode.SELECT:
            case EditMode.DRAW: {
                if (this.dragging) {
                    Settings.renderOffset = Settings.renderOffset.add(dxdy.divideV(this.renderScale));
                }
                if(this.draggingWire) {
                    this.draggingWire.tryAddSegment(this.windowPointToScene(this.getMousePosition()));
                }
                return;
            }
            case EditMode.ERASE: {
                if(this.dragging) {
                    const scenePos = this.windowPointToScene(clickPos);
                    const sceneCast = Settings.scene.getObjectAtPosition(scenePos);
                    if (sceneCast) {
                        Settings.scene.removeObject(sceneCast.component);
                    }
                }
                return;
            }
        }
    }

    private handleClickReleased(clickPos: Vector2) {
        const scenePos = this.windowPointToScene(clickPos);
        if (this.draggingComponent) {
            if(!this.isInWindowNotUI(clickPos)) {
                if(!this.draggingComponent.isNewComponent) {
                    Settings.scene.removeObject(this.draggingComponent.component);
                }
            } else {

                if(this.draggingComponent.isNewComponent) {
                    this.draggingComponent.component.orientation = this.draggingComponent.orientation;
                    this.draggingComponent.component.position = this.draggingComponent.position;
                    Settings.scene.addComponent(this.draggingComponent.component);
                } else {
                    if(this.windowPointToScene(this.previousClickPosition).distanceTo(scenePos) > 0.25) {
                        this.draggingComponent.component.orientation = this.draggingComponent.orientation;
                        Settings.scene.moveComponent(this.draggingComponent.component, this.draggingComponent.position);
                    }
                }
            }
        }
        if(Date.now() - this.previousClickTime > this.DOUBLE_CLICK_THRESHOLD) {
            if(this.draggingWire) {
                Settings.scene.addWires(this.draggingWire.wires);
            }
        }
        if(this.draggingComponent)
            this.draggingComponent.component.dragged = false;
        this.draggingComponent = undefined;
        this.dragging = false;
        this.previousMousePosition = undefined;
        this.draggingWire = undefined;
    }

    private updateClickTime(): boolean {
        const clickTime = Date.now();
        const previous = this.previousClickTime;
        this.previousClickTime = clickTime;
        return clickTime - previous < this.DOUBLE_CLICK_THRESHOLD;
    }

    private isInWindow(position: Vector2): boolean {
        return position.x >= 0 && position.y >= 0 && position.x < this.p5Instance!.width && position.y < this.p5Instance!.height;
    }

    private isInWindowNotUI(position: Vector2): boolean {
        return this.isInWindow(position) && !this.uiRoot?.containsPoint(position);
    }

    private windowPointToScene(position: Vector2): Vector2 {
        return position.divideV(this.renderScale).subtract(Settings.renderOffset);
    }

/*    private getFirstTouchPosition(): Vector2 {
        return new Vector2(this.p5Instance.touches[0].x, this.p5Instance.mouseY);
    }*/

    private getMousePosition(): Vector2 {
        return new Vector2(this.p5Instance.mouseX, this.p5Instance.mouseY);
    }

    private handleMouseDrag(newPosition: Vector2) {
        let dxdy = Vector2.Zero;
        if (this.previousMousePosition) {
            dxdy = newPosition.subtract(this.previousMousePosition);
        }
        this.previousMousePosition = newPosition;
        return dxdy;
    }

    // Canvas size in pixels
    public resizeCanvas(width: number, height: number): void {
        this.renderScale = new Vector2(width / Settings.renderSize, width / Settings.renderSize);
        Settings.aspectRatio = new Vector2(1, height / width);
        this.windowResolution = new Vector2(width, height);
        this.p5Instance?.resizeCanvas(width, height);
        this.uiRoot?.updateRects(this.windowResolution);
    }
}

export default SceneRenderer;
