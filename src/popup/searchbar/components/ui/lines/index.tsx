import React from "react";
import { AddressAvatar } from "../../../../../components/avatar";
import { Token } from "../../../../../interfaces/assets";
import { addressSlicer } from "../../../../../utils/formaters";
import { NewWalletProps, User } from "../../../models";

export interface LinesType {
  token: Token | { name: string } | NewWalletProps | User;
  children: JSX.Element;
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
  ...props
}: LinesType) => {
  let address = "";
  if ("address" in token) address = addressSlicer(token.address);

  const renderLogoOrAddressAvatar = (token) => {
    if (!token || !("logo" in token)) {
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
        address={token.address}
      />
    );
  };

  return (
    <div
      className={`flex items-center cursor-pointer transition-all duration-250 justify-between ${
        active ? "bg-light-bg-hover dark:bg-dark-bg-hover" : ""
      } py-[7px] px-[20px] hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover ${extraCss}`}
      onMouseOver={() => setActive(index)}
      {...props}
    >
      <div className="flex items-center">
        {renderLogoOrAddressAvatar(token)}
        {icon || null}
        <p className="text-md font-medium max-w-[340px] truncate text-light-font-100 dark:text-dark-font-100 mr-2.5">
          {token.name}
        </p>
        <p className="text-md font-medium text-light-font-40 dark:text-dark-font-40">
          {"symbol" in token ? token.symbol : address}
        </p>
      </div>
      {children}
    </div>
  );
};
