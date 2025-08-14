import axios from "axios";

export async function getExistingShape(
  standalone: boolean,
  roomId: string | null
) {
  try {
    if (standalone && !roomId) {
      const rawShapes = localStorage.getItem("shape");
      if (!rawShapes) return [];

      const shapes = JSON.parse(rawShapes);

      return shapes;
    } else if (roomId) {
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

      return shapesData;
    }
  } catch (error) {
    console.log(`Error while parsing ${error}`);
    return [];
  }
}
