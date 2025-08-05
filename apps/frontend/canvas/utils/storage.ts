import axios from "axios";

export async function getExistingShape(standalone: boolean) {
  let rawShapes = null;
  if (standalone) {
    localStorage.getItem("shape");
  } else {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/room-messages`,
      {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );
    console.log(response.data);
  }
  if (!rawShapes) return [];
  try {
    const shapes = JSON.parse(rawShapes);
    return shapes;
  } catch (error) {
    console.log(`Error while parsing ${error}`);
    return [];
  }
}
