import { useContext, useState } from "react";
import { LargeFont, SmallFont } from "../../../../../../components/fonts";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import {
  getFormattedAmount,
  getTokenPercentage,
} from "../../../../../../utils/formaters";
import { tsColors } from "../../../../constant";
import { BaseAssetContext } from "../../../../context-manager";
import { calculateDaysRemaining } from "../../../../utils";

interface UnlockProgressProps {
  extraCss?: string;
}

export const UnlockProgress = ({ extraCss }: UnlockProgressProps) => {
  const { baseAsset } = useContext(BaseAssetContext);
  const [isHovering, setIsHovering] = useState("");

  const getTotalAmountUnlock = () => {
    let total = 0;
    let totalUnlock = 0;
    let totalLock = 0;
    const now = new Date().getTime();
    baseAsset?.release_schedule?.forEach((entry) => {
      if (entry.unlock_date <= now) totalUnlock += entry.tokens_to_unlock;
      if (entry.unlock_date > now) totalLock += entry.tokens_to_unlock;
      total += entry.tokens_to_unlock;
    });
    return { totalUnlock, totalLock, total };
  };

  const getPercentage = (amount: number, totalAmount: number) =>
    (amount * 100) / totalAmount;
  const { totalUnlock, total } = getTotalAmountUnlock();

  const getAmountForEachDistribution = () => {
    const seen = new Set();
    const seenLock = new Set();
    const typeUnlock = {};
    const typeLock = {};
    const now = new Date().getTime();
    baseAsset?.release_schedule?.forEach((entry) => {
      if (entry.unlock_date <= now) {
        const entries = Object.entries(entry.allocation_details);
        entries.forEach(([key, value]) => {
          if (!seen.has(key)) {
            seen.add(key);
            typeUnlock[key] = value;
          } else {
            typeUnlock[key] += value;
          }
        });
      }
      if (entry.unlock_date > now) {
        const entries = Object.entries(entry.allocation_details);
        entries.forEach(([key, value]) => {
          if (!seenLock.has(key)) {
            seenLock.add(key);
            typeLock[key] = value;
          } else {
            typeLock[key] += value;
          }
        });
      }
    });
    return { typeUnlock, typeLock };
  };

  const daysRemaining = calculateDaysRemaining(baseAsset?.release_schedule);
  const { typeUnlock: distribution, typeLock: distributionLocked } =
    getAmountForEachDistribution();

  const getSameColors = () => {
    const fusionArr = Object.entries(distribution).concat(
      Object.entries(distributionLocked)
    );
    const extractNames = [];
    fusionArr.forEach((entry) => {
      if (!extractNames.includes(entry?.[0])) extractNames.push(entry?.[0]);
    });
    const colorsForRound = {};
    extractNames.forEach((entry, i) => {
      (colorsForRound[entry] as any) = tsColors[i];
    });
    return colorsForRound;
  };

  const newColors = getSameColors();
  const hasLockedDistribution = Object.entries(distributionLocked).length > 0;

  const getPositionOfTooltip = (i: number, isUnlock: boolean) => {
    const distribLength = Object.entries(distribution).length;
    const distribLockedLength = Object.entries(distributionLocked).length;
    const isNearEndUnlocked = i >= distribLength - 3;
    const isNearEndLocked = i >= distribLockedLength - 3;

    if (hasLockedDistribution) {
      if (isNearEndUnlocked && isUnlock)
        return {
          left: "0%",
          right: "auto",
        };
      if (isNearEndLocked && !isUnlock)
        return {
          left: "auto",
          right: "0%",
        };
    } else if (isNearEndUnlocked && isUnlock)
      return {
        left: "auto",
        right: "0%",
      };
  };

  const getBorderRadius = (i: number) => {
    if (!hasLockedDistribution && Object.keys(distribution).length - 1 === i)
      return "rounded-r";
    if (i === 0) return "rounded-l";

    return "rounded-0";
  };

  return (
    <div className={cn(`flex w-full mx-auto flex-col mb-[30px]`, extraCss)}>
      <LargeFont extraCss="mb-2.5">Unlock Progress</LargeFont>
      <div className="flex pr-5 lg:pr-0 flex-col w-full">
        <div className="flex items-center justify-between mb-[7.5px]">
          <SmallFont extraCss="font-medium">
            {getTokenPercentage(getPercentage(totalUnlock, total))}%
          </SmallFont>
          {daysRemaining?.[0] < 0 ? (
            <SmallFont extraCss="font-medium">
              {Math.abs(daysRemaining[0])} days ago
            </SmallFont>
          ) : (
            <SmallFont extraCss="font-medium">
              {daysRemaining?.[0]} days left
            </SmallFont>
          )}
        </div>
        <div className="flex w-full h-[25px] rounded-md bg-light-bg-hover dark:bg-dark-bg-hover relative border border-light-border-primary dark:border-dark-border-primary">
          {Object.entries(distribution).map(([key, value], i) => (
            <div
              className={`${newColors[key]} h-full ${getBorderRadius(
                i
              )} border-r
             border-light-border-primary dark:border-dark-border-primary relative 
             cursor-pointer`}
              style={{ width: `${getPercentage(value as number, total)}%` }}
              key={key}
              onMouseEnter={() => setIsHovering(key)}
              onMouseLeave={() => setIsHovering("")}
            >
              <div
                className={`flex w-fit h-auto px-2.5 py-[7px] rounded-md bg-light-bg-hover dark:bg-dark-bg-hover z-[20]
                max-w-[300px] absolute border border-light-border-primary dark:border-dark-border-primary flex-col shadow-md ${
                  isHovering === key
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95"
                } transition-all duration-200 ease-in-out`}
                style={{
                  top: "calc(100% + 7.5px)",
                  left: getPositionOfTooltip(i, true)?.left,
                  right: getPositionOfTooltip(i, true)?.right,
                }}
              >
                <div className="flex items-center mb-[5px]">
                  <div
                    className={`flex w-2.5 h-2.5 rounded-full mr-[5px] min-w-2.5 ${newColors[key]} `}
                  />
                  <SmallFont extraCss="whitespace-pre-wrap font-medium">
                    {key}
                  </SmallFont>
                </div>
                <div className="flex items-center justify-between w-full mr-[15px]">
                  <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 whitespace-nowrap">
                    % Unlocked:
                  </SmallFont>
                  <SmallFont extraCss="font-medium">
                    {getTokenPercentage(getPercentage(value as number, total))}%
                  </SmallFont>
                </div>
                <div className="flex items-center mr-[15px] justify-between w-full">
                  <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 whitespace-nowrap">
                    Amount Unlocked:
                  </SmallFont>
                  <SmallFont extraCss="font-medium">
                    {getFormattedAmount(value as number)}
                  </SmallFont>
                </div>
                <div className="flex items-center mr-[15px] justify-between w-full">
                  <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 whitespace-nowrap">
                    Amount USD:
                  </SmallFont>
                  <SmallFont extraCss="font-medium">
                    $
                    {getFormattedAmount(
                      Number(value) * (baseAsset?.price || 0)
                    )}
                  </SmallFont>
                </div>
              </div>
            </div>
          ))}
          {getPercentage(totalUnlock, total) !== 100 ? (
            <div
              className="flex absolute top-[-2.5px] h-[125%] w-0.5 z-[1] rounded-full bg-light-font-60 dark:bg-dark-font-60"
              style={{
                left: `${getPercentage(totalUnlock, total)}%`,
              }}
            />
          ) : null}
          {Object.entries(distributionLocked).map(([key, value], i) => (
            <div
              className={`flex ${
                newColors[key]
              } h-full border-r border-light-border-primary 
            dark:border-dark-border-primary relative cursor-pointer z-[3] ${
              i === Object.entries(distributionLocked).length - 1
                ? "rounded-r"
                : ""
            } ${
                isHovering === key + value ? "opacity-100" : "opacity-30"
              } transition-all duration-200 ease-in-out`}
              key={key}
              onMouseEnter={() => setIsHovering(key + value)}
              onMouseLeave={() => setIsHovering("")}
              style={{ width: `${getPercentage(value as number, total)}%` }}
            >
              <div
                className={`flex w-fit h-auto px-2.5 py-[7px] rounded-md bg-light-bg-hover dark:bg-dark-bg-hover absolute border 
                border-light-border-primary dark:border-dark-border-primary flex-col shadow-md z-[2] ${
                  isHovering === key + value
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95"
                } transition-all duration-200 ease-in-out`}
                style={{
                  top: "calc(100% + 7.5px)",
                  left: getPositionOfTooltip(i, false)?.left,
                  right: getPositionOfTooltip(i, false)?.right,
                }}
              >
                <div className="flex items-center mb-[5px]">
                  <div
                    className={`flex w-2.5 h-2.5 rounded-full mr-[5px] ${newColors[key]}`}
                  />
                  <SmallFont extraCss="whitespace-nowrap font-medium">
                    {key}
                  </SmallFont>
                </div>
                <div className="flex items-center justify-between w-full mr-[15px]">
                  <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 whitespace-nowrap">
                    % Locked:
                  </SmallFont>
                  <SmallFont extraCss="font-medium">
                    {getTokenPercentage(getPercentage(value as number, total))}%
                  </SmallFont>
                </div>
                <div className="flex items-center justify-between w-full mr-[15px]">
                  <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 whitespace-nowrap">
                    Amount Locked:
                  </SmallFont>
                  <SmallFont extraCss="font-medium">
                    {getFormattedAmount(value as number)}
                  </SmallFont>
                </div>
                <div className="flex items-center justify-between w-full mr-[15px]">
                  <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 whitespace-nowrap">
                    Amount USD:
                  </SmallFont>
                  <SmallFont extraCss="font-medium">
                    $
                    {getFormattedAmount(
                      Number(value) * (baseAsset?.price || 0)
                    )}
                  </SmallFont>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
