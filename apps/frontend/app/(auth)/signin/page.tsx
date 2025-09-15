"use client";
import useMenuStore from "@/app/store/menu-store";
import AuthCard from "@/components/authCard";
import Doodles from "@/components/doodle";
import EmailVerification from "@/components/emailVerification";
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
import ThemeToggle from "@/components/themeToggle";

import React, { useRef } from "react";

export default function Signin() {
  const { verifyEmailBox, setVerifyEmailBox } = useMenuStore();
  return (
    <div className="relative w-screen h-screen flex flex-col justify-center items-center bg-white dark:bg-black/30 overflow-hidden  ">
      <TopLeftBlob />
      <TopRightBlob />
      <BottomRightBlob />
      <BottomLeftBlob />

      <Doodles />
      <div className="relative z-10 flex flex-col items-center   ">
        <div className="hidden md:flex gap-3 mb-8">
          <SketchLogo size={48} color={"#6965db"} />
          <h1 className="font-architect text-5xl text-[#343a40] dark:text-[#e7e5fb]  font-extrabold">
            Sketch
          </h1>
        </div>

        {!verifyEmailBox && <AuthCard isSignin={true} />}
        {verifyEmailBox && <EmailVerification />}
      </div>
    </div>
  );
}
