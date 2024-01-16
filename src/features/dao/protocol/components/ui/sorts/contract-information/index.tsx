import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { useState } from "react";
import { BiCopy } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { HiOutlineNewspaper } from "react-icons/hi";
import { MediumFont, SmallFont } from "../../../../../../../components/fonts";
import { addressSlicer } from "../../../../../../../utils/formaters";
import { BoxContainer } from "../../../../../common/components/box-container";
import { TokenDivs } from "../../../../models";

interface ContractInformationProps {
  token: TokenDivs;
}

export const ContractInformation = ({ token }: ContractInformationProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <BoxContainer extraCss="mb-5 relative transition-all duration-200 py-[15px] md:py-2.5 px-5 lg:px-[15px] md:px-2.5 rounded-2xl sm:rounded-0">
      <div className="flex items-center border-b border-light-border-primary dark:border-dark-border-primary pb-5 lg:pb-[15px] md:pb-2.5">
        <HiOutlineNewspaper className="text-light-font-100 dark:text-dark-font-100" />
        <MediumFont extraCss="ml-2.5">Contract & Information</MediumFont>
      </div>
      {token?.excludedFromCirculationAddresses?.filter((entry) => entry.address)
        .length > 0 ? (
        <div className="flex mt-[15px] flex-row md:flew-col">
          <div className="flex flex-col w-full">
            <SmallFont extraCss="mb-2.5 font-normal">
              Excluded Addresses
            </SmallFont>
            <div className="flex flex-wrap">
              {token?.excludedFromCirculationAddresses?.map(
                ({ address, blockchain }, i: number) => (
                  <div
                    className={`flex h-[35px] rounded-md items-center bg-light-bg-terciary dark:bg-dark-bg-terciary 
                  border border-light-border-primary dark:border-dark-border-primary mb-[7.5px] text-light-font-100 
                  dark:text-dark-font-100 w-calc-half-10 md:w-full px-[7.5px] ${
                    i % 2 !== 0
                      ? "mr-0 ml-[5px] md:ml-0"
                      : "ml-[5px] md:ml-0 mr-0"
                  }`}
                    key={i}
                  >
                    <img
                      className="w-[22px] h-[22px] rounded-full mr-[7.5px]"
                      alt={`${blockchain} logo`}
                      src={
                        blockchainsContent[blockchain]?.logo ||
                        "/icon/unknown.png"
                      }
                    />
                    <MediumFont>{addressSlicer(address)}</MediumFont>
                    <button
                      className="flex items-center justify-center opacity-60 hover:opacity-100 ml-auto w-fit transition-all duration-200"
                      onClick={() => {
                        copyToClipboard(address);
                        setIsCopied(true);
                        setTimeout(() => {
                          setIsCopied(false);
                        }, 2000);
                      }}
                    >
                      {!isCopied ? (
                        <BiCopy className="text-light-font-100 dark:text-dark-font-100 ml-auto" />
                      ) : (
                        <BsCheckLg className="text-green dark:text-green ml-auto" />
                      )}
                    </button>
                  </div>
                )
              )}{" "}
            </div>
          </div>
        </div>
      ) : null}
      <SmallFont extraCss="mb-2.5 mt-[30px] lg:mt-5 md:mt-[15px] font-normal">
        Total supply details
      </SmallFont>
      {token?.totalSupplyContracts?.length > 0 &&
      token?.contracts?.length > 0 &&
      token.totalSupplyContracts[0]?.address === token.contracts[0]?.address ? (
        <div className="flex items-center mb-2.5">
          <SmallFont>
            Total supply is the supply of the first contract
          </SmallFont>
          <BsCheckLg className="text-green dark:text-green ml-2.5" />
        </div>
      ) : (
        <div className="flex items-center mb-2.5">
          <SmallFont extraCss="mb-2.5">
            Total supply us a sum of all contracts
          </SmallFont>
          <BsCheckLg className="text-green dark:text-green ml-2.5" />
        </div>
      )}
    </BoxContainer>
  );
};
