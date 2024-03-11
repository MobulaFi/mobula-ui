import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { LargeFont, MediumFont } from "../../../../../components/fonts";
import { NextImageFallback } from "../../../../../components/image";
import { Menu } from "../../../../../components/menu";
import { ILaunchpad } from "../../../../../interfaces/launchpads";
import { createSupabaseDOClient } from "../../../../../lib/supabase";
import { ACTIONS } from "../../reducer";
import { addButtonStyle, inputStyle } from "../../styles";
import { getInfoFromIndex, getNameFromNumber } from "../../utils";

export const Sales = ({ dispatch, state }) => {
  const [launchpads, setLaunchpads] = useState<ILaunchpad[]>([]);
  const [activePlateform, setActivePlateform] = useState<ILaunchpad>(
    {} as ILaunchpad
  );

  useEffect(() => {
    const supabase = createSupabaseDOClient();
    supabase
      .from("launchpads")
      .select("logo,name")
      .then(({ data, error }) => {
        if (error) console.error(error);
        else
          setLaunchpads([
            ...data,
            { name: "Other", logo: "/empty/unknown.png" },
          ]);
      });
  }, []);

  return (
    <>
      <LargeFont extraCss="mt-2.5 pt-5">Presale(s)</LargeFont>
      {state.tokenomics.sales.map(
        (
          {
            startDate,
            unlockType,
            howToParticipate,
            fundraisingGoal,
            id,
            links,
            investors,
            ...d
          },
          i
        ) => (
          <>
            <div
              className={`flex justify-between ${
                i !== 0 ? "mt-[50px]" : "mt-5"
              }`}
            >
              <MediumFont>
                {getNameFromNumber(i + 1)} Round Sale Information
              </MediumFont>
              <button
                className="flex items-center justify-center text-light-font-100 dark:text-dark-font-100"
                onClick={() =>
                  dispatch({
                    type: ACTIONS.REMOVE_ELEMENT_TOKENOMICS,
                    payload: { object: "sales", i },
                  })
                }
              >
                <AiOutlineClose className="text-xs" />
              </button>
            </div>
            <div className="flex flex-col mt-5">
              {Object.keys(d).map((entry, j) => {
                const info = getInfoFromIndex(j);
                const placeholder = info ? info.placeholder : "";
                const title = info ? info.title : "";
                const type = info ? info.type : "";
                return (
                  <>
                    <MediumFont extraCss="mb-1.5">{title}</MediumFont>
                    {j !== Object.keys(d).length - 1 ? (
                      <input
                        className={`${inputStyle} border border-light-border-primary dark:border-dark-border-primary mb-5 min-h-[35px]`}
                        name={entry}
                        type={type}
                        placeholder={placeholder}
                        value={d[entry]}
                        onChange={(e) => {
                          let value: string | number = "";
                          if (
                            entry === "valuation" ||
                            entry === "price" ||
                            entry === "amount"
                          )
                            value = parseFloat(e.target.value);
                          else if (entry === "date") value = e.target.value;
                          else value = e.target.value;
                          dispatch({
                            type: ACTIONS.SET_ELEMENT_TOKENOMICS,
                            payload: {
                              object: "sales",
                              name: e.target.name,
                              value,
                              i,
                            },
                          });
                        }}
                      />
                    ) : (
                      <Menu
                        titleCss={`${addButtonStyle} w-fit px-3 mb-2.5 mt-0`}
                        extraCss="top-[55px] left-0 w-fit h-fit"
                        title={
                          <div className="flex items-center h-full">
                            {d.platform ? (
                              <img
                                className="mr-[7.5px] w-5 h-5 md:w-[18px] md:h-[18px] rounded-full"
                                src={
                                  activePlateform.logo || "/icon/unknown.png"
                                }
                                alt={`${activePlateform.name} logo`}
                              />
                            ) : null}
                            {d.platform ? d.platform : "Select a Platform"}{" "}
                            <BsChevronDown className="ml-2.5" />
                          </div>
                        }
                      >
                        {launchpads.map((launchpad) => (
                          <button
                            key={launchpad.logo}
                            className={`font-normal flex text-sm md:text-xs items-center bg-light-bg-terciary dark:bg-dark-bg-terciary py-1 ${
                              activePlateform === launchpad
                                ? "text-light-font-100 dark:text-dark-font-100"
                                : "text-light-font-60 dark:text-dark-font-60"
                            } hover:text-light-font-100 hover:dark:text-dark-font-100`}
                            onClick={() => {
                              setActivePlateform(launchpad);
                              dispatch({
                                type: ACTIONS.SET_ELEMENT_TOKENOMICS,
                                payload: {
                                  object: "sales",
                                  name: "platform",
                                  value: launchpad.name,
                                  i,
                                },
                              });
                            }}
                          >
                            <NextImageFallback
                              width={18}
                              height={18}
                              style={{
                                marginRight: "7.5px",
                                borderRadius: "50%",
                              }}
                              src={launchpad.logo}
                              alt={`${launchpad.name} logo`}
                              fallbackSrc={"/empty/unknown.png"}
                            />
                            {launchpad.name}
                          </button>
                        ))}
                      </Menu>
                    )}
                  </>
                );
              })}
            </div>
          </>
        )
      )}
      <button
        className={`${addButtonStyle} w-fit px-3 `}
        onClick={() =>
          dispatch({
            type: ACTIONS.ADD_ELEMENT_TOKENOMICS,
            payload: {
              object: "sales",
              template: {
                name: "",
                date: "",
                valuation: 0,
                price: 0,
                amount: 0,
                platform: "",
              },
            },
          })
        }
      >
        + Add {getNameFromNumber(state.tokenomics.sales.length + 1)} Presale
      </button>
    </>
  );
};
