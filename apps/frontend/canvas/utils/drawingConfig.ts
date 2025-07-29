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
  Transparent = "#00000000",
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

export enum FontFamily {
  Normal = "Nunito",
  HandDrawn = "Architects Daughter",
  Comic = "Comic Relief",
  Code = "Fira Code",
}
export enum FontSize {
  Small = "15px",
  Medium = "25px",
  Large = "35px",
  Xl = "45px",
}

export enum StrokeSizePencil {
  Thin = 2,
  Bold = 5,
  ExtraBold = 10,
}

export enum Tapper {
  None = 0,
  Subtle = 35,
  Sharp = 70,
}
export enum Thinning {
  None = 0,
  Medium = 0.5,
  High = 0.9,
}

export interface TextStyle {
  strokeStyle: StrokeColor | string;
  fontsize: FontSize;
  fontfamily: FontFamily;
}
export interface ShapeStyles {
  strokeWidth: StrokeWidth;
  strokeStyle: StrokeColor | string;
  fill: string;
  strokeType: StrokeType;
  background: BackgroundColor | string;
}
export const DefaultTextStyle: TextStyle = {
  strokeStyle: StrokeColor.PrimaryRed,
  fontsize: FontSize.Medium,
  fontfamily: FontFamily.Normal,
};
export interface PencilStyles {
  StrokeStyle: StrokeColor | string;
  strokeWidth: StrokeSizePencil;
  tapper: Tapper;
  thinning: Thinning;
}
export const DefaultPencilStyles: PencilStyles = {
  StrokeStyle: StrokeColor.PrimaryBlue,
  strokeWidth: StrokeSizePencil.ExtraBold,
  tapper: Tapper.Sharp,
  thinning: Thinning.Medium,
};

export const DefaultShapeStyles: ShapeStyles = {
  strokeType: StrokeType.Solid,
  strokeWidth: StrokeWidth.Thin,
  strokeStyle: StrokeColor.PrimaryBlack,
  fill: "transparent",
  background: BackgroundColor.Transparent,
};

export const BoundingBorderStyles: ShapeStyles = {
  strokeType: StrokeType.Solid,
  strokeWidth: StrokeWidth.Thin,
  strokeStyle: "#6741d9",
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
      return [8, 8];
    case StrokeType.Dotted:
      return [4, 4];
    default:
      return [];
  }
}
