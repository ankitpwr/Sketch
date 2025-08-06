import axios from "axios";
import { json } from "stream/consumers";

export async function getExistingShape(standalone: boolean, roomId: string) {
  try {
    if (standalone) {
      const rawShapes = localStorage.getItem("shape");
      if (!rawShapes) return [];
      console.log("raw shapes is");
      console.log(rawShapes);
      const shapes = JSON.parse(rawShapes);
      console.log(shapes);
      return shapes;
    } else {
      console.log(`roomid is ${roomId}`);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/room-messages/?roomId=${roomId}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const shapesData = response.data.messages.map((data: any) => {
        return JSON.parse(data.message);
      });
      console.log("shapedata is ");
      console.log(shapesData);
      return shapesData;
    }
  } catch (error) {
    console.log(`Error while parsing ${error}`);
    return [];
  }
}
