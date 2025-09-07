export enum StrokeWidth {
  Thin = 1.5,
  Bold = 2.5,
  ExtraBold = 4,
}
export enum StrokeType {
  Solid = "solid",
  Dashed = "dashed",
  Dotted = "dotted",
}
export enum Sloppiness {
  Architect = 0,
  Artist = 1,
  Cartoonist = 2,
}

export enum Edges {
  Sharp = "Sharp",
  Rounded = "Rounded",
}
export enum FillStyle {
  Hachure = "hachure",
  Solid = "solid",
  CrossHatch = "cross-hatch",
  ZigZagLine = "zigzag-line",
  // Dots = "dots",
  // Dashed = "dashed",
}
export interface AppSetting {
  canvasColorKey: CanvasColorKey;
  strokeColorKey: StrokeColorKey;
  backgroundColorKey: BackgroundColorkey;
  strokeWidth: StrokeWidth;
  strokeStyle: StrokeType;
  grid: boolean;
  fillStyle: FillStyle;
  sloppiness: Sloppiness;
  edges: Edges;
}
export const setting: AppSetting = {
  canvasColorKey: "White",
  strokeColorKey: "Stroke_Black",
  backgroundColorKey: "BG_Transparent",
  strokeWidth: StrokeWidth.Thin,
  strokeStyle: StrokeType.Solid,
  grid: false,
  fillStyle: FillStyle.Solid,
  sloppiness: Sloppiness.Architect,
  edges: Edges.Rounded,
};

export const STROKE_COLOR_KEYS = [
  "Stroke_Black",
  "Stroke_Red",
  "Stroke_Green",
  "Stroke_Blue",
  "Stroke_Yellow",
  "Stroke_Violet",
] as const;

export const BG_COLOR_KEYS = [
  "BG_Transparent",
  "BG_Red",
  "BG_Green",
  "BG_Blue",
  "BG_Yellow",
  "BG_White",
] as const;

export const CANVAS_COLOR_KEYS = [
  "White",
  "Blue",
  "Red",
  "Yellow",
  "Grey",
] as const;

export type CanvasColorKey = (typeof CANVAS_COLOR_KEYS)[number]; //Union of Canvas_color_keys
export type StrokeColorKey = (typeof STROKE_COLOR_KEYS)[number];
export type BackgroundColorkey = (typeof BG_COLOR_KEYS)[number];

export const THEME_PALETTE = {
  light: {
    //canvas light colors
    White: "#ffffff",
    Blue: "#f5faff",
    Yellow: "#fffce8",
    Red: "#fdf8f6",
    Grey: "#f8f9fa",

    //stroke light colors
    Stroke_Black: "#1e1e1e",
    Stroke_Red: "#e03131",
    Stroke_Green: "#2f9e44",
    Stroke_Blue: "#1971c2",
    Stroke_Yellow: "#f08c00",
    Stroke_Violet: "#6741d9",

    //background light color for shapes
    BG_Transparent: "#00000000",
    BG_Red: "#ffc9c9",
    BG_Green: "#b2f2bb",
    BG_Blue: "#a5d8ff",
    BG_Yellow: "#ffec99",
    BG_White: "#ffffff",
  },
  dark: {
    White: "#121212",
    Blue: "#13171c",
    Yellow: "#181605",
    Red: "#1b1615",
    Grey: "#161718",

    //stroke dark colors
    Stroke_Black: "#d3d3d3",
    Stroke_Red: "#ff8383",
    Stroke_Green: "#3a994c",
    Stroke_Blue: "#56a2e8",
    Stroke_Yellow: "#b76100",
    Stroke_Violet: "#b4b0ff",

    //background dark color for shapes
    BG_Transparent: "#00000000",
    BG_Red: "#5b2d2d",
    BG_Green: "#043b0c",
    BG_Blue: "#154163",
    BG_Yellow: "#362600",
    BG_White: "#121212",
  },
};

export function getThemeColors(theme: "light" | "dark" | string | undefined) {
  return theme === "dark" ? THEME_PALETTE.dark : THEME_PALETTE.light;
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
  fontsize: FontSize;
  fontfamily: FontFamily;
  strokeColorKey: StrokeColorKey;
  backgroundColorKey: BackgroundColorkey;
}
export interface PencilStyles {
  strokeWidth: StrokeSizePencil;
  tapper: Tapper;
  thinning: Thinning;
  strokeColorKey: StrokeColorKey;
  backgroundColorKey: BackgroundColorkey;
}
export interface ShapeStyles {
  strokeWidth: StrokeWidth;
  strokeType: StrokeType;
  strokeColorKey: StrokeColorKey;
  backgroundColorKey: BackgroundColorkey;
  sloppiness: Sloppiness;
  bowing: number;
  fillStyle: FillStyle;
  edges: Edges;
}
export const DefaultTextStyle: TextStyle = {
  fontsize: FontSize.Medium,
  fontfamily: FontFamily.Normal,
  strokeColorKey: "Stroke_Black",
  backgroundColorKey: "BG_Transparent",
};

export const DefaultPencilStyles: PencilStyles = {
  strokeWidth: StrokeSizePencil.ExtraBold,
  tapper: Tapper.Sharp,
  thinning: Thinning.Medium,
  strokeColorKey: "Stroke_Black",
  backgroundColorKey: "BG_Transparent",
};

export const DefaultShapeStyles: ShapeStyles = {
  strokeType: StrokeType.Solid,
  strokeWidth: StrokeWidth.Thin,
  strokeColorKey: "Stroke_Black",
  backgroundColorKey: "BG_Transparent",
  sloppiness: Sloppiness.Architect,
  bowing: 0.85,
  fillStyle: FillStyle.Solid,
  edges: Edges.Rounded,
};

export const BoundingBorderStyles: ShapeStyles = {
  strokeType: StrokeType.Solid,
  strokeWidth: StrokeWidth.Thin,
  strokeColorKey: "Stroke_Violet",
  backgroundColorKey: "BG_White",
  sloppiness: Sloppiness.Architect,
  bowing: 0.5,
  fillStyle: FillStyle.Solid,
  edges: Edges.Rounded,
};

export function getLineDashPattern(
  strokeStyle: StrokeType,
  strokeWidth: StrokeWidth
) {
  switch (strokeStyle) {
    case StrokeType.Solid:
      return [];
    case StrokeType.Dashed:
      return [strokeWidth * 3, strokeWidth * 3];
    case StrokeType.Dotted:
      return [1 * strokeWidth, strokeWidth * 2.5];
    default:
      return [];
  }
}
