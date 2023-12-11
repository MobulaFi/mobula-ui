"use client";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { useAccount } from "wagmi";
import {
  LargeFont,
  MediumFont,
  SmallFont,
} from "../../../../../../components/fonts";
import { UserContext } from "../../../../../../contexts/user";
import { pushData } from "../../../../../../lib/mixpanel";

export const Discover = ({ showPage, info }) => {
  const router = useRouter();
  const [isHover, setIsHover] = useState(false);
  const isReferral = info.title === "Referral Program";
  const [isCopied, setIsCopied] = useState(false);
  const { address } = useAccount();
  const { user } = useContext(UserContext);

  const clickEvent = () => {
    if (isReferral) {
      setIsCopied(true);
      navigator.clipboard.writeText(
        `https://mobula.fi?ref=${user?.reflink ? user.reflink : address}`
      );
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } else {
      pushData("Window Home Clicked", {
        name: info.title,
        to_page: info.url,
      });
      router.push(info.url);
    }
  };

  return (
    <div
      className={`flex flex-col w-[200px] px-3.5 transition-all duration-300 ease-in-out pt-2.5 pb-0 min-w-full`}
      style={{ transform: `translateX(-${showPage * 100}%)` }}
    >
      <MediumFont>{info.title}</MediumFont>
      <div
        className={`flex flex-col cursor-pointer mt-2.5 lg:mt-[7.5px] w-full h-[140px] lg:h-[123px] rounded-2xl relative border ${
          isHover
            ? "border-light-border-secondary dark:border-dark-border-secondary"
            : "border-light-border-primary dark:border-dark-border-primary"
        } transition-all duration-200`}
        onClick={clickEvent}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className="flex w-[90%] justify-between items-center absolute top-[15px] left-[15px]">
          <LargeFont>{info.subtitle}</LargeFont>
          {isCopied && isReferral ? (
            <div className="flex items-center">
              <SmallFont extraCss="text-bold">Copied</SmallFont>
              <BsCheckLg className="ml-[5px] text-green text-xs" />
            </div>
          ) : null}
          {!isCopied && isReferral ? (
            <SmallFont extraCss="font-bold"> Copy</SmallFont>
          ) : null}
        </div>
        <div className="absolute w-[90%] mx-auto top-[55px] left-[15px] text-sm lg:text-[13px] sm:text-xs font-medium whitespace-pre-wrap break-words">
          {info.description}
        </div>
        <img
          className="w-full h-[160px]"
          src={info.image}
          alt="Discovery banner of Mobula features"
        />
      </div>
    </div>
  );
};
