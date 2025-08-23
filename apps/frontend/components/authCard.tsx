"use client";
import React, { useRef } from "react";
import Input from "./input";
import Button from "./button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

export default function AuthCard({ isSignin }: { isSignin: boolean }) {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) return; //  toast error
    let response;
    if (isSignin) {
      response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/signin`,
        {
          email: emailRef.current.value,
          password: passwordRef.current.value,
        }
      );
    } else {
      if (!nameRef.current) return; //  toast error
      response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/signup`,
        {
          email: emailRef.current.value,
          password: passwordRef.current.value,
          name: nameRef.current.value,
        }
      );
    }

    if (response.status != 200) {
      console.log(`error as ${response.data.error}`);
      toast.error(response.data.error);
      return;
    } else {
      console.log(`token is ${response.data.tokens}`);
      localStorage.setItem("token", response.data.token);
      router.push("/");
    }
  };
  return (
    <div className="flex flex-col items-center md:gap-6 gap-4 bg-[#fef3d3] dark:bg-[#232329]  p-6 md:p-12 rounded-4xl   shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
      <div className="flex flex-col items-center gap-1">
        {" "}
        <h1 className="text-2xl font-nunito font-extrabold text-[#343a40] dark:text-[#ced4da] ">
          Hi there!
        </h1>
        <p className="text-sm font-nunito text-[#343A40] dark:text-[#ced4da] ">
          Enter Your Email and Password
        </p>
      </div>
      <div className="flex flex-col items-center gap-2 ">
        {!isSignin && (
          <Input refer={nameRef} placeholder="Name" type={"text"} />
        )}
        <Input refer={emailRef} placeholder={"Email"} type={"text"} />
        <Input refer={passwordRef} placeholder={"Password"} type={"text"} />

        <Button
          varient={"primary"}
          size={"sm"}
          isActive={false}
          onClickhandler={handleSubmit}
          styles={`w-full py-6`}
        >
          {isSignin ? "Sign in" : "Sign up"}
        </Button>
      </div>

      <div className="flex w-full gap-1 items-center">
        <div
          id="border-line"
          className="w-[50%] h-[0.5px] rounded-lg bg-gray-500 dark:bg-[#b9b9c6]"
        ></div>
        <p className="align-text-top text-[#343A40] dark:text-[#b9b9c6]">or</p>

        <div
          id="border-line"
          className="w-[50%] h-[0.5px] rounded-lg bg-gray-500 dark:bg-[#b9b9c6]"
        ></div>
      </div>

      {isSignin && (
        <div className="flex w-full justify-center gap-1">
          <h1 className="text-xs">Don't have an account?</h1>
          <p
            onClick={() => router.push("/signup")}
            className="text-xs text-[#6965db] hover:cursor-pointer hover:underline"
          >
            Sign Up
          </p>
        </div>
      )}

      {!isSignin && (
        <div className="flex w-full justify-center gap-1">
          <h1 className="text-xs">Already have an account?</h1>
          <p
            onClick={() => router.push("/signin")}
            className="text-xs text-[#6965db] hover:cursor-pointer hover:underline"
          >
            Sign In
          </p>
        </div>
      )}
    </div>
  );
}
