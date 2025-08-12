import AuthCard from "@/components/authCard";
import Doodles from "@/components/doodle";
import {
  ArrowSVG,
  BulbSVG,
  CircleSVG,
  DrawSVG,
  FunnyFaceSVG,
  GhostSVG,
  HelicalSVG,
  StarSVG,
  TopLeftBlob,
  TopRightBlob,
} from "@/components/svgIcons";

import React, { useRef } from "react";

export default function Signin() {
  return (
    <div className="relative w-screen h-screen flex flex-col justify-center items-center">
      <TopLeftBlob />
      <TopRightBlob />

      <Doodles />
      <h1>Sketch</h1>
      <AuthCard isSignin={true} />
    </div>
  );
}
