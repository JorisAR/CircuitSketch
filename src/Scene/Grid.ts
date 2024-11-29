import DrawCall from "Scene/DrawCall";

class Grid {
    draw(drawCall: DrawCall): void {
        const p = drawCall.p;
        const renderScale = drawCall.renderScale;
        const renderOffset = drawCall.renderOffset.negate();

        p.push();
        p.strokeWeight(renderScale.x * 0.125);
        p.stroke(150);

        // Draw vertical lines
        const gridSpacing = renderScale; // assuming grid lines are spaced 1 scene unit apart
        const startX = Math.floor(renderOffset.x);
        const endX = Math.ceil(renderOffset.x + p.width / renderScale.x);
        for (let x = startX; x <= endX; x++) {
            const screenX = (x - renderOffset.x) * renderScale.x;
            p.line(screenX, 0, screenX, p.height);
        }

        // Draw horizontal lines
        const startY = Math.floor(renderOffset.y);
        const endY = Math.ceil(renderOffset.y + p.height / renderScale.y);
        for (let y = startY; y <= endY; y++) {
            const screenY = (y - renderOffset.y) * renderScale.y;
            p.line(0, screenY, p.width, screenY);
        }

        p.pop();
    }
}

export default Grid;
