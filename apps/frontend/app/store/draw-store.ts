import {
  AppSetting,
  BackgroundColorkey,
  CanvasColorKey,
  setting,
  StrokeColorKey,
} from "@repo/types/drawingConfig";
import { create, StateCreator } from "zustand";

interface DrawState {
  canvasColorKey: CanvasColorKey;
  backgroundColorKey: BackgroundColorkey;
  strokeColorKey: StrokeColorKey;
}

interface DrawStateAction {
  setCanvasColorKey: (CanvasColorKey: CanvasColorKey) => void;
  setBackgroundColorKey: (backgroundColorKey: BackgroundColorkey) => void;
  setStrokeColorKey: (StrokeColorKey: StrokeColorKey) => void;
}

type DrawStoreType = DrawState & DrawStateAction;

const DrawStore: StateCreator<DrawStoreType> = (set) => ({
  canvasColorKey: "White",
  backgroundColorKey: "BG_Transparent",
  strokeColorKey: "Stroke_Black",

  setCanvasColorKey: (canvasColorKey: CanvasColorKey) => {
    setting.canvasColorKey = canvasColorKey;
    set({ canvasColorKey: canvasColorKey });
    localStorage.setItem("sketch-setting", JSON.stringify(setting));
  },

  setBackgroundColorKey: (backgroundColorKey: BackgroundColorkey) => {
    setting.backgroundColorKey = backgroundColorKey;
    set({ backgroundColorKey: backgroundColorKey });
    localStorage.setItem("sketch-setting", JSON.stringify(setting));
  },

  setStrokeColorKey: (strokeColorKey: StrokeColorKey) => {
    setting.strokeColorKey = strokeColorKey;
    set({ strokeColorKey: strokeColorKey });
    localStorage.setItem("sketch-setting", JSON.stringify(setting));
  },
});

const useDrawStore = create<DrawStoreType>(DrawStore);
export default useDrawStore;
