import React, { useState } from "react";
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
  const isContract =
    type === "Contract" ||
    type === "contracts" ||
    type === "excludedFromCirculationAddresses" ||
    type === "totalSupplyContracts";
  const isLinks = type === "links";
  const onCopy = () => {
    navigator.clipboard.writeText(newValue);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  if (
    type === "contracts" ||
    type === "excludedFromCirculationAddresses" ||
    type === "totalSupplyContracts"
  ) {
    oldValue = oldValue.map(
      (contract: { address: string }) => contract.address
    );
    newValue = newValue.map(
      (contract: { address: string }) => contract.address
    );
  }

  if (type === "links") {
    const oldData = [];
    const newData = [];
    Object.keys(newValue).forEach((key) => {
      if (newValue?.[key] !== oldValue?.[key]) {
        oldData.push(oldValue[key] as never);
        newData.push(newValue[key] as never);
      }
    });

    oldValue = oldData;
    newValue = newData;
  }

  if (type === "image") {
    oldValue = oldValue.logo;
    newValue = newValue.logo;
  }

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
            <SmallFont extraCss="text-start md:flex flex-col">
              {isContract
                ? oldValue?.map?.((contract) => (
                    <div key={contract}>{`${contract}`}</div>
                  ))
                : null}
              {isLinks
                ? oldValue?.map?.((links) => (
                    <div key={links}>{`${links}`}</div>
                  ))
                : null}

              {!isContract && !isLinks ? oldValue : null}
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
            <SmallFont extraCss="text-start md:flex flex-col">
              {isContract
                ? newValue.map((contract) => (
                    <div key={contract}>{`${contract}`}</div>
                  ))
                : null}
              {isLinks
                ? newValue.map((links) => <div key={links}>{`${links}`}</div>)
                : null}

              {!isContract && !isLinks ? newValue : null}
            </SmallFont>
          </div>
        </BoxContainer>
      </div>
    </BoxContainer>
  );
};
