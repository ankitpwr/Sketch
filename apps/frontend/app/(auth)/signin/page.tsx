import AuthCard from "@/components/authCard";
import Doodles from "@/components/doodle";
import {
  ArrowSVG,
  BottomLeftBlob,
  BottomRightBlob,
  BulbSVG,
  CircleSVG,
  DrawSVG,
  FunnyFaceSVG,
  GhostSVG,
  HelicalSVG,
  SketchLogo,
  StarSVG,
  TopLeftBlob,
  TopRightBlob,
} from "@/components/svgIcons";

import React, { useRef } from "react";

export default function Signin() {
  return (
    <div className="relative  w-screen h-screen flex flex-col justify-center items-center ">
      <TopLeftBlob />
      <TopRightBlob />
      <BottomRightBlob />
      <BottomLeftBlob />

      <Doodles />
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex gap-3 mb-8">
          <SketchLogo size={48} color={"#6965db"} />
          <h1 className="font-architect text-5xl text-[#030064] font-extrabold">
            Sketch
          </h1>
        </div>

        <AuthCard isSignin={true} />
      </div>
    </div>
  );
}
