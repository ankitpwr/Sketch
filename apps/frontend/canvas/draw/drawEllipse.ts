import { EllipseShape } from "@repo/types/canvasTypes";
import { getLineDashPattern, getThemeColors } from "@repo/types/drawingConfig";

export function drawEllipse(
  ctx: CanvasRenderingContext2D,
  shape: EllipseShape,
  themeColors: ReturnType<typeof getThemeColors>
) {
  const width = Math.abs(shape.endX - shape.startX);
  const height = Math.abs(shape.endY - shape.startY);
  const centerX = (shape.startX + shape.endX) / 2;
  const centerY = (shape.startY + shape.endY) / 2;
  ctx.save();
  ctx.fillStyle = themeColors[shape.style.backgroundColorKey];
  ctx.strokeStyle = themeColors[shape.style.strokeColorKey];
  ctx.lineWidth = shape.style.strokeWidth;
  ctx.setLineDash(
    getLineDashPattern(shape.style.strokeType, shape.style.strokeWidth)
  );
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
