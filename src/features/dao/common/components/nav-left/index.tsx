"use client";
import { NextChakraLink } from "components/link";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../../../../components/button";
import {
  LargeFont,
  MediumFont,
  SmallFont,
} from "../../../../../components/fonts";
import { useMember } from "../../hooks/use-members";
import { usePathnameInfo } from "../../hooks/use-pathname-info";

interface ILeftNavigation {
  page: string;
  [key: string]: any;
}

export const LeftNavigation = ({ page, ...props }: ILeftNavigation) => {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedSection, setSelectedSection] = useState("");
  const membersQuantity = useMember();
  const infos = usePathnameInfo();
  const isGovernance = page === "governance";
  const { theme } = useTheme();
  const isWhiteMode = theme === "light";

  useEffect(() => {
    // if (pathname.includes("new")) setSelectedSection("New Proposal");
    // if (pathname.includes("overview")) setSelectedSection("Overview");
    // if (pathname.includes("staking")) setSelectedSection("Staking");
    // if (pathname.includes("metrics")) setSelectedSection("Stats");
    if (pathname.includes("overview")) setSelectedSection("Overview");
    if (pathname.includes("sort")) setSelectedSection("First Sort");
    if (pathname.includes("pool")) setSelectedSection("Pending Pool");
    if (pathname.includes("validation")) setSelectedSection("Final Validation");
    if (pathname.includes("metrics")) setSelectedSection("Stats");
  }, []);

  return (
    <div {...props}>
      {/* pl-5 */}
      <div className="mb-5 ">
        <p className="text-xl text-light-font-100 dark:text-dark-font-100 font-bold">
          Mobula DAO
        </p>
      </div>
      <div
        className="bg-light-bg-secondary dark:bg-dark-bg-secondary h-[500px] w-[235px] 
      flex items-center flex-col mr-5 rounded-xl border border-light-border-primary dark:border-dark-border-primary"
      >
        <img
          className="mt-[30px] h-[87px] w-[87px]"
          alt="mobula logo"
          src={
            isWhiteMode
              ? "/mobula/mobula-logo-light.svg"
              : "/mobula/mobula-logo.svg"
          }
        />
        <LargeFont extraCss="mt-2.5">{infos.title}</LargeFont>
        <MediumFont extraCss="text-light-font-60 dark:text-dark-font-60 text-normal">
          {membersQuantity} {infos.subtitle}
        </MediumFont>
        <Button
          extraCss="border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue max-w-[120px] h-[30px] mb-[25px] mt-5 cursor-not-allowed opacity-50"
          onClick={() => {
            // if (isGovernance) router.push("/discover/governance");
            // else router.push("/discover/protocol");
          }}
        >
          <SmallFont>Join</SmallFont>
        </Button>
        <div className="flex flex-col w-full relative">
          <div className="flex flex-col w-full items-start relative">
            {infos.list.map((info) => (
              <button
                key={info.url}
                className={`py-2.5 pl-[30px] ${
                  selectedSection === info.name
                    ? "border-l border-blue dark:border-blue"
                    : ""
                }`}
                onClick={() => setSelectedSection(info?.name)}
              >
                <NextChakraLink href={`/dao/${info.url}`}>
                  <MediumFont
                    extraCss={`${
                      selectedSection === info?.name
                        ? "text-light-font-100 dark:text-dark-font-100"
                        : "text-light-font-40 dark:text-dark-font-40"
                    }`}
                  >
                    {info?.name}{" "}
                  </MediumFont>
                </NextChakraLink>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
