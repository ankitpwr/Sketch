import {
  AppSetting,
  BackgroundColorkey,
  CanvasColorKey,
  Edges,
  FillStyle,
  setting,
  Sloppiness,
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
  fillStyle: FillStyle;
  sloppiness: Sloppiness;
  edges: Edges;
}

interface DrawStateAction {
  setCanvasColorKey: (canvasColorKey: CanvasColorKey) => void;
  setBackgroundColorKey: (backgroundColorKey: BackgroundColorkey) => void;
  setStrokeColorKey: (strokeColorKey: StrokeColorKey) => void;
  setStrokeWidth: (strokeWidth: StrokeWidth) => void;
  setStrokeStyle: (strokeStyle: StrokeType) => void;
  setFillStyle: (FillStyle: FillStyle) => void;
  setSloppiness: (sloppiness: Sloppiness) => void;
  setEdges: (edges: Edges) => void;
}

type DrawStoreType = DrawState & DrawStateAction;

const DrawStore: StateCreator<DrawStoreType> = (set) => ({
  canvasColorKey: "White",
  backgroundColorKey: "BG_Transparent",
  strokeColorKey: "Stroke_Black",
  strokeWidth: StrokeWidth.Thin,
  strokeStyle: StrokeType.Solid,
  fillStyle: FillStyle.Solid,
  sloppiness: Sloppiness.Architect,
  edges: Edges.Rounded,

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

  setFillStyle: (fillStyle: FillStyle) => {
    setting.fillStyle = fillStyle;
    set({ fillStyle: fillStyle });
    localStorage.setItem("sketch-setting", JSON.stringify(setting));
  },

  setSloppiness: (sloppiness: Sloppiness) => {
    setting.sloppiness = sloppiness;
    set({ sloppiness: sloppiness });
    localStorage.setItem("sketch-setting", JSON.stringify(setting));
  },

  setEdges: (edges: Edges) => {
    setting.edges = edges;
    set({ edges: edges });
    localStorage.setItem("sketch-setting", JSON.stringify(setting));
  },
});

const useDrawStore = create<DrawStoreType>(DrawStore);
export default useDrawStore;
