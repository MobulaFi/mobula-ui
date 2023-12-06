"use client";
import React, { useContext, useReducer } from "react";
import { Button } from "../../../components/button";
import { Container } from "../../../components/container";
import { pushData } from "../../../lib/mixpanel";
import { BasicInformation } from "./components/basic-information";
import { ContractInformation } from "./components/contract-information";
import { FeesInformation } from "./components/fees-information";
import { Nav } from "./components/nav";
import { SocialInformation } from "./components/social-information";
import { Submit } from "./components/submit";
import { VestingInformation } from "./components/vesting-information";
import { ListingContext } from "./context-manager";
import { INITIAL_STATE, reducer } from "./reducer";

export const Listing = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { actualPage, setActualPage } = useContext(ListingContext);
  // const alert = useAlert();

  const getAccessToNextPage = () => {
    if (
      actualPage === 0 &&
      state.name &&
      state.symbol &&
      state.description &&
      state.type &&
      state.categories.length > 0 &&
      (state.image.uploaded_logo || state.image.logo)
    ) {
      return true;
    }
    if (actualPage === 0) {
      // alert.show("Please fill all the fields");
      return false;
    }
    if (actualPage !== 0) return true;
    return false;
  };

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
              {actualPage === 3 ? (
                <VestingInformation state={state} dispatch={dispatch} />
              ) : null}
              {actualPage === 4 ? (
                <FeesInformation state={state} dispatch={dispatch} />
              ) : null}
            </>
          )}
          {actualPage === 5 ? <Submit state={state} /> : null}
          {(state.type === "nft" && actualPage === 3) ||
          actualPage === 5 ? null : (
            <Button
              extraCss="w-[100px]"
              onClick={() => {
                if (getAccessToNextPage()) {
                  pushData(`Listing Form Page ${actualPage + 1} Clicked`);
                  if (actualPage === 2 && state.type === "nft")
                    setActualPage(5);
                  else setActualPage(actualPage + 1);
                }
              }}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
};
