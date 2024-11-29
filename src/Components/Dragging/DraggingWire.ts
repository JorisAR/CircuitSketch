import WireSegment from "Components/WireSegment";
import DrawCall from "Scene/DrawCall";
import {Vector2} from "Utils/Vector2";


class DraggingWire {

    get wires() {
        console.log(this._wires.length);
        return this._wires;
    }

    set wires(value) {
        this._wires = value;
    }
    private _previousPoint : Vector2 | undefined;
    private _wires : WireSegment[] = [];
    private _points : Vector2[] = [];


    public draw(drawCall: DrawCall) {
        this._wires.forEach(wire => wire.draw(drawCall));
    }

    public tryAddSegment(position : Vector2) {
        if(this._previousPoint && this._previousPoint.distanceTo(position) < 0.9) return;

        const gridPos = position.round();
        this._previousPoint = gridPos;
        if(position.distanceTo(gridPos) < 0.5) {
            this._points.push(gridPos);
            const i = this._points.length
            if(i >= 2) {
                const a = this._points[i - 2];
                const b = this._points[i - 1];
                if(a.shareAxis(b)) {
                    this._wires.push(new WireSegment(a, b));
                }
                else {
                    const c = new Vector2(a.x, b.y);
                    this._wires.push(new WireSegment(a, c));
                    this._wires.push(new WireSegment(c, b));
                }
            }

        }

            //this._wires.push(new WireSegment(gridPos.floor(), gridPos.ceil() ))
    }
}

export default DraggingWire;
