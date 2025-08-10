import { ResizeHandlers, Shape, ShapeType } from "@repo/types/canvasTypes";

export function isNeartheShape(currentX: number, currentY: number, s: Shape) {
  //prettier-ignore
  if(s.type==ShapeType.DIAMOND|| s.type==ShapeType.RECTANGLE || s.type==ShapeType.ELLIPSE){
          const minX = Math.min(s.startX, s.endX);
          const minY = Math.min(s.startY, s.endY);
          const maxX = Math.max(s.startX, s.endX);
          const maxY = Math.max(s.startY, s.endY);
          return minX<=currentX && minY<=currentY &&  maxX>=currentX && maxY>=currentY;
      }
    else if (s.type == ShapeType.LINE || s.type == ShapeType.ARROW) {
      const distanceX = Math.abs(s.startX - s.endX);
      const distanceY = Math.abs(s.startY - s.endY);
      return (
        distanceX ==
          Math.abs(currentX - s.startX) + Math.abs(s.endX - currentX) &&
        distanceY == Math.abs(currentY - s.startY) + Math.abs(s.endY - currentY)
      );
    }
    else if(s.type==ShapeType.PENCIL){
      //use different method 
      let isEqual:boolean= false;
      const threshold=5;
      for(let i=0; i<s.points.length-1; i++){
        const point1= s.points[i];
        const point2= s.points[i+1];
        const distanceX= Math.abs(point1[0]- point2[0]);
        const distanceY= Math.abs(point1[1]-point2[1]);
        const currentPointDistX= Math.abs(currentX-point1[0])+Math.abs(currentX-point2[0]);
        const currentPointDistY= Math.abs(currentY-point1[1])+Math.abs(currentY-point2[1]);
        const diffenceInDistX= Math.abs(distanceX-currentPointDistX);
        const diffenceInDistY= Math.abs(distanceY-currentPointDistY);
        if(diffenceInDistX<=threshold && diffenceInDistY<=threshold) {
          isEqual=true;
          break;
        }
      }
      return isEqual
    }
    else if(s.type==ShapeType.TEXT){
        const minX = s.startX;
  const minY = s.startY;
  const maxX = s.startX + s.width;
  const maxY = s.startY + s.height

   const threshold =1;
  return (
    currentX >= minX - threshold &&
    currentX <= maxX + threshold &&
    currentY >= minY - threshold &&
    currentY <= maxY + threshold
  );
    }
}
