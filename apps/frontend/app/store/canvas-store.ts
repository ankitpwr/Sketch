import { CanvasEngine } from "@/canvas/CanvasEngine";
import { ActionTool, Tool } from "@repo/types/canvasTypes";
import { create, StateCreator } from "zustand";

interface CanvasState {
  currentTool: Tool;
  canvasEngine: CanvasEngine | null;
  dpr: number;
}
interface CanvasAction {
  setTool: (currentTool: Tool) => void;
  setCanvasEngine: (canvasEngine: CanvasEngine | null) => void;
  setDpr: (dpr: number) => void;
}

type CanvasStoreType = CanvasState & CanvasAction;

const CanvasStore: StateCreator<CanvasStoreType> = (set) => ({
  currentTool: ActionTool.HAND,
  canvasEngine: null,
  dpr: 1,

  setTool: (currentTool: Tool) => set({ currentTool: currentTool }),
  setCanvasEngine: (canvasEngine: CanvasEngine | null) =>
    set({ canvasEngine: canvasEngine }),
  setDpr: (dpr: number) => set({ dpr: dpr }),
});

const useCanvasStore = create<CanvasState & CanvasAction>(CanvasStore);
export default useCanvasStore;
