import { Collapse, useDisclosure } from "@chakra-ui/react";
import router from "next/router";
import React, { useContext } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { NextChakraLink } from "../../../../components/link";
import { CommonPageContext } from "../../../../contexts/commun-page";
import { Navigation } from "../../model";

interface MobileProps {
  isFooter?: boolean;
  navigation: Navigation[];
}

export const Mobile = ({ isFooter, navigation }: MobileProps) => {
  const { isMenuMobile, setIsMenuMobile, extended, setExtended } =
    useContext(CommonPageContext);
  const { onToggle } = useDisclosure();
  return (
    <div className="flex flex-col w-full">
      {navigation.map((entry) => (
        <div
          className="flex py-2.5 flex-col px-[30px] border-b border-light-bg-primary dark:border-dark-bg-primary"
          key={`${entry.url}-${entry.name}`}
          onClick={() => {
            if (entry.url) {
              router.push(entry.url);
              if (!isFooter) setIsMenuMobile(!isMenuMobile);
            } else {
              setExtended({
                Cyptocurrencies: false,
                Ecosystem: false,
                Tools: false,
                "Mobula DAO": false,
                [entry.name]: !extended[entry.name],
              });
            }
          }}
        >
          <div className="flex items-center">
            <p className="text-base text-light-font-100 dark:text-dark-font-100">
              {entry.name}
            </p>
            {entry.name !== "Profile" ? (
              <>
                {entry.extends && extended[entry.name] ? (
                  <BsChevronUp
                    className="ml-auto text-light-font-100 dark:text-dark-font-100 text-base"
                    onClick={onToggle}
                  />
                ) : (
                  <BsChevronDown
                    className="ml-auto text-light-font-100 dark:text-dark-font-100 text-base"
                    onClick={onToggle}
                  />
                )}
              </>
            ) : null}
          </div>
          <Collapse in={extended[entry.name]} animateOpacity>
            <div className="flex mt-2.5 flex-col text-base">
              {entry.extends.map((submenu) => (
                <NextChakraLink
                  href={submenu.url}
                  extraCss={`mb-[3px] w-fit my-1 ${
                    isFooter
                      ? "text-light-font-60 dark:text-dark-font-60"
                      : "text-light-font-100 dark:text-dark-font-100"
                  }`}
                  key={`${submenu.url}-${submenu.name}`}
                  onClick={() => {
                    setIsMenuMobile(false);
                  }}
                >
                  <div className="flex items-center">
                    {isFooter ? null : (
                      <div className="flex rounded w-5 h-5 bg-light-bg-hover dark:bg-dark-bg-hover items-center justify-center">
                        {submenu.icon}
                      </div>
                    )}
                    <p className="text-sm ml-2.5">{submenu.name}</p>
                  </div>
                </NextChakraLink>
              ))}
            </div>
          </Collapse>
        </div>
      ))}
    </div>
  );
};
