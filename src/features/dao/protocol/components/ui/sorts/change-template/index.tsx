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
  const isContract =
    type === "Contract" ||
    type === "contracts" ||
    type === "excludedFromCirculationAddresses" ||
    type === "totalSupplyContracts";
  const isLinks = type === "links";
  const isTeam = type === "team";

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
    const oldData = {};
    const newData = {};

    const determineType = (url) => {
      if (!url) return null;
      if (url.includes("t.me")) return "telegram";
      if (url.includes("discord.com") || url.includes("discord.gg"))
        return "discord";
      if (url.includes("twitter.com")) return "twitter";
      if (url.includes("github.com")) return "github";
      return "website";
    };

    Object.keys(newValue).forEach((key) => {
      const oldLink = oldValue[key];
      const newLink = newValue[key];
      const oldLinkType = determineType(oldLink);
      const newLinkType = determineType(newLink);

      if (newLinkType && newLink !== undefined && newLink !== null) {
        newData[newLinkType] = newLink;
      }
      if (oldLinkType && oldLink !== undefined && oldLink !== null) {
        oldData[oldLinkType] = oldLink;
      }
    });

    oldValue = oldData;
    newValue = newData;
  }

  if (type === "image") {
    oldValue = oldValue?.logo;
    newValue = newValue?.logo;
  }

  if (type === "tokenomics") {
    return;
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
              {isLinks && oldValue
                ? Object.entries(oldValue).map(([type, link]) => (
                    <div key={type}>
                      {type}: {link as string}
                    </div>
                  ))
                : null}

              {isTeam && Array.isArray(oldValue)
                ? oldValue.map((member, index) => (
                    <div key={index}>
                      {Object.entries(member).map(([type, link]) => (
                        <div key={type}>
                          {type}: {link.toString()}
                        </div>
                      ))}
                    </div>
                  ))
                : null}

              {!isContract && !isLinks && !isTeam ? oldValue : null}
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
              {isLinks && newValue
                ? Object.entries(newValue).map(([type, link]) => (
                    <div key={type}>
                      {type}: {link as string}
                    </div>
                  ))
                : null}

              {isTeam && Array.isArray(newValue)
                ? newValue.map((member, index) => (
                    <div key={index}>
                      {Object.entries(member).map(([type, link]) => (
                        <div key={type}>
                          {type}: {link.toString()}
                        </div>
                      ))}
                    </div>
                  ))
                : null}

              {!isContract && !isLinks && !isTeam ? newValue : null}
            </SmallFont>
          </div>
        </BoxContainer>
      </div>
    </BoxContainer>
  );
};
