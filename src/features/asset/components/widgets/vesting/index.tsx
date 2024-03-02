import { LargeFont } from "components/fonts";
import dynamic from "next/dynamic";
import React, { useContext, useMemo } from "react";
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

    console.log("vesting", vesting);

    vesting?.forEach((event) => {
      const { allocation_details: type } = event;
      if (!type) return;
      Object.keys?.(type).forEach((key) => {
        if (!seen.has(key)) {
          types.push(key as never);
          seen.add(key);
        }
      });
    });

    const newVesting = vesting?.map((event) => {
      const {
        unlock_date: timestamp,
        token_to_unlock: amount,
        allocation_details: rounds,
      } = event;
      const roundsArr = types.map((type) => [type, rounds[type] || 0]);
      return [timestamp, amount, roundsArr];
    });

    console.log("newVesting", newVesting);

    return newVesting;
  };

  const newVesting = useMemo(
    () => addRoundsinvestForEachEvent(),
    [baseAsset?.release_schedule]
  );

  const getVestingChartData = () => {
    if (!baseAsset?.release_schedule) return;
    const categories: CategoriesProps = {} as CategoriesProps;
    const seen = new Set();
    newVesting?.forEach(([timestamp, , types], idx) => {
      if (idx === 0) {
        types?.forEach(([type, value]) => {
          categories[type] = [[timestamp, value]];
          seen.add(type);
        });
      } else {
        types?.forEach(([type, value]) => {
          if (!seen.has(type)) {
            categories[type] = [[timestamp, value]];
            seen.add(type);
          } else {
            categories[type].push([
              timestamp,
              value + categories[type][categories[type].length - 1][1],
            ]);
          }
        });
      }
    });
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
