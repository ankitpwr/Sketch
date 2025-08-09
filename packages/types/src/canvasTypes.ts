import { PencilStyles, ShapeStyles, TextStyle } from "./drawingConfig";

export type ShapeType =
  | "Rectangle"
  | "Diamond"
  | "Ellipse"
  | "Line"
  | "Arrow"
  | "Pencil"
  | "Text";
export type Shape =
  | RectangleShape
  | EllipseShape
  | DiamondShape
  | LineShape
  | ArrowShape
  | PencilShape
  | TextShape;

export interface BaseShape {
  type: ShapeType;
  id?: string;
}
interface BoundedShape extends BaseShape {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  style: ShapeStyles;
}
export type RectangleShape = BoundedShape & { type: "Rectangle" };
export type EllipseShape = BoundedShape & { type: "Ellipse" };
export type DiamondShape = BoundedShape & { type: "Diamond" };
export type LineShape = BoundedShape & { type: "Line" };
export type ArrowShape = BoundedShape & { type: "Arrow" };

export interface PencilShape extends BaseShape {
  type: "Pencil";
  points: Points[];
  style: PencilStyles;
}
export interface TextShape extends BaseShape {
  type: "Text";
  text: string;
  startX: number;
  startY: number;
  style: TextStyle;
  width: number;
  height: number;
}
export interface ResizeHandlers extends BoundedShape {
  type: "Rectangle";
  side: "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight";
}

export type Action =
  | "drawing"
  | "panning"
  | "zooming"
  | "moving"
  | "resizing"
  | "writing"
  | "none";
export type Tool = "Pan" | "Select" | ShapeType | "Eraser";
export type Points = [number, number];
