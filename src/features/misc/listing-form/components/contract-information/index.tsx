import React, { useContext } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Button } from "../../../../../components/button";
import {
  ExtraLargeFont,
  LargeFont,
  SmallFont,
} from "../../../../../components/fonts";
import { ListingContext } from "../../context-manager";
import { ACTIONS } from "../../reducer";
import { addButtonStyle } from "../../styles";
import { Launch } from "../launch";
import { MultiInputTemplate } from "../ui/multi-input-template";

export const ContractInformation = ({ dispatch, state }) => {
  const { isLaunched, setIsLaunched, actualPage, setActualPage } =
    useContext(ListingContext);

  return (
    <div className="flex flex-col mb-5 w-[400px] md:w-full">
      <div className="flex items-center">
        <button
          className="hidden md:flex items-center"
          onClick={() => setActualPage(actualPage - 1)}
        >
          <FaArrowLeftLong className="mr-[5px] text-light-font-100 dark:text-dark-font-100" />
        </button>
        <ExtraLargeFont>Contract Information</ExtraLargeFont>
      </div>
      {state.type === "nft" ? null : (
        <>
          {state.contracts.length > 1 ? (
            <div className="flex flex-col w-full mt-5">
              <LargeFont extraCss="mb-2.5">Token supply details</LargeFont>
              <Button
                extraCss={`${addButtonStyle} w-fit px-3 ${
                  state.totalSupplyContracts.length === 1
                    ? "bg-light-bg-hover dark:bg-dark-bg-hover"
                    : "bg-light-bg-terciary dark:bg-dark-bg-terciary"
                }`}
                onClick={() => {
                  dispatch({ type: ACTIONS.CLEAR_TOTAL_SUPPLY_CONTRACTS });
                  dispatch({ type: ACTIONS.ADD_ALL_CONTRACTS });
                }}
              >
                Total supply is a sum of all contracts
              </Button>
              <SmallFont extraCss="mt-2.5 text-light-font-40 dark:text-dark-font-40">
                This means the token bridge is “native” - you need to burn (and
                not vest) assets to mint them on the other chain.
              </SmallFont>
              <Button
                extraCss={`${addButtonStyle} w-fit px-3 mb-2.5 w-fit mt-5 ${
                  state.totalSupplyContracts.length > 1
                    ? "bg-light-bg-hover dark:bg-dark-bg-hover"
                    : "bg-light-bg-terciary dark:bg-dark-bg-terciary"
                }`}
                onClick={() => {
                  dispatch({ type: ACTIONS.CLEAR_TOTAL_SUPPLY_CONTRACTS });
                  dispatch({ type: ACTIONS.ADD_FIRST_CONTRACT });
                }}
              >
                Total supply is the supply of the first contract
              </Button>
              <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
                This means the token bridge isn&apos;t “native” - you vest /
                lock assets to mint them on the other chain, so the supply on
                the first chain stays the same.
              </SmallFont>
            </div>
          ) : null}
          <MultiInputTemplate
            dispatch={dispatch}
            state={state}
            name="excludedFromCirculationAddresses"
            title="Excluded addresses"
            placeholder="0x0GeT...345234"
            text="These addresses are excluded from the circulating supply (vesting or staking contracts, etc.)"
            template={{
              address: "",
              blockchain: "",
              blockchain_id: 1,
            }}
          />
          <div className="flex flex-col w-[400px]">
            <LargeFont extraCss="mt-5">
              Is the asset already launched?
            </LargeFont>
            <div className="flex">
              <Button
                extraCss={`${addButtonStyle} mr-2.5 ${
                  isLaunched
                    ? "bg-light-bg-hover dark:bg-dark-bg-hover"
                    : "bg-light-bg-terciary dark:bg-dark-bg-terciary"
                }`}
                onClick={() => setIsLaunched(true)}
              >
                Yes
              </Button>
              <Button
                extraCss={`${addButtonStyle} ${
                  !isLaunched
                    ? "bg-light-bg-hover dark:bg-dark-bg-hover"
                    : "bg-light-bg-terciary dark:bg-dark-bg-terciary"
                }`}
                onClick={() => setIsLaunched(false)}
              >
                No
              </Button>
            </div>
          </div>
          {isLaunched ? null : <Launch dispatch={dispatch} state={state} />}
          {/* TO FIX CORRECLTY LATER (useless actually) */}
          {/* <Sales dispatch={dispatch} state={state} /> */}
          {/* <Distribution dispatch={dispatch} state={state} /> */}
        </>
      )}
    </div>
  );
};
