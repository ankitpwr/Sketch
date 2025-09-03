import React, { useState } from "react";
import Button from "./button";
import Dialog from "./Dialog";
import useUserStore from "@/app/store/user-store";
import useMenuStore from "@/app/store/menu-store";

export default function Share() {
  const { dialogBox, setDialogBox } = useMenuStore();
  const { standalone } = useUserStore();
  const varient = standalone ? "primary" : "success";

  return (
    <div className="hidden md:flex fixed top-5 right-5  gap-2">
      <Button
        onClickhandler={() => setDialogBox(!dialogBox)}
        varient={varient}
        size="md"
        isActive={false}
      >
        {" "}
        <p>Share</p>{" "}
      </Button>

      {dialogBox && <Dialog />}
    </div>
  );
}
