import Component from "Components/Component";
import DrawCall from "Scene/DrawCall";
import {Vector2} from "Utils/Vector2";
import {SceneObjectCast} from "Scene/SceneObjectCast";
import WireSegment from "Components/WireSegment";
import ChangeEmitter from "Settings/ChangeEmitter";
import { JsonObject, JsonProperty } from "json2typescript";
import CircuitElement from "Components/CircuitElement";
import Settings from "Settings/Settings";


@JsonObject("Scene")
class Scene extends ChangeEmitter {
    @JsonProperty("components", [Component])
    private components: Component[] = [];
    @JsonProperty("wires", [WireSegment])
    private wires: WireSegment[] = [];

    constructor() {
        super();
    }

    public addComponent(component : Component): void {
        for (const c of this.components) {
            if(component.position.distanceTo(c.position) < 0.5) return;
        }
        this.components.push(component)
        this.updateSegments();
        this.notifyChange();
    }

    public addWires(wires: WireSegment[]): void {
        this.wires = this.wires.concat(wires);
        this.updateSegments();
        this.notifyChange();
    }

    public moveComponent(component: Component, position: Vector2): boolean {
        for (const c of this.components) {
            if(position.distanceTo(c.position) < 0.5) return false;
        }

        component.position = position;
        this.updateSegments();
        this.notifyChange();
        return true;
    }

    public updateComponentTag(component: Component | undefined, tag: string): void {
        if(component) {
            component.tag = tag;
            this.notifyChange();
        }
    }

    public removeObject(circuitElement: CircuitElement): void {
        if (circuitElement instanceof WireSegment) {
            const index = this.wires.indexOf(circuitElement, 0);
            if (index > -1) {
                this.wires.splice(index, 1);
            }
        } else if(circuitElement instanceof Component) {
            const index = this.components.indexOf(circuitElement, 0);
            if (index > -1) {
                this.components.splice(index, 1);
            }
        }
        Settings.selectedComponent = undefined;
        this.notifyChange();
    }

    public draw(drawCall: DrawCall): void {
        this.components.forEach(component => component.draw(drawCall));
        this.wires.forEach(wire => wire.draw(drawCall));
    }

    public getObjectAtPosition(position: Vector2): SceneObjectCast | undefined {
        for (const component of this.components) {
            const connector = component.getConnectorAt(position);
            if(connector){
                return {
                    component: component,
                    connector: connector
                };
            }
            if (component.containsPoint(position)) {
                return {
                    component: component,
                    connector : undefined
                };
            }
        }
        for (const wire of this.wires) {
            if (wire.containsPoint(position)) {
                return {
                    component: wire,
                    connector : undefined
                };
            }
        }
        return undefined;
    }

    public updateSegments(): void {
        const newWires: WireSegment[] = [];

        // Iterate over each wire-wire pair
        for (let i = 0; i < this.wires.length; i++) {
            let merged = false;
            for (let j = 0; j < newWires.length; j++) {
                if (this.wires[i].isOverlapping(newWires[j])) {
                    newWires[j] = this.wires[i].combineSegments(newWires[j]);
                    merged = true;
                    break;
                }
            }
            if (!merged) {
                newWires.push(this.wires[i]);
            }
        }

        const splitWires: WireSegment[] = [];
        // Iterate over new wires and split if necessary
        for (const wire of newWires) {
            let isSplit = false;
            for (const component of this.components) {
                const connectorsOnLine = wire.getIntersectionColliders(component.getConnectors());
                // If two connectors are on the line, split the wire segment
                if (connectorsOnLine.length === 2) {
                    isSplit = true;
                    const [startConnector, endConnector] = connectorsOnLine;
                    const segment1 = new WireSegment(wire.position, startConnector.position);
                    const segment2 = new WireSegment(endConnector.position, wire.end);
                    splitWires.push(segment1, segment2);
                    break;
                }
            }
            if (!isSplit) {
                splitWires.push(wire);
            }
        }

        // Ensure no segments go through components
        const finalWires = splitWires.filter(wire => {
            for (const component of this.components) {
                if (wire.intersectsComponent(component)) {
                    return false;
                }
            }
            return true;
        });

        this.wires = finalWires;
    }



    public getComponentCentroid(): Vector2 {
        let result = Vector2.Zero;
        if(this.components.length <= 0) return result;
        for (const component of this.components) {
            result = result.add(component.position);
        }
        return result.divide(this.components.length);
    }
}
export default Scene;
