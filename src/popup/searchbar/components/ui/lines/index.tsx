import React from "react";
import { AddressAvatar } from "../../../../../components/avatar";
import { Token } from "../../../../../interfaces/assets";
import { addressSlicer } from "../../../../../utils/formaters";
import { NewWalletProps, User } from "../../../models";

export interface LinesType {
  token: Token | { name: string } | NewWalletProps | User;
  children: React.ReactNode;
  icon?: any;
  isImage?: boolean;
  active: boolean;
  extraCss?: string;
  setActive?: React.Dispatch<React.SetStateAction<number>>;
  index?: number;
  [key: string]: any;
}

export const Lines = ({
  token,
  children,
  icon,
  active,
  setActive,
  index,
  extraCss,
  isImage = false,
  ...props
}: LinesType) => {
  let address = "";
  if ("address" in token) address = addressSlicer(token.address);

  const renderLogoOrAddressAvatar = (token) => {
    if (!token || !isImage) {
      return null;
    }

    if (token.logo && token.logo !== "/mobula/fullicon.png") {
      return (
        <img
          className="w-[20px] h-[20px] rounded-full mr-[7.5px]"
          alt={`${token.name} logo`}
          src={token.logo}
        />
      );
    }
    return (
      <AddressAvatar
        extraCss="mr-2.5 rounded-full w-[20px] h-[20px] min-w-[20px]"
        address={token.address || token?.contracts?.[0]}
      />
    );
  };
  const logo = renderLogoOrAddressAvatar(token);

  return (
    <div
      className={`flex items-center cursor-pointer transition-all duration-200 justify-between ${
        active ? "bg-light-bg-hover dark:bg-dark-bg-hover" : ""
      } py-[7px] px-[20px] md:px-2.5 hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover ${extraCss}`}
      onMouseOver={() => setActive(index)}
      {...props}
    >
      <div className="flex items-center">
        {logo}
        {icon || null}
        <p className="text-sm font-medium md:font-normal max-w-[340px] truncate text-light-font-100 dark:text-dark-font-100 mr-2.5">
          {token.name}
        </p>
        <p className="text-sm font-medium md:font-normal text-light-font-40 dark:text-dark-font-40">
          {"symbol" in token ? token.symbol : address}
        </p>
      </div>
      {children}
    </div>
  );
};
