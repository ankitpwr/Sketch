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
  | "Pencil"
  | "Eraser"
  | "Text";
