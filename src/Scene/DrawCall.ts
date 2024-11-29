import p5 from "p5";
import {Vector2} from "Utils/Vector2";

class DrawCall {
    public p: p5;
    private renderSize = 25; // show 25 units horizontally

    public renderScale = Vector2.One; //the scale factor applied to rendering to achieve the right rendering. Essentially the amount of pixels that equal one scene unit.
    public renderOffset = Vector2.Zero; // the render offset in scene units
    public windowResolution = Vector2.One;
    public alpha = 1.0;

    constructor(p: p5, renderScale: Vector2, renderOffset: Vector2, windowResolution : Vector2) {
        this.p = p;
        this.renderScale = renderScale;
        this.renderOffset = renderOffset;
        this.windowResolution = windowResolution;
    }

    sceneToWindow(position: Vector2) : Vector2 {
        return position.add(this.renderOffset).multiplyV(this.renderScale);
    }
}

export default DrawCall;
