"use client";
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
import useMenuStore from "@/app/store/menu-store";
export default function Signup() {
  return (
    <div className="relative w-screen h-screen flex flex-col justify-center items-center  bg-white dark:bg-black/30 overflow-hidden  ">
      <TopLeftBlob />
      <TopRightBlob />
      <BottomRightBlob />
      <BottomLeftBlob />

      <Doodles />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-3">
        <div className="hidden md:flex gap-3 mb-8">
          <SketchLogo size={48} color={"#6965db"} />
          <h1 className="font-architect text-5xl text-[#343a40] dark:text-[#e7e5fb]  font-extrabold">
            Sketch
          </h1>
        </div>
      </div>
      <AuthCard isSignin={false} />
    </div>
  );
}
