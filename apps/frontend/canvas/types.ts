export type Shape =
  | {
      type: "Rectangle";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    }
  | {
      type: "Ellipse";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    }
  | {
      type: "Diamond";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    };

export type Action =
  | "drawing"
  | "panning"
  | "zooming"
  | "moving-shape"
  | "resizing"
  | "none";
export type Tool =
  | "Pan"
  | "Select"
  | "Rectangle"
  | "Diamond"
  | "Ellipse"
  | "Line"
  | "Pencil"
  | "Eraser"
  | "Text";
// this.ctx.lineTo(minX + (maxX - minX) / 2, minY);
// this.ctx.lineTo(maxX, minY + (maxY - minY) / 2);
// this.ctx.lineTo(minX + (maxX - minX) / 2, maxY);
// this.ctx.lineTo(minX, minY + (maxY - minY) / 2);
