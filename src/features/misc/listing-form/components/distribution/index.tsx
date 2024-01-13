import React, { useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { isAddress } from "viem";
import { Button } from "../../../../../components/button";
import { LargeFont, MediumFont } from "../../../../../components/fonts";
import { ACTIONS } from "../../reducer";
import { addButtonStyle, inputStyle } from "../../styles";

export const Distribution = ({ dispatch, state }) => {
  const amountRef = useRef<HTMLInputElement>(null);
  const deleteButtonStyle =
    "flex justify-center items-center whitespace-nowrap w-fit min-w-[40px] px-2 h-[35px]  rounded-md text-sm lg:text-[13px] md:text-xs bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary text-light-font-100 dark:text-dark-font-100";

  const pushAddress = async (address: string, i: number, j: number) => {
    const newAddressObject = {
      address,
    };
    if (!state.tokenomics.distribution[i].addresses[0].address)
      dispatch({
        type: ACTIONS.REMOVE_DISTRIBUTION_ADDRESS,
        payload: { j, i },
      });
    dispatch({
      type: ACTIONS.ADD_DISTRIBUTION_ADDRESS,
      payload: { address: newAddressObject, i, j },
    });
  };
  return (
    <>
      <LargeFont extraCss="mt-[40px]">Token distribution</LargeFont>
      {state.tokenomics.distribution.map((d, i) => (
        <>
          <div className="flex flex-col mt-5">
            <button
              className="w-fit ml-auto"
              onClick={() =>
                dispatch({
                  type: ACTIONS.REMOVE_ELEMENT_TOKENOMICS,
                  payload: { i, object: "distribution" },
                })
              }
            >
              <AiOutlineClose className="text-xs text-light-font-100 dark:text-dark-font-100" />
            </button>
            <MediumFont extraCss="mb-2.5">Name</MediumFont>
            <input
              className={`${inputStyle} mb-5 min-h-[35px] border border-light-border-primary dark:border-dark-border-primary`}
              name="name"
              placeholder="Type a name "
              onChange={(e) =>
                dispatch({
                  type: ACTIONS.SET_DISTRIBUTION,
                  payload: { name: e.target.name, value: e.target.value, i },
                })
              }
            />
            <MediumFont extraCss="mb-2.5">Amount (%)</MediumFont>
            <input
              className={`${inputStyle} min-h-[35px] ${
                parseFloat(amountRef?.current?.value as string) > 100 || 0
                  ? "border border-red dark:border-red"
                  : "border border-light-border-primary dark:border-dark-border-primary"
              } w-[100px]`}
              name="percentage"
              placeholder="12"
              type="number"
              ref={amountRef}
              onChange={(e) =>
                dispatch({
                  type: ACTIONS.SET_DISTRIBUTION,
                  payload: {
                    name: e.target.name,
                    value: parseFloat(e.target.value),
                    i,
                  },
                })
              }
            />
            {parseFloat(amountRef?.current?.value as string) > 100 || 0 ? (
              <p className="text-[10px] lg:text-[9px] md:text-[8px] text-red dark:text-red mt-[3px]">
                The amount should be less than 100%
              </p>
            ) : null}
            <MediumFont extraCss="mt-5">Address</MediumFont>
            {state.tokenomics.distribution[i].addresses?.map((a, j) => (
              <div className="flex mt-2.5" key={a}>
                <div
                  className={`flex items-center ${inputStyle} border border-light-border-primary dark:border-dark-border-primary h-[35px] min-h-[35px] max-h-[35px]`}
                >
                  <input
                    className="bg-light-bg-terciary dark:bg-dark-bg-terciary w-full pl-0 pr-2.5 h-full overflow-scroll text-ellipsis text-light-font-100 dark:text-dark-font-100"
                    placeholder="0x77A8...459135"
                    onChange={(e) => {
                      if (
                        isAddress(e.target.value) &&
                        a.address !== e.target.value
                      )
                        pushAddress(e.target.value, i, j);
                    }}
                  />
                </div>
                <Button
                  className={`${deleteButtonStyle} mt-0 ml-2.5`}
                  onClick={() => {
                    dispatch({
                      type: ACTIONS.REMOVE_DISTRIBUTION_ADDRESS,
                      payload: {
                        i,
                        k: j,
                      },
                    });
                  }}
                >
                  <AiOutlineClose className="text-xs text-light-font-100 dark:text-dark-font-100" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            extraCss={`${addButtonStyle} w-fit`}
            onClick={() =>
              dispatch({
                type: ACTIONS.ADD_DISTRIBUTION_INPUT_ADDRESS,
                payload: { i },
              })
            }
          >
            + Add recipient address
          </Button>
        </>
      ))}
      <Button
        extraCss={`${addButtonStyle} w-fit mt-5 px-3`}
        onClick={() => dispatch({ type: ACTIONS.ADD_DISTRIBUTION })}
      >
        + Add distribution recipient
      </Button>
    </>
  );
};
