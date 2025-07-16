"use client";
import React, { useRef } from "react";
import Input from "./input";
import Button from "./button";
import { useRouter } from "next/navigation";
import axios from "axios";

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
      return; //toast error
    } else {
      console.log(`token is ${response.data.tokens}`);
      localStorage.setItem("token", response.data.token);
      router.push("/");
    }
  };
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <h1>Welcome</h1>
        {!isSignin && (
          <Input refer={nameRef} placeholder="Name" type={"text"} />
        )}
        <Input refer={emailRef} placeholder={"Email"} type={"text"} />
        <Input refer={passwordRef} placeholder={"Password"} type={"text"} />

        <Button
          onClickhandler={handleSubmit}
          title={isSignin ? "Sign in" : "Sign up"}
        />
      </div>
    </div>
  );
}
