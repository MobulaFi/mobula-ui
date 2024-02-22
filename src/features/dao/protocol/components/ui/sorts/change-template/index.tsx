import { addressSlicer } from "@utils/formaters";
import { useState } from "react";
import { BiCopy } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { FaArrowDownLong } from "react-icons/fa6";
import { MediumFont, SmallFont } from "../../../../../../../components/fonts";
import { TitleContainer } from "../../../../../../../components/title";
import { BoxContainer } from "../../../../../common/components/box-container";
import { EditingTemplate } from "../../../../models";

export const ChangeTemplate = ({
  oldImage,
  newImage,
  oldValue,
  newValue,
  type,
}: EditingTemplate) => {
  const [hasCopied, setHasCopied] = useState(false);
  const isContract = type === "Contract";
  const onCopy = () => {
    navigator.clipboard.writeText(newValue);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };
  console.log("oldValue", oldValue, isContract);
  console.log("newValue", newValue, isContract);
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
        <FaArrowDownLong className="text-[30px] my-2.5 ml-[1.1%] text-light-font-60 dark:text-dark-font-60" />
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
              extraCss={`overflow-x-scroll scroll whitespace-pre-wrap text-start flex ${
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
              onClick={onCopy}
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
