import p5 from "p5";
import {Vector2} from "Utils/Vector2";
import UIElement from "UI/UIElement";
import { RectControl } from "UI/RectControl";
import DrawCall from "Scene/DrawCall";
import Component from "Components/Component";

type ComponentDrawFunction = (drawCall : DrawCall, size: Vector2) => void;
type ComponentGetFunction = () => Component;

class UIComponentRect extends UIElement {
    private drawComponent: ComponentDrawFunction;
    public getComponent: ComponentGetFunction;

    constructor(rectControl: RectControl, drawComponent: ComponentDrawFunction, getComponent: ComponentGetFunction) {
        super(rectControl);
        this.drawComponent = drawComponent;
        this.getComponent = getComponent;
    }

    protected drawFunction(drawCall: DrawCall): void {
        const p = drawCall.p;
        const size = this.rectControl.size;
        const position = this.rectControl.position;
        const oldScale = drawCall.renderScale;
        drawCall.renderScale = new Vector2(25, 25);

        p.push();
        p.translate(position.x + size.x / 2, position.y + size.y / 2);
        this.drawComponent(drawCall, size);
        p.pop();
        drawCall.renderScale = oldScale;
    }

    onMousePressed(point: Vector2): void {
        // Handle mouse pressed event
    }

    onMouseReleased(point: Vector2): void {
        // Handle mouse released event
    }
}

export default UIComponentRect;
