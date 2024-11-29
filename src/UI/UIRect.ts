import p5 from "p5";
import {Vector2} from "Utils/Vector2";
import UIElement from "UI/UIElement";
import DrawCall from "Scene/DrawCall";
import {RectControl} from "UI/RectControl";

class UIRect extends UIElement {
    color: string;

    constructor(rectControl: RectControl, color: string = "gray") {
        super(rectControl);
        this.color = color;
    }

    onMousePressed(point: Vector2): void {
        // Handle mouse pressed event
    }

    onMouseReleased(point: Vector2): void {
        // Handle mouse released event
    }

    protected drawFunction(drawCall: DrawCall): void {
        const p = drawCall.p;
        p.push();
        p.fill(this.color);
        p.stroke(this.color);
        p.rect(this.rectControl.position.x, this.rectControl.position.y, this.rectControl.size.x, this.rectControl.size.y);

        p.pop();
    }
}

export default UIRect;
