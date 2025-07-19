import { DrawDiamondArgs } from "../types/types";

export function drawDiamond({ ctx, minX, minY, maxX, maxY }: DrawDiamondArgs) {
  const width = maxX - minX;
  const height = maxY - minY;
  const centerX = minX + width / 2;
  const centerY = minY + height / 2;
  const topPoint = { x: centerX, y: minY };
  const rightPoint = { x: maxX, y: centerY };
  const bottomPoint = { x: centerX, y: maxY };
  const leftPoint = { x: minX, y: centerY };
  const cornerRadius = Math.min(width / 2, height / 2) * 0.4;
  const actualRadius = Math.max(2, Math.min(cornerRadius, 15));
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
  ctx.stroke();
}
