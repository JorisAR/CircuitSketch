export enum Orientation {
    UP,
    DOWN,
    LEFT,
    RIGHT,
} export default Orientation;

export function GetRotationAngle(orientation: Orientation): number {
    switch (orientation) {
        case Orientation.UP:
            return Math.PI * 1.5;
        case Orientation.DOWN:
            return Math.PI * 0.5;
        case Orientation.LEFT:
            return Math.PI;
        case Orientation.RIGHT:
        default:
            return 0;
    }
}