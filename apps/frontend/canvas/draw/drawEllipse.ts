import { EllipseShape } from "@repo/types/canvasTypes";
import { getLineDashPattern, getThemeColors } from "@repo/types/drawingConfig";
import { RoughCanvas } from "roughjs/bin/canvas";

export function drawEllipse(
  roughCanvas: RoughCanvas,
  shape: EllipseShape,
  themeColors: ReturnType<typeof getThemeColors>
) {
  const width = Math.abs(shape.endX - shape.startX);
  const height = Math.abs(shape.endY - shape.startY);
  const centerX = (shape.startX + shape.endX) / 2;
  const centerY = (shape.startY + shape.endY) / 2;

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
    seed: shape.seed,
    hachureGap: 3 * shape.style.strokeWidth,
  };

  roughCanvas.ellipse(centerX, centerY, width, height, options);
}
