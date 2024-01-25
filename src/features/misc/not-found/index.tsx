"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Container } from "../../../components/container";

export default function NotFound() {
  const [timer, setTimer] = useState(6);
  const router = useRouter();
  function countdown() {
    if (timer > 0) setTimer(timer - 1);
    else router.push("/home");
  }
  setTimeout(countdown, 1000);
  return (
    <Container extraCss="flex justify-center items-center font-jetBrains min-h-[70vh] h-full my-auto">
      <img
        src="/empty/ray.png"
        alt="Ray crying"
        className="w-[150px] md:w-[116px] h-[106px] md:h-[82px] mx-auto"
      />
      <p className="text-center text-normal text-5xl my-[15px] md:my-[10px] text-light-font-100 dark:text-dark-font-100">
        404
      </p>
      <p className="text-center text-normal text-2xl md:text-base text-cyan dark:text-cyan w-[90%] mx-auto max-w-[420px]">
        Oops! You were not supposed to find a crying ray.
      </p>
      <div className="h-[1px] bg-light-border-primary dark:bg-dark-border-primary w-[90%] mx-auto max-w-[190px] my-[25px] md:my-[15px]" />
      <p className="text-center text-normal text-base md:text-sm w-[90%] mx-auto text-light-font-100 dark:text-dark-font-100">
        Please, give him some privacy and go back to the
        <div className="text-base font-medium text-cyan dark:text-cyan">
          main page
          <span className="text-light-font-100 dark:text-dark-font-100">.</span>
        </div>
      </p>
      <div>
        <p className="mt-[15px] text-3xl md:text-2xl text-center text-light-font-100 dark:text-dark-font-100 mx-auto w-5 max-w-5">
          {timer}
        </p>
      </div>
    </Container>
  );
}
