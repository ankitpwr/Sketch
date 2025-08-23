import AuthCard from "@/components/authCard";
import React from "react";
import Doodles from "@/components/doodle";
import {
  BottomLeftBlob,
  BottomRightBlob,
  SketchLogo,
  TopLeftBlob,
  TopRightBlob,
} from "@/components/svgIcons";
import ThemeToggle from "@/components/themeToggle";
export default function Signup() {
  return (
    <div className="relative w-screen h-screen flex flex-col justify-center items-center  bg-white dark:bg-black/30 ">
      <TopLeftBlob />
      <TopRightBlob />
      <BottomRightBlob />
      <BottomLeftBlob />

      <Doodles />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-3">
        <SketchLogo size={48} color={"#6965db"} />
        <h1 className="font-architect text-5xl text-[#030064] dark:text-[#e7e5fb] font-extrabold">
          Sketch
        </h1>
      </div>
      <AuthCard isSignin={false} />
    </div>
  );
}
