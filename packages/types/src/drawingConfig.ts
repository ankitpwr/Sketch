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
  PrimaryViolet = "#6741d9",
}
export enum BackgroundColor {
  Transparent = "#00000000",
  BG_Red = "#ffc9c9",
  BG_Green = "#b2f2bb",
  BG_Blue = "#a5d8ff",
  BG_Yellow = "#ffec99",
  BG_White = "#ffffff",
}

export enum CanvasColor {
  White = "#ffffff",
  Light_Blue = "#f5faff",
  Light_Yellow = "#fffce8",
  Light_Red = "#fdf8f6",
  Light_Green = "#f0fdf4",
  Black = "#121212",
  DarK_BLUE = "#13171c",
  DarK_YELLOW = "#181605",
  DarK_RED = "#1b1615",
  DarK_GREY = "#161718",
}
export const CANVAS_COLOR_KEYS = [
  "White",
  "Blue",
  "Red",
  "Yellow",
  "Grey",
] as const;

export type CanvasColorKey = (typeof CANVAS_COLOR_KEYS)[number]; //Union of Canvas_color_keys
export const THEME_PALETTE = {
  light: {
    White: "#ffffff",
    Blue: "#f5faff",
    Yellow: "#fffce8",
    Red: "#fdf8f6",
    Grey: "#f8f9fa",
  },
  dark: {
    White: "#121212",
    Blue: "#13171c",
    Yellow: "#181605",
    Red: "#1b1615",
    Grey: "#161718",
  },
};

export function getThemeColors(theme: "light" | "dark" | string | undefined) {
  return theme === "dark" ? THEME_PALETTE.dark : THEME_PALETTE.light;
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
  strokeStyle: StrokeColor.PrimaryViolet,
  fill: "transparent",
  background: BackgroundColor.BG_White,
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
