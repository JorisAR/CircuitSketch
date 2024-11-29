import {Vector2} from "Utils/Vector2";
import p5 from "p5";

export function DrawRect(p: p5, center: Vector2, size : Vector2){
    const pos = center.subtract(size.multiply(0.5));
    p.rect(pos.x, pos.y, size.x, size.y);
}

export function DrawCircle(p: p5, center: Vector2, radius: number){
    p.circle(center.x, center.y, radius);
}