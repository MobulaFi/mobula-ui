import { Collapse } from "components/collapse";
import router from "next/router";
import React, { useContext } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useAccount } from "wagmi";
import { NextChakraLink } from "../../../../components/link";
import { CommonPageContext } from "../../../../contexts/commun-page";
import { Navigation } from "../../model";

interface MobileProps {
  isFooter?: boolean;
  navigation: Navigation[];
}

export const Mobile = ({ isFooter, navigation }: MobileProps) => {
  const { isConnected } = useAccount();
  const { isMenuMobile, setIsMenuMobile, extended, setExtended } =
    useContext(CommonPageContext);

  return (
    <div className="flex flex-col w-full">
      {navigation.map((entry) => {
        if (entry.name === "Swap")
          return (
            <NextChakraLink href={entry.url} key={`${entry.url}-${entry.name}`}>
              <div
                className="flex py-2.5 flex-col px-[30px] border-b border-light-bg-primary dark:border-dark-bg-primary"
                key={`${entry.url}-${entry.name}`}
                onClick={() => setIsMenuMobile(false)}
              >
                <div className="flex items-center">
                  <p className="text-base text-light-font-100 dark:text-dark-font-100">
                    {entry.name}
                  </p>
                </div>
              </div>
            </NextChakraLink>
          );
        return (
          <div
            className="flex py-2.5 flex-col px-[30px] border-b border-light-bg-primary dark:border-dark-bg-primary "
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
            <div className="flex items-center cursor-pointer">
              <p className="text-base text-light-font-100 dark:text-dark-font-100">
                {entry.name}
              </p>
              {entry.name !== "Profile" ? (
                <>
                  {entry.extends && extended[entry.name] ? (
                    <BsChevronUp className="ml-auto text-light-font-100 dark:text-dark-font-100 text-base" />
                  ) : (
                    <BsChevronDown className="ml-auto text-light-font-100 dark:text-dark-font-100 text-base" />
                  )}
                </>
              ) : null}
            </div>
            <Collapse
              isOpen={extended[entry.name]}
              startingHeight="max-h-[0px]"
            >
              <div className="flex mt-2.5 flex-col text-base cursor-pointer">
                {entry.extends.map((submenu, i) => (
                  <NextChakraLink
                    href={
                      submenu.name === "Watchlist"
                        ? isConnected
                          ? submenu.url
                          : ""
                        : submenu.url
                    }
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
                    <div
                      className={`flex items-center ${
                        i !== entry.extends?.length - 1 ? " mb-2.5" : ""
                      }`}
                    >
                      {isFooter ? null : (
                        <div
                          className="flex rounded-md w-6 h-6 bg-light-bg-hover dark:bg-dark-bg-hover
                         items-center justify-center p-1"
                        >
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
        );
      })}
    </div>
  );
};
