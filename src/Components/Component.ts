import { Vector2 } from "Utils/Vector2";
import { GetRotationAngle, Orientation } from "Components/Orientation";
import RectCollider from "Utils/RectCollider";
import DrawCall from "Scene/DrawCall";
import { JsonObject, JsonProperty } from "json2typescript";
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
    @JsonProperty("tag", String) public tag: string; // Add the tag property
    @JsonProperty("tagRotation", Number) public tagRotation: number = 0; // Add the tag property

    constructor(type: ComponentType, position: Vector2 = Vector2.Zero, orientation: Orientation = Orientation.RIGHT, tag: string = "") {
        super(position);
        this.componentType = type;
        this.size = Component.DEFAULT_SIZE;
        this.tag = tag; // Initialize the tag
        this.hitbox = new RectCollider(this.size.multiply(0.5), new Vector2(0, 0));
        this.inferConnectorsFromPositions([
            new Vector2(-this.size.x * 0.5, 0), // Connection point on the left
            new Vector2(this.size.x * 0.5, 0)   // Connection point on the right
        ]);
    }

    protected inferConnectorsFromPositions(vector2s: Vector2[]): void {
        const result: { position: Vector2, direction: Vector2 }[] = [];
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
                position: conn.position.rotate(angle).add(this._position),
                direction: conn.direction.rotate(angle).normalize(),
            }
        });
    }

    public flip(): void {
        switch (this.orientation) {
            case Orientation.UP:
                this.orientation = Orientation.DOWN;
                break;
            case Orientation.DOWN:
                this.orientation = Orientation.UP;
                break;
            case Orientation.LEFT:
                this.orientation = Orientation.RIGHT;
                break;
            case Orientation.RIGHT:
            default:
                this.orientation = Orientation.LEFT;
                break;
        }
    }

    public flipTag(): void {
        this.tagRotation ++;
        if(this.tagRotation >= 4) this.tagRotation = 0;
    }

    draw(drawCall: DrawCall): void {
        if (this.dragged)
            drawCall.alpha *= 0.25;
        drawCall.highlight = this.selected;
        const p = drawCall.p;
        const center = drawCall.sceneToWindow(this.position);
        p.push();
        p.stroke(0);
        p.fill(0);
        p.translate(center.x, center.y);
        p.rotate(GetRotationAngle(this.orientation));

        // ------------ BODY --------------
        this.drawFunction(drawCall, this.size.multiplyV(drawCall.renderScale));

        // Draw tag
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(drawCall.renderScale.x);

        if(this.tagRotation >= 2) p.rotate(Math.PI);
        p.text(this.tag, 0, (this.tagRotation % 2 == 0 ? 1 : -1) * -0.5 * this.size.y * drawCall.renderScale.x); // Adjust position and size as needed

        p.pop();
        if (this.dragged)
            drawCall.alpha /= 0.25;
        drawCall.highlight = false;
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
            case ComponentType.AMPERE_METER:
                ComponentDrawing.drawAmpereMeter(drawCall, size);
                return;
            case ComponentType.VOLT_METER:
                ComponentDrawing.drawVoltMeter(drawCall, size);
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

    public getConnectorAt(position: Vector2): Connector | undefined {
        for (const connector of this.getConnectors()) {
            if (connector.position.distanceTo(position) < Component.CONNECTOR_RADIUS)
                return connector;
        }
        return undefined;
    }
}

export default Component;
