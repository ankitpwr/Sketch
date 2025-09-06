import { RectangleShape } from "@repo/types/canvasTypes";
import {
  Edges,
  getLineDashPattern,
  getThemeColors,
  StrokeWidth,
} from "@repo/types/drawingConfig";
import { RoughCanvas } from "roughjs/bin/canvas";

export function drawRoundedRectangle(
  roughCanvas: RoughCanvas,
  shape: RectangleShape,
  themeColors: ReturnType<typeof getThemeColors>,

  boundingBox: { isBoundingBox: boolean; scale: number } = {
    isBoundingBox: false,
    scale: 1,
  }
) {
  const width = shape.endX - shape.startX;
  const height = shape.endY - shape.startY;
  let radius =
    shape.style.edges == Edges.Rounded
      ? Math.abs(Math.min(width, height) / 6)
      : 0;

  if (boundingBox.isBoundingBox) {
    shape.style.strokeWidth = 1 / boundingBox.scale;
    radius = width / 3;
  }

  const roundedRectPath = createRoundedRectPath(
    shape.startX,
    shape.startY,
    width,
    height,
    radius
  );
  const options = {
    stroke: themeColors[shape.style.strokeColorKey],
    fill: themeColors[shape.style.backgroundColorKey],
    strokeWidth: shape.style.strokeWidth,
    roughness: shape.style.sloppiness,
    bowing: shape.style.bowing,
    fillStyle: shape.style.fillStyle,
    strokeLineDash: getLineDashPattern(
      shape.style.strokeType,
      shape.style.strokeWidth
    ),
  };

  roughCanvas.path(roundedRectPath, options);
}

function createRoundedRectPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): string {
  const r = Math.min(radius, width / 2, height / 2);

  if (r <= 0) {
    return `M${x},${y} L${x + width},${y} L${x + width},${y + height} L${x},${y + height} Z`;
  }

  const path = `
    M${x + r},${y}
    L${x + width - r},${y}
    Q${x + width},${y} ${x + width},${y + r}
    L${x + width},${y + height - r}
    Q${x + width},${y + height} ${x + width - r},${y + height}
    L${x + r},${y + height}
    Q${x},${y + height} ${x},${y + height - r}
    L${x},${y + r}
    Q${x},${y} ${x + r},${y}
    Z
  `;

  return path.replace(/\s+/g, " ").trim();
}
