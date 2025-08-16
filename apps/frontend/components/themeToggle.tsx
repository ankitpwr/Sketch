"use client";
import React, { useEffect, useState } from "react";
import Button from "./button";
import { LaptopMinimal, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const checkActive = (currentTheme: string) => {
    return currentTheme == theme;
  };
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <div className="  flex p-1  gap-1 items-center border border-[#f1f0ff] dark:border-[#2a2a34] w-fit rounded-xl">
      <Button
        varient={"theme"}
        size={"md"}
        isActive={checkActive("light")}
        onClickhandler={() => setTheme("light")}
      >
        {" "}
        <Sun size={16} color={"currentColor"} />
      </Button>
      <Button
        varient={"theme"}
        size={"md"}
        isActive={checkActive("dark")}
        onClickhandler={() => setTheme("dark")}
      >
        {" "}
        <Moon size={16} color={"currentColor"} />
      </Button>
      <Button
        varient={"theme"}
        size={"md"}
        isActive={checkActive("system")}
        onClickhandler={() => {
          setTheme("system");
        }}
      >
        {" "}
        <LaptopMinimal size={16} color={"currentColor"} />
      </Button>
    </div>
  );
}
