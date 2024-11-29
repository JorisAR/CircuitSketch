import { Vector2 } from "Utils/Vector2";
import Component from "Components/Component";
import DrawCall from "Scene/DrawCall";
import RectCollider from "Utils/RectCollider";
import ComponentDrawing from "Components/ComponentDrawing";
import { JsonObject, JsonProperty } from "json2typescript";
import CircuitElement from "Components/CircuitElement";
import Connector from "Components/Connector";

@JsonObject("WireSegment")
class WireSegment extends CircuitElement {
    @JsonProperty("end", Vector2) public end: Vector2;

    public static readonly WIDTH : number = 0.1 ;

    constructor(start: Vector2 = Vector2.Zero, end: Vector2 = Vector2.Zero) {
        super(start);
        this.end = end;
        this.hitbox = this.calculateHitbox();
    }

    calculateHitbox(): RectCollider {
        const width = Math.abs(this.end.x - this.position.x) + WireSegment.WIDTH * 2;
        const height = Math.abs(this.end.y - this.position.y) + WireSegment.WIDTH * 2;
        const offsetX = (this.position.x + this.end.x) * 0.5 - this.position.x;
        const offsetY = (this.position.y + this.end.y) * 0.5 - this.position.y;
        return new RectCollider(new Vector2(width, height), new Vector2(offsetX, offsetY));
    }

    draw(drawCall: DrawCall): void {
        const a = this.position.add(drawCall.renderOffset).multiplyV(drawCall.renderScale);
        const b = this.end.add(drawCall.renderOffset).multiplyV(drawCall.renderScale);
        ComponentDrawing.drawAxisAlignedWireSegment(drawCall, a, b);
    }

    drawFunction(drawCall: DrawCall, size: Vector2): void {}

    public isOverlapping(other: WireSegment) {
        if (this.position.x === this.end.x && other.position.x === other.end.x) { // both vertical
            return this.position.x === other.position.x &&
                Math.max(this.position.y, this.end.y) >= Math.min(other.position.y, other.end.y) &&
                Math.min(this.position.y, this.end.y) <= Math.max(other.position.y, other.end.y);
        }
        if (this.position.y === this.end.y && other.position.y === other.end.y) { // both horizontal
            return this.position.y === other.position.y &&
                Math.max(this.position.x, this.end.x) >= Math.min(other.position.x, other.end.x) &&
                Math.min(this.position.x, this.end.x) <= Math.max(other.position.x, other.end.x);
        }
        return false;
    }

    public combineSegments (other: WireSegment): WireSegment {
        if (this.position.x === this.end.x) { // vertical
            const yMin = Math.min(this.position.y, this.end.y, other.position.y, other.end.y);
            const yMax = Math.max(this.position.y, this.end.y, other.position.y, other.end.y);
            return new WireSegment(new Vector2(this.position.x, yMin), new Vector2(this.position.x, yMax));
        }
        if (this.position.y === this.end.y) { // horizontal
            const xMin = Math.min(this.position.x, this.end.x, other.position.x, other.end.x);
            const xMax = Math.max(this.position.x, this.end.x, other.position.x, other.end.x);
            return new WireSegment(new Vector2(xMin, this.position.y), new Vector2(xMax, this.position.y));
        }
        return this;
    }

    public intersectsComponent(component: Component): boolean {
        const xMin = Math.min(this.position.x, this.end.x);
        const xMax = Math.max(this.position.x, this.end.x);
        const yMin = Math.min(this.position.y, this.end.y);
        const yMax = Math.max(this.position.y, this.end.y);

        const componentPos = component.position;

        return componentPos.x >= xMin && componentPos.x <= xMax &&
            componentPos.y >= yMin && componentPos.y <= yMax;
    }

    public getNormalFrom(position: Vector2): Vector2 {
        const lineDir = this.end.subtract(this.position).normalize();
        const toPoint = position.subtract(this.position);
        const projection = toPoint.dot(lineDir);
        let normal;

        if (projection < 0) {
            normal = position.subtract(this.position).discardSmallestDimension();
        } else if (projection > this.end.subtract(this.position).length()) {
            normal = position.subtract(this.end).discardSmallestDimension();
        } else {
            const closestPoint = this.position.add(lineDir.multiply(projection));
            normal = position.subtract(closestPoint);
        }
        return normal.normalize();
    }

    // Function to check if a point is on the line segment
    public getIntersectionColliders(connectors: Connector[]): Connector[] {
        const position = this.position;
        const end = this.end;

        // Filter and sort connectors that are on the line segment
        const intersectionColliders = connectors.filter(connector => {
            const { position: p } = connector;
            if (position.x === end.x) { // Vertical line
                return p.x === position.x && p.y >= Math.min(position.y, end.y) && p.y <= Math.max(position.y, end.y);
            } else { // Horizontal line
                return p.y === position.y && p.x >= Math.min(position.x, end.x) && p.x <= Math.max(position.x, end.x);
            }
        });

        intersectionColliders.sort((a, b) => {
            const distanceA = position.x === end.x
                ? a.position.y - position.y
                : a.position.x - position.x;
            const distanceB = position.x === end.x
                ? b.position.y - position.y
                : b.position.x - position.x;
            return distanceA - distanceB;
        });

        return intersectionColliders;
    }


}

export default WireSegment;
