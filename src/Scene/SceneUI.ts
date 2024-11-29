import {Vector2} from "Utils/Vector2";
import UIRect from "UI/UIRect";
import UIElement from "UI/UIElement";
import {RectControl} from "UI/RectControl";
import UIGridContainer from "UI/UIGridContainer";
import UIComponentRect from "UI/UIComponentRect";
import ComponentDrawing from "Components/ComponentDrawing";
import Component from "Components/Component";
import ComponentType from "Components/ComponentType";


export function CreateUI(canvasRef: HTMLDivElement): UIElement {
        const root = new UIRect(RectControl.CreateAsAnchors(0, 1, 0.9, 1), "#f0f0f0");
        const grid = new UIGridContainer(RectControl.CreateFullAnchors(), 0.5, 1);

        root.addChild(grid);
        grid.addChild(new UIComponentRect(RectControl.CreateFullAnchors(), ComponentDrawing.drawResistor, () => new Component(ComponentType.RESISTOR, Vector2.Zero)));
        grid.addChild(new UIComponentRect(RectControl.CreateFullAnchors(), ComponentDrawing.drawLight, () => new Component(ComponentType.LAMP, Vector2.Zero)));
        grid.addChild(new UIComponentRect(RectControl.CreateFullAnchors(), ComponentDrawing.drawBattery, () => new Component(ComponentType.BATTERY, Vector2.Zero)));
        grid.addChild(new UIComponentRect(RectControl.CreateFullAnchors(), ComponentDrawing.drawSwitch, () => new Component(ComponentType.SWITCH, Vector2.Zero)));
        grid.addChild(new UIComponentRect(RectControl.CreateFullAnchors(), ComponentDrawing.drawDiode, () => new Component(ComponentType.DIODE, Vector2.Zero)));


        return root;
}
