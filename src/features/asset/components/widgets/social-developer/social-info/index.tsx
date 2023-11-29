import React, { useContext } from "react";
import { BsDiscord, BsTwitter } from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";
import { MediumFont, SmallFont } from "../../../../../../components/fonts";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { getFormattedAmount } from "../../../../../../utils/formaters";
import { BaseAssetContext } from "../../../../context-manager";
import { FlexBorderBox } from "../../../../style";

interface SocialInfoProps {
  extraCss?: string;
}

export const SocialInfo = ({ extraCss }: SocialInfoProps) => {
  const { baseAsset } = useContext(BaseAssetContext);
  const metrics = [
    {
      title: "Twitter Followers",
      value: getFormattedAmount(baseAsset?.assets_social?.twitter_members),
      icon: <BsTwitter className="text-twitter dark:text-twitter" />,
    },
    {
      title: "Telegram Members",
      value: getFormattedAmount(baseAsset?.assets_social?.telegram_members),
      icon: <FaTelegramPlane className="text-telegram dark:text-telegram" />,
    },
    {
      title: "Discord Members",
      value: getFormattedAmount(baseAsset?.assets_social?.discord_members),
      icon: <BsDiscord className="text-discord dark:text-discord" />,
    },
  ];
  return (
    <div
      className={cn(
        `flex ${FlexBorderBox} bg-light-bg-secondary dark:bg-dark-bg-secondary lg:bg-inherit dark:lg:bg-inherit border border-light-border-primary dark:border-dark-border-primary lg:border-0`,
        extraCss
      )}
    >
      <MediumFont extraCss="mb-2.5 flex lg:hidden">Socials Metrics</MediumFont>
      {metrics
        .filter((entry) => entry.value && entry.value !== 0)
        .map((entry, i) => (
          <div
            key={entry.title}
            className={`flex justify-between py-2.5 ${
              i === 0
                ? ""
                : "border-t border-light-border-primary dark:border-dark-border-primary"
            } ${metrics.length - 1 === i ? "pb-0" : "pb-2.5"}`}
          >
            <div className="flex items-center mb-[5px]">
              {entry.icon}
              <SmallFont extraCss="ml-[7.5px] text-light-font-60 dark:text-dark-font-60">
                {entry.title}
              </SmallFont>
            </div>
            <div className="flex items-center">
              <p className="text-[13px] text-light-font-100 dark:text-dark-font-100">
                {entry.value}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};
