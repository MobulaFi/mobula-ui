import dynamic from "next/dynamic";
import React, { useContext, useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FaArrowLeftLong } from "react-icons/fa6";
import {
  ExtraLargeFont,
  ExtraSmallFont,
  LargeFont,
  MediumFont,
  SmallFont,
} from "../../../../../components/fonts";
import { ListingContext } from "../../context-manager";
import { ACTIONS } from "../../reducer";
import { addButtonStyle, inputStyle } from "../../styles";
import { getDateError } from "../../utils";

const EChart = dynamic(() => import("../../../../../lib/echart/line"), {
  ssr: false,
});

export const VestingInformation = ({ dispatch, state }) => {
  const dateRef = useRef<HTMLInputElement>(null);
  const { actualPage, setActualPage } = useContext(ListingContext);

  const addItem = (template) => {
    dispatch({ type: ACTIONS.ADD_VESTING, payload: template });
  };

  const updateItem = (index: number, changes) => {
    const item = state.tokenomics.vestingSchedule[index];
    const newItem = [
      "timestamp" in changes ? changes.timestamp : item[0],
      "value" in changes ? changes.value : item[1],
      changes.breakdown ? changes.breakdown : item[2],
    ];

    dispatch({ type: ACTIONS.UPDATE_VESTING, index, payload: newItem });
  };

  const deleteItem = (index: number) => {
    dispatch({ type: ACTIONS.DELETE_VESTING, index });
  };

  const isoToTimestamp = (date: string, i: number) => {
    const fullDate = date || "27/06/2023";
    const parts = fullDate.split("/");
    const jsDateStr = `${parts[1]}/${parts[0]}/${parts[2]}`;
    const newDate = new Date(jsDateStr);
    const timestamp = newDate.getTime();
    updateItem(i, { timestamp });
  };

  const formatVesting = () => {
    if (!state?.tokenomics?.vestingSchedule?.length) {
      return [];
    }

    const vesting: [number, number][] =
      state?.tokenomics?.vestingSchedule?.map?.((v: [number, number]) => [
        v[0],
        v[1],
      ]);

    vesting?.reduce?.((acc, curr) => {
      curr[0] += acc[0];
      curr[1] += acc[1];
      return curr;
    });

    return vesting;
  };

  const vestingFormatted = formatVesting();

  return (
    <div className="flex flex-col mb-5 w-[400px] md:w-full">
      <div className="flex items-center mb-2.5">
        <button
          className="hidden items-center md:flex text-light-font-100 dark:text-dark-font-100 text-sm "
          onClick={() => setActualPage(actualPage - 1)}
        >
          <FaArrowLeftLong className="mr-[5px] text-light-font-100 dark:text-dark-font-100" />
        </button>
        <ExtraLargeFont>Vesting Details</ExtraLargeFont>
      </div>
      <SmallFont>
        If the asset has a vesting schedule, you can add the unlock events here.
        If not, simply click Next.
      </SmallFont>
      {state.tokenomics.vestingSchedule.map((d, i) => (
        <div
          key={d}
          className={`flex flex-col ${i !== 0 ? "mt-[30px]" : "mt-5"}`}
        >
          <button
            className="-mb-5 ml-auto text-light-font-100 dark:text-dark-font-100 text-sm lg:text-[13px] md:text-xs"
            onClick={() => deleteItem(i)}
          >
            <AiOutlineClose className="text-sm" />
          </button>
          <div className="flex justify-between">
            <LargeFont extraCss="mb-2.5">Date</LargeFont>
          </div>
          <input
            className={`${inputStyle} min-h-[35px] w-full border ${
              getDateError(dateRef)
                ? "mb-0 border-red dark:border-red"
                : "mb-5 border-light-border-primary dark:border-dark-border-primary"
            }`}
            ref={dateRef}
            type="text"
            value={d[0] ? new Date(d[0]).toLocaleDateString() : 0}
            placeholder="DD/MM/YYYY"
            onChange={(e) => isoToTimestamp(e.target.value, i)}
          />
          {getDateError(dateRef) ? (
            <ExtraSmallFont className="text-red dark:text-red mb-5 mt-[3px]">
              Correct format: DD/MM/YYYY
            </ExtraSmallFont>
          ) : null}
          <LargeFont extraCss="mb-2.5">Amount</LargeFont>
          <input
            className={`${inputStyle} mb-5 w-full min-h-[35px] border border-light-border-primary dark:border-dark-border-primary`}
            type="number"
            placeholder="10000.00"
            value={typeof d[1] === "number" ? d[1].toFixed(2) : "0.00"}
            onChange={(e) =>
              updateItem(i, { value: parseFloat(e.target.value) })
            }
          />
          <LargeFont extraCss="mb-2.5">Breakdown</LargeFont>
          {Object.keys(d[2]).map((_, j) => (
            <div className="flex" key={i}>
              <input
                className={`${inputStyle} mr-2.5 w-full min-h-[35px] border border-light-border-primary dark:border-dark-border-primary`}
                placeholder="1,000.00"
                type="number"
                value={d[2][_]}
                onChange={(e) => {
                  const newBreakdown = [...d[2]];
                  newBreakdown[j] = {
                    ...newBreakdown[j],
                    amount: parseFloat(e.target.value),
                  };

                  updateItem(i, {
                    breakdown: newBreakdown,
                  });
                }}
              />
              <input
                className={`${inputStyle} mb-2.5 w-[150px] min-h-[35px] border border-light-border-primary dark:border-dark-border-primary`}
                type="text"
                placeholder="Role"
                value={_}
                onChange={(e) => {
                  const newBreakdown = [...d[2]];
                  newBreakdown[j] = {
                    ...newBreakdown[j],
                    name: e.target.value,
                  };

                  updateItem(i, {
                    breakdown: newBreakdown,
                  });
                }}
              />
            </div>
          ))}
          <button
            className={`${addButtonStyle} px-3 mb-5 mt-0 w-fit`}
            onClick={() =>
              updateItem(i, {
                breakdown: [...d[2], { name: "", amount: "" }],
              })
            }
          >
            + Add breakdown
          </button>
        </div>
      ))}
      <button
        className={`${addButtonStyle} px-3 w-fit mt-0`}
        onClick={() =>
          addItem([
            "",
            "",
            [
              {
                name: "",
                amount: "",
              },
            ],
          ])
        }
      >
        + Add unlock event
      </button>
      <div className="flex w-full relative">
        {vestingFormatted.length >= 2 &&
        vestingFormatted?.[1][0] &&
        vestingFormatted?.[1][1] ? (
          <>
            <MediumFont extraCss="absolute left-0 top-5 z-[1]">
              Token Vesting Schedule
            </MediumFont>
            <EChart
              data={vestingFormatted}
              leftMargin={["0%", "0%"]}
              height={300}
              timeframe="ALL"
            />
          </>
        ) : null}
      </div>
    </div>
  );
};
