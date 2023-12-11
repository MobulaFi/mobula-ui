"use client";
import { NextImageFallback } from "components/image";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MediumFont } from "../../../../../components/fonts";
import { NextChakraLink } from "../../../../../components/link";
import { useMember } from "../../hooks/use-members";
import { usePathnameInfo } from "../../hooks/use-pathname-info";
import { ButtonOutlined } from "../button-outlined";

interface LeftNavigationMobileProps {
  page: string;
}

export const LeftNavigationMobile = ({ page }: LeftNavigationMobileProps) => {
  const pathname = usePathname();
  const [selectedSection, setSelectedSection] = useState("");
  const router = useRouter();
  const infos = usePathnameInfo();
  const membersQuantity = useMember();
  const { theme } = useTheme();
  const isWhiteMode = theme === "light";

  const getActiveButtonFromPath = () => {
    if (pathname.includes("/protocol/overview")) setSelectedSection("Overview");
    if (pathname.includes("/protocol/sort")) setSelectedSection("First Sort");
    if (pathname.includes("/protocol/validation"))
      setSelectedSection("Final Validation");
    if (pathname.includes("/protocol/metrics")) setSelectedSection("Sorts");
    if (pathname.includes("/protocol/pool")) setSelectedSection("Pending Pool");
    if (pathname.includes("/governance/new"))
      setSelectedSection("New Proposal");
    if (pathname.includes("/governance/overview"))
      setSelectedSection("Overview");
    if (pathname.includes("/governance/staking")) setSelectedSection("Staking");
    if (pathname.includes("/governance/metrics")) setSelectedSection("Stats");
  };

  useEffect(() => {
    getActiveButtonFromPath();
  }, []);

  return (
    <div className="flex flex-col w-full mt-[28px] md:mt-0">
      <div className="mb-5 ml-2.5">
        <p className="text-light-font-100 dark:text-dark-font-100 text-xl font-bold">
          Mobula DAOs
        </p>
      </div>
      <div className="flex items-center ml-2.5">
        <NextImageFallback
          style={{
            marginRight: "15px",
          }}
          alt="mobula logo"
          width={50}
          height={50}
          src={
            isWhiteMode
              ? "/mobula/mobula-logo-light.svg"
              : "/mobula/mobula-logo.svg"
          }
          fallbackSrc={"/mobula/mobula-logo.svg"}
        />
        <div className="mr-5">
          <p className="text-light-font-100 dark:text-dark-font-100 text-[22px]">
            {infos.title}
          </p>
          <p className="text-light-font-60 dark:text-dark-font-60 text-[15px]">
            {membersQuantity} {infos.subtitle}
          </p>
        </div>
        <ButtonOutlined
          extraCss="flex justify-center items-center w-[90px] h-[25px] text-[13px] md:text-xs font-normal cursor-not-allowed opacity-50"
          onClick={() => {
            // router.push(`/discover/${page}`)
          }}
        >
          Join
        </ButtonOutlined>
      </div>
      <div className="flex items-center pb-0 mt-2.5 overflow-x-scroll relative scroll border-b border-light-border-primary dark:border-dark-border-primary">
        {infos.list.map((info) => {
          const isActive = selectedSection === info?.name;
          return (
            <div key={info.id}>
              <button
                className={`w-fit py-2.5 pb-5 px-[15px] ${
                  isActive
                    ? "border-b border-blue dark:border-blue"
                    : "border-0"
                }`}
              >
                <NextChakraLink href={`/dao/${info.url}`}>
                  <MediumFont
                    extraCss={`${
                      isActive
                        ? ""
                        : "text-light-font-40 dark:text-dark-font-40"
                    }  whitespace-nowrap`}
                  >
                    {info?.name}
                  </MediumFont>
                </NextChakraLink>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
