import { useContext } from "react";
import { FiExternalLink } from "react-icons/fi";
import {
  ExtraSmallFont,
  LargeFont,
  MediumFont,
} from "../../../../../components/fonts";
import { NextChakraLink } from "../../../../../components/link";
import { ListingContext } from "../../context-manager";

export const Nav = ({ state }) => {
  const { actualPage, setActualPage } = useContext(ListingContext);

  const infos = [
    {
      name: "Asset Info",
    },
    {
      name: "Socials",
    },
    {
      name: "Contracts",
    },
    ...(state.type === "nft"
      ? []
      : [
          {
            name: "Vesting",
          },
          {
            name: "Fees",
          },
        ]),

    {
      name: "Submit",
    },
  ];

  return (
    <div>
      <div
        className="flex rounded-xl bg-light-bg-terciary dark:bg-dark-bg-terciary 
      mr-[25px] flex-col w-[235px] pb-[25px] items-center border border-light-border-primary 
      dark:border-dark-border-primary md:hidden"
      >
        <img
          className="mt-[30px] mb-2.5 rounded-full w-[87px] h-[87px]"
          src={
            state.image.logo ||
            state.image.uploaded_logo ||
            "/mobula/mobula-logo.svg"
          }
          alt="token logo"
        />
        <LargeFont extraCss="mb-[30px]">Listing Form</LargeFont>
        <div className="flex flex-col w-full mb-5 relative">
          <div className="flex flex-col w-full items-start relative">
            {infos.map((info, i) => (
              <div className="w-full flex-col flex pl-[30px]" key={info.name}>
                <div className="flex items-center">
                  <button
                    className={`w-6 h-6 rounded-full text-light-font-100 dark:text-dark-font-100 
                  transition-all duration-250 text-sm border ${
                    i <= actualPage
                      ? "border-blue dark:border-blue bg-light-bg-hover dark:bg-light-bg-hover"
                      : "border-light-border-primary dark:border-dark-border-primary bg-light-bg-terciary dark:bg-dark-bg-terciary hover:bg-light-bg-hover hover:dark:bg-light-bg-hover"
                  }`}
                    onClick={() => {
                      if (i <= actualPage) setActualPage(i);
                    }}
                  >
                    {i + 1}
                  </button>
                  <MediumFont extraCss="ml-2.5">{info.name}</MediumFont>
                </div>
                {infos.length - 1 === i ? null : (
                  <div
                    className={`flex border-l ${
                      i < actualPage
                        ? "border-l border-blue dark:border-blue"
                        : "outline-dashed border-l border-light-border-terciary dark:border-dark-border-terciary"
                    } h-[30px] w-0.5 ml-3`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <NextChakraLink
            extraCss="text-blue dark:text-blue text-[10px] lg:text-[9px] md:text-[8px] font-medium"
            href="https://docs.mobula.fi/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read here{" "}
          </NextChakraLink>{" "}
          <ExtraSmallFont extraCss="ml-[25px] mr-auto">
            the documentation
          </ExtraSmallFont>
        </div>
        <div className="flex items-center ml-[25px] mr-auto">
          <NextChakraLink
            href="https://t.me/MobulaPartnerBot?start=Form_Help"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExtraSmallFont extraCss="text-light-font-40 dark:text-dark-font-40 underline">
              {" "}
              Get in touch with core-team
              <FiExternalLink className="ml-[5px] text-[11px] text-light-font-40 dark:text-dark-font-40" />
            </ExtraSmallFont>
          </NextChakraLink>
        </div>
      </div>
    </div>
  );
};
