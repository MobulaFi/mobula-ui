import axios from "axios";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { ChangeEvent, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { LargeFont, MediumFont } from "../../../../../../components/fonts";
import { NextImageFallback } from "../../../../../../components/image";
import { API_ENDPOINT } from "../../../../../../constants";
import { useGeneralContext } from "../../../../../../contexts/general";
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
    "flex justify-center items-center whitespace-nowrap w-fit min-w-[40px] px-2 h-[35px]  rounded-md text-sm lg:text-[13px] md:text-xs bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary text-light-font-100 dark:text-dark-font-100";

  const [temporateValue, setTemporateValue] = useState<any>(state[name]);
  const { editAssetReducer, setEditAssetReducer } = useGeneralContext();

  const handleNewContract = (
    e: ChangeEvent<HTMLInputElement>,
    i: string,
    object: string
  ) => {
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
      const response: any = await axios.get(
        `${API_ENDPOINT}/api/1/metadata?asset=${address}`,
        {
          headers: {
            Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
          },
        }
      );

      console.log("response", response, address);

      let blockchainName;
      if (Array.isArray(response.data.data.blockchains)) {
        blockchainName = response.data.data.blockchains[0];
      } else {
        blockchainName = response.data.data.blockchain;
      }

      console.log("blockchainName", blockchainName);

      const { chainId } = blockchainsContent[blockchainName];

      dispatch({
        type: ACTIONS.SET_ELEMENT,
        payload: {
          i,
          name: "blockchain",
          value: blockchainName,
          object,
        },
      });
      dispatch({
        type: ACTIONS.SET_ELEMENT,
        payload: {
          i,
          name: "blockchain_id",
          value: chainId,
          object,
        },
      });
      if (title === "Contracts") {
        if (state.totalSupplyContracts.length === 0) {
          dispatch({
            type: ACTIONS.INITIAL_CONTRACT,
            payload: {
              address: e.target.value,
              blockchain: blockchainName,
              blockchain_id: chainId,
            },
          });
        }
      }
    };
    getBlockchain(e.target.value);
  };

  return (
    <div className="flex flex-col w-full mt-5">
      <LargeFont>{title}</LargeFont>{" "}
      {text && <MediumFont extraCss="mb-[15px]">{text}</MediumFont>}
      {state[name].map(
        (contract: any, i: any) => (
          console.log("contract", temporateValue?.[i]?.address),
          (
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
                            blockchainsContent[temporateValue?.[i]?.blockchain]
                              ?.logo
                          }
                          alt={`${temporateValue?.[i]?.blockchain} logo`}
                          key={`logo-${temporateValue?.[i]?.blockchain}-${i}`}
                        />
                        <input
                          className="pl-2.5 w-full h-full pr-2.5 ovrflow-scroll text-ellipsis bg-light-bg-terciary dark:bg-dark-bg-terciary"
                          placeholder={placeholder}
                          value={temporateValue?.[i]?.address || ""}
                          onChange={(e) => {
                            handleNewContract(e, i, name);
                            if (title === "Contracts") {
                              setTemporateValue((prev: any) => {
                                const buffer = [...prev];
                                buffer[i] = { address: e.target.value };
                                return buffer;
                              });
                              if (state.totalSupplyContracts.length === 0)
                                dispatch({ type: ACTIONS.ADD_FIRST_CONTRACT });

                              if (editAssetReducer) {
                                setEditAssetReducer(
                                  (prevState: { contracts: any }) => {
                                    const newContracts = [
                                      ...prevState.contracts,
                                    ];
                                    newContracts[i] = {
                                      ...newContracts[i],
                                      address: e.target.value,
                                    };
                                    return {
                                      ...prevState,
                                      contracts: newContracts,
                                    };
                                  }
                                );
                              }
                            } else if (title === "Excluded addresses") {
                              setTemporateValue((prev: any) => {
                                const buffer = [...prev];
                                buffer[i] = { address: e.target.value };
                                return buffer;
                              });

                              if (editAssetReducer) {
                                setEditAssetReducer(
                                  (prevState: {
                                    excludedFromCirculationAddresses: any;
                                  }) => {
                                    const newExcluded = [
                                      ...prevState.excludedFromCirculationAddresses,
                                    ];
                                    newExcluded[i] = {
                                      ...newExcluded[i],
                                      address: e.target.value,
                                    };
                                    return {
                                      ...prevState,
                                      excludedFromCirculationAddresses:
                                        newExcluded,
                                    };
                                  }
                                );
                              }
                            }
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <input
                      className="pl-[5px] w-full pr-2.5 h-full overflow-scroll text-ellipsis text-light-font-100 dark:text-dark-font-100 bg-light-bg-terciary dark:bg-dark-bg-terciary"
                      placeholder={placeholder}
                      value={temporateValue?.[i]?.address || ""}
                      onChange={(e) => {
                        handleNewContract(e, i, name);
                        if (title === "Contracts") {
                          setTemporateValue((prev: any) => {
                            const buffer = [...prev];
                            buffer[i] = { address: e.target.value };
                            return buffer;
                          });
                          if (state.totalSupplyContracts.length === 0)
                            dispatch({ type: ACTIONS.ADD_FIRST_CONTRACT });

                          if (editAssetReducer) {
                            setEditAssetReducer((prevState: any) => {
                              const newContracts = [...prevState?.contracts];
                              newContracts[i] = {
                                ...newContracts[i],
                                address: e.target.value,
                              };
                              return {
                                ...prevState,
                                contracts: newContracts,
                              };
                            });
                          }
                        } else if (title === "Excluded addresses") {
                          setTemporateValue((prev: any) => {
                            const buffer = [...prev];
                            buffer[i] = { address: e.target.value };
                            return buffer;
                          });
                          if (editAssetReducer) {
                            setEditAssetReducer(
                              (prevState: {
                                excludedFromCirculationAddresses: any;
                              }) => {
                                const newExcluded = [
                                  ...prevState.excludedFromCirculationAddresses,
                                ];
                                newExcluded[i] = {
                                  ...newExcluded[i],
                                  address: e.target.value,
                                };
                                return {
                                  ...prevState,
                                  excludedFromCirculationAddresses: newExcluded,
                                };
                              }
                            );
                          }
                        }
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
                      if (state.totalSupplyContracts.length === 1) {
                        dispatch({ type: ACTIONS.ADD_FIRST_CONTRACT });
                      } else {
                        dispatch({ type: ACTIONS.ADD_ALL_CONTRACTS });
                      }
                      if (editAssetReducer) {
                        setEditAssetReducer((prevState) => ({
                          ...prevState,
                          contracts: [
                            ...prevState.contracts.slice(0, i),
                            ...prevState.contracts.slice(i + 1),
                          ],
                        }));
                      }

                      setTemporateValue((prev: string[]) => [
                        ...prev.slice(0, i),
                        ...prev.slice(i + 1),
                      ]);
                    }}
                  >
                    <AiOutlineClose className="text-xs" />
                  </button>
                ) : null}
              </div>
            </div>
          )
        )
      )}
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
