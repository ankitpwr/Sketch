export type StrokeStyle = "solid" | "dashed" | "dotted";
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
export interface ShapeStyles {
  strokeWidth: StrokeWidth;
  strokeStyle: StrokeColor;
  fill: string;
  strokeType: StrokeStyle;
  background: BackgroundColor;
}

export const DEFAULT_STYLES: ShapeStyles = {
  strokeType: "solid",
  strokeWidth: StrokeWidth.Thin,
  strokeStyle: StrokeColor.PrimaryRed,
  fill: "transparent",
  background: BackgroundColor.Transparent,
};
