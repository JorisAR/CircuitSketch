import p5 from "p5";
import { Vector2 } from "Utils/Vector2";
import Component from "Components/Component";
import DrawCall from "Scene/DrawCall";
import {GetRotationAngle, Orientation} from "Components/Orientation";

type ComponentDrawFunction = (p: p5, size: Vector2) => void;

class DraggingComponent {
    public component: Component;
    public isNewComponent: boolean;
    public position: Vector2 = Vector2.Zero;
    public orientation : Orientation;

    constructor(component: Component, isNewComponent : boolean) {
        this.isNewComponent = isNewComponent;
        this.component = component;
        this.orientation = this.component.orientation;
    }

    draw(drawCall: DrawCall, size: Vector2 = Component.DEFAULT_SIZE): void {
        const p = drawCall.p;
        const position = drawCall.sceneToWindow(this.position);
        p.push();
        p.translate(position.x, position.y);
        if(this.component) p.rotate(GetRotationAngle(this.orientation));
        this.component.drawFunction(drawCall, size.multiplyV(drawCall.renderScale));
        p.pop();
    }
}

export default DraggingComponent;
