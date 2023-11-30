import React, { useContext } from "react";
import { FiExternalLink } from "react-icons/fi";
import { LargeFont, SmallFont } from "../../../../../../components/fonts";
import { HoverLink } from "../../../../../../components/hover-link";
import { NextChakraLink } from "../../../../../../components/link";
import { Tds } from "../../../../../../components/table";
import { getFormattedAmount } from "../../../../../../utils/formaters";
import { BaseAssetContext } from "../../../../context-manager";
import { Social } from "../../../../models";

export const Socials = () => {
  const { baseAsset } = useContext(BaseAssetContext);
  const socials: Social[] = [
    {
      title: "Twitter",
      logo: "/social/twitter.png",
      username: baseAsset?.twitter?.split("https://twitter.com/")[1],
      subtitle: "Followers",
      members: baseAsset?.assets_social?.twitter_members,
      engagement: null,
      url: baseAsset?.twitter,
    },
    {
      title: "Discord",
      logo: "/social/discord.png",
      username: baseAsset?.assets_social?.discord_name,
      subtitle: "Members",
      members: baseAsset?.assets_social?.discord_members,
      online: baseAsset?.assets_social?.discord_online_members,
      url: baseAsset?.discord,
    },
    {
      title: "Telegram",
      logo: "/social/telegram.png",
      subtitle: "Members",
      members: baseAsset?.assets_social?.telegram_members,
      online: baseAsset?.assets_social?.telegram_online_members,
      username: baseAsset?.chat?.split("https://t.me/")[1],
      url: baseAsset?.chat,
    },
  ];
  return (
    <div className="flex flex-col mt-[50px] md:mt-[30px] w-full md:w-[95%] mx-auto">
      <LargeFont mb="10px">Socials</LargeFont>
      {socials?.filter((entry) => entry.url)?.length > 0 ? (
        <table>
          {socials
            .filter((entry) => entry.url)
            .map((entry, i) => {
              const isLast = i === 2;
              const linkChild = (
                <NextChakraLink
                  extraCss="text-light-font-40 dark:text-dark-font-40"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={entry.url}
                  key={entry.url}
                >
                  <div className="flex items-center max-w-[150px] text-light-font-60 dark:text-dark-font-60">
                    <SmallFont extraCss="truncate text-light-font-60 dark:text-dark-font-60">
                      {entry.username ? `@${entry.username}` : "N/A"}
                    </SmallFont>
                    {entry.username ? (
                      <FiExternalLink className="ml-[5px] text-[13px]" />
                    ) : null}
                  </div>
                </NextChakraLink>
              );
              return (
                <tbody key={entry.url}>
                  <tr>
                    <Tds
                      extraCss={`py-[15px] px-[15px] border-light-border-primary dark:border-dark-border-primary ${
                        isLast ? "border-b-0" : "border-b"
                      }}`}
                    >
                      <div className="flex items-center">
                        <img
                          src={entry.logo}
                          className="w-[25px] mr-[15px]"
                          alt={`${entry.username} logo`}
                        />
                        <div>
                          <SmallFont>{entry.title}</SmallFont>
                          {entry.url ? (
                            <NextChakraLink
                              href={entry.url}
                              extraCss="text-light-font-60 dark:text-dark-font-60"
                            >
                              {linkChild}
                            </NextChakraLink>
                          ) : (
                            linkChild
                          )}
                        </div>
                      </div>
                    </Tds>
                    <Tds
                      extraCss={`py-[10px] px-[15px] border-light-border-primary dark:border-dark-border-primary ${
                        isLast ? "border-b-0" : "border-b"
                      }}`}
                    >
                      {!entry.members ||
                      (entry.online && entry.online == null) ||
                      (entry.engagement && entry.engagement == null) ? (
                        "-"
                      ) : (
                        <div>
                          <SmallFont>
                            {getFormattedAmount(entry.members)}
                          </SmallFont>
                          <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
                            {entry.subtitle}
                          </SmallFont>
                        </div>
                      )}
                    </Tds>
                    <Tds
                      extraCss={`py-[10px] px-[15px] border-light-border-primary dark:border-dark-border-primary ${
                        isLast ? "border-b-0" : "border-b"
                      }}`}
                    >
                      <div className="flex flex-col items-end text-light-font-100 dark:text-dark-font-100">
                        {!entry.members ||
                        (entry.online == null && !entry.engagement) ||
                        (!entry.online && entry.engagement == null) ? (
                          "-"
                        ) : (
                          <>
                            <div className="flex items-center">
                              <div
                                className={`w-1.5 h-1.5 min-w-1.5 rounded-full mr-[5px] ${
                                  entry.engagement
                                    ? "bg-yellow dark:bg-yellow"
                                    : "bg-green dark:bg-green"
                                }`}
                              />
                              <SmallFont>
                                {entry.engagement
                                  ? `${entry.engagement}%`
                                  : entry.online}
                              </SmallFont>
                            </div>
                            <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
                              {entry.engagement ? "Engagement" : "Online"}
                            </SmallFont>
                          </>
                        )}
                      </div>
                    </Tds>
                    {/* <Tds
                      extraCss={`py-[10px] px-[15px] border-light-border-primary dark:border-dark-border-primary ${
                        isLast ? "border-b-0" : "border-b"
                      }} table-cell md:hidden`}
                    >
                      <div className="flex justify-end">
                        <TagPercentage
                          percentage={baseAsset?.price_change_24h}
                          isUp={baseAsset?.price_change_24h > 0}
                        />
                      </div>
                    </Tds>
                    <Tds
                      extraCss={`py-[10px] px-[15px] border-light-border-primary dark:border-dark-border-primary ${
                        isLast ? "border-b-0" : "border-b"
                      }} table-cell md:hidden`}
                    >
                      <div className="flex justify-end">
                        <div className="w-[135px]">
                          <NextImageFallback
                            alt={`${baseAsset?.name} sparkline`}
                            extraCss="w-full h-[45px]"
                            src={
                              `${API_ENDPOINT}/spark?id=${baseAsset?.id}.svg` ||
                              "/empty/sparkline.png"
                            }
                            fallbackSrc="/empty/sparkline.png"
                            priority={i < 4}
                          />
                        </div>
                      </div>
                    </Tds> */}
                  </tr>
                </tbody>
              );
            })}
        </table>
      ) : (
        <div className="flex items-center text-sm lg:text-[13px] md:text-xs text-light-font-60 dark:text-dark-font-60">
          No social link provided. Provide one <HoverLink>now</HoverLink>
          to improve Mobula!
        </div>
      )}
    </div>
  );
};
