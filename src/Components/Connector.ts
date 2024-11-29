import { JsonObject, JsonProperty } from "json2typescript";
import { Vector2 } from "Utils/Vector2";

@JsonObject("Connector")
class Connector {
    @JsonProperty("position", Vector2)
    public position: Vector2 = new Vector2();

    @JsonProperty("direction", Vector2)
    public direction: Vector2 = new Vector2();

    constructor(position: Vector2 = new Vector2(), direction: Vector2 = new Vector2()) {
        this.position = position;
        this.direction = direction;
    }
}

export default Connector;
