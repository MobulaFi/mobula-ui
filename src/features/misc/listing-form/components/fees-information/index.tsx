import React, { useContext, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Button } from "../../../../../components/button";
import {
  ExtraLargeFont,
  LargeFont,
  SmallFont,
} from "../../../../../components/fonts";
import { ListingContext } from "../../context-manager";
import { ACTIONS } from "../../reducer";
import { addButtonStyle } from "../../styles";
import { FeeBreakdown } from "./fee-breakdown";

export const FeesInformation = ({ dispatch, state }) => {
  const [sellFees, setSellFees] = useState("");
  const { actualPage, setActualPage } = useContext(ListingContext);

  return (
    <div className="flex flex-col mb-5 w-[400px] md:w-full">
      <div className="flex items-center mb-2.5">
        <button
          className="hidden md:flex"
          onClick={() => setActualPage(actualPage - 1)}
        >
          <FaArrowLeft className="mr-[5px] text-light-font-100 dark:text-dark-font-100" />
        </button>
        <ExtraLargeFont>Fees Details</ExtraLargeFont>
      </div>
      <SmallFont>
        If the asset has fees on transfers (i.e. Safemoon), you can add them
        here. If not, simply click Next. If multiple fees (liquidity, marketing,
        etc) make sure to break them down individually.
      </SmallFont>
      <LargeFont extraCss="mt-2.5">Buy fees</LargeFont>
      <FeeBreakdown dispatch={dispatch} state={state} side="buy" />
      <Button
        extraCss={`${addButtonStyle} mb-5 w-fit px-3`}
        onClick={() =>
          dispatch({
            type: ACTIONS.ADD_ELEMENT_TOKENOMICS,
            payload: {
              object: "fees",
              template: {
                name: "",
                percentage: 0,
                details: "",
                side: "buy",
              },
            },
          })
        }
      >
        + Add another buy fee
      </Button>
      <div className="flex flex-col">
        <LargeFont>Sell fees</LargeFont>
        <FeeBreakdown dispatch={dispatch} state={state} side="sell" />
        <div>
          {/* <Button
            bg={boxBg6}
            border={borders}
            _hover={{bg: hover, border: bordersActive}}
            {...addButtonStyle}
            mr="10px"
            w="fit-content"
            px="12px"
            // onClick={() => {
            //   if (
            //     state.tokenomics.fees[state.tokenomics.fees.length - 2]
            //       ?.side !== "sell"
            //   ) {
            //     if (
            //       state.tokenomics.fees[state.tokenomics.fees.length - 1]
            //         .side === "sell"
            //     ) {
            //       dispatch({
            //         type: ACTIONS.REMOVE_ELEMENT_TOKENOMICS,
            //         payload: {
            //           object: "fees",
            //           i: state.tokenomics.fees.length - 1,
            //         },
            //       });
            //       dispatch({
            //         type: ACTIONS.ADD_ELEMENT_TOKENOMICS,
            //         payload: {
            //           object: "fees",
            //           template: {
            //             ...state.tokenomics.fees[i],
            //             side: "sell",
            //           },
            //         },
            //       });
            //     }
            //   }
            //   if (
            //     state.tokenomics.fees[state.tokenomics.fees.length - 1].side ===
            //     "buy"
            //   )
            //     dispatch({
            //       type: ACTIONS.ADD_ELEMENT_TOKENOMICS,
            //       payload: {
            //         object: "fees",
            //         template: {
            //           ...state.tokenomics.fees[i],
            //           side: "sell",
            //         },
            //       },
            //     });
            // }}
          >
            Copy buy fees
          </Button> */}
          <Button
            extraCss={`${addButtonStyle} mb-5 w-fit px-3`}
            onClick={() =>
              dispatch({
                type: ACTIONS.ADD_ELEMENT_TOKENOMICS,
                payload: {
                  object: "fees",
                  template: {
                    name: "",
                    percentage: 0,
                    details: "",
                    side: "sell",
                  },
                },
              })
            }
          >
            + Add sell fee
          </Button>
        </div>
      </div>
    </div>
  );
};
