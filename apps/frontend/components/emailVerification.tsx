import useMenuStore from "@/app/store/menu-store";
import React, { useEffect, useRef, useState } from "react";
import Button from "./button";
import { toast } from "sonner";

export default function EmailVerification() {
  const { verifyEmailBox, setVerifyEmailBox } = useMenuStore();
  const [otpValue, setOtpValue] = useState(new Array(4).fill(""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [finalOtp, setFinalOtp] = useState<string | null>(null);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleVerification = (otp: string | null) => {
    if (!otp) return toast.error("Please enter the OTP");
    if (otp.length != 6) return toast.error("OTP must be 6 digit");
  };

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;
    const newOtp = [...otpValue];
    newOtp[index] = value.substring(value.length - 1);

    setOtpValue(newOtp);
    setFinalOtp(newOtp.join(""));
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    console.log("called keydown");
    if (e.key === "Backspace" && index > 0 && !otpValue[index]) {
      console.log("inside Backspace logic");
      inputRefs.current[index - 1]!.focus();
    }
  };

  return (
    <div className="flex flex-col items-center md:gap-8 gap-4 z-22  bg-[#fef3d3] dark:bg-[#232329]  p-6 md:p-12 rounded-4xl   shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
      <div className="flex flex-col gap-1 justify-center items-center">
        <h1 className="text-2xl font-nunito font-extrabold text-[#343a40] dark:text-[#ced4da] ">
          Enter OTP
        </h1>
        <p className="text-sm font-nunito text-[#343A40] dark:text-[#ced4da] ">
          Enter the 6-digit code has been sent to your Email
        </p>
      </div>
      <div className="flex gap-2 font-bold font-nunito text-2xl ">
        {otpValue.map((value, index) => {
          return (
            <input
              key={index}
              ref={(input) => {
                inputRefs.current[index] = input;
              }}
              value={value}
              type="text"
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-14 h-14 border-1 rounded-2xl bg-[#fcf6e2] dark:bg-[#3c3c45] flex text-center border-[#767680] focus:outline-none text-[#1b1b1f]  dark:border-[#46464f] dark:text-white focus:border-[#6965db]"
            ></input>
          );
        })}
      </div>
      <Button
        onClickhandler={() => handleVerification(finalOtp)}
        varient={"primary"}
        size="md"
        isActive={false}
        styles="w-46 h-14 text-lg"
      >
        {" "}
        <p>Verify</p>{" "}
      </Button>
    </div>
  );
}
