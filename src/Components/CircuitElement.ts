import {Vector2} from "Utils/Vector2";
import {GetRotationAngle, Orientation} from "Components/Orientation";
import RectCollider from "Utils/RectCollider";
import DrawCall from "Scene/DrawCall";
import {JsonObject, JsonProperty} from "json2typescript";
import Connector from "Components/Connector";
import ComponentDrawing from "Components/ComponentDrawing";

@JsonObject("CircuitElement")
abstract class CircuitElement {
    @JsonProperty("_position", Vector2) protected _position: Vector2 = Vector2.Zero;
    @JsonProperty("hitbox", RectCollider) protected hitbox: RectCollider = new RectCollider(Vector2.Zero, Vector2.Zero);

    get position(): Vector2 {
        return this._position;
    }

    set position(value: Vector2) {
        this._position = value;
    }

    @JsonProperty("size", Vector2) public size: Vector2;

    constructor(position: Vector2 = Vector2.Zero) {
        this._position = position;
        this.size = Vector2.One;
        this.hitbox = new RectCollider(this.size, new Vector2(0, 0));
    }

    abstract draw(drawCall: DrawCall): void;

    abstract drawFunction(drawCall: DrawCall, size: Vector2): void;

    public containsPoint(position: Vector2): boolean {
        return this.hitbox.containsPoint(position, this._position);
    }
}

export default CircuitElement;
