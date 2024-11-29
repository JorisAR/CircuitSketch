import ChangeEmitter from "Settings/ChangeEmitter";
import Scene from "Scene/Scene";
import {JsonConvert} from "json2typescript";

//class History<T extends ChangeEmitter> extends ChangeEmitter {
class History extends ChangeEmitter {
    private history: string[] = []; // Store JSON strings
    private currentIndex: number = 0;
    private readonly maxDepth: number;
    private _currentState: Scene;

    constructor(maxDepth: number, initialState: Scene) {
        super();
        this.maxDepth = Math.max(1, maxDepth);
        this._currentState = initialState; // Track the current state independently
        this.history = [this.serialize(initialState)];
        this.subscribeToChange(initialState);
    }

    get currentState(): Scene {
        return this._currentState;
    }

    get currentStateString(): string {
        return this.serialize(this._currentState);
    }

    public undo(): void {
        if (!this.canUndo()) {
            return;
        }
        this.unsubscribeToChange(this._currentState);
        this.currentIndex--;
        this._currentState = this.deserialize(this.history[this.currentIndex]);
        this.subscribeToChange(this._currentState);
        this.emit(ChangeEmitter.EVENT_CHANGE);
    }

    public redo(): void {
        if (!this.canRedo()) {
            return;
        }
        this.unsubscribeToChange(this._currentState);
        this.currentIndex++;
        this._currentState = this.deserialize(this.history[this.currentIndex]);
        this.subscribeToChange(this._currentState);
        this.emit(ChangeEmitter.EVENT_CHANGE);
    }

    public canUndo(): boolean {
        return this.currentIndex > 0;
    }

    public canRedo(): boolean {
        return this.currentIndex < this.history.length - 1;
    }

    private subscribeToChange(state: Scene): void {
        state.on(ChangeEmitter.EVENT_CHANGE, this.handleStateChange);
    }

    private unsubscribeToChange(state: Scene): void {
        state.removeAllListeners(ChangeEmitter.EVENT_CHANGE);
    }

    private handleStateChange = (): void => {
        this.addState(this._currentState);
    };

    public addState(state: Scene): void {
        const stateString = this.serialize(state);
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }

        this.history.push(stateString);

        if (this.history.length > this.maxDepth) {
            this.history.shift();
        } else {
            this.currentIndex++;
        }

        this._currentState = state;
        this.emit(ChangeEmitter.EVENT_CHANGE);
    }


    private serialize(object : Scene) : string {
        return JSON.stringify(object);
    }

    private deserialize(text : string) : Scene {
        return new JsonConvert().deserializeObject(JSON.parse(text), Scene);
    }
}

export default History;
