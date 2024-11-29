import {JsonObject, JsonProperty, PropertyConvertingMode} from "json2typescript";
@JsonObject("Vector2")
export class Vector2 {
    public static get Zero() {return new Vector2(0, 0);}
    public static get One() {return new Vector2(1, 1);}


    @JsonProperty("x", Number, PropertyConvertingMode.IGNORE_NULLABLE)
    public x: number = 0;

    @JsonProperty("y", Number, PropertyConvertingMode.IGNORE_NULLABLE)
    public y: number = 0;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

// Add another vector to this vector
    public add(v: Vector2): Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    // Subtract another vector from this vector
    public subtract(v: Vector2): Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    // Multiply this vector by a scalar
    public multiply(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    public multiplyV(scale: Vector2) {
        return new Vector2(this.x * scale.x, this.y * scale.y);
    }

    // Multiply this vector by a scalar
    public divide(scalar: number): Vector2 {
        return new Vector2(this.x / scalar, this.y / scalar);
    }
    public divideV(scale: Vector2) {
        return new Vector2(this.x / scale.x, this.y / scale.y);
    }

    public reflect(normal: Vector2) {
        return this.subtract(normal.multiply(2 * this.dot(normal)));
    }

    // Calculate the dot product of this vector and another vector
    public dot(v: Vector2): number {
        return this.x * v.x + this.y * v.y;
    }

    public distanceTo(v: Vector2): number {
        return this.subtract(v).length();
    }

    // Calculate the cross product of this vector and another vector
    // Note: In 2D, the cross product is a scalar
    public cross(v: Vector2): number {
        return this.x * v.y - this.y * v.x;
    }

    // Calculate the magnitude (length) of this vector
    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Normalize this vector (make it unit length)
    public normalize(): Vector2 {
        const mag = this.length();
        return new Vector2(this.x / mag, this.y / mag);
    }

    // Rotate this vector by a given angle (in radians)
    public rotate(angle: number): Vector2 {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    static fromAngle(angle: number) : Vector2 {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2(
            cos,
            sin
        );
    }

    // Randomly reflect this vector around a normal vector within ±90 degrees
    public randomReflection() {
        const angle = (Math.random() - 0.5) * Math.PI; // Random angle between -90 and 90 degrees
        return this.rotate(angle).normalize();
    }

    //elementwise min
    public min(v: Vector2): Vector2 {
        return new Vector2(Math.min(this.x, v.x), Math.min(this.y, v.y));
    }

    //elementwise max
    public max(v: Vector2): Vector2 {
        return new Vector2(Math.max(this.x, v.x), Math.max(this.y, v.y));
    }

    public toString() : string {
        return `{${this.x}, ${this.y}}`
    }


    public inverseSquareLawFactor(v: Vector2) : number {
        const r = this.distanceTo(v) / 2 + 0.000001;
        return 1 / (4 * Math.PI * r * r);
    }

    public angle() : number {
        return Math.atan2(this.y, this.x);
    }

    public round() : Vector2 {
        return new Vector2(Math.round(this.x), Math.round(this.y))
    }

    public floor() : Vector2 {
        return new Vector2(Math.floor(this.x), Math.floor(this.y))
    }

    public ceil() : Vector2 {
        return new Vector2(Math.ceil(this.x), Math.ceil(this.y))
    }

    public negate() : Vector2 {
        return new Vector2(-this.x, -this.y);
    }

    public discardSmallestDimension() : Vector2 {
        if(Math.abs(this.x) > Math.abs(this.y)) {
            return new Vector2(this.x, 0);
        }
        return new Vector2(0, this.y);
    }

    public nextGridPoint(direction: Vector2) : Vector2 {
        return this.add(direction.multiply(0.99)).round();
    }

    public snapToDualGrid(): Vector2 {
        const i = Math.round(this.x);
        const j = Math.round(this.y);
        const dx = this.x - i;
        const dy = this.y - j;

        let snappedX: number;
        let snappedY: number;

        if (Math.abs(dx - 0.5) < Math.abs(dy - 0.5)) {
            snappedX = i + 0.5;
            snappedY = j;
        } else {
            snappedX = i;
            snappedY = j + 0.5;
        }

        return new Vector2(snappedX, snappedY);
    }

    public shareAxis(other: Vector2): boolean {
        return this.x === other.x || this.y === other.y;
    }


}