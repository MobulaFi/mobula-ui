/* eslint-disable consistent-return */
import {Flex} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import {useContext, useMemo} from "react";
import {TextLandingMedium} from "../../../../../../UI/Text";
import {useColors} from "../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../context-manager";
import {Allocation} from "../fundraising/allocation";
import {CalendarEvent} from "./calendar-event";
import {NextUnlockEvent} from "./next-unlock-event";
import {UnlockProgress} from "./unlock-progress";

const AreaChart = dynamic(
  () => import("../../../../../../common/charts/Area"),
  {
    ssr: false,
  },
);

export const Vesting = () => {
  const {text80} = useColors();
  const {baseAsset} = useContext(BaseAssetContext);

  const addRoundsinvestForEachEvent = () => {
    const vesting = baseAsset?.release_schedule;
    const seen = new Set();
    const types = [];

    vesting.forEach(([, , type]) => {
      Object.keys(type).forEach(key => {
        if (!seen.has(key)) {
          types.push(key);
          seen.add(key);
        }
      });
    });

    const newVesting = vesting.slice(1).map(([timestamp, amount, rounds]) => {
      const roundsArr = types.map(type => [type, rounds[type] || 0]);
      return [timestamp, amount, roundsArr];
    });

    return newVesting;
  };

  const newVesting = useMemo(
    () => addRoundsinvestForEachEvent(),
    [baseAsset?.release_schedule],
  );

  const getVestingChartData = () => {
    if (!baseAsset?.release_schedule) return;
    const categories = {};
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
    return {categories};
  };

  const {categories} = useMemo(
    () => getVestingChartData(),
    [baseAsset?.release_schedule],
  );

  return (
    <Flex
      mt={["0px", "0px", "0px", "20px"]}
      mx="auto"
      w={["95%", "95%", "100%", "100%"]}
      direction={["column-reverse", "column-reverse", "column-reverse", "row"]}
    >
      <Flex
        direction="column"
        maxW="990px"
        w={["100%", "100%", "100%", "calc(100% - 345px)"]}
        mr={["0px", "0px", "0px", "25px"]}
      >
        <UnlockProgress />
        {baseAsset?.release_schedule?.length > 0 ? (
          <>
            <TextLandingMedium color={text80} mb="20px" zIndex={1}>
              Vesting schedules
            </TextLandingMedium>
            <AreaChart data={(categories as any) || []} />
          </>
        ) : null}
        <CalendarEvent />
        <Flex
          direction="column"
          w="100%"
          display={["flex", "flex", "flex", "none"]}
        >
          <NextUnlockEvent />
          <Allocation />
        </Flex>
      </Flex>
      <Flex
        direction="column"
        display={["none", "none", "none", "flex"]}
        maxW="320px"
        w="100%"
      >
        <NextUnlockEvent />
        <Allocation />
      </Flex>
    </Flex>
  );
};
