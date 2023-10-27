"use client";

import NextImage from "next/image";
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
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { pushData } from "../../../../../../lib/mixpanel";

export const Discover = ({ showPage, info }) => {
  const { text80, bordersActive, text100, borders } = useColors();
  const router = useRouter();
  const [isHover, setIsHover] = useState(false);
  const isReferral = info.title === "Referral Program";
  const [isCopied, setIsCopied] = useState(false);
  const { address } = useAccount();
  const { user } = useContext(UserContext);
  return (
    <div
      className={`min-w-full flex flex-col w-[200px] translate-x-[-${
        showPage * 100
      }%] transition-all duration-250 pt-2.5 py-[15px] pb-0`}
    >
      <MediumFont>{info.title}</MediumFont>
      <div
        className={`flex cursor-pointer mt-5 lg:mt-[7.5px] w-full h-[130px] lg:h-[123px] rounded-2xl relative border ${
          isHover
            ? "border-light-border-secondary dark:border-dark-border-secondary"
            : "border-light-border-primary dark:border-dark-border-primary"
        } transition-all duration-250`}
        onClick={() => {
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
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className="flex w-[90%] justify-between items-center absolute top-[15px] left-[15px]">
          <LargeFont>{info.subtitle}</LargeFont>
          {isCopied && isReferral ? (
            <div className="flex items-center">
              <SmallFont extraCss="text-bold">Copied</SmallFont>
              <BsCheckLg
              //TODO: fix icon
              // as={BsCheckLg}
              // ml="5px"
              // color="green"
              // fontSize="12px"
              // mt="1px"
              />
            </div>
          ) : null}
          {!isCopied && isReferral ? (
            <SmallFont extraCss="text-bold"> Copy</SmallFont>
          ) : null}
        </div>
        <SmallFont className="absolute bottom-[25px] left-[15px] text-medium">
          {info.description}
        </SmallFont>
        <NextImage
          // TODO: fix image
          src={info.image}
          alt="Discovery banner of Mobula features"
          width="375"
          height="130"
        />
      </div>
    </div>
  );
};
