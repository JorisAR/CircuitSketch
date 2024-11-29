import p5 from "p5";
import { Vector2 } from "Utils/Vector2";
import UIElement from "UI/UIElement";
import DrawCall from "Scene/DrawCall";
import { RectControl } from "UI/RectControl";

class UIGridContainer extends UIElement {
    private childSize: number;  // Fraction of the container width
    private columnCount: number;

    constructor(rectControl: RectControl, childSize: number, columnCount: number) {
        super(rectControl);
        this.childSize = childSize;
        this.columnCount = columnCount;
    }

    protected drawFunction(drawCall: DrawCall): void {
        // Draw the grid container itself (if needed)
    }

    public updateRects(windowSize: Vector2) {
        const parentSize = this.parent ? this.parent.rectControl.size : windowSize;
        const parentPosition = this.parent ? this.parent.rectControl.position : Vector2.Zero;
        this.rectControl.calculatePositionAndSize(parentPosition, parentSize);

        const gridWidth = this.rectControl.size.x;
        const childPixelSize = this.childSize * gridWidth;
        const margin = (gridWidth - this.columnCount * childPixelSize) / (this.columnCount + 1);

        let row = 0;
        let col = 0;
        for (const child of this.children) {
            const childX = margin + col * (childPixelSize + margin);
            const childY = margin + row * (childPixelSize + margin);

            child.rectControl = RectControl.CreateAsRelative(new Vector2(childX, childY), new Vector2(childPixelSize, childPixelSize));
            child.updateRects(windowSize);

            col++;
            if (col >= this.columnCount) {
                col = 0;
                row++;
            }
        }
    }

    onMousePressed(point: Vector2): void {
        // Handle mouse pressed event
    }

    onMouseReleased(point: Vector2): void {
        // Handle mouse released event
    }
}

export default UIGridContainer;
