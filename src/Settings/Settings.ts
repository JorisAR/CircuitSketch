import Scene from "Scene/Scene";
import History from "Settings/History";
import ChangeEmitter from "Settings/ChangeEmitter";
import {Vector2} from "Utils/Vector2";

class Settings extends ChangeEmitter {

    //public sceneHistory: History<Scene> = new History<Scene>(10, new Scene());
    public sceneHistory: History = new History(10, new Scene());
    private _renderGrid: boolean = true;

    public renderOffset: Vector2 = Vector2.Zero;
    private _renderSize: number = 25;
    public aspectRatio: Vector2 = Vector2.One;

    constructor() {
        super();
        this.sceneHistory.on(ChangeEmitter.EVENT_CHANGE, () => {
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
}

export default new Settings();
