import { LineShape } from "@repo/types/canvasTypes";
import { getLineDashPattern } from "@repo/types/drawingConfig";
export function drawLine(ctx: CanvasRenderingContext2D, shape: LineShape) {
  ctx.save();
  ctx.fillStyle = shape.style.background;
  ctx.strokeStyle = shape.style.strokeStyle;
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
