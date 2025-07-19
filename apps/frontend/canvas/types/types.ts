export type ShapeType =
  | "Rectangle"
  | "Diamond"
  | "Ellipse"
  | "Line"
  | "Arrow"
  | "Pencil";
export type Shape =
  | RectangleShape
  | EllipseShape
  | DiamondShape
  | LineShape
  | ArrowShape
  | PencilShape;

export interface BaseShape {
  type: ShapeType;
  id?: string;
}
interface BoundedShape extends BaseShape {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}
export type RectangleShape = BoundedShape & { type: "Rectangle" };
export type EllipseShape = BoundedShape & { type: "Ellipse" };
export type DiamondShape = BoundedShape & { type: "Diamond" };
export type LineShape = BoundedShape & { type: "Line" };
export type ArrowShape = BoundedShape & { type: "Arrow" };
export interface PencilShape extends BaseShape {
  type: "Pencil";
  points: Points[];
}

export interface DrawRectangleArgs {
  ctx: CanvasRenderingContext2D;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
export interface DrawEllipseArgs {
  ctx: CanvasRenderingContext2D;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
export interface DrawDiamondArgs {
  ctx: CanvasRenderingContext2D;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface DrawLineArgs {
  ctx: CanvasRenderingContext2D;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}
export interface DrawPencilArgs {
  ctx: CanvasRenderingContext2D;
  points: Points[];
}

export type Action =
  | "drawing"
  | "panning"
  | "zooming"
  | "moving-shape"
  | "resizing"
  | "none";
export type Tool = "Pan" | "Select" | ShapeType | "Eraser" | "Text";
export type Points = [number, number];
