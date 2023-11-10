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
      className={`flex flex-col w-[200px] transition-all duration-250 pt-2.5 py-[15px] pb-0`}
      style={{ transform: `translateX(-${showPage * 100}%)` }}
    >
      <MediumFont>{info.title}</MediumFont>
      <div
        className={`flex cursor-pointer mt-5 lg:mt-[7.5px] w-full h-[130px] lg:h-[123px] rounded-2xl relative border ${
          isHover
            ? "border-light-border-secondary dark:border-dark-border-secondary"
            : "border-light-border-primary dark:border-dark-border-primary"
        } transition-all duration-250`}
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
            <SmallFont extraCss="text-bold"> Copy</SmallFont>
          ) : null}
        </div>
        <SmallFont className="absolute bottom-[25px] left-[15px] text-medium">
          {info.description}
        </SmallFont>
        <img
          className="w-full h-[130px]"
          src={info.image}
          alt="Discovery banner of Mobula features"
        />
      </div>
    </div>
  );
};
