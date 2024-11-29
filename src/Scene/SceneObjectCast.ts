import Component from "Components/Component";
import Connector from "Components/Connector";
import CircuitElement from "Components/CircuitElement";


export interface SceneObjectCast {
    component: CircuitElement;
    connector : Connector | undefined;
}