import { Shape } from "../types/types";

export function isNeartheShape(currentX: number, currentY: number, s: Shape) {
  //prettier-ignore
  if(s.type=="Diamond"|| s.type=="Rectangle" || s.type=="Ellipse"){
          const minX = Math.min(s.startX, s.endX);
          const minY = Math.min(s.startY, s.endY);
          const maxX = Math.max(s.startX, s.endX);
          const maxY = Math.max(s.startY, s.endY);
          return minX<=currentX && minY<=currentY &&  maxX>=currentX && maxY>=currentY;
      }
    else if (s.type == "Line" || s.type == "Arrow") {
      const distanceX = Math.abs(s.startX - s.endX);
      const distanceY = Math.abs(s.startY - s.endY);
      return (
        distanceX ==
          Math.abs(currentX - s.startX) + Math.abs(s.endX - currentX) &&
        distanceY == Math.abs(currentY - s.startY) + Math.abs(s.endY - currentY)
      );
    }
    else if(s.type=="Pencil"){
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
}
