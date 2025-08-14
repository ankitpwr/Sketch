import React from "react";
import {
  ArrowSVG,
  BulbSVG,
  ChristmasTreeSVG,
  CircleSVG,
  CoffeeSVG,
  DrawSVG,
  FunnyFaceSVG,
  GhostSVG,
  GiftSVG,
  HelicalSVG,
  PawSVG,
  SantSVG,
  ScaleSVG,
  SqaureSVG,
  StarSVG,
  TriangleSVG,
  WrongSVG,
} from "./svgIcons";

export default function Doodles() {
  return (
    <div>
      <div
        className="fixed top-6 left-3 animate-bounce "
        style={{ animationDuration: "5s" }}
      >
        <DrawSVG size={42} color={"#DA498D"} />
      </div>
      <div
        className="fixed top-24 left-10 animate-spin"
        style={{ animationDuration: "8s" }}
      >
        <FunnyFaceSVG size={50} color={"#aba1e5"} />
      </div>

      <div className="fixed top-8 left-34">
        <ArrowSVG size={42} color={"#FF9B00"} />
      </div>
      <div
        className="fixed top-34 left-34 animate-bounce"
        style={{ animationDuration: "4s" }}
      >
        <SqaureSVG color={"#E14434"} size={28} />
      </div>

      <div
        className="hidden md:fixed bottom-0 right-30 animate-bounce"
        style={{ animationDuration: "4s" }}
      >
        <TriangleSVG color={"#aba1e5"} size={68} />
      </div>

      <div
        className="fixed top-8 right-8 animate-bounce "
        style={{ animationDuration: "6s" }}
      >
        <StarSVG color={"#9ad5ff"} size={28} />
      </div>

      <div className="fixed top-38 right-5 ">
        <HelicalSVG color={"black"} size={48} />
      </div>
      <div className="fixed top-20 right-20 ">
        <GhostSVG color={"#FF6363"} size={56} />
      </div>

      <div
        className="fixed top-8 right-40  animate-spin"
        style={{ animationDuration: "6s" }}
      >
        <CircleSVG color={"#78C841"} size={32} />
      </div>

      <div
        className="fixed bottom-4 right-3  animate-bounce"
        style={{ animationDuration: "4s" }}
      >
        <CoffeeSVG color={"#854836"} size={32} />
      </div>

      <div
        className="fixed bottom-18 right-22 animate-spin"
        style={{ animationDuration: "4s" }}
      >
        <WrongSVG color={"#E14434"} size={28} />
      </div>
      <div
        className="fixed bottom-6 left-24 animate-pulse"
        style={{ animationDuration: "2s" }}
      >
        <BulbSVG color={"#F26B0F"} size={48} />
      </div>

      <div className="fixed bottom-6 right-56">
        <ScaleSVG color={"#7EA1FF"} size={48} />
      </div>

      <div
        className="fixed bottom-8 left-68 animate-bounce"
        style={{ animationDuration: "6s" }}
      >
        <GiftSVG color={"#687FE5"} size={42} />
      </div>

      <div
        className="fixed bottom-22 left-4 animate-bounce"
        style={{ animationDuration: "6s" }}
      >
        <SantSVG color={"#FB4141"} size={40} />
      </div>
      <div
        className="hidden md:fixed bottom-26 left-42  animate-bounce"
        style={{ animationDuration: "6s" }}
      >
        <PawSVG color={"#BB6653"} size={38} />
      </div>
    </div>
  );
}
