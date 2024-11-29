import p5 from "p5";
import { Vector2 } from "Utils/Vector2";
import DrawCall from "Scene/DrawCall";
import { RectControl } from "UI/RectControl";

abstract class UIElement {
    public rectControl: RectControl;
    protected children: UIElement[];
    protected parent: UIElement | undefined;
    public ignoreInput: boolean = false;

    constructor(rectControl: RectControl) {
        this.rectControl = rectControl;
        this.children = [];
    }

    public addChild(child: UIElement): void {
        this.children.push(child);
        child.parent = this;
    }

    public draw(drawCall: DrawCall): void {
        this.drawFunction(drawCall);
        for (const child of this.children) {
            child.draw(drawCall);
        }
    }

    public updateRects(windowSize: Vector2): void {
        const parentSize = this.parent ? this.parent.rectControl.size : windowSize;
        const parentPosition = this.parent ? this.parent.rectControl.position : Vector2.Zero;
        this.rectControl.calculatePositionAndSize(parentPosition, parentSize);
        for (const child of this.children) {
            child.updateRects(windowSize);
        }
    }

    protected abstract drawFunction(drawCall: DrawCall): void;

    public getCollidedElement(point: Vector2): UIElement | undefined {
        // Search for the point in reverse order (last child first)
        for (let i = this.children.length - 1; i >= 0; i--) {
            const collidedChild = this.children[i].getCollidedElement(point);
            if (collidedChild) {
                return collidedChild;
            }
        }

        // Check if the current element contains the point
        if (this.containsPoint(point)) {
            return this;
        }

        return undefined;
    }

    public containsPoint(point: Vector2): boolean {
        if (this.ignoreInput) return false;
        return point.x >= this.rectControl.position.x && point.x <= this.rectControl.position.x + this.rectControl.size.x
            && point.y >= this.rectControl.position.y && point.y <= this.rectControl.position.y + this.rectControl.size.y;
    }

    abstract onMousePressed(point: Vector2): void;

    abstract onMouseReleased(point: Vector2): void;
}

export default UIElement;
