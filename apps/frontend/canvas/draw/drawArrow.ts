import { ArrowShape } from "@repo/types/canvasTypes";
import { getLineDashPattern, getThemeColors } from "@repo/types/drawingConfig";
import { RoughCanvas } from "roughjs/bin/canvas";

export function drawArrow(
  roughCanvas: RoughCanvas,
  shape: ArrowShape,
  themeColors: ReturnType<typeof getThemeColors>
) {
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

  const dx = shape.endX - shape.startX;
  const dy = shape.endY - shape.startY;
  const lineLength = Math.sqrt(dx * dx + dy * dy);
  let headlen = lineLength * 0.15;
  headlen = Math.min(30, Math.max(headlen, 10));
  const angle = Math.atan2(dy, dx);
  roughCanvas.line(shape.startX, shape.startY, shape.endX, shape.endY, options);

  const p1x = shape.endX - headlen * Math.cos(angle - Math.PI / 9);
  const p1y = shape.endY - headlen * Math.sin(angle - Math.PI / 9);
  roughCanvas.line(shape.endX, shape.endY, p1x, p1y, options);

  const p2x = shape.endX - headlen * Math.cos(angle + Math.PI / 9);
  const p2y = shape.endY - headlen * Math.sin(angle + Math.PI / 9);
  roughCanvas.line(shape.endX, shape.endY, p2x, p2y, options);
}
