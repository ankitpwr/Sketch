import React from "react";
import {
  ArrowSVG,
  BulbSVG,
  ChristmasTreeSVG,
  CircleSVG,
  CoffeeSVG,
  CurlyArrow,
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
        style={{ animationDuration: "8s" }}
      >
        <DrawSVG size={60} color={"#FF8282"} />
      </div>
      <div className="fixed top-32 left-2 " style={{ animationDuration: "8s" }}>
        <FunnyFaceSVG size={70} color={"#716ddd"} />
      </div>

      <div className="hidden md:fixed top-8 left-34">
        <ArrowSVG size={32} color={"#FF9B00"} />
      </div>
      <div
        className="fixed top-34 left-34 animate-bounce"
        style={{ animationDuration: "4s" }}
      >
        <SqaureSVG color={"#E14434"} size={24} />
      </div>

      <div
        className="invisible md:visible fixed bottom-0 right-30 animate-bounce"
        style={{ animationDuration: "4s" }}
      >
        <TriangleSVG color={"#aba1e5"} size={64} />
      </div>

      <div
        className="fixed top-8 right-8 animate-bounce "
        style={{ animationDuration: "6s" }}
      >
        <StarSVG color={"#9ad5ff"} size={24} />
      </div>

      <div className="fixed top-38 right-5 ">
        <HelicalSVG color={"black"} size={44} />
      </div>
      <div className="fixed top-20 right-20 ">
        <GhostSVG color={"#FF6363"} size={48} />
      </div>

      <div
        className="fixed top-8 right-40 animate-bounce "
        style={{ animationDuration: "6s" }}
      >
        <CircleSVG color={"#78C841"} size={50} />
      </div>

      <div
        className="fixed bottom-4 right-3  animate-bounce"
        style={{ animationDuration: "4s" }}
      >
        <CoffeeSVG color={"#854836"} size={28} />
      </div>

      <div
        className="fixed bottom-26 md:bottom-18 right-22 "
        style={{ animationDuration: "6s" }}
      >
        <WrongSVG color={"#FFCCE1"} size={24} />
      </div>
      <div
        className="fixed bottom-6 left-24 animate-pulse"
        style={{ animationDuration: "2s" }}
      >
        <BulbSVG color={"#F08B51"} size={40} />
      </div>

      <div className="invisible md:visible fixed bottom-6 right-56">
        <ScaleSVG color={"#7EA1FF"} size={44} />
      </div>

      <div
        className="fixed bottom-14 left-54 animate-bounce"
        style={{ animationDuration: "6s" }}
      >
        <GiftSVG color={"#687FE5"} size={36} />
      </div>

      <div
        className="fixed bottom-22 left-4 animate-bounce"
        style={{ animationDuration: "6s" }}
      >
        <SantSVG color={"#FFA09B"} size={38} />
      </div>
    </div>
  );
}
