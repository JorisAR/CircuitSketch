import {Vector2} from "Utils/Vector2";
import DrawCall from "Scene/DrawCall";
import ComponentDrawing from "Components/ComponentDrawing";
import WireSegment from "Components/WireSegment";


class SmartWire {

    static GetWireSegmentPositions(origin : Vector2, direction : Vector2, destination : Vector2, destinationDirection : Vector2 | undefined = undefined) : Vector2[] {
        //three cases:
        // - origin is in line with destination (e.g x or y are identical), return [origin, destination]
        // - destination is not in line, but is positive with respect to direction (i.e. destination = origin + t * direction + b, where b is an arbtirary vector perpendicular to b)
        // -- we now need 4 points [origin, origin + t * direction, origin + t * direction, destination]
        // - same as previous, but negative with respect to direction. In this case, walk forward a bit, turn around

        let result: Vector2[];
        let d : Vector2;

        if(destinationDirection) {
            d = destination.nextGridPoint(destinationDirection);
        } else {
            d = destination.round();
        }

        const t = direction.dot(d.subtract(origin));

        if(t > 0) {
            if(origin.x === d.x || origin.y === d.y) {
                result = [origin, d];
            } else {
                const a = origin.add(direction.multiply(t));
                result = [origin, a, a, d];
            }

        } else {
            const a = origin.nextGridPoint(direction);
            const a2d = d.subtract(a);
            const adir = a2d.subtract(direction.multiply(a2d.dot(direction))).normalize();
            const t2 = adir.dot(a2d);
            const b = a.add(adir.multiply(t2)).round();

            result = [origin, a, a, b, b, d];
        }

        if(destinationDirection) {
            result.push(d);
            result.push(destination);
        }

        return result;
    }

    static DrawLine(drawCall: DrawCall, origin : Vector2, direction : Vector2, destination : Vector2) {
        const positions = this.GetWireSegmentPositions(origin, direction, destination);

        for (let i = 0; i < positions.length; i+= 2){
            const a = positions[i].add(drawCall.renderOffset).multiplyV(drawCall.renderScale);
            const b = positions[i + 1].add(drawCall.renderOffset).multiplyV(drawCall.renderScale);
            ComponentDrawing.drawAxisAlignedWireSegment(drawCall, a, b);
        }
    }

    static CommitToSegments(origin : Vector2, direction : Vector2, destination : Vector2) : WireSegment[] {
        const positions = this.GetWireSegmentPositions(origin, direction, destination);
        const result : WireSegment[] = [];
        for (let i = 0; i < positions.length; i+= 2){
            result.push(new WireSegment(positions[i], positions[i+1]));
        }
        return result;
    }
}

export default SmartWire;
