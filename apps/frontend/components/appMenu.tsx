import React from "react";

import TextSelector from "./TextSelector";
import AppMenuContainer from "./appMenuContainer";

export default function AppMenu() {
  function isHexColor(hex: string) {
    var hexaPattern = /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
    return hexaPattern.test(hex) || hex == "#00000000";
  }

  return (
    <div className=" invisible md:visible py-1 rounded fixed left-5  top-20 min-h-86 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
      <AppMenuContainer />
    </div>
  );
}
