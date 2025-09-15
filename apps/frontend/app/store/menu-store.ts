import AppMenu from "@/components/appMenu";
import DropDown from "@/components/dropDown";
import { verify } from "crypto";
import { create, StateCreator } from "zustand";

interface AppMenuState {
  dialogBox: boolean;
  dropDown: boolean;
  shapeSetting: boolean;
  verifyEmailBox: boolean;
}
interface AppMenuAction {
  setDialogBox: (dialogBox: boolean) => void;
  setDropDown: (dropDown: boolean) => void;
  setShapeSetting: (shapeSetting: boolean) => void;
  setVerifyEmailBox: (verifyEmailBox: boolean) => void;
}

type AppMenuStoreType = AppMenuState & AppMenuAction;

const AppMenuStore: StateCreator<AppMenuStoreType> = (set) => ({
  dialogBox: false,
  dropDown: false,
  shapeSetting: false,
  verifyEmailBox: false,
  setDialogBox: (dialogBox: boolean) => set({ dialogBox: dialogBox }),
  setDropDown: (dropDown: boolean) => set({ dropDown: dropDown }),
  setShapeSetting: (shapeSetting: boolean) =>
    set({ shapeSetting: shapeSetting }),

  setVerifyEmailBox: (verifyEmailBox: boolean) =>
    set({ verifyEmailBox: verifyEmailBox }),
});

const useMenuStore = create<AppMenuStoreType>(AppMenuStore);
export default useMenuStore;
