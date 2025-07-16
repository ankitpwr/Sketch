import AuthCard from "@/components/authCard";
import React from "react";

export default function Signup() {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <h1>Sketch</h1>
      <AuthCard isSignin={false} />
    </div>
  );
}
