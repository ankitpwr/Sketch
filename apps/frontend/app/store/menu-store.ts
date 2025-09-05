import AppMenu from "@/components/appMenu";
import DropDown from "@/components/dropDown";
import { create, StateCreator } from "zustand";

interface AppMenuState {
  dialogBox: boolean;
  dropDown: boolean;
  shapeSetting: boolean;
}
interface AppMenuAction {
  setDialogBox: (dialogBox: boolean) => void;
  setDropDown: (dropDown: boolean) => void;
  setShapeSetting: (shapeSetting: boolean) => void;
}

type AppMenuStoreType = AppMenuState & AppMenuAction;

const AppMenuStore: StateCreator<AppMenuStoreType> = (set) => ({
  dialogBox: false,
  dropDown: false,
  shapeSetting: false,
  setDialogBox: (dialogBox: boolean) => set({ dialogBox: dialogBox }),
  setDropDown: (dropDown: boolean) => set({ dropDown: dropDown }),
  setShapeSetting: (shapeSetting: boolean) =>
    set({ shapeSetting: shapeSetting }),
});

const useMenuStore = create<AppMenuStoreType>(AppMenuStore);
export default useMenuStore;
