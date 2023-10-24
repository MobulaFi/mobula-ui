/* eslint-disable import/no-extraneous-dependencies */
"use client";
import { Button, Flex, Icon } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { useRouter, useSearchParams } from "next/navigation";
import {
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
import { TextSmall } from "../../../../components/fonts";
import { PopupUpdateContext } from "../../../../contexts/popup";
import { UserContext } from "../../../../contexts/user";
import { Asset } from "../../../../interfaces/assets";
import { useColors } from "../../../../lib/chakra/colorMode";
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
  const { text80, text60, borders, bgTable, hover, boxBg6 } = useColors();
  const [typePopup, setTypePopup] = useState("");
  const { user } = useContext(UserContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
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
        color: "blue",
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
            <Button
              my="10px"
              variant="outlined_grey"
              px={["8px", "12px"]}
              mr="10px"
              borderRadius="4px"
              h={["30px", "30px", "30px", "35px"]}
            >
              <TextSmall mr="7.5px" fontWeight="500" color={text80}>
                {formatName(key)}
              </TextSmall>
              |
              <TextSmall ml="7.5px" color={text60}>
                {filterFromType(key, filter)}
              </TextSmall>
            </Button>
          </PopoverTrade>
        )),
    [typePopup, state.filters, activeView]
  );

  console.log("activeView", activeView);

  return (
    <Flex w="100%" bg={bgTable} direction="column">
      <Flex
        direction="column"
        maxWidth="1300px"
        w={["97%", "95%", "90%", "90%"]}
        mx="auto"
        borderTop={borders}
        borderBottom={borders}
        overflowX="scroll"
        className="scroll"
        css={{
          scrollBehavior: "smooth",
        }}
      >
        <Flex justify="space-between" w="100%" mb="10px">
          <Flex
            w="fit-content"
            maxW="calc(90% - 40px)"
            position="relative"
            ref={scrollContainer}
            overflowX="scroll"
            className="scroll"
            css={{
              scrollBehavior: "smooth",
            }}
          >
            {buttonTemplate.map((content, i) => (
              <Button
                variant="outlined_grey"
                mr={i === (buttonTemplate?.length || 1) - 1 ? "0px" : "10px"}
                mt="10px"
                key={`${content.name}${buttonTemplate[i - 1]?.name}`}
                h={["30px", "30px", "30px", "35px"]}
                px={["8px", "12px"]}
                borderRadius="4px"
                fontWeight="500"
                bg={activeView?.name === content?.name ? hover : boxBg6}
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
                <Flex
                  bg={content?.color || "grey"}
                  boxSize="10px"
                  minW="10px"
                  borderRadius="full"
                  mr="7.5px"
                />
                {content?.name}
              </Button>
            ))}
            <Flex
              mt="10px"
              position="sticky"
              right="0px"
              pl="10px"
              bg={bgTable}
            >
              <Button
                isDisabled={!isConnected && activeView?.name !== "All"}
                variant="outlined_grey"
                h={["30px", "30px", "30px", "35px"]}
                w={["30px", "30px", "30px", "35px"]}
                borderRadius="4px"
                onClick={() => {
                  if (isConnected) setTypePopup("create");
                  else setConnect(true);
                }}
              >
                +
              </Button>
              {showArrow ? (
                <Button
                  ml="10px"
                  onClick={handleClick}
                  borderRadius="0px"
                  display={!isConnected ? "none" : "flex"}
                >
                  <Icon as={FaChevronRight} color={text80} />
                </Button>
              ) : null}
            </Flex>
          </Flex>
          <Flex w="fit-content" ml="10px" mt="10px">
            {/* <Button variant="outlined_grey" mr="10px">
              <Icon as={MdiShareVariantOutline} color={text80} />
            </Button> */}
            {activeView?.name !== "Portfolio" ? (
              <Button
                h={["30px", "30px", "30px", "35px"]}
                px={["8px", "12px"]}
                variant="outlined_grey"
                borderRadius="4px"
                onClick={() => {
                  pushData("Edit View clicked");
                  if (isConnected) setTypePopup("edit");
                  else setConnect(true);
                }}
              >
                Edit view
              </Button>
            ) : null}
          </Flex>
        </Flex>
      </Flex>
      {activeView && activeView?.name !== "Portfolio" ? (
        <Flex
          maxWidth="1300px"
          w={["97%", "95%", "90%", "90%"]}
          mx="auto"
          overflowX="scroll"
          className="scroll"
          justify="space-between"
        >
          <Flex align="center" w="fit-content">
            {/* ||
            (JSON.stringify(defaultTop100.display) !==
              JSON.stringify(state.display) &&
              isConnected) */}
            {callBackPopoverFilters()}
            {JSON.stringify(defaultTop100.filters) !==
              JSON.stringify(state.filters) && isConnected ? (
              <>
                <Button
                  my="10px"
                  variant="outlined_grey"
                  px={["8px", "12px"]}
                  mr="10px"
                  borderRadius="4px"
                  boxSize={["30px", "30px", "30px", "35px"]}
                  onClick={() => {
                    setActiveDisplay("filters");
                    setTypePopup("edit");
                  }}
                >
                  +
                </Button>
                {/* <Button
                  my="10px"
                  variant="outlined_grey"
                  px={["8px", "12px"]}
                  ml="auto"
                  mr="10px"
                  borderRadius="4px"
                  h={["30px", "30px", "30px", "35px"]}
                  onClick={() => {
                    setActiveDisplay("display");
                    setTypePopup("edit");
                  }}
                >
                  Change Display
                </Button> */}
              </>
            ) : null}
          </Flex>
        </Flex>
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
    </Flex>
  );
};
