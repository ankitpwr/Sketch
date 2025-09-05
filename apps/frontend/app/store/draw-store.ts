import {
  AppSetting,
  BackgroundColorkey,
  CanvasColorKey,
  setting,
  StrokeColorKey,
  StrokeType,
  StrokeWidth,
} from "@repo/types/drawingConfig";
import { create, StateCreator } from "zustand";

interface DrawState {
  canvasColorKey: CanvasColorKey;
  backgroundColorKey: BackgroundColorkey;
  strokeColorKey: StrokeColorKey;
  strokeWidth: StrokeWidth;
  strokeStyle: StrokeType;
}

interface DrawStateAction {
  setCanvasColorKey: (canvasColorKey: CanvasColorKey) => void;
  setBackgroundColorKey: (backgroundColorKey: BackgroundColorkey) => void;
  setStrokeColorKey: (strokeColorKey: StrokeColorKey) => void;
  setStrokeWidth: (strokeWidth: StrokeWidth) => void;
  setStrokeStyle: (strokeStyle: StrokeType) => void;
}

type DrawStoreType = DrawState & DrawStateAction;

const DrawStore: StateCreator<DrawStoreType> = (set) => ({
  canvasColorKey: "White",
  backgroundColorKey: "BG_Transparent",
  strokeColorKey: "Stroke_Black",
  strokeWidth: StrokeWidth.Thin,
  strokeStyle: StrokeType.Solid,

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

  setStrokeWidth: (strokeWidth: StrokeWidth) => {
    setting.strokeWidth = strokeWidth;
    set({ strokeWidth: strokeWidth });
    localStorage.setItem("sketch-setting", JSON.stringify(setting));
  },

  setStrokeStyle: (strokeStyle: StrokeType) => {
    setting.strokeStyle = strokeStyle;
    set({ strokeStyle: strokeStyle });
    localStorage.setItem("sketch-setting", JSON.stringify(setting));
  },
});

const useDrawStore = create<DrawStoreType>(DrawStore);
export default useDrawStore;
