import AppMenu from "@/components/appMenu";
import DropDown from "@/components/dropDown";
import { create, StateCreator } from "zustand";

interface AppMenuState {
  dialogBox: boolean;
}
interface AppMenuAction {
  setDialogBox: (dropDown: boolean) => void;
}

type AppMenuStoreType = AppMenuState & AppMenuAction;

const AppMenuStore: StateCreator<AppMenuStoreType> = (set) => ({
  dialogBox: false,
  setDialogBox: (dropDown: boolean) => set({ dialogBox: dropDown }),
});

const useMenuStore = create<AppMenuStoreType>(AppMenuStore);
export default useMenuStore;
