"use client";
import { Button } from "components/button";
import { SmallFont } from "components/fonts";
import { Input } from "components/input";
import { Cookies } from "js-cookie";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { Key, useContext, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { useAccount } from "wagmi";
import { Popover } from "../../../../../../components/popover";
import { Spinner } from "../../../../../../components/spinner";
import { UserContext } from "../../../../../../contexts/user";
import { triggerAlert } from "../../../../../../lib/toastify";
import { POST } from "../../../../../../utils/fetch";
import { defaultCategories, formatDataForFilters } from "../../../constants";
import { useTop100 } from "../../../context-manager";
import { View } from "../../../models";
import { ACTIONS, maxValue } from "../../../reducer";

interface PopoverTradeProps {
  state: View;
  dispatch: React.Dispatch<unknown>;
  children: JSX.Element[] | JSX.Element | string;
  name: string;
  setTypePopup: React.Dispatch<React.SetStateAction<string>>;
}

export const PopoverTrade = ({
  dispatch,
  children,
  state,
  name,
  setTypePopup,
}: PopoverTradeProps) => {
  const { activeView, setIsLoading, setShowCategories, setActiveView } =
    useTop100();
  const { user, setUser } = useContext(UserContext);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [loadTime, setLoadTime] = useState(false);
  const { address } = useAccount();

  const handleInputChange = (e, time) => {
    dispatch({
      type: ACTIONS.SET_INPUT,
      payload: {
        name: e.target.name,
        value: e.target.value,
        time,
      },
    });
  };

  const editView = (toEdit) => {
    setLoadTime(true);
    setIsPopoverOpen(false);
    POST("/views/update", toEdit)
      .then((r) => r.json())
      .then((r) => {
        if (r.error) {
          triggerAlert("Error", r.error);
          return;
        } else {
          setUser((prev) => ({
            ...prev,
            views: [
              ...(prev?.views?.filter(
                (entry) => entry.name !== activeView?.name
              ) || []),
              r.view[0],
            ],
          }));
          setLoadTime(false);
        }
      });
  };

  const handleBlockchainsChange = (chain: string) => {
    if (!state?.filters?.blockchains?.includes(chain))
      dispatch({
        type: ACTIONS.ADD_BLOCKCHAINS,
        payload: { value: chain },
      });
    else
      dispatch({
        type: ACTIONS.REMOVE_BLOCKCHAINS,
        payload: { value: chain },
      });
  };

  const handleCategoryChange = (category: string) => {
    if (!state.filters.categories?.includes(category))
      dispatch({
        type: ACTIONS.ADD_CATEGORY,
        payload: { value: category },
      });
    else
      dispatch({
        type: ACTIONS.REMOVE_CATEGORY,
        payload: { value: category },
      });
  };

  const newDefault = [...defaultCategories];

  return (
    <Popover
      position="start"
      onToggle={() => setIsPopoverOpen((prev) => !prev)}
      isOpen={isPopoverOpen}
      visibleContent={children}
      hiddenContent={
        isPopoverOpen ? (
          <div className="flex flex-col">
            {name !== "blockchains" && name !== "categories" ? (
              <div className="flex flex-col">
                <Input
                  extraCss="mb-2.5"
                  placeholder={state.filters?.[name]?.from}
                  name={name}
                  onChange={(e) => handleInputChange(e, "from")}
                />
                <Input
                  placeholder={
                    state.filters?.[name]?.to === 100_000_000_000_000_000
                      ? "Any"
                      : state.filters?.[name]?.to
                  }
                  name={name}
                  onChange={(e) => handleInputChange(e, "to")}
                />
              </div>
            ) : null}
            {name === "blockchains" ? (
              <div className="flex flex-col">
                <div className="flex flex-col w-full max-h-[390px] overflow-y-scroll">
                  {Object.keys(blockchainsContent)?.map((chain, i) => {
                    if (!chain) return null;
                    return (
                      <div
                        className={`flex items-center ${
                          i !== 0 ? "mt-[7.5px]" : "mt-0"
                        } ${
                          i ===
                          (Object.keys(blockchainsContent).length || 0) - 1
                            ? "mb-0"
                            : "mb-[7.5px]"
                        }`}
                        key={chain}
                      >
                        <Button
                          className="w-[16px] h-[16px] border-blue max-w-[16px] max-h-[16px] flex items-center justify-center rounded-md border border-light-border-secondary dark:border-dark-border-secondary bg-light-bg-terciary dark:bg-dark-bg-terciary hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover"
                          onClick={() => {
                            handleBlockchainsChange(chain);
                          }}
                        >
                          <BsCheckLg
                            className={`text-xs text-light-font-100 dark:text-dark-font-100 ${
                              state?.filters?.blockchains?.includes(chain)
                                ? "opacity-100"
                                : "opacity-0"
                            }`}
                          />
                        </Button>
                        <img
                          className="ml-[15px] rounded-full w-[25px] h-[25px] min-w-[25px] min-h-[25px] mr-2.5"
                          src={
                            blockchainsContent[chain]?.logo ||
                            `/logo/${chain.toLowerCase().split(" ")[0]}.png`
                          }
                          alt={`${chain} logo`}
                        />
                        <SmallFont extraCss="mr-2.5 whitespace-nowrap">
                          {chain}
                        </SmallFont>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
            {name === "categories" ? (
              <div className="flex flex-wrap w-full">
                {newDefault
                  ?.sort((entry) =>
                    state.filters?.categories?.includes(entry) ? -1 : 1
                  )
                  ?.filter((_, i) => i < 5)
                  .map((categorie) => (
                    <Button
                      extraCss={`rounded-2xl mt-[7.5px] h-[30px] mr-[7.5px] ${
                        state.filters.categories?.includes(categorie)
                          ? "bg-light-bg-hover dark:bg-dark-bg-hover"
                          : "bg-light-bg-terciary dark:bg-dark-bg-terciary"
                      } `}
                      onClick={() => handleCategoryChange(categorie)}
                      key={categorie as Key}
                    >
                      <SmallFont>{categorie}</SmallFont>
                      {state.filters.categories?.includes(categorie) ? (
                        <AiOutlineClose className="text-[9px] ml-[5px]" />
                      ) : null}
                    </Button>
                  ))}
                <Button
                  extraCss="rounded-2xl mt-[7.5px] h-[30px] mr-[7.5px]"
                  onClick={() => {
                    setTypePopup("edit");
                    setShowCategories(true);
                  }}
                >
                  <SmallFont>See all</SmallFont>
                </Button>
              </div>
            ) : null}
            <div className="flex mt-2.5">
              <Button
                extraCss="w-1/2 flex items-center h-[40px] sm:h-[35px]"
                onClick={() => {
                  setIsLoading(true);
                  setLoadTime(true);

                  const commonFilters = {
                    ...state.filters,
                    [name]: { from: 0, to: maxValue },
                  };

                  let newFilters = {};
                  let edit = false;

                  switch (name) {
                    case "categories":
                      dispatch({ type: ACTIONS.RESET_CATEGORY });
                      newFilters = {
                        ...commonFilters,
                        [name]: defaultCategories,
                      };
                      edit = true;
                      break;
                    case "blockchains":
                      dispatch({ type: ACTIONS.RESET_BLOCKCHAINS });
                      newFilters = {
                        ...commonFilters,
                        [name]: Object.keys(blockchainsContent),
                      };
                      edit = true;
                      break;
                    default:
                      dispatch({
                        type: ACTIONS.RESET_FILTER,
                        payload: { name },
                      });
                      if (activeView?.name === "All") {
                        newFilters = commonFilters;
                      } else {
                        newFilters = commonFilters;
                        edit = true;
                      }
                      break;
                  }

                  setActiveView({
                    ...state,
                    filters: newFilters,
                    isFirst: false,
                  });
                  if (activeView?.name === "All") {
                    const activeViewStr = formatDataForFilters(
                      {
                        ...state,
                        name: "All",
                        filters: newFilters,
                        isFirst: false,
                      },
                      state
                    );
                    Cookies.set(`view-${address}`, activeViewStr, {
                      secure: process.env.NODE_ENV !== "development",
                      sameSite: "strict",
                    });
                  }
                  if (edit && activeView?.name !== "All") {
                    const { id } = activeView;
                    editView({
                      account: user?.address,
                      user_id: user?.id,
                      color: state.color,
                      name: state.name,
                      is_favorite: state.is_favorite,
                      display: state.display,
                      filters: newFilters,
                      id,
                    });
                  }
                }}
              >
                Reset
              </Button>
              <Button
                extraCss="w-1/2 flex items-center h-[40px] sm:h-[35px] border-blue mb-0 ml-[5px]"
                onClick={() => {
                  if (!activeView) return;
                  setIsLoading(true);
                  setLoadTime(true);
                  if (activeView.name === "All") {
                    setActiveView({ ...state, name: "All", isFirst: false });
                    if (!user || !activeView) return;
                    const activeViewStr = formatDataForFilters(
                      { ...state, name: "All", isFirst: false },
                      state
                    );
                    Cookies.set(`view-${address}`, activeViewStr, {
                      secure: process.env.NODE_ENV !== "development",
                      sameSite: "strict",
                    });
                    setLoadTime(false);
                    setIsPopoverOpen(false);
                  } else if (activeView.name !== "All") {
                    const { id } = activeView;
                    setActiveView({
                      ...activeView,
                      color: state.color,
                      name: state.name,
                      is_favorite: state.is_favorite,
                      display: state.display,
                      filters: state.filters,
                    });
                    editView({
                      account: user?.address,
                      user_id: user?.id,
                      color: state.color,
                      name: state.name,
                      is_favorite: state.is_favorite,
                      display: state.display,
                      filters: state.filters,
                      id,
                    });
                  }
                }}
              >
                {loadTime ? (
                  <Spinner extraCss="w-[20px] h-[20px] mr-[7.5px]" />
                ) : null}
                Apply
              </Button>{" "}
            </div>
          </div>
        ) : null
      }
    />
  );
};
