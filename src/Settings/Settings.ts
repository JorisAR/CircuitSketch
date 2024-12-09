import Scene from "Scene/Scene";
import History from "Settings/History";
import ChangeEmitter from "Settings/ChangeEmitter";
import {Vector2} from "Utils/Vector2";
import Component from "Components/Component";

export enum EditMode { SELECT, DRAW , ERASE }

class Settings extends ChangeEmitter {
    //public sceneHistory: History<Scene> = new History<Scene>(10, new Scene());
    public sceneHistory: History = new History(50, new Scene());
    private _renderGrid: boolean = true;

    public renderOffset: Vector2 = Vector2.Zero;
    private _renderSize: number = 25;
    public aspectRatio: Vector2 = Vector2.One;
    private _selectedComponent: Component | undefined;
    private _editMode: EditMode = EditMode.SELECT;

    constructor() {
        super();
        this.sceneHistory.on(ChangeEmitter.EVENT_CHANGE, () => {
            this.selectedComponent = undefined;
            this.emit(ChangeEmitter.EVENT_CHANGE, this);

        });
    }

    public get scene(): Scene {
        return this.sceneHistory.currentState;
    }

    get renderGrid(): boolean {
        return this._renderGrid;
    }

    set renderGrid(value: boolean) {
        this._renderGrid = value;
        this.notifyChange();
    }

    get renderSize(): number {
        return this._renderSize;
    }

    set renderSize(value: number) {
        this.renderOffset = this.renderOffset.add(this.aspectRatio.multiplyV(Vector2.One.multiply(0.5 * (value- this.renderSize))));
        this._renderSize = value;
        this.notifyChange();

        this.emit("RenderSizeChanged", this);
    }

    get selectedComponent(): Component | undefined {
        return this._selectedComponent;
    }

    set selectedComponent(value: Component | undefined)
    {
        if(this.selectedComponent !== undefined)
            this.selectedComponent.selected = false;

        this._selectedComponent = value;
        if(this.selectedComponent)
            this.selectedComponent.selected = true;
        this.notifyChange();
    }

    get editMode(): EditMode {
        return this._editMode;
    }

    set editMode(value: EditMode) {
        this._editMode = value;
        this.selectedComponent = undefined;
    }
}

export default new Settings();
