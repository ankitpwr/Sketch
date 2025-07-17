interface drawArgs {
  ctx: CanvasRenderingContext2D;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

interface Line {
  ctx: CanvasRenderingContext2D;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}
export function drawRectangle({
  ctx,
  minX,
  minY,
  maxX,
  maxY,
  width,
  height,
}: drawArgs) {
  const radius = Math.min(width, height) / 4;
  ctx.beginPath();
  ctx.roundRect(minX, minY, width, height, radius);
  ctx.closePath();
  ctx.stroke();
}
export function drawEllipse({
  ctx,
  minX,
  minY,
  maxX,
  maxY,
  width,
  height,
}: drawArgs) {
  const centerX = minX + width / 2;
  const centerY = minY + height / 2;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.stroke();
}

export function drawDiamond({
  ctx,
  minX,
  minY,
  maxX,
  maxY,
  width,
  height,
}: drawArgs) {
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

export function drawLine({ ctx, startX, startY, endX, endY }: Line) {
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}
export function drawArrow({ ctx, startX, startY, endX, endY }: Line) {
  const dx = endX - startX;
  const dy = endY - startY;
  const lineLength = Math.sqrt(dx * dx + dy * dy);
  let headlen = lineLength * 0.15;
  headlen = Math.min(30, Math.max(headlen, 10));
  const angle = Math.atan2(dy, dx);
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineCap = "round";
  ctx.lineTo(endX, endY);
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headlen * Math.cos(angle - Math.PI / 6),
    endY - headlen * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headlen * Math.cos(angle + Math.PI / 6),
    endY - headlen * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}
