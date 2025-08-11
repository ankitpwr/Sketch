import React, { useState } from "react";
import Button from "./button";
import Dialog from "./Dialog";

export default function Share({ standalone }: { standalone: boolean }) {
  const [dialogBox, setDialogBox] = useState(false);
  return (
    <div className="fixed top-5 right-5 flex gap-2">
      <Button
        onClickhandler={() => setDialogBox((pre) => !pre)}
        varient={"primary"}
        size="md"
        isActive={false}
      >
        {" "}
        <p>Share</p>{" "}
      </Button>

      {dialogBox && (
        <Dialog setDialogBox={setDialogBox} standalone={standalone} />
      )}
    </div>
  );
}
