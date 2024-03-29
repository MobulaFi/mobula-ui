import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import { SiConvertio } from "react-icons/si";
import { MediumFont, SmallFont } from "../../../../../../../components/fonts";
import { Tds, Ths } from "../../../../../../../components/table";
import { addressSlicer } from "../../../../../../../utils/formaters";
import { BoxContainer } from "../../../../../common/components/box-container";
import { colors } from "../../../../constants";
import { TokenDivs } from "../../../../models";
import { thStyles } from "../../../../style";
import { PopupAddress } from "../../popup-address";

interface DistributionProps {
  token: TokenDivs;
}

export const Distribution = ({ token }: DistributionProps) => {
  const [isOpen, setIsOpen] = useState<string | null>(null);

  const getDisplay = () => {
    if (token?.tokenomics?.distribution?.length > 0) return "flex";
    return "hidden";
  };
  const display = getDisplay();

  const getRadiusFromIndex = (index: number) => {
    if (index === 0) return "rounded-l";
    if (index === (token?.tokenomics?.distribution?.length || 1) - 1)
      return "rounded-r";
    return "";
  };

  return (
    <BoxContainer
      extraCss={`mb-5 relative transition-all duration-200 py-[15px] md:py-2.5 px-5 lg:px-[15px] md:px-2.5 rounded-2xl sm:rounded-0 ${display}`}
    >
      <div className="flex items-center pb-5 lg:pb-[15px] md:pb-2.5 border-b border-light-border-primary dark:border-dark-border-primary">
        <SiConvertio className="text-blue dark:text-blue" />
        <MediumFont extraCss="ml-2.5">Distribution</MediumFont>
      </div>
      <div className="w-full overflow-x-scroll scroll">
        <table>
          <thead>
            <tr>
              <Ths extraCss={`${thStyles} w-[33%]`}>Name</Ths>
              <Ths extraCss={`${thStyles} w-[33%]`}>Percentage</Ths>
              <Ths extraCss={`${thStyles} w-[33%] text-end`}>Address</Ths>
            </tr>
          </thead>
          <tbody>
            {token?.tokenomics.distribution?.map((distribution, i) => (
              <tr key={i}>
                <Tds extraCss="px-2.5 py-[1(px] w-[33%]">
                  {distribution.name}
                </Tds>
                <Tds extraCss="px-2.5 py-[1(px] w-[33%]">
                  {distribution.percentage}%
                </Tds>
                <Tds extraCss="px-2.5 py-[1(px] w-[33%] pr-0 text-end">
                  <button
                    className="mr-2.5 px-0 text-light-font-100 dark:text-dark-font-100 text-sm lg:text-[13px] md:text-xs"
                    onClick={() => {
                      if (distribution.addresses?.[0]?.address)
                        setIsOpen(distribution.name);
                    }}
                  >
                    <img
                      className="rounded-full w-4 h-4 mr-[7.5px]"
                      src={
                        blockchainsContent[
                          distribution.addresses?.[0]?.blockchain_id || 1
                        ]?.logo || "/empty/unkown.png"
                      }
                      alt="blockchain logo"
                    />
                    {addressSlicer(distribution.addresses?.[0]?.address)}
                    {distribution.addresses?.[0]?.address ? (
                      <FiChevronDown className="text-[15px] ml-2" />
                    ) : null}
                  </button>
                  <PopupAddress
                    isOpen={isOpen === distribution.name}
                    setIsOpen={setIsOpen}
                    distribution={
                      token?.tokenomics?.distribution[i]?.name ===
                      distribution?.name
                        ? token?.tokenomics?.distribution[i]
                        : null
                    }
                  />
                  <div className="flex justify-end items-center" />
                </Tds>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SmallFont extraCss="mt-5 md:mt-[15px] mb-[15px] font-normal">
        Supply repartition
      </SmallFont>
      <div className="flex items-center w-full h-[15px] lg:h-3 md:h-2.5 rounded">
        {token?.tokenomics?.distribution?.map(({ percentage }, i: number) => (
          <div
            key={i}
            className={`h-full ${colors[i]} ${getRadiusFromIndex(i)}`}
            style={{
              width: `${percentage}%`,
            }}
          />
        ))}
      </div>
      <div className="flex items-center flex-wrap">
        {token?.tokenomics?.distribution?.map(({ name, percentage }, i) => (
          <div className="flex items-center mt-2.5" key={name}>
            <div
              className={`rounded-full w-3 h-3 min-w-3 ${colors[i]} mr-[5px]`}
            />
            <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 mr-[5px]">
              {name}:
            </SmallFont>
            <SmallFont extraCss="mr-5">{percentage}%</SmallFont>
          </div>
        ))}
      </div>
    </BoxContainer>
  );
};
