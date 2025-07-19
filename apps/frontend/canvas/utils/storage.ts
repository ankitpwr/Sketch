export async function getExistingShape() {
  const rawShapes = localStorage.getItem("shape");

  if (!rawShapes) return [];
  try {
    const shapes = JSON.parse(rawShapes);

    return shapes;
  } catch (error) {
    console.log(`Error while parsing ${error}`);
    return [];
  }
}
