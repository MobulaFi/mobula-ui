/* eslint-disable import/no-extraneous-dependencies */
"use client";
import Cookies from "js-cookie";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { useParams, useRouter } from "next/navigation";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { FaChevronRight } from "react-icons/fa";
import { useAccount } from "wagmi";
import { Button } from "../../../../components/button";
import { SmallFont } from "../../../../components/fonts";
import { PopupUpdateContext } from "../../../../contexts/popup";
import { UserContext } from "../../../../contexts/user";
import { Asset } from "../../../../interfaces/assets";
import { pushData } from "../../../../lib/mixpanel";
import { GET } from "../../../../utils/fetch";
import { PopoverTrade } from "../components/popup/popover";
import { ViewPopup } from "../components/popup/views";
import { defaultCategories, defaultTop100, formatName } from "../constants";
import { useTop100 } from "../context-manager";
import { View } from "../models";
import { ACTIONS, INITIAL_VALUE, maxValue, reducer } from "../reducer";
import { filterFromType, unformatActiveView } from "../utils";

export const Views = ({ cookieTop100, actualView, setResultsData }) => {
  const [typePopup, setTypePopup] = useState("");
  const { user } = useContext(UserContext);
  const router = useRouter();
  const params = useParams();
  const page = params.page;
  const {
    activeView,
    setActiveView,
    setIsPortfolioLoading,
    setIsLoading,
    portfolio,
    setPortfolio,
  } = useTop100();
  const scrollContainer = useRef(null);
  const [state, dispatch] = useReducer(reducer, activeView || INITIAL_VALUE);
  const { isConnected } = useAccount();
  const { setConnect } = useContext(PopupUpdateContext);
  const { address } = useAccount();
  const [activeDisplay, setActiveDisplay] = useState("display");
  const [showArrow, setShowArrow] = useState(false);

  const formatDataForFilters = () => {
    let activeViewStr = "";
    const newStr = [];
    const { blockchains } = activeView.filters;
    const defaultBlockchains = Object.keys(blockchainsContent);
    const { categories } = activeView.filters;

    activeViewStr += activeView?.id ? `(${activeView?.id})` : "";
    activeViewStr += `(${activeView?.color})`;
    activeViewStr += `(${activeView?.name})`;
    activeViewStr += `(${activeView?.is_favorite})`;

    Object.keys(activeView?.display).forEach((key) => {
      newStr.push(`${activeView?.display[key]?.value}`);
    });
    activeViewStr += `(display:${JSON.stringify(newStr)})`;

    Object.keys(activeView?.filters).forEach((key) => {
      if (key !== "blockchains" && key !== "categories") {
        const diffThanMin = activeView?.filters[key]?.from !== 0;
        const diffThanMax = activeView?.filters[key]?.to !== maxValue;
        if (diffThanMin || diffThanMax) {
          activeViewStr += `(${key}:${
            diffThanMin ? activeView?.filters[key]?.from : "_"
          }|${diffThanMax ? activeView?.filters[key]?.to : "_"})`;
        }
      }
      if (
        key === "blockchains" &&
        defaultBlockchains.length !== blockchains.length
      ) {
        const diffChains = [];
        const activeViewBlockchainsLength = blockchains.length;
        const blockchainsContentLength = defaultBlockchains.length;
        const diffLength =
          blockchainsContentLength - activeViewBlockchainsLength;

        if (activeViewBlockchainsLength > diffLength) {
          defaultBlockchains.forEach((chain) => {
            blockchains.forEach(() => {
              if (
                !blockchains.includes(chain) &&
                !diffChains.includes(defaultBlockchains.indexOf(chain))
              )
                diffChains.push(defaultBlockchains.indexOf(chain));
            });
          });
          activeViewStr += `(blockchains0:${JSON.stringify(diffChains)})`;
        } else {
          blockchains.forEach((blockchain) => {
            diffChains.push(defaultBlockchains.indexOf(blockchain));
          });
          activeViewStr += `(blockchains1:${JSON.stringify(diffChains)})`;
        }
      }
      if (
        key === "categories" &&
        activeView.filters.categories.length !== defaultCategories?.length
      ) {
        const activeViewCategorieLength = categories.length;
        const defaultCategorieLength = defaultCategories.length;
        const diffLength = defaultCategorieLength - activeViewCategorieLength;
        const diffCategories = [];

        if (activeViewCategorieLength > diffLength) {
          defaultCategories.forEach((categorie) => {
            categories.forEach(() => {
              if (
                !categories.includes(categorie) &&
                !diffCategories.includes(categorie)
              ) {
                diffCategories.push(defaultCategories.indexOf(categorie));
              }
            });
          });
          activeViewStr += `(categories0:${JSON.stringify(diffCategories)})`;
        } else {
          const newCategories = state?.filters?.categories?.map((categorie) =>
            defaultCategories.indexOf(categorie)
          );
          activeViewStr += `(categories1:${JSON.stringify(newCategories)})`;
        }
      }
    });
    return activeViewStr;
  };

  const setViewCookies = () => {
    if (!user || !activeView || !isConnected) return;
    const activeViewStr = formatDataForFilters();
    Cookies.set("actual-view", activeViewStr, {
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });
  };

  const setViewAllCookie = () => {
    if (!isConnected || !user || !activeView) return;
    const activeViewStr = formatDataForFilters();
    Cookies.set(`view-${address}`, activeViewStr, {
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });
  };

  const handleResize = useCallback(() => {
    if (scrollContainer.current) {
      const containerWidth = scrollContainer.current.offsetWidth;
      const { scrollWidth } = scrollContainer.current;
      const threshold = 20;
      setShowArrow(scrollWidth - containerWidth > threshold);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    if (
      user &&
      activeView?.name !== "Portfolio" &&
      isConnected &&
      !activeView?.disconnected &&
      activeView?.filters
    )
      setViewCookies();
    if (
      user &&
      activeView?.name === "All" &&
      isConnected &&
      !activeView?.disconnected &&
      activeView?.filters
    )
      setViewAllCookie();
  }, [user, activeView, isConnected, state]);

  useEffect(() => {
    if (
      address &&
      activeView?.name === "Portfolio" &&
      portfolio?.length === 0
    ) {
      setIsPortfolioLoading(true);
      GET("/api/1/wallet/holdings", {
        account: address,
        cached: true,
        asset_data: true,
      })
        .then((r) => r.json())
        .then((res) => {
          if (res) setPortfolio(res.data);
          setIsPortfolioLoading(false);
        });
    }

    if (activeView?.name === "Portfolio" && portfolio) {
      setResultsData({ count: portfolio.length, data: portfolio });
    }

    if (isConnected) {
      if (activeView?.display)
        dispatch({
          type: ACTIONS.SET_USER_VALUE,
          payload: { value: activeView },
        });
      else
        dispatch({
          type: ACTIONS.SET_USER_VALUE,
          payload: { value: INITIAL_VALUE },
        });
    }
  }, [activeView, portfolio, user]);

  const handleClick = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollLeft += 400;
    }
  };

  const getButtonTemplate = (): View[] => {
    const template: View[] = [
      {
        color: "bg-blue dark:bg-blue",
        name: "Portfolio",
        filters: {
          tokens: portfolio as Asset[],
        },
      },
    ];

    if (isConnected) {
      const cookieView =
        cookieTop100 ||
        unformatActiveView(
          Cookies.get(`view-${address}`) || null,
          "all",
          actualView,
          address
        );
      if (cookieView && Object.keys(cookieView).length) {
        template.push(cookieView);
      } else {
        template.push({ ...defaultTop100, color: "grey", name: "All" });
      }

      if (user?.views?.length > 0) {
        const sortedViews = user.views.sort((itemA, itemB) =>
          // eslint-disable-next-line no-nested-ternary
          itemA.is_favorite && !itemB.is_favorite
            ? -1
            : !itemA.is_favorite && itemB.is_favorite
            ? 1
            : 0
        );
        template.push(...sortedViews);
      }
    } else {
      template.push({ ...defaultTop100, color: "grey", name: "All" });
    }

    return template;
  };

  const buttonTemplate = useMemo(
    () => getButtonTemplate(),
    [isConnected, cookieTop100, user, activeView]
  );

  useEffect(() => {
    if (Cookies.get("address") !== address)
      Cookies.set("address", address, {
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
      });

    if ((activeView ? Object.keys(activeView) : [])?.length === 0) {
      const storedView = unformatActiveView(
        Cookies.get(`view-${address}`) || null,
        "all",
        actualView,
        address
      );
      setActiveView(
        storedView
          ? { ...storedView, isFirst: false, disconnected: false }
          : {
              ...defaultTop100,
              color: "grey",
              name: "All",
              isFirst: false,
              disconnected: false,
            }
      );
    }
    if (isConnected && activeView?.disconnected && !activeView?.isFirst)
      setIsLoading(true);
    if ((activeView?.name === "All" && !page) || activeView?.disconnected) {
      if (!activeView?.isFirst) setIsLoading(true);

      if (isConnected) {
        if (activeView?.disconnected) {
          const storedView = unformatActiveView(
            Cookies.get(`view-${address}`) || null,
            "all",
            actualView,
            address
          );
          setActiveView(
            storedView
              ? { ...storedView, isFirst: false, disconnected: false }
              : {
                  ...defaultTop100,
                  color: "grey",
                  name: "All",
                  isFirst: false,
                  disconnected: false,
                }
          );
        } else if (cookieTop100)
          setActiveView({ ...cookieTop100, disconnected: false });
      }
      if (isConnected === false && !activeView?.disconnected)
        setActiveView({
          ...defaultTop100,
          color: "grey",
          name: "All",
          disconnected: true,
          isFirst: false,
        });
    } else if (isConnected === false && !activeView?.disconnected) {
      setIsLoading(true);
      setActiveView({
        ...defaultTop100,
        color: "grey",
        name: "All",
        disconnected: true,
        isFirst: false,
      });
    }
  }, [isConnected]);

  const callBackPopoverFilters = useCallback(
    () =>
      Object.entries(activeView.filters || {})
        .filter(
          ([key, filter]) =>
            (key !== "blockchains" &&
              key !== "categories" &&
              (filter?.from !== 0 || filter?.to !== 100_000_000_000_000_000)) ||
            (key === "blockchains" &&
              filter.length !== Object.keys(blockchainsContent).length) ||
            (key === "categories" &&
              filter.length !== defaultCategories?.length)
        )
        .map(([key, filter]) => (
          <PopoverTrade
            name={key}
            key={key}
            dispatch={dispatch}
            state={state}
            setTypePopup={setTypePopup}
          >
            <Button extraCss="mb-2.5 mr-2.5">
              <SmallFont extraCss="mr-[7.5px] text-light-font-100 dark:text-dark-font-100 font-medium whitespace-nowrap">
                {formatName(key)}
              </SmallFont>
              |
              <SmallFont extraCss="ml-[7.5px] text-light-font-60 dark:text-dark-font-60  whitespace-nowrap">
                {filterFromType(key, filter)}
              </SmallFont>
            </Button>
          </PopoverTrade>
        )),
    [typePopup, state.filters, activeView]
  );

  return (
    <div className="w-full bg-light-bg-table dark:bg-dark-bg-table flex flex-col">
      <div className="flex flex-col max-w-[1300px] w-[90%] md:w-[95%] sm:w-[97%] mx-auto border-t border-b border-light-border-primary dark:border-dark-border-primary scroll overflow-x-scroll scroll-smooth">
        <div className="flex justify-between w-full mb-2.5">
          <div className="flex w-fit max-w-[calc(90% - 40px)] relative overflow-x-scroll scroll">
            {buttonTemplate.map((content, i) => (
              <Button
                extraCss={`${
                  i === (buttonTemplate?.length || 1) - 1 ? "me-0" : "me-2.5"
                } mt-2.5 font-medium ${
                  activeView?.name === content.name
                    ? "bg-light-bg-hover dark:bg-dark-bg-hover border-light-border-secondary dark:border-dark-border-secondary"
                    : ""
                }`}
                key={`${content.name}${buttonTemplate[i - 1]?.name}`}
                onClick={() => {
                  setIsLoading(true);
                  if (content.name === "Portfolio") {
                    if (isConnected) {
                      pushData("Active View", { name: "Portfolio" });
                      setActiveView({
                        color: "blue",
                        name: "Portfolio",
                        filters: {
                          tokens: portfolio,
                        },
                      });
                    } else {
                      setConnect(true);
                      setActiveView({
                        ...defaultTop100,
                        color: "grey",
                        name: "All",
                        isFirst: false,
                        disconnected: true,
                      });
                    }
                  } else {
                    if (page) router.replace("/");
                    setActiveView({ ...content, isFirst: false });
                    pushData("Active View", { name: "Other View" });
                  }
                }}
              >
                {content.name === "Portfolio" ? null : (
                  <div
                    className="w-2.5 h-2.5 min-w-2.5 rounded-full mr-[7.5px]"
                    style={{
                      background: content?.color || "grey",
                    }}
                  />
                )}
                {content?.name}
              </Button>
            ))}
            <div className="mt-2.5 sticky right-0 pl-2.5 flex bg-light-bg-table dark:bg-dark-bg-table">
              <Button
                isDisabled={!isConnected && activeView?.name !== "All"}
                extraCss="w-[35px] h-[35px] p-0"
                onClick={() => {
                  if (isConnected) setTypePopup("create");
                  else setConnect(true);
                }}
              >
                +
              </Button>
              {showArrow ? (
                <button
                  className={`ml-2.5 ${!isConnected ? "hidden" : "flex"}`}
                  onClick={handleClick}
                >
                  <FaChevronRight className="text-light-font-100 dark:text-dark-font-100" />
                </button>
              ) : null}
            </div>
          </div>
          <div className="flex w-fit ml-2.5 mt-2.5">
            {activeView?.name !== "Portfolio" ? (
              <Button
                extraCss="px-3 sm:px-2"
                onClick={() => {
                  pushData("Edit View clicked");
                  if (isConnected) setTypePopup("edit");
                  else setConnect(true);
                }}
              >
                Edit view
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      {activeView && activeView?.name !== "Portfolio" ? (
        <div className="max-w-[1300px] w-[90%] md:w-[95%] sm:w-[97%] mx-auto flex justify-between ">
          <div className="flex w-fit items-center flex-wrap pt-2.5">
            {callBackPopoverFilters()}
            {JSON.stringify(defaultTop100.filters) !==
              JSON.stringify(state.filters) && isConnected ? (
              <Button
                extraCss="mb-2.5 mr-2.5"
                onClick={() => {
                  setActiveDisplay("filters");
                  setTypePopup("edit");
                }}
              >
                +
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}
      {typePopup ? (
        <ViewPopup
          type={typePopup}
          setType={setTypePopup}
          state={state}
          dispatch={dispatch}
          activeDisplay={activeDisplay}
          setActiveDisplay={setActiveDisplay}
        />
      ) : null}
    </div>
  );
};
