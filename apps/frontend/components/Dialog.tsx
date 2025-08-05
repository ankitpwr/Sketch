import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Button from "./button";
import { Play, X } from "lucide-react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { headers } from "next/headers";

export default function Dialog({
  setDialogBox,
}: {
  setDialogBox: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const refer = useRef<HTMLDivElement | null>(null);
  const handleMouseEvent = (e: MouseEvent) => {
    if (e.target == refer.current) {
      setDialogBox(false);
    }
  };

  const handleNewRoomCreation = async () => {
    console.log(localStorage.getItem("token"));

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
      className="fixed inset-0 bg-gray-300/50  backdrop:blur-sm flex items-center justify-center "
    >
      <div className="bg-white p-8 relative  rounded-xl  flex flex-col items-center gap-8 w-xl ">
        <div
          onClick={() => setDialogBox(false)}
          className="absolute top-4 right-4"
        >
          <X size={18} color="gray" />
        </div>
        <div className="flex flex-col p-2 justify-center items-center gap-3">
          <h2 className="text-2xl font-bold text-[#6965db]">
            Live Collaboration
          </h2>
          <p className="text-md">
            Invite people to collaborate on your drawing.
          </p>
        </div>
        <div className="flex flex-col gap-3 p-4 justify-center items-center">
          <Button
            onClickhandler={handleNewRoomCreation}
            varient={"primary"}
            size={"md"}
            isActive={false}
          >
            <p>Create New Room</p>
          </Button>
          <h1 className="text-center text-sm">
            Create a new room and share the room ID with your friends for live
            collaboration.
          </h1>
        </div>

        <div
          id="border-line"
          className="w-full h-[1px] rounded-md bg-gray-200"
        ></div>

        <div className="flex flex-col gap-3 p-4 justify-center items-center">
          <Button varient={"primary"} size={"md"} isActive={false}>
            <p>Join Room</p>
          </Button>
          <h1 className="text-center text-sm">
            Join an existing room using a shared room ID.
          </h1>
        </div>
      </div>
    </div>
  );
}
