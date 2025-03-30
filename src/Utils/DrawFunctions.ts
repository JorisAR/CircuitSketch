import {Vector2} from "Utils/Vector2";
import p5 from "p5";

export function DrawRect(p: p5, center: Vector2, size : Vector2){
    const pos = center.subtract(size.multiply(0.5));
    p.rect(pos.x, pos.y, size.x, size.y);
}

export function DrawCircle(p: p5, center: Vector2, radius: number){
    p.circle(center.x, center.y, radius);
}

export function DrawText(p: p5, center: Vector2, radius: number, text: string) {
    p.push();
    p.strokeWeight(0);
    p.textSize(radius);               // Set the text size to match the radius
    p.textAlign(p.CENTER, p.CENTER);  // Align text to the center horizontally and vertically
    p.fill(0);                      // Ensure the text is filled with white (or any other color)
    p.text(text, center.x, center.y); // Draw the text at the center
    p.pop();
}
