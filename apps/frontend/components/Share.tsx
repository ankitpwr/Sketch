import React, { useState } from "react";
import Button from "./button";
import Dialog from "./Dialog";
import useUserStore from "@/app/store/user-store";

export default function Share() {
  const [dialogBox, setDialogBox] = useState(false);
  const { standalone } = useUserStore();
  const varient = standalone ? "primary" : "success";
  return (
    <div className="fixed top-5 right-5 flex gap-2">
      <Button
        onClickhandler={() => setDialogBox((pre) => !pre)}
        varient={varient}
        size="md"
        isActive={false}
      >
        {" "}
        <p>Share</p>{" "}
      </Button>

      {dialogBox && <Dialog setDialogBox={setDialogBox} />}
    </div>
  );
}
