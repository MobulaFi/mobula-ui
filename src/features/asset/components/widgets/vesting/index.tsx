import { LargeFont } from "components/fonts";
import dynamic from "next/dynamic";
import { useContext, useMemo } from "react";
import { Spinner } from "../../../../../components/spinner";
import { BaseAssetContext } from "../../../context-manager";
import { CategoriesProps } from "../../../models";
import { Allocation } from "../fundraising/allocation";
import { CalendarEvent } from "./calendar-event";
import { NextUnlockEvent } from "./next-unlock-event";
import { UnlockProgress } from "./unlock-progress";

const AreaChart = dynamic(() => import("../../../../../lib/echart/area"), {
  ssr: false,
});

export const Vesting = () => {
  const { baseAsset } = useContext(BaseAssetContext);

  const addRoundsinvestForEachEvent = () => {
    const vesting = baseAsset?.release_schedule;
    const seen = new Set();
    const types = [];

    vesting?.forEach(
      ({ unlock_date, tokens_to_unlock, allocation_details }) => {
        Object.keys(allocation_details).forEach((key) => {
          if (!seen.has(key)) {
            types.push(key);
            seen.add(key);
          }
        });
      }
    );

    const newVesting = vesting
      ?.slice(1)
      .map(({ unlock_date, tokens_to_unlock, allocation_details }) => {
        const roundsArr = types.map((type) => [
          type,
          allocation_details[type] || 0,
        ]);
        return [unlock_date, tokens_to_unlock, roundsArr];
      });

    return newVesting;
  };

  const newVesting = useMemo(
    () => addRoundsinvestForEachEvent(),
    [baseAsset?.release_schedule]
  );

  const getVestingChartData = () => {
    if (!baseAsset?.release_schedule) return;
    const categories = {};
    const seen = new Set();

    newVesting
      ?.sort((a, b) => a[0] - b[0])
      .forEach(([timestamp, , types], idx) => {
        types?.forEach(([type, value]) => {
          if (!categories[type]) {
            categories[type] = [];
          }
          categories[type].push([
            timestamp,
            idx === 0
              ? value
              : value + categories[type][categories[type].length - 1][1],
          ]);
          seen.add(type);
        });
      });

    // Now we need to sort the timestamps within each category
    for (const type in categories) {
      categories[type] = categories[type].sort((a, b) => a[0] - b[0]);
    }

    return categories;
  };

  const categories = useMemo(
    () => getVestingChartData(),
    [baseAsset?.release_schedule]
  );

  return (
    <div className="flex mt-5 lg:mt-0 mx-auto w-full md:w-[95%] flex-row lg:flex-col-reverse">
      <div className="flex flex-col w-full mr-[25px] lg:mr-0">
        <UnlockProgress />
        {baseAsset?.release_schedule?.length > 0 ? (
          <>
            <LargeFont extraCss="mb-5 z-[1]">Vesting schedules</LargeFont>
            <AreaChart data={categories as CategoriesProps} />
          </>
        ) : (
          <>
            <LargeFont extraCss="mb-5 z-[1]">Vesting schedules</LargeFont>
            <div className="h-[300px] w-full flex items-center justify-center">
              <Spinner extraCss="w-[50px] h-[50px]" />
            </div>
          </>
        )}
        <CalendarEvent />
        <div className="flex-col w-full hidden lg:flex">
          <NextUnlockEvent />
          <Allocation />
        </div>
      </div>
      <div className="flex-col w-full flex lg:hidden max-w-[345px]">
        <NextUnlockEvent />
        <Allocation />
      </div>
    </div>
  );
};
