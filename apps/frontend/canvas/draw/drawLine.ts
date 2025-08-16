import { LineShape } from "@repo/types/canvasTypes";
import { getLineDashPattern, getThemeColors } from "@repo/types/drawingConfig";
export function drawLine(
  ctx: CanvasRenderingContext2D,
  shape: LineShape,
  themeColors: ReturnType<typeof getThemeColors>
) {
  ctx.save();
  ctx.fillStyle = themeColors[shape.style.backgroundColorKey];
  ctx.strokeStyle = themeColors[shape.style.strokeColorKey];
  ctx.lineWidth = shape.style.strokeWidth;
  ctx.setLineDash(
    getLineDashPattern(shape.style.strokeType, shape.style.strokeWidth)
  );
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(shape.startX, shape.startY);
  ctx.lineTo(shape.endX, shape.endY);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
