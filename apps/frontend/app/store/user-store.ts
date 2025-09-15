import { create, StateCreator } from "zustand";

interface UserDetails {
  socket: WebSocket | null;
  userId: string | null;
  username: string | null;
  standalone: boolean;
  signedin: boolean;
  roomId: string | null;
  email: string | null;
}
interface UserActions {
  setSocket: (socket: WebSocket | null) => void;
  setUserId: (userId: string | null) => void;
  setUsername: (username: string | null) => void;
  setStandalone: (standalone: boolean) => void;
  setSignedin: (signedin: boolean) => void;
  setRoomId: (roomId: string | null) => void;
  setEmail: (email: string | null) => void;
}
type UserStoreType = UserDetails & UserActions;
const UserStore: StateCreator<UserStoreType> = (set) => ({
  socket: null,
  userId: null,
  username: null,
  standalone: true,
  signedin: false,
  roomId: null,
  email: null,

  setSocket: (socket: WebSocket | null) => set({ socket: socket }),
  setUserId: (userId: string | null) => set({ userId: userId }),
  setUsername: (username: string | null) => set({ username: username }),
  setStandalone: (standalone: boolean) => set({ standalone: standalone }),
  setSignedin: (signedin: boolean) => set({ signedin: signedin }),
  setRoomId: (roomId: string | null) => set({ roomId: roomId }),
  setEmail: (email: string | null) => set({ email: email }),
});

const useUserStore = create<UserDetails & UserActions>(UserStore);
export default useUserStore;
