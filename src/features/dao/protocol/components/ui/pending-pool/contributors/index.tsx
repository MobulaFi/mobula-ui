import React from "react";
import { SiConvertio } from "react-icons/si";
import { MediumFont, SmallFont } from "../../../../../../../components/fonts";
import { NextImageFallback } from "../../../../../../../components/image";
import { BoxContainer } from "../../../../../common/components/box-container";

export const Contributors = () => {
  const contributors = [
    {
      name: "John Doe",
      amount: "1000",
      symbol: "USDC",
      profile_pic: "/mobula/coinMobula.png",
      logo: "/logo/bnb.png",
    },
    {
      name: "John Doe",
      amount: "1000",
      symbol: "USDC",
      profile_pic: "/mobula/coinMobula.png",
      logo: "/logo/cardano.png",
    },
    {
      name: "John Doe",
      amount: "1000",
      symbol: "USDC",
      profile_pic: "/mobula/coinMobula.png",
      logo: "/logo/bitcoin.png",
    },
    {
      name: "John Doe",
      amount: "1000",
      symbol: "USDC",
      profile_pic: "/mobula/coinMobula.png",
      logo: "/logo/ethereum.png",
    },
  ];

  return (
    <BoxContainer extraCss="mb-5 relative transition-all duration-200 ease-in-out py-[15px] px-5 lg:px-[15px] md:p-2.5 rounded-2xl sm:rounded-0">
      <div className="flex items-center pb-5 lg:pb-[15px] md:pb-2.5 border-b border-light-border-primary dark:border-dark-border-primary">
        <SiConvertio className="text-blue dark:text-blue" />
        <MediumFont extraCss="ml-2.5">Contributors</MediumFont>
        {/* <InfoPopup mb="3px" /> */}
      </div>
      {contributors.map((contributor) => (
        <div
          key={contributor.logo + contributor.name}
          className="flex items-center justify-between py-[15px] border-b
         border-light-border-primary dark:border-dark-border-primary"
        >
          <div className="flex items-center">
            <NextImageFallback
              width={20}
              height={20}
              className="mr-2.5 rounded-full"
              src={contributor.profile_pic || "/empty/unknown.png"}
              alt={contributor.name}
              fallbackSrc={""}
            />
            <SmallFont>{contributor.name}</SmallFont>
          </div>
          <div className="flex items-center">
            <SmallFont>{`${contributor.amount} ${contributor.symbol}`}</SmallFont>
            <NextImageFallback
              src={contributor.logo || "/empty/unknown.png"}
              alt={contributor.name}
              width={20}
              height={20}
              className="mr-2.5 rounded-full"
              fallbackSrc={""}
            />
          </div>
        </div>
      ))}
    </BoxContainer>
  );
};
