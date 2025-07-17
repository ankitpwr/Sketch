export type ShapeType = "Rectangle" | "Diamond" | "Ellipse" | "Line" | "Arrow";
export type Shape = {
  type: ShapeType;
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
  | "Arrow"
  | "Pencil"
  | "Eraser"
  | "Text";
