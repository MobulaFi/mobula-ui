"use client";
import axios from "axios";
import React, { useContext, useReducer } from "react";
import { API_ENDPOINT } from "../../../../src/constants/index";
import { Button } from "../../../components/button";
import { Container } from "../../../components/container";
import { useGeneralContext } from "../../../contexts/general";
import { pushData } from "../../../lib/mixpanel";
import { triggerAlert } from "../../../lib/toastify";
import { BasicInformation } from "./components/basic-information";
import { ContractInformation } from "./components/contract-information";
import { Nav } from "./components/nav";
import { SocialInformation } from "./components/social-information";
import { Submit } from "./components/submit";
import { ListingContext } from "./context-manager";
import { INITIAL_STATE, reducer } from "./reducer";
import { cleanFee, cleanVesting, formatDate } from "./utils";

export const Listing = () => {
  const { editAssetReducer, baseEditAssetReducer } = useGeneralContext();
  const [state, dispatch] = useReducer(
    reducer,
    editAssetReducer || INITIAL_STATE
  );

  console.log("state", state);

  const { actualPage, setActualPage, setWallet, setIsListed, isListed } =
    useContext(ListingContext);

  state.type = "token";

  const getAccessToNextPage = () => {
    if (actualPage === 0) {
      let missingFields: string[] = [];
      if (!state.name) missingFields.push("Name");
      if (!state.symbol) missingFields.push("Symbol");
      if (!state.description) missingFields.push("Description");
      if (state.categories.length === 0) missingFields.push("Categories");

      if (missingFields.length > 0) {
        triggerAlert(
          "Warning",
          `Please fill in the following fields: ${missingFields.join(", ")}`
        );
        return false;
      }
      return true;
    }
    return actualPage !== 0;
  };

  async function submitListing(state: any) {
    try {
      const dateToSend = {
        ...state,
        contracts: state.contracts.filter(
          (contract: { address: string }) => contract.address !== ""
        ),
        excludedFromCirculationAddresses:
          state.excludedFromCirculationAddresses.filter(
            (newAddress: { address: any }) => newAddress && newAddress.address
          ),
        tokenomics: {
          ...state.tokenomics,
          sales: state.tokenomics.sales
            .filter((sale: { name: string; date: string }) => sale.name !== "")
            .map((sale: { name: string; date: string }) => ({
              ...sale,
              date:
                typeof sale.date === "string"
                  ? formatDate(sale.date)
                  : sale.date,
            })),
          vestingSchedule: state.tokenomics.vestingSchedule
            .filter((vesting: any[]) => vesting[0])
            .map(cleanVesting),
          fees: state.tokenomics.fees
            .filter((fee: { name: string }) => fee.name !== "")
            .map(cleanFee),
        },
        logo: state.image.logo,
      };

      const response = await axios.get(`${API_ENDPOINT}/asset/submit-token`, {
        params: {
          assetFormattedData: dateToSend,
        },
      });

      setWallet(response.data.wallet.address);

      const intervalId = setInterval(async () => {
        try {
          const status = await axios.get(
            `${API_ENDPOINT}/asset/listing-status`,
            {
              params: { wallet: response.data.wallet },
            }
          );

          if (status.data.receivedFunds === true) {
            setIsListed(true);
            clearInterval(intervalId);
          }
        } catch (statusError) {
          console.error(
            "Error checking token submission status:",
            statusError.response?.data || statusError.message
          );
        }
      }, 3000);

      // Setup a timeout to stop the interval after 30 minutes
      setTimeout(() => {
        clearInterval(intervalId);
        console.log(
          "Stopped checking for token submission status after 30 minutes."
        );
      }, 1800000);
    } catch (error) {
      console.error(
        "Error submitting token:",
        error.response?.data || error.message
      );
    }
  }

  async function formatEdit(state: any, baseEditAssetReducer: any) {
    try {
      const edits: string[] = [];

      Object.keys(state).forEach((key) => {
        if (
          state &&
          baseEditAssetReducer[key] !== state[key] &&
          (typeof baseEditAssetReducer[key] !== typeof state[key] ||
            JSON.stringify(baseEditAssetReducer[key]) !==
              JSON.stringify(state[key])) &&
          key !== "activeCoinType" &&
          key !== "own_blockchain"
        ) {
          edits.push(key);
        }
      });

      state.edits = edits;
    } catch (error) {
      console.error(
        "Error editing token:",
        error.response?.data || error.message
      );
    }
  }

  return (
    <Container>
      <div className="flex mb-[50px]">
        <Nav state={state} />
        <div className="flex flex-col w-full">
          {actualPage === 0 ? (
            <BasicInformation state={state} dispatch={dispatch} />
          ) : null}
          {actualPage === 1 ? (
            <SocialInformation state={state} dispatch={dispatch} />
          ) : null}
          {actualPage === 2 ? (
            <ContractInformation state={state} dispatch={dispatch} />
          ) : null}
          {state.type === "nft" ? null : (
            <>
              {/* REMOVED TEMPORARILY */}
              {/* {actualPage === 3 ? (
                <VestingInformation state={state} dispatch={dispatch} />
              ) : null} */}
              {/* {actualPage === 3 ? (
                <FeesInformation state={state} dispatch={dispatch} />
              ) : null} */}
            </>
          )}
          {actualPage === 3 ? <Submit state={state} /> : null}
          <div className="flex">
            {actualPage !== 3 ? (
              <Button
                extraCss="w-[160px]"
                onClick={() => {
                  if (getAccessToNextPage()) {
                    !editAssetReducer
                      ? submitListing(state)
                      : formatEdit(state, baseEditAssetReducer);

                    !editAssetReducer
                      ? pushData(`List now Clicked`)
                      : pushData(`Edit now Clicked`);

                    setActualPage(3);
                  }
                }}
              >
                {!editAssetReducer ? "List now" : "Edit now"}
              </Button>
            ) : null}
            {actualPage === 3 || actualPage === 2 ? null : (
              <Button
                extraCss="w-[180px] ml-[20px]"
                onClick={() => {
                  if (getAccessToNextPage()) {
                    pushData(`Listing Form Page ${actualPage + 1} Clicked`);
                    setActualPage(actualPage + 1);
                  }
                }}
              >
                Enrich token details
              </Button>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};
