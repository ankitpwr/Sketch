import { create, StateCreator } from "zustand";

interface RoomDetails {
  roomId: string | null;
  loading: boolean;
}

interface RoomActions {
  setLoading: (loading: boolean) => void;
}

type RoomStoreType = RoomDetails & RoomActions;
const RoomStore: StateCreator<RoomStoreType> = (set) => ({
  roomId: null,
  loading: false,

  setLoading: (loading: boolean) => set({ loading: loading }),
});

const useRoomStore = create<RoomStoreType>(RoomStore);

export default useRoomStore;
