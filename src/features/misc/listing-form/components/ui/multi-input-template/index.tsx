import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { ChangeEvent } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { isAddress } from "viem";
import { LargeFont, MediumFont } from "../../../../../../components/fonts";
import { NextImageFallback } from "../../../../../../components/image";
import { fetchContract } from "../../../../../../layouts/swap/utils";
import { ACTIONS } from "../../../reducer";
import { inputStyle } from "../../../styles";

interface MultiInputTemplateProps {
  dispatch: any;
  state: any;
  name: string;
  template: { [key: string]: any };
  title: string;
  placeholder: string;
  hasLogo?: boolean;
  text?: string;
}

export const MultiInputTemplate = ({
  dispatch,
  state,
  name,
  template,
  title,
  hasLogo,
  placeholder,
  text,
}: MultiInputTemplateProps) => {
  const deleteButtonStyle =
    "flex justify-center items-center whitespace-nowrap w-fit min-w-[40px] px-2 h-[35px]  rounded text-sm lg:text-[13px] md:text-xs bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary text-light-font-100 dark:text-dark-font-100";

  const handleNewContract = (
    e: ChangeEvent<HTMLInputElement>,
    i: string,
    object: string
  ) => {
    if (isAddress(e.target.value)) {
      dispatch({
        type: ACTIONS.SET_ELEMENT,
        payload: {
          i,
          name: "address",
          value: e.target.value,
          object,
        },
      });
      const getBlockchain = async (address: string) => {
        const fetchResults = await Promise.all(fetchContract(address));
        const { blockchain: blockchainBuffer } =
          fetchResults.filter((entry) => entry)[0] || {};
        dispatch({
          type: ACTIONS.SET_ELEMENT,
          payload: {
            i,
            name: "blockchain",
            value: blockchainBuffer,
            object,
          },
        });
        const { chainId } = blockchainsContent[blockchainBuffer];
        dispatch({
          type: ACTIONS.SET_ELEMENT,
          payload: {
            i,
            name: "blockchain_id",
            value: chainId,
            object,
          },
        });
        if (title === "Contracts")
          if (state.totalSupplyContracts.length === 0)
            dispatch({
              type: ACTIONS.INITIAL_CONTRACT,
              payload: {
                address: e.target.value,
                blockchain: blockchainBuffer,
                blockchain_id: chainId,
              },
            });
      };
      getBlockchain(e.target.value);
    }
  };

  return (
    <div className="flex flex-col w-full mt-5">
      <LargeFont>{title}</LargeFont>{" "}
      {text && <MediumFont extraCss="mb-[15px]">{text}</MediumFont>}
      {state[name].map((contract, i) => (
        <div className="flex flex-col w-full" key={contract.name + i}>
          <div className="flex items-center mb-2.5">
            <div
              className={`${inputStyle} border border-light-border-primary dark:border-dark-border-primary w-full h-[35px]`}
            >
              {hasLogo ? (
                <>
                  <div className="flex items-center justify-center h-full">
                    <NextImageFallback
                      height={20}
                      width={20}
                      fallbackSrc="/empty/unknown.png"
                      src={
                        blockchainsContent[state.contracts[i]?.blockchain]?.logo
                      }
                      alt={`${state.contracts[i]?.blockchain} logo`}
                    />
                    <input
                      className="pl-2.5 w-full h-full pr-2.5 ovrflow-scroll text-ellipsis bg-light-bg-terciary dark:bg-dark-bg-terciary"
                      placeholder={placeholder}
                      onChange={(e) => {
                        handleNewContract(e, i, name);
                      }}
                    />
                  </div>
                </>
              ) : (
                <input
                  className="pl-[5px] w-full pr-2.5 h-full overflow-scroll text-ellipsis text-light-font-100 dark:text-dark-font-100 bg-light-bg-terciary dark:bg-dark-bg-terciary"
                  placeholder={placeholder}
                  onChange={(e) => {
                    handleNewContract(e, i, name);
                    if (title === "Contracts")
                      if (state.totalSupplyContracts.length === 0)
                        dispatch({ type: ACTIONS.ADD_FIRST_CONTRACT });
                  }}
                />
              )}
            </div>
            {i > 0 ? (
              <button
                className={`${deleteButtonStyle} mt-0 ml-2.5`}
                onClick={() => {
                  dispatch({
                    type: ACTIONS.REMOVE_ELEMENT,
                    payload: { i, object: name },
                  });
                  dispatch({ type: ACTIONS.CLEAR_TOTAL_SUPPLY_CONTRACTS });
                  if (state.totalSupplyContracts.length === 1)
                    dispatch({ type: ACTIONS.ADD_FIRST_CONTRACT });
                  else dispatch({ type: ACTIONS.ADD_ALL_CONTRACTS });
                }}
              >
                <AiOutlineClose className="text-xs" />
              </button>
            ) : null}
          </div>
        </div>
      ))}
      <button
        className={`${deleteButtonStyle} w-[170px] ml-0 mt-0`}
        onClick={() =>
          dispatch({
            type: ACTIONS.ADD_ELEMENT,
            payload: {
              object: name,
              template,
            },
          })
        }
      >
        + Add contract
      </button>
    </div>
  );
};
