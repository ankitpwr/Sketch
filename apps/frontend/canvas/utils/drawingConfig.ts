export enum StrokeType {
  Solid = "solid",
  Dashed = "dashed",
  Dotted = "dotted",
}
export enum StrokeColor {
  PrimaryBlack = "#1e1e1e",
  PrimaryRed = "#e03131",
  PrimaryBlue = "#1971c2",
  PrimaryGreen = "#2f9e44",
  PrimaryYellow = "#f08c00",
}
export enum BackgroundColor {
  Transparent = "transparent",
  BG_Red = "#ffc9c9",
  BG_Green = "#b2f2bb",
  BG_Blue = "#a5d8ff",
  BG_Yellow = "#ffec99",
}
export enum StrokeWidth {
  Thin = 1,
  Bold = 2.5,
  ExtraBold = 4,
}

export enum StrokeSizePencil {
  Thin = 2,
  Bold = 5,
  ExtraBold = 10,
}

export enum Tapper {
  None = 0,
  Subtle = 34,
  Sharp = 64,
}
export enum Thinning {
  None = 0,
  Medium = 0.5,
  High = 0.9,
}
export interface ShapeStyles {
  strokeWidth: StrokeWidth;
  strokeStyle: StrokeColor;
  fill: string;
  strokeType: StrokeType;
  background: BackgroundColor;
}

export interface PencilStyles {
  fillStyle: StrokeColor;
  strokeWidth: StrokeSizePencil;
  tapper: Tapper;
  thinning: Thinning;
}
export const DefaultPencilStyles: PencilStyles = {
  fillStyle: StrokeColor.PrimaryBlue,
  strokeWidth: StrokeSizePencil.ExtraBold,
  tapper: Tapper.Sharp,
  thinning: Thinning.Medium,
};

export const DefaultShapeStyles: ShapeStyles = {
  strokeType: StrokeType.Dotted,
  strokeWidth: StrokeWidth.Thin,
  strokeStyle: StrokeColor.PrimaryBlue,
  fill: "transparent",
  background: BackgroundColor.Transparent,
};

export const BoundingBorderStyles: ShapeStyles = {
  strokeType: StrokeType.Solid,
  strokeWidth: StrokeWidth.Thin,
  strokeStyle: StrokeColor.PrimaryBlue,
  fill: "transparent",
  background: BackgroundColor.Transparent,
};

export function getLineDashPattern(
  strokeStyle: StrokeType,
  strokeWidth: StrokeWidth
) {
  switch (strokeStyle) {
    case StrokeType.Solid:
      return [];
    case StrokeType.Dashed:
      return [10, 10];
    case StrokeType.Dotted:
      return [3, 3];
    default:
      return [];
  }
}
