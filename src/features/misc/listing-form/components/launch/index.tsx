import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { useEffect, useRef, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import {
  ExtraSmallFont,
  LargeFont,
  MediumFont,
  SmallFont,
} from "../../../../../components/fonts";
import { Menu } from "../../../../../components/menu";
import { Tooltip } from "../../../../../components/tooltip";
import { ACTIONS } from "../../reducer";
import { addButtonStyle, inputStyle } from "../../styles";
import { getDateError } from "../../utils";

export const Launch = ({ dispatch, state }) => {
  const dateRef = useRef<HTMLInputElement>(null);
  const hoursRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState({
    date: "",
    time: "",
  });
  const selectors = [
    {
      name: "exchange",
      select: blockchainsContent[state.contracts[0].blockchain]?.routers,
      title: "Exchange",
      button_name: "Add Exchange",
    },
    {
      name: "vsToken",
      select: blockchainsContent[state.contracts[0]?.blockchain]?.tokens,
      title: "Initial Pair",
      button_name: "Add Pair",
    },
  ];

  const ISOtoTimestamp = () => {
    const fullDate = `${date.date ? date.date : "27/06/2023"} ${
      date.time ? date.time : "00:00"
    }`;
    const parts = fullDate.split("/");
    const jsDateStr = `${parts[1]}/${parts[0]}/${parts[2]}`;
    const newDate = new Date(jsDateStr);
    const timestamp = newDate.getTime();
    dispatch({
      type: ACTIONS.SET_LAUNCH,
      payload: { name: "date", value: timestamp },
    });
  };

  useEffect(() => {
    ISOtoTimestamp();
  }, [date]);

  const getNameFromSelector = (
    name: string,
    selector: { [key: string]: any }
  ) => {
    if (name === "vsToken")
      return `${state.symbol}/${state.tokenomics.launch[selector.name]}`;
    return state.tokenomics.launch[selector.name];
  };

  const getHoursError = () => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (hoursRef.current === null || hoursRef.current.value === "")
      return false;
    if (!regex.test(hoursRef.current.value)) return true;
    return false;
  };

  return (
    <>
      <LargeFont extraCss="mt-5">Launch Details</LargeFont>
      <MediumFont extraCss="mt-5 mb-2.5">Public launch date & hour</MediumFont>
      <div className="flex items-center">
        <input
          className={`${inputStyle} mr-2.5 w-[135px] border ${
            getDateError(dateRef)
              ? "border-red dark:border-red"
              : "border-light-border-primary dark:border-dark-border-primary"
          }`}
          ref={dateRef}
          placeholder="DD/MM/YYYY"
          onChange={(e) =>
            setDate((prev) => ({ ...prev, date: e.target.value }))
          }
        />
        <input
          className={`${inputStyle} mr-2.5 w-[100px] border ${
            getHoursError()
              ? "border-red dark:border-red"
              : "border-light-border-primary dark:border-dark-border-primary"
          }`}
          ref={hoursRef}
          placeholder="HH:MM"
          onChange={(e) =>
            setDate((prev) => ({ ...prev, time: e.target.value }))
          }
        />
        <SmallFont>UTC</SmallFont>
      </div>
      {getDateError(dateRef) ? (
        <ExtraSmallFont extraCss="mt-[3px] text-red dark:text-red">
          Correct format: DD/MM/YYYY
        </ExtraSmallFont>
      ) : null}
      {getHoursError() ? (
        <ExtraSmallFont extraCss="mt-[3px] text-red dark:text-red">
          Correct format: HH:MM
        </ExtraSmallFont>
      ) : null}
      <MediumFont extraCss="mt-5 mb-2.5">Floating Time</MediumFont>
      <div className="flex items-center">
        <input
          className={`${inputStyle} w-[100px]`}
          type="number"
          placeholder="2 (Default)"
          onChange={(e) =>
            dispatch({
              type: ACTIONS.SET_LAUNCH,
              payload: {
                name: "lag",
                value: (Number(e.target.value) * 3600).toString(),
              },
            })
          }
        />
        <SmallFont extraCss="ml-2.5">Hours</SmallFont>
        <Tooltip
          iconCss="mt-0.5"
          extraCss="left-0 top-[20px] md:left-[-100px]"
          tooltipText="What's the range from launch date (hours) you expect for your launch"
        />
      </div>
      {selectors?.map((selector) => (
        <>
          <MediumFont extraCss="mt-5">{selector.title}</MediumFont>
          <Menu
            disabled={!state.contracts[0].address}
            extraCss="top-[50px] left-0 w-fit h-fit"
            titleCss={`${addButtonStyle} hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover bg-light-bg-terciary 
            dark:bg-dark-bg-terciary px-3 w-fit text-sm md:text-xs border border-light-border-primary 
            dark:border-dark-border-primary`}
            title={
              <>
                {state.tokenomics.launch[selector.name]
                  ? getNameFromSelector(selector.name, selector)
                  : `Select a ${selector.button_name}`}
                <BsChevronDown className="ml-2.5 text-light-font-100 dark:text-dark-font-100" />
              </>
            }
          >
            {selector?.select?.map((item) => (
              <button
                key={item.name}
                className="flex items-center bg-light-bg-terciary dark:bg-dark-bg-terciary text-light-font-60
                 dark:text-dark-font-60 py-1 hover:text-light-font-100 hover:dark:text-dark-font-100 my-1"
                onClick={() => {
                  dispatch({
                    type: ACTIONS.SET_LAUNCH,
                    payload: {
                      name: selector.name,
                      value: item.name,
                    },
                  });
                }}
              >
                {selector.title === "Exchange" ? item.name : item.symbol}
              </button>
            ))}
          </Menu>
          {state.contracts[0].address ? null : (
            <ExtraSmallFont extraCss="mt-[5px] text-light-font-60 dark:text-dark-font-60">
              Please enter an contract address to unlock this{" "}
            </ExtraSmallFont>
          )}
        </>
      ))}
    </>
  );
};
