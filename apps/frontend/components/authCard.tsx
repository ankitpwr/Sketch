"use client";
import React, { useRef, useState } from "react";
import Input from "./input";
import Button from "./button";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Ellipsis, LoaderIcon } from "lucide-react";

export default function AuthCard({ isSignin }: { isSignin: boolean }) {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setLoading(true);
    if (!emailRef.current || !passwordRef.current) return; //  toast error
    if (!emailRef.current.value || !passwordRef.current.value)
      return toast.error("Please fill Email and Password");

    let response;
    try {
      if (isSignin) {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/signin`,
          {
            email: emailRef.current.value,
            password: passwordRef.current.value,
          }
        );
      } else {
        if (!nameRef.current || !nameRef.current.value)
          return toast.error("Please Fill Name");
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/signup`,
          {
            email: emailRef.current.value,
            password: passwordRef.current.value,
            name: nameRef.current.value,
          }
        );
      }
      localStorage.setItem("token", response.data.token);
      router.push("/");
    } catch (error) {
      const axiosError = error as AxiosError<{ error: any }>;
      console.log(axiosError);

      if (
        axiosError.response &&
        axiosError.response.data &&
        axiosError.response.data.error
      ) {
        const errorData = axiosError.response.data.error;

        if (typeof errorData === "string") toast.error(errorData);
        else if (Array.isArray(errorData) && errorData.length > 0) {
          toast.error(errorData[0].message);
        } else toast.error("Error occured");
      }
    }

    setLoading(false);
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
        <Input refer={passwordRef} placeholder={"Password"} type={"password"} />

        <Button
          varient={"primary"}
          size={"sm"}
          isActive={false}
          onClickhandler={handleSubmit}
          styles={`w-full py-6`}
        >
          {loading ? (
            <Ellipsis className="animate-pulse w-10 h-10 " />
          ) : isSignin ? (
            "Sign in"
          ) : (
            "Sign up"
          )}
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
