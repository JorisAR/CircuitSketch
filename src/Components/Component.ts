import {Vector2} from "Utils/Vector2";
import {GetRotationAngle, Orientation} from "Components/Orientation";
import RectCollider from "Utils/RectCollider";
import DrawCall from "Scene/DrawCall";
import {JsonObject, JsonProperty} from "json2typescript";
import Connector from "Components/Connector";
import ComponentDrawing from "Components/ComponentDrawing";
import CircuitElement from "Components/CircuitElement";
import ComponentType from "Components/ComponentType";

@JsonObject("Component")
class Component extends CircuitElement {
    private static CONNECTOR_RADIUS = 0.5;
    public static DEFAULT_SIZE = new Vector2(3, 3);
    public selected = false;
    public dragged = false;
    @JsonProperty("componentType", Number) public componentType: ComponentType = ComponentType.RESISTOR;
    @JsonProperty("orientation", Number) public orientation: Orientation = Orientation.RIGHT;
    @JsonProperty("connectors", [Connector]) protected connectors: Connector[] = [];
    @JsonProperty("size", Vector2) public size: Vector2;

    constructor(type : ComponentType, position: Vector2 = Vector2.Zero, orientation: Orientation = Orientation.RIGHT) {
        super(position);
        this.componentType = type;
        this.size = Component.DEFAULT_SIZE;
        this.hitbox = new RectCollider(this.size.multiply(0.5), new Vector2(0, 0));
        this.inferConnectorsFromPositions([
            new Vector2(-this.size.x * 0.5, 0), // Connection point on the left
            new Vector2(this.size.x * 0.5, 0)   // Connection point on the right
        ]);
    }


    protected inferConnectorsFromPositions(vector2s: Vector2[]) : void {
        const result : {position : Vector2, direction : Vector2}[] = [];
        for (const position of vector2s) {
            const direction = position.discardSmallestDimension();
            result.push(
                {
                    position,
                    direction
                }
            );
        }

        this.connectors = result;
    }

    public getConnectors(): Connector[] {
        return this.connectors.map(conn => {
            const angle = GetRotationAngle(this.orientation);
            return {
                    position:  conn.position.rotate(angle).add(this._position),
                    direction: conn.direction.rotate(angle).normalize(),
                }
        });
    }

    draw(drawCall: DrawCall): void {
        if(this.dragged)
            drawCall.alpha *= 0.25;
        const p = drawCall.p;
        const center = drawCall.sceneToWindow(this.position);
        p.push();
        p.stroke(0);
        p.fill(0);
        p.translate(center.x, center.y);
        p.rotate(GetRotationAngle(this.orientation));

        // ------------ BODY --------------
        this.drawFunction(drawCall, this.size.multiplyV(drawCall.renderScale));
        //this.drawConnections(drawCall);

        p.pop();
        if(this.dragged)
            drawCall.alpha /= 0.25;
    }

    drawFunction(drawCall: DrawCall, size: Vector2): void {
        switch (this.componentType) {
            case ComponentType.LAMP:
                ComponentDrawing.drawLight(drawCall, size);
                return;
            case ComponentType.BATTERY:
                ComponentDrawing.drawBattery(drawCall, size);
                return;
            case ComponentType.SWITCH:
                ComponentDrawing.drawSwitch(drawCall, size);
                return;
            case ComponentType.DIODE:
                ComponentDrawing.drawDiode(drawCall, size);
                return;
            default:
                ComponentDrawing.drawResistor(drawCall, size);
                return;
        }

    }

    protected drawConnections(drawCall: DrawCall) {
        const p = drawCall.p;
        p.stroke(255, 50, 50);
        p.fill(255, 50, 50, 50);
        this.connectors.forEach(connector => {
            const pixels = connector.position.multiplyV(drawCall.renderScale);
            p.circle(pixels.x, pixels.y, Component.CONNECTOR_RADIUS * drawCall.renderScale.x);
        });
    }

    public getConnectorAt(position: Vector2) : Connector | undefined {
        for (const connector of this.getConnectors()) {
            if(connector.position.distanceTo(position) < Component.CONNECTOR_RADIUS)
                return connector;
        }
        return undefined;
    }
}

export default Component;
