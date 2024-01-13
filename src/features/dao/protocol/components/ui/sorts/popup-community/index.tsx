import React, { useState } from "react";
import { BiCopy } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";
import { NextChakraLink } from "../../../../../../../components/link";
import { SocialSort, TokenDivs } from "../../../../models";

interface CommunityPopupProps {
  token: TokenDivs;
}

export const CommunityPopup = ({ token }: CommunityPopupProps) => {
  const [hasCopied, setHasCopied] = useState<string[]>([]);
  const socials: SocialSort[] = [
    {
      logo: "/social/discord.png",
      url: token?.links?.discord,
      alt: "Discord",
    },
    {
      logo: "/social/twitter.png",
      url: token?.links?.twitter,
      alt: "Twitter",
    },
    {
      logo: "/social/telegram.png",
      url: token?.links?.telegram,
      alt: "Telegram",
    },
  ];

  return (
    <div className="flex w-full flex-col h-auto z-[2] max-w-auto text-xs">
      {socials
        .filter((entry) => entry.url)
        .map((entry, i) => (
          <div
            key={entry.url}
            className={`flex items-center relative justify-between rounded-md border border-light-border-primary 
          dark:border-dark-border-primary px-2.5 h-[30px] hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover 
          transition-all duration-200 w-full bg-light-bg-terciary dark:bg-dark-bg-terciary ${
            i !== socials.filter((social) => social.url).length - 1
              ? "mb-2.5"
              : ""
          }`}
          >
            <div className="flex items-center">
              <img
                className="w-[17px] h-[17px] mr-2"
                src={entry.logo}
                alt={`${entry.alt} logo`}
              />
              <NextChakraLink href={entry.url} target="_blank" rel="norefferer">
                <p className="text-xs mr-2.5 w-full text-light-font-100 dark:text-dark-font-100 truncate max-w-[150px]">
                  {entry.url}
                </p>
              </NextChakraLink>
            </div>
            <div className="flex items-center ml-4">
              {hasCopied.includes(entry.alt) ? (
                <BsCheckLg className="ml-2.5 text-green dark:text-green" />
              ) : (
                <BiCopy
                  className="cursor-pointer text-light-font-100 dark:text-dark-font-100 "
                  onClick={() => {
                    if (entry.url) {
                      navigator.clipboard.writeText(entry.url);
                      setHasCopied((prev) => [...prev, entry.alt]);
                      setTimeout(() => {
                        setHasCopied(
                          hasCopied.filter((copy) => copy !== entry.alt)
                        );
                      }, 3000);
                    }
                  }}
                />
              )}
              <NextChakraLink
                href={entry?.url}
                target="_blank"
                rel="norefferer"
                extraCss="cursor-pointer"
              >
                <FiExternalLink className="ml-2.5 text-sm text-light-font-40 dark:text-dark-font-40" />
              </NextChakraLink>
            </div>
          </div>
        ))}
    </div>
  );
};
