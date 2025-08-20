import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import Button from "./button";
import { CopyIcon, Ellipsis, X } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import useUserStore from "@/app/store/user-store";
import Input from "./input";
import useRoomStore from "@/app/store/room-store";
import { MessageType } from "@repo/types/wsTypes";

export default function Dialog({
  setDialogBox,
}: {
  setDialogBox: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    standalone,
    username,
    userId,
    roomId,
    socket,
    setSocket,
    setStandalone,
    setRoomId,
  } = useUserStore();
  const { loading, setLoading } = useRoomStore();
  const router = useRouter();
  const refer = useRef<HTMLDivElement | null>(null);
  const linkRefer = useRef<HTMLInputElement | null>(null);

  const handleMouseEvent = (e: MouseEvent) => {
    if (e.target == refer.current) {
      setDialogBox(false);
    }
  };

  const handleLeaveRoom = () => {
    if (!socket) return;
    socket.send(
      JSON.stringify({
        type: MessageType.LEAVE,
        roomId: roomId,
        message: "Join room",
      })
    );
    setSocket(null);
    setRoomId(null);
    setStandalone(true);
    router.push("/");
  };

  const handleCopy = () => {
    if (!linkRefer.current) return;
    const link = linkRefer.current.value;
    navigator.clipboard.writeText(link).then(() => {});
  };

  const handleNewRoomCreation = async () => {
    console.log(localStorage.getItem("token"));

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/create-room`,
        {},
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      router.push(`room/${response.data.roomId}`);
      setLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        if (axiosError.response.status === 401) {
          console.log("Unauthorized User");
          router.push("/signin");
        } else if (axiosError.response.status === 404) {
          console.log("API endpoint not found");
        }
      }
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!refer.current) return;
    refer.current.addEventListener("mousedown", handleMouseEvent);

    return () => {
      if (!refer.current) return;
      refer.current.removeEventListener("mousedown", handleMouseEvent);
    };
  }, []);

  return (
    <div
      ref={refer}
      className="fixed inset-0 bg-[#cacbcc]/20  backdrop-blur-sm flex items-center justify-center z-50  "
    >
      {standalone && (
        <div className="bg-white dark:bg-[#232329] p-8 relative dark:border-2 dark:border-[#3d3d3d]  rounded-xl  flex flex-col items-center gap-2 w-xl ">
          <div
            onClick={() => setDialogBox(false)}
            className="absolute top-4 right-4"
          >
            <X size={18} color="gray" />
          </div>
          <div className="flex flex-col p-2 justify-center items-center gap-2">
            <h2 className="text-2xl font-bold text-[#6965db]   font-nunito dark:text-[#dadadf]">
              Live Collaboration
            </h2>
            <p className="text-md text-black font-nunito dark:text-[#dadadf]">
              Invite people to collaborate on your drawing.
            </p>
          </div>
          <div className="flex flex-col gap-2 p-4 justify-center items-center">
            <Button
              onClickhandler={handleNewRoomCreation}
              varient={"primary"}
              size={"md"}
              isActive={false}
              styles={`w-42 h-10`}
            >
              {loading ? (
                <Ellipsis className="animate-pulse w-10 h-10 " />
              ) : (
                <p>Create New Room</p>
              )}
            </Button>

            <h1 className="text-center text-sm text-black  font-nunito dark:text-[#dadadf]">
              Create a new room and share the link with your friends for live
              collaboration.
            </h1>
          </div>
        </div>
      )}

      {!standalone && userId && username && (
        <div className=" relative flex flex-col  justify-center items-center gap-6 p-12 w-xl rounded-xl bg-white dark:bg-[#232329]    ">
          <div
            onClick={() => setDialogBox(false)}
            className="absolute top-4 right-4"
          >
            <X size={18} color="gray" />
          </div>
          <div className="flex flex-col  justify-start items-start gap-3 w-full">
            <h2 className="text-2xl font-bold text-[#6965db]">
              Live Collaboration
            </h2>
          </div>
          <div className="flex flex-col  gap-0.5  items-start w-full">
            <h1 className="text-sm text-black font-nunito dark:text-[#dadadf]">
              Your name
            </h1>
            <Input
              placeholder={"Your name"}
              type={"text"}
              readonly={true}
              defaultValue={`${username}`}
              styles={` bg-[#ececf4] dark:bg-[#232329] dark:text-white w-full `}
            />
          </div>

          <div className="flex flex-col  gap-0.5   items-start w-full">
            <h1 className="text-sm">Link</h1>
            <div className="flex gap-1.5 w-full">
              <Input
                refer={linkRefer}
                placeholder={"Link"}
                type={"text"}
                readonly={true}
                defaultValue={`${process.env.NEXT_PUBLIC_FE_URL}/room/${roomId}`}
                styles={` bg-[#f1f0ff] dark:bg-[#2e2d39] dark:text-white w-full  `}
              />
              <Button
                varient={"primary"}
                size={"md"}
                isActive={false}
                onClickhandler={handleCopy}
              >
                <CopyIcon size={16} />
                <p>Copy</p>
              </Button>
            </div>
          </div>

          <div
            id="border-line"
            className="w-full h-[1px] rounded-md bg-gray-200"
          ></div>

          <div className="flex items-center">
            <Button
              onClickhandler={handleLeaveRoom}
              varient={"primary"}
              size={"md"}
              isActive={false}
              styles={`border-2 border-red-300  dark:bg-[#232329] hover:border-1.5 bg-transparent hover:bg-transparent hover:border-red-500`}
            >
              <p className="text-red-400 dark:text-red-300">Exit Room</p>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
