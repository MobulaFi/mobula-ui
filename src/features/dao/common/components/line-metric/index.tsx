"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { AddressAvatar } from "../../../../../components/avatar";
import { SmallFont } from "../../../../../components/fonts";
import { addressSlicer } from "../../../../../utils/formaters";

interface MetricsLineProps {
  keys?: string;
  address?: string;
  history?: any;
  logo: string;
  rank?: number;
  isProfilePic?: boolean;
  isProtocolStat?: boolean;
  url?: boolean;
  children: React.ReactNode;
}

export const MetricsLine = ({
  keys,
  history,
  logo,
  isProtocolStat,
  rank,
  address,
  children,
  url,
  isProfilePic,
}: MetricsLineProps) => {
  const router = useRouter();
  const isUrl = history?.name !== undefined || url;
  const isLinkToProfile = keys?.includes("#");
  const handleRedirectToProfile = () => {
    if (isLinkToProfile) router.push(`/profile/${address}`);
  };
  const protocolPath = {
    url: "/dao/protocol/overview",
    name: "Overview",
    theme: "Protocol DAO",
  };

  useEffect(() => {
    localStorage.setItem("path", JSON.stringify(protocolPath));
  }, []);

  const renderProfileImageOrAddressAvatar = () => {
    if (!isProfilePic) return null;
    if (logo !== "/mobula/fullicon.png") {
      return (
        <img
          className="rounded-full w-5 h-5"
          src={logo || "/empty/unknown.png"}
          alt={`${history?.token_data.name} logo`}
        />
      );
    }
    return (
      <AddressAvatar
        extraCss="w-5 h-5 rounded-full"
        address={address as string}
      />
    );
  };

  const imageProfile = renderProfileImageOrAddressAvatar();

  return (
    <div
      className={`flex w-full items-center justify-between transition-all duration-200
     ${
       isUrl
         ? "cursor-pointer hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover"
         : ""
     } 
     border-b border-light-border-primary dark:border-dark-border-primary py-[15px] px-5 sm:px-2.5`}
      onClick={() => {
        if (!isUrl) return;
        if (history?.token_data.name)
          router.push(`/asset/${history.token_data.name}`);
      }}
    >
      <div className="flex items-center">
        {isProtocolStat ? (
          <SmallFont extraCss="mr-2.5 text-light-font-60 dark:text-dark-font-60">
            {rank ? rank + 1 : 1}
          </SmallFont>
        ) : null}
        {imageProfile}
        {!isProfilePic ? (
          <img
            className="rounded-full w-5 h-5"
            src={logo || "/empty/unknown.png"}
            alt={`${history?.token_data.name} logo`}
          />
        ) : null}
        <div
          className="flex flex-wrap items-center sm:items-start mr-2.5 cursor-pointer flex-row sm:flex-col"
          onClick={handleRedirectToProfile}
        >
          <SmallFont extraCss="ml-2.5 max-w-[120px] truncate">
            {isProtocolStat ? keys?.slice(0, keys?.length - 5) : keys}
          </SmallFont>
          <div className="flex items-center">
            <SmallFont extraCss="ml-2.5 text-light-font-40 dark:text-dark-font-40 ">
              {history?.token_data.symbol}
            </SmallFont>
            {address ? (
              <SmallFont extraCss="whitespace-pre-wrap text-light-font-40 dark:text-dark-font-40">
                ({addressSlicer(address)})
              </SmallFont>
            ) : null}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
