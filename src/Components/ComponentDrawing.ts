import p5 from "p5";
import { Vector2 } from "Utils/Vector2";
import {DrawCircle, DrawRect} from "Utils/DrawFunctions";
import DrawCall from "Scene/DrawCall";
import WireSegment from "Components/WireSegment";

class ComponentDrawing {

    static strokeAndFill(drawCall: DrawCall, strokeAlpha=1.0, fillAlpha=1.0) {
        const p = drawCall.p;

        if(drawCall.highlight) {
            p.stroke(240, 15, 15, strokeAlpha *255.0 * drawCall.alpha);
            p.fill(240, 15, 15, fillAlpha * 255.0 * drawCall.alpha);
        } else {
            p.stroke(0, strokeAlpha * 255.0 * drawCall.alpha);
            p.fill(0, fillAlpha * 255.0 * drawCall.alpha);
        }
        p.strokeWeight(drawCall.renderScale.x * WireSegment.WIDTH);
    }

    static drawResistor(drawCall : DrawCall, size: Vector2): void {
        const p = drawCall.p;
        p.push();
        ComponentDrawing.strokeAndFill(drawCall, 1, 0);

        // ------------ BODY --------------
        const componentWidth = 0.6;
        DrawRect(p, new Vector2(0, 0).multiplyV(size), new Vector2(componentWidth, 0.2).multiplyV(size));
        ComponentDrawing.wireThroughComponent(drawCall, size.x, componentWidth);
        p.pop();
    }

    static drawLight(drawCall : DrawCall, size: Vector2): void {
        const p = drawCall.p;
        p.push();
        ComponentDrawing.strokeAndFill(drawCall, 1, 0);

        // ------------ BODY --------------
        const componentWidth = 0.6;
        DrawCircle(drawCall.p, Vector2.Zero, componentWidth * size.x);
        const v1 = new Vector2(0, 0.49 * componentWidth * size.x).rotate(Math.PI * 0.25);
        const v2 = new Vector2(0, 0.49 * componentWidth * size.x).rotate(-Math.PI * 0.25);
        p.line(v1.x, v1.y, -v1.x, -v1.y);
        p.line(v2.x, v2.y, -v2.x, -v2.y);

        ComponentDrawing.wireThroughComponent(drawCall, size.x, componentWidth);
        p.pop();
    }

    static drawDiode(drawCall : DrawCall, size: Vector2): void {
        const p = drawCall.p;
        p.push();
        ComponentDrawing.strokeAndFill(drawCall, 1, 1);

        // ------------ BODY --------------
        const componentWidth = 0.6;
        const a = new Vector2(.25, 0).multiplyV(size);
        const b = new Vector2(-.3, .28).multiplyV(size);
        const c = new Vector2(-.3, -.28).multiplyV(size);
        p.triangle(a.x, a.y, b.x, b.y, c.x, c.y);
        DrawRect(p, new Vector2(.3, 0).multiplyV(size), new Vector2(0.01, 0.55).multiplyV(size));
        ComponentDrawing.wireThroughComponent(drawCall, size.x, componentWidth);
        p.pop();
    }

    static drawBattery(drawCall : DrawCall, size: Vector2): void {
        const p = drawCall.p;
        p.push();
        ComponentDrawing.strokeAndFill(drawCall, 1, 1);

        // ------------ BODY --------------
        const componentWidth = 0.2;
        DrawRect(p, new Vector2(-0.08, 0).multiplyV(size), new Vector2(0.033, 0.6).multiplyV(size));
        DrawRect(p, new Vector2(0.1, 0).multiplyV(size), new Vector2(0.1, 0.3).multiplyV(size));
        ComponentDrawing.wireThroughComponent(drawCall, size.x, componentWidth);
        p.pop();
    }

    static drawSwitch(drawCall : DrawCall, size: Vector2): void {
        const p = drawCall.p;
        p.push();
        ComponentDrawing.strokeAndFill(drawCall, 1, 1);

        // ------------ BODY --------------
        const componentWidth = 0.6;
        const a = new Vector2(-0.3, 0).multiplyV(size);
        let b = new Vector2(0.3, 0).multiplyV(size);
        DrawCircle(drawCall.p,  a, 0.25 * componentWidth * size.x);
        DrawCircle(drawCall.p,  b, 0.25 * componentWidth * size.x);
        b = b.add(new Vector2(-0.1, 0.1).multiplyV(size));
        p.line(a.x, a.y, b.x, b.y );
        ComponentDrawing.wireThroughComponent(drawCall, size.x, componentWidth);
        p.pop();
    }

    static wireThroughComponent(drawCall : DrawCall, width : number, componentWidthRatio: number): void {
        const p = drawCall.p;
        p.push();
        ComponentDrawing.strokeAndFill(drawCall, 1, 1);
        const w = 0.5 * width;

        // ------------ BODY --------------
        p.line(- w, 0, - componentWidthRatio * w, 0);
        p.line(w, 0, componentWidthRatio * w, 0);

        p.pop();
    }

    static drawAxisAlignedWireSegment(drawCall : DrawCall, from: Vector2, to: Vector2): void {
        const p = drawCall.p;
        p.push();
        p.stroke(0, 255.0 * drawCall.alpha);
        p.fill(0, 255.0 * drawCall.alpha);
        p.strokeWeight(drawCall.renderScale.x * WireSegment.WIDTH);

        // ------------ BODY --------------
        p.line(from.x, from.y, to.x, to.y);

        p.pop();
    }
}

export default ComponentDrawing;
