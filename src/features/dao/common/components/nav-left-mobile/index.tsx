"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MediumFont } from "../../../../../components/fonts";
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
        <div className="flex items-center mt-5">
          <button
            className={`text-[13px] font-medium ${
              pathname.includes("governance")
                ? "text-light-font-100 dark:text-dark-font-100"
                : "text-light-font-40 dark:text-dark-font-40"
            }`}
            onClick={() => router.push("/dao/governance/overview")}
          >
            Governance
          </button>
          <div className="h-4 w-0.5 bg-light-border-primary dark:bg-dark-border-primary mx-2.5" />
          <button
            className={`text-[13px] font-medium ${
              pathname.includes("protocol")
                ? "text-light-font-100 dark:text-dark-font-100"
                : "text-light-font-40 dark:text-dark-font-40"
            }`}
            onClick={() => router.push("/dao/protocol/overview")}
          >
            Protocol
          </button>
        </div>
      </div>
      <div className="flex items-center ml-2.5">
        <img
          src={
            pathname.includes("governance")
              ? "/header/new/governance.svg"
              : "/header/new/protocol.svg"
          }
          className="w-[50px] h-[50px] mr-[15px]"
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
          extraCss="w-[90px] h-[25px] text-[13px] md:text-xs font-medium"
          onClick={() => router.push(`/discover/${page}`)}
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
                className={`py-2.5 pb-5 px-[15px] ${
                  isActive
                    ? "border-b border-blue dark:border-blue"
                    : "border-0"
                }`}
                onClick={() => {
                  if (info.url === "validation")
                    router.push("/dao/protocol/validation");
                  else if (info.url === "sort")
                    router.push("/dao/protocol/sort");
                  else router.push(`/dao${info.url}`);
                }}
              >
                <MediumFont
                  extraCss={`${
                    isActive ? "" : "text-light-font-40 dark:text-dark-font-40"
                  }`}
                >
                  {info?.name}
                </MediumFont>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};