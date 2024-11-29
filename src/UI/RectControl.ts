import {Vector2} from "Utils/Vector2";

enum RectControlMode {
    RELATIVE,
    ANCHOR
}

class RectControl {
    private position_: Vector2;
    private size_: Vector2;

    public position: Vector2;
    public size: Vector2;
    mode: RectControlMode;
    anchor: { top?: number, bottom?: number, left?: number, right?: number };

    private constructor() {
        this.position_ = Vector2.Zero;
        this.size_ = Vector2.Zero;
        this.position = Vector2.Zero;
        this.size = Vector2.Zero;
        this.mode = RectControlMode.RELATIVE;
        this.anchor = {};
    }

    static CreateAsAnchors(top: number, bottom: number, left: number, right: number): RectControl {
        const r = new RectControl();
        r.mode = RectControlMode.ANCHOR;
        r.anchor = { top, bottom, left, right };
        return r;
    }

    static CreateFullAnchors(): RectControl {
        return RectControl.CreateAsAnchors(0, 1, 0, 1);
    }

    static CreateAsRelative(position: Vector2, size: Vector2): RectControl {
        const r = new RectControl();
        r.position_ = position;
        r.size_ = size;
        return r;
    }


    public getCenter() {
        return this.position.add(this.size.multiply(0.5));
    }

    public calculatePositionAndSize(parentPosition: Vector2, parentSize: Vector2) {
        switch (this.mode) {
            case RectControlMode.RELATIVE:
                this.calculateRelative(parentPosition, parentSize);
                return;
            case RectControlMode.ANCHOR:
                this.calculateAnchor(parentPosition, parentSize);
                return;
            default:
                throw new Error("Invalid RectControl mode");
        }
    }

    private calculateRelative(parentPosition: Vector2, parentSize: Vector2): void {
        this.position = this.position_.add(parentPosition);//.add(parentSize.multiply(0.5)));
        this.size = this.size_;
    }

    private calculateAnchor(parentPosition: Vector2, parentSize: Vector2): void {
        const position = new Vector2(
            parentPosition.x + (this.anchor.left ?? 0) * parentSize.x,
            parentPosition.y + (this.anchor.top ?? 0) * parentSize.y
        );

        const size = new Vector2(
            ((this.anchor.right ?? 1) - (this.anchor.left ?? 0)) * parentSize.x,
            ((this.anchor.bottom ?? 1) - (this.anchor.top ?? 0)) * parentSize.y
        );

        this.position = position;
        this.size = size;
    }
}

export { RectControl, RectControlMode };
