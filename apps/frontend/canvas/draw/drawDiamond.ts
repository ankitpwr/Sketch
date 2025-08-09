import { DiamondShape, Shape } from "@repo/types/canvasTypes";
import { getLineDashPattern } from "@repo/types/drawingConfig";

export function drawDiamond(
  ctx: CanvasRenderingContext2D,
  shape: DiamondShape
) {
  const width = shape.endX - shape.startX;
  const height = shape.endY - shape.startY;
  const centerX = shape.startX + width / 2;
  const centerY = shape.startY + height / 2;
  const topPoint = { x: centerX, y: shape.startY };
  const rightPoint = { x: shape.endX, y: centerY };
  const bottomPoint = { x: centerX, y: shape.endY };
  const leftPoint = { x: shape.startX, y: centerY };
  const cornerRadius = Math.min(width / 2, height / 2) * 0.4;
  const actualRadius = Math.max(2, Math.min(cornerRadius, 15));
  ctx.save();
  ctx.fillStyle = shape.style.background;
  ctx.strokeStyle = shape.style.strokeStyle;
  ctx.lineWidth = shape.style.strokeWidth;
  ctx.setLineDash(
    getLineDashPattern(shape.style.strokeType, shape.style.strokeWidth)
  );
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(
    // moving to midpoint of left to top edge
    leftPoint.x + (topPoint.x - leftPoint.x) / 2,
    topPoint.y + (leftPoint.y - topPoint.y) / 2
  );
  ctx.arcTo(topPoint.x, topPoint.y, rightPoint.x, rightPoint.y, actualRadius);
  ctx.arcTo(
    rightPoint.x,
    rightPoint.y,
    bottomPoint.x,
    bottomPoint.y,
    actualRadius
  );
  ctx.arcTo(
    bottomPoint.x,
    bottomPoint.y,
    leftPoint.x,
    leftPoint.y,
    actualRadius
  );
  ctx.arcTo(leftPoint.x, leftPoint.y, topPoint.x, topPoint.y, actualRadius);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
