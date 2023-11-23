import { ArrowDownIcon } from "@chakra-ui/icons";
import { useClipboard } from "@chakra-ui/react";
import React from "react";
import { BiCopy } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { MediumFont, SmallFont } from "../../../../../../../components/fonts";
import { TitleContainer } from "../../../../../../../components/title";
import { addressSlicer } from "../../../../../../../utils/formaters";
import { BoxContainer } from "../../../../../common/components/box-container";
import { EditingTemplate } from "../../../../models";

export const ChangeTemplate = ({
  oldImage,
  newImage,
  oldValue,
  newValue,
  type,
}: EditingTemplate) => {
  const { onCopy, hasCopied } = useClipboard("");
  const isContract = type === "Contract";
  return (
    <BoxContainer extraCss="mb-5">
      <TitleContainer extraCss="px-[15px]">
        <MediumFont>{type} change</MediumFont>
      </TitleContainer>
      <div className="flex p-5 flex-col">
        <BoxContainer>
          <TitleContainer extraCss="px-[15px]">
            <SmallFont>Old {type}</SmallFont>
          </TitleContainer>
          <div className="p-2.5 flex items-center">
            <img
              src={oldImage}
              className="mr-2.5 rounded-full w-[26px] h-[26px]"
            />
            <SmallFont extraCss="overflow-x-scroll scroll whitespace-pre-wrap text-start flex md:hidden">
              {oldValue}
            </SmallFont>
            <SmallFont extraCss="overflow-x-scroll scroll whitespace-pre-wrap text-start hidden md:flex">
              {isContract
                ? `${oldValue?.slice(0, 4)}...${oldValue?.slice(-4)}`
                : oldValue}
            </SmallFont>
          </div>
        </BoxContainer>
        <ArrowDownIcon fontSize="30px" my="10px" ml="1.1%" color="text.60" />
        <BoxContainer>
          <TitleContainer extraCss="px-[15px]">
            <SmallFont>New {type}</SmallFont>
          </TitleContainer>
          <div className="p-2.5 flex items-center">
            <img
              src={newImage}
              className="mr-2.5 rounded-full w-[26px] h-[26px]"
            />
            <SmallFont
              extraCss={`overflow-x-scroll scroll whitespace-pre-wrap text-start hidden ${
                isContract ? "" : "md:flex"
              }`}
            >
              {newValue}
            </SmallFont>
            {isContract ? (
              <SmallFont extraCss="overflow-x-scroll scroll whitespace-pre-wrap text-start hidden md:flex">
                {addressSlicer(newValue)}
              </SmallFont>
            ) : null}
            <button
              className="whitespace-pre-wrap cursor-pointer w-fit"
              onClick={() => {
                onCopy();
                navigator.clipboard.writeText(newValue);
              }}
            >
              {hasCopied ? (
                <BsCheckLg className="ml-2.5 text-green dark:text-green" />
              ) : (
                <BiCopy className="ml-2.5 text-light-font-40 dark:text-dark-font-40" />
              )}
            </button>
          </div>
        </BoxContainer>
      </div>
    </BoxContainer>
  );
};
