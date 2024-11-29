import {Vector2} from "Utils/Vector2";
import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("RectCollider")
class RectCollider {
    @JsonProperty("size", Vector2) public size: Vector2;//is centered, as in, if offset = 0, then points are in this rect collider at +- size/2.
    @JsonProperty("offset", Vector2) public offset: Vector2;

    constructor(size : Vector2 = Vector2.Zero, offset: Vector2 = Vector2.Zero) {
        this.size = size;
        this.offset = offset;
    }

    containsPoint(point: Vector2, componentPosition: Vector2): boolean {
        const relativeX = Math.abs(point.x - componentPosition.x - this.offset.x);
        const relativeY = Math.abs(point.y - componentPosition.y - this.offset.y);
        return relativeX <= this.size.x * 0.5 && relativeY <= this.size.y * 0.5;
    }
}

export default RectCollider;
