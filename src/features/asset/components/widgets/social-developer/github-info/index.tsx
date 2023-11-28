import React from "react";
import { AiOutlineEye, AiOutlineStar } from "react-icons/ai";
import { BiGitRepoForked } from "react-icons/bi";
import { BsCheckLg, BsThreeDots } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi";
import { TbArrowsShuffle2 } from "react-icons/tb";
import { MediumFont, SmallFont } from "../../../../../../components/fonts";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { FlexBorderBox } from "../../../../style";

export const GithubInfo = ({ extraCss }) => {
  //   const {baseAsset} = useContext(BaseAssetContext);
  const metrics = [
    {
      title: "Stars",
      //   value: baseAsset?.assets_social?.github_stars,
      value: 132,
      icon: <AiOutlineStar className="text-yellow dark:text-yellow" />,
    },
    {
      title: "Watchers",
      //   value: baseAsset?.assets_social?.github_watchers,
      value: 43253,
      icon: (
        <AiOutlineEye className="text-light-font-100 dark:text-dark-font-100" />
      ),
    },
    {
      title: "Forks",
      //   value: baseAsset?.assets_social?.github_forks,
      value: 2340,
      icon: (
        <BiGitRepoForked className="text-light-font-100 dark:text-dark-font-100" />
      ),
    },
    {
      title: "Contributors",
      //   value: baseAsset?.assets_social?.github_contributors,
      value: 103,
      icon: <HiOutlineUsers className="text-blue dark:text-blue" />,
    },
    {
      title: "Merged Pull Requests",
      //   value: baseAsset?.assets_social?.github_merged_pull_request,
      value: 3422,
      icon: <TbArrowsShuffle2 className="text-green dark:text-green" />,
    },
    {
      title: "Closed Issues",
      //   value: baseAsset?.assets_social?.github_closed_issues,
      value: 2344,
      icon: <BsCheckLg className="text-green dark:text-green" />,
    },
    {
      title: "Total Issues",
      //   value: baseAsset?.assets_social?.github_total_issues,
      value: 2344,
      icon: (
        <BsThreeDots className="text-light-font-100 dark:text-dark-font-100" />
      ),
    },
  ];
  return (
    <div
      className={cn(
        `flex ${FlexBorderBox} bg-light-bg-secondary dark:bg-dark-bg-secondary lg:bg-inherit dark:lg:bg-inherit border border-light-border-primary dark:border-dark-border-primary lg:border-0`,
        extraCss
      )}
    >
      <MediumFont extraCss="mb-2.5 flex lg:hidden">Github Metrics</MediumFont>
      {metrics.map((entry, i) => (
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
