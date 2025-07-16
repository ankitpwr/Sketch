import AuthCard from "@/components/authCard";

import React, { useRef } from "react";

export default function Signin() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1>Sketch</h1>
      <AuthCard isSignin={true} />
    </div>
  );
}
