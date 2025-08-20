import { ResizeHandlers, Shape, ShapeType } from "@repo/types/canvasTypes";

export function isNeartheShape(currentX: number, currentY: number, s: Shape) {
  if (
    s.type == ShapeType.DIAMOND ||
    s.type == ShapeType.RECTANGLE ||
    s.type == ShapeType.ELLIPSE
  ) {
    const minX = Math.min(s.startX, s.endX);
    const minY = Math.min(s.startY, s.endY);
    const maxX = Math.max(s.startX, s.endX);
    const maxY = Math.max(s.startY, s.endY);
    return (
      minX <= currentX &&
      minY <= currentY &&
      maxX >= currentX &&
      maxY >= currentY
    );
  } else if (s.type == ShapeType.LINE || s.type == ShapeType.ARROW) {
    const threshold = 5;
    const { startX, startY, endX, endY } = s;
    const lenSq = (endX - startX) ** 2 + (endY - startY) ** 2;
    const t =
      ((currentX - startX) * (endX - startX) +
        (currentY - startY) * (endY - startY)) /
      lenSq;
    let distanceSq: number;

    if (t < 0) {
      distanceSq = (currentX - startX) ** 2 + (currentY - startY) ** 2;
    } else if (t > 1) {
      distanceSq = (currentX - endX) ** 2 + (currentY - endY) ** 2;
    } else {
      const closestX = startX + t * (endX - startX);
      const closestY = startY + t * (endY - startY);
      distanceSq = (currentX - closestX) ** 2 + (currentY - closestY) ** 2;
    }

    return distanceSq < threshold ** 2;
  } else if (s.type == ShapeType.PENCIL) {
    let isEqual: boolean = false;
    const threshold = 5;
    for (let i = 0; i < s.points.length - 1; i++) {
      const point1 = s.points[i];
      const point2 = s.points[i + 1];
      const distanceX = Math.abs(point1[0] - point2[0]);
      const distanceY = Math.abs(point1[1] - point2[1]);
      const currentPointDistX =
        Math.abs(currentX - point1[0]) + Math.abs(currentX - point2[0]);
      const currentPointDistY =
        Math.abs(currentY - point1[1]) + Math.abs(currentY - point2[1]);
      const diffenceInDistX = Math.abs(distanceX - currentPointDistX);
      const diffenceInDistY = Math.abs(distanceY - currentPointDistY);
      if (diffenceInDistX <= threshold && diffenceInDistY <= threshold) {
        isEqual = true;
        break;
      }
    }
    return isEqual;
  } else if (s.type == ShapeType.TEXT) {
    const minX = s.startX;
    const minY = s.startY;
    const maxX = s.startX + s.width;
    const maxY = s.startY + s.height;
    const threshold = 1;
    console.log("in is near the shape text");
    return (
      currentX >= minX - threshold &&
      currentX <= maxX + threshold &&
      currentY >= minY - threshold &&
      currentY <= maxY + threshold
    );
  }
}
