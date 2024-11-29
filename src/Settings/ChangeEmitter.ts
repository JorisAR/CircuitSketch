import { EventEmitter } from 'events';

abstract class ChangeEmitter extends EventEmitter {
    public static readonly EVENT_CHANGE : string = 'change';

    protected notifyChange(): void {
        this.emit('change', this);
    }
}

export default ChangeEmitter;
