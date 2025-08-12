import React from "react";
import {
  ArrowSVG,
  BulbSVG,
  CircleSVG,
  CoffeeSVG,
  DrawSVG,
  FunnyFaceSVG,
  GhostSVG,
  HelicalSVG,
  ScaleSVG,
  StarSVG,
  WrongSVG,
} from "./svgIcons";

export default function Doodles() {
  return (
    <div>
      <div
        className="fixed top-6 left-3 animate-bounce "
        style={{ animationDuration: "5s" }}
      >
        <DrawSVG size={42} color={"#33A1E0"} />
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

      {/* <div
        className="fixed bottom-16 left-1/4  animate-bounce"
        style={{ animationDuration: "4s" }}
      >
        <CoffeeSVG color={"#854836"} size={38} />
      </div>

      <div className="fixed bottom-16 left-1/2">
        <WrongSVG color={"#E14434"} size={28} />
      </div> */}
      {/* <div
        className="fixed bottom-10 left-1/2 animate-pulse"
        style={{ animationDuration: "2s" }}
      >
        <BulbSVG color={"#FFB200"} size={48} />
      </div> */}

      {/* <div className="fixed bottom-32 left-2/3">
        <ScaleSVG color={"#F93827"} size={48} />
      </div> */}
    </div>
  );
}
