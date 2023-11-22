import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { LargeFont, MediumFont } from "../../../../../components/fonts";
import { Menu } from "../../../../../components/menu";
import { ILaunchpad } from "../../../../../interfaces/launchpads";
import { createSupabaseDOClient } from "../../../../../lib/supabase";
import { ACTIONS } from "../../reducer";
import { inputStyle } from "../../styles";
import { getInfoFromIndex, getNameFromNumber } from "../../utils";

export const Sales = ({ dispatch, state }) => {
  const [launchpads, setLaunchpads] = useState<ILaunchpad[]>([]);
  const [activePlateform, setActivePlateform] = useState<ILaunchpad>(
    {} as ILaunchpad
  );

  const addButtonStyle =
    "flex items-center w-[120px]h-[35px] mt-2.5 text-base hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover  lg:text-sm md:text-xs bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary";

  function formatDate(timestamp: number) {
    return new Date(timestamp).getTime();
  }

  useEffect(() => {
    const supabase = createSupabaseDOClient();
    supabase
      .from("launchpads")
      .select("*")
      .then(({ data, error }) => {
        if (error) console.error(error);
        else
          setLaunchpads([
            ...data,
            { name: "Other", logo: "/icon/unknown.png" },
          ]);
      });
  }, []);

  return (
    <>
      <LargeFont extraCss="mt-[30px] pt-5">Presale(s)</LargeFont>
      {state.tokenomics.sales.map((d, i) => (
        <>
          <div
            className={`flex justify-between ${i !== 0 ? "mt-[50px]" : "mt-5"}`}
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
              const { placeholder, title, type } = getInfoFromIndex(j);
              return (
                <>
                  <MediumFont extraCss="mb-2.5">{title}</MediumFont>
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
                        else if (entry === "date")
                          value = formatDate(Number(e.target.value));
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
                      title={
                        <div className="flex items-center h-full">
                          {d.platform ? (
                            <img
                              className="mr-[7.5px] w-5 h-5 md:w-[18px] md:h-[18px] rounded-full"
                              src={activePlateform.logo || "/icon/unknown.png"}
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
                          className="flex items-center bg-light-bg-terciary dark:bg-dark-bg-terciary"
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
                          <img
                            className="mr-[7.5px] w-5 h-5 md:w-[18px] md:h-[18px] rounded-full"
                            src={launchpad.logo || "/icon/unknown.png"}
                            alt={`${launchpad.name} logo`}
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
      ))}
      <button
        className={`${addButtonStyle} mt-2.5 w-fit px-3 `}
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
