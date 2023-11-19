/* eslint-disable react/display-name */
import { ArrowBackIcon, CloseIcon } from "@chakra-ui/icons";
import { Icon, IconProps, Spinner } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AiFillStar, AiOutlineClose, AiOutlineStar } from "react-icons/ai";
import { BsCheckLg, BsChevronDown, BsTrash3 } from "react-icons/bs";
import { PiDotsNineBold } from "react-icons/pi";
import { ReactSortable } from "react-sortablejs";
import { useAccount } from "wagmi";
import { Accordion as AccordionCustom } from "../../../../../../components/accordion";
import { Button } from "../../../../../../components/button";
import { MediumFont, SmallFont } from "../../../../../../components/fonts";
import {
  Input,
  Input as InputCustom,
} from "../../../../../../components/input";
import { ModalContainer } from "../../../../../../components/modal-container";
import { PopupUpdateContext } from "../../../../../../contexts/popup";
import { UserContext } from "../../../../../../contexts/user";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { pushData } from "../../../../../../lib/mixpanel";
import { GET, POST } from "../../../../../../utils/fetch";
import { getFormattedAmount } from "../../../../../../utils/formaters";
import {
  colors,
  defaultCategories,
  defaultTop100,
  displays,
  filters,
  formatDataForFilters,
} from "../../../constants";
import { useTop100 } from "../../../context-manager";
import { View } from "../../../models";
import { ACTIONS, INITIAL_VALUE } from "../../../reducer";
import { unformatActiveView } from "../../../utils";
import { Tutorial } from "../tuto";
import { ColorPopover } from "./ui/color-popover";

const CustomComponent = forwardRef<HTMLDivElement, any>((props, ref) => (
  <div ref={ref} style={{ display: "flex", flexWrap: "wrap" }}>
    {props.children}
  </div>
));

interface ViewPopupProps {
  state: View;
  dispatch: React.Dispatch<unknown>;
  type: string;
  setType: Dispatch<SetStateAction<string>>;
  activeDisplay: string;
  setActiveDisplay: Dispatch<SetStateAction<string>>;
}

export const ViewPopup = ({
  type,
  setType,
  state,
  dispatch,
  activeDisplay,
  setActiveDisplay,
}: ViewPopupProps) => {
  const {
    boxBg3,
    borders,
    bordersActive,
    text40,
    text60,
    boxBg6,
    hover,
    text80,
  } = useColors();
  const [isStarHover, setIsStarHover] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [showTuto, setShowTuto] = useState(false);
  const [showColorPopover, setShowColorPopover] = useState(false);
  const {
    activeView,
    setActiveView,
    setIsLoading,
    setShowCategories,
    showCategories,
    activeStep,
  } = useTop100();
  const { address } = useAccount();
  // const alert = useAlert();
  const { isConnected } = useAccount();
  const { setConnect } = useContext(PopupUpdateContext);
  const maxValue = 100_000_000_000_000_000;
  const [isViewsLoading, setIsViewsLoading] = useState(false);
  const [dragNdrop, setDragNdrop] = useState<
    { type: string; value: string; id: number }[]
  >(
    state?.display?.map((item, index) => ({
      ...item,
      id: index + 1,
    })) || []
  );

  useEffect(() => {
    if (type === "edit" && user?.views?.length > 0)
      dispatch({
        type: ACTIONS.SET_USER_VALUE,
        payload: { value: activeView },
      });
    if (
      (type === "create" && user?.views?.length > 0) ||
      (type === "create" && activeView?.name === "All")
    )
      dispatch({
        type: ACTIONS.SET_USER_VALUE,
        payload: { value: INITIAL_VALUE },
      });
  }, [type]);

  const getTitleFromType = () => {
    if (type === "create") return " filter & view";
    return activeView?.name;
  };

  const getStarIconFromActiveView = () => {
    if (isStarHover && state.is_favorite)
      return {
        fill: 0,
        outline: 1,
        color: text80,
      };
    if (!isStarHover && state.is_favorite)
      return {
        fill: 1,
        outline: 0,
        color: "yellow",
      };
    if (isStarHover && !state.is_favorite)
      return {
        fill: 1,
        outline: 0,
        color: "yellow",
      };
    return {
      fill: 0,
      outline: 1,
      color: text80,
    };
  };

  const defaultColor = state.color || colors[0];

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    time: string
  ) => {
    dispatch({
      type: ACTIONS.SET_INPUT,
      payload: {
        name: e.target.name,
        value: e.target.value,
        time,
      },
    });
  };

  const handleDisplayChange = (entry, name) => {
    const isEntryInDisplay =
      state.display?.filter((item) => item.value === entry) || [];
    if (isEntryInDisplay?.length === 0)
      dispatch({
        type: ACTIONS.ADD_DISPLAY,
        payload: { type: name, value: entry },
      });
    else dispatch({ type: ACTIONS.REMOVE_DISPLAY, payload: { value: entry } });
  };

  const handleBasicInputChange = (e) => {
    dispatch({
      type: ACTIONS.SET_BASIC_INPUT,
      payload: { name: "name", value: e.target.value },
    });
  };

  const handleBlockchainsChange = (chain: string) => {
    if (!state.filters.blockchains.includes(chain))
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

  const createView = () => {
    setIsViewsLoading(true);
    POST("/views/create", {
      account: user?.address,
      user_id: user?.id,
      color: state.color,
      name: state.name,
      is_favorite: state.is_favorite,
      display: state.display,
      filters: state.filters,
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.error) {
          return;
          //  alert.error(r.error);
        } else {
          setUser((prev) => ({
            ...prev,
            views: [...(user?.views || []), r.view[0]],
          }));
          setActiveView(r.view[0]);
          setType("");
          setIsViewsLoading(false);
        }
      });
  };

  const editView = (): void => {
    setIsViewsLoading(true);
    const { id } = activeView;
    setActiveView({
      ...activeView,
      color: state.color,
      name: state.name,
      is_favorite: state.is_favorite,
      display: state.display,
      filters: state.filters,
    });
    setType("");
    POST("/views/update", {
      account: user?.address,
      user_id: user?.id,
      color: state.color,
      name: state.name,
      is_favorite: state.is_favorite,
      display: state.display,
      filters: state.filters,
      id,
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.error) {
          return;
          // alert.error(r.error);
        } else {
          setUser((prev) => ({
            ...prev,
            views: [
              ...(prev.views?.filter(
                (entry) => entry.name !== activeView?.name
              ) || []),
              r.view[0],
            ],
          }));
          setIsViewsLoading(false);
        }
      });
  };

  const removeView = () => {
    setIsViewsLoading(true);
    pushData("View popup", {
      action: "delete",
    });
    const { id } = activeView;
    if (user)
      GET("/views/remove", {
        account: user.address,
        id,
      })
        .then((r) => r.json())
        .then((r) => {
          if (r.error) {
            return;
            //  alert.error(r.error);
          } else {
            setUser((prev) => ({
              ...prev,
              views: user?.views.filter(
                (entry) => entry.name !== activeView?.name
              ),
            }));
            setType("");
            setActiveView(
              JSON.stringify(user?.views[0]) !== JSON.stringify(activeView)
                ? user?.views[0]
                : unformatActiveView(
                    Cookies.get(`view-${user?.address}`) || null,
                    "all",
                    JSON.stringify(defaultTop100),
                    user?.address
                  )
            );
            setIsViewsLoading(false);
          }
        });
    // else alert.info('You should be connected to be able to remove a view');
  };

  const getRenderForFilters = useCallback(
    (filter: { name: string; title: string; icon: IconProps }) => {
      if (filter.name === "blockchains") {
        return (
          <div className="flex items-center h-fit">
            {state.filters[filter.name]
              ?.filter((_, i) => i < 7)
              ?.map((item) => (
                <img
                  className="w-[20px] h-[20px] rounded-full ml-[-5px] bg-light-bg-hover dark:bg-dark-bg-hover"
                  key={item}
                  alt={blockchainsContent[item]?.name}
                  src={
                    blockchainsContent[item]?.logo ||
                    `/logo/${
                      blockchainsContent[item]?.name
                        ?.toLowerCase()
                        .split(" ")[0]
                    }.png`
                  }
                />
              ))}
          </div>
        );
      }
      if (filter.name === "categories") {
        return (
          <SmallFont className="text-blue text-medium">
            {state.filters[filter.name]?.length} categories
          </SmallFont>
        );
      }

      const { from, to } = state.filters[filter.name] || {
        from: 0,
        to: maxValue,
      };
      let valueMax: number | string = maxValue;
      if (to === maxValue) valueMax = "Any";
      else valueMax = getFormattedAmount(to);

      if (to !== maxValue || from !== 0)
        return (
          <SmallFont className="text-blue text-medium">
            {getFormattedAmount(from)} - {valueMax}
          </SmallFont>
        );
      return null;
    },
    [state.filters]
  );

  const checkSameNameExist = () => {
    if (!user) return false;
    if (user?.views?.length > 0 && type === "create") {
      const alreadyExist = user
        ? user.views.find((view) => view.name === state.name)
        : false;
      // if (alreadyExist)
      //   alert.error(
      //     'You already have a view with this name. Please change it and retry',
      //   );
      return alreadyExist;
    }
    if (state.name !== "All" && activeView?.name === "All" && type === "edit") {
      // alert.error("Can't change the name of this view.");
      return true;
    }
    return false;
  };

  const resetButtonStyle = {
    w: "fit-content",
    mt: "10px",
    fontSize: ["12px", "12px", "13px", "14px"],
    fontWeight: "400",
    color: { text40 },
    transition: "all 250ms ease-in-out",
    _hover: { color: text80 },
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

  const [searchCategorie, setSearchCategorie] = useState("");
  const filteredCategories = defaultCategories.filter((entry) => {
    if (searchCategorie === "") return true;
    return entry.toLowerCase().includes(searchCategorie.toLowerCase());
  });

  useEffect(() => {
    if (!localStorage.getItem("showTutoViews")) setShowTuto(true);
  }, []);

  useEffect(() => {
    if (!state.display) return;
    if (state.display.length !== dragNdrop.length)
      setDragNdrop(
        state.display.map((item, index) => ({
          ...item,
          id: index + 1,
        }))
      );
  }, [state.display]);

  const newDefault = [...defaultCategories];
  const ReactSortableAny = ReactSortable as any;

  return (
    <ModalContainer
      title={
        type.slice(0, 1).toUpperCase() +
        type.slice(1) +
        " " +
        getTitleFromType()
      }
      extraCss="max-w-[480px]"
      isOpen={type !== ""}
      onClose={() => setType("")}
    >
      {showTuto ? (
        <div className="flex flex-col w-full h-full bg-light-bg-secondary dark:bg-dark-bg-secondary z-[2] absolute top-0 left-0 rounded-xl opacity-80" />
      ) : null}
      {showTuto ? (
        <Tutorial
          setShowTuto={setShowTuto}
          setActiveDisplay={setActiveDisplay}
        />
      ) : null}
      {showCategories ? (
        <div className="scroll flex flex-col ">
          <div className="flex justify-between w-full items-center mb-[15px]">
            <button
              className="flex items-center"
              onClick={() => setShowCategories(false)}
            >
              <Icon as={ArrowBackIcon} mr="7.5px" />
              <MediumFont extraCss="text-bold">
                Categories ({filteredCategories.length})
              </MediumFont>{" "}
            </button>
            <InputCustom
              type="text"
              placeholder="Search a category"
              onChange={(e) => setSearchCategorie(e.target.value)}
            />
          </div>
          {filteredCategories.length > 0 ? (
            <div className="flex flex-wrap max-h-[480px] min-h-[165px] overflow-y-scroll">
              {filteredCategories.map((category) => (
                <Button
                  extraCss={`rounded-2xl mb-[7.5px] h-[30px] mr-[7.5px] ${
                    state.filters.categories?.includes(category)
                      ? "bg-light-bg-hover dark:bg-dark-bg-hover"
                      : "bg-light-bg-terciary dark:bg-dark-bg-terciary"
                  }`}
                  onClick={() => {
                    handleCategoryChange(category);
                  }}
                  key={category}
                >
                  <SmallFont>{category}</SmallFont>
                  {state.filters.categories?.includes(category) ? (
                    <AiOutlineClose className="text-[10px] ml-[5px]" />
                  ) : null}
                </Button>
              ))}
            </div>
          ) : (
            <SmallFont className="mx-auto my-[25px] font-medium">
              No categories found
            </SmallFont>
          )}
          <div className="w-full flex items-center bg-light-bg-secondary dark:bg-dark-bg-secondary sticky pt-[15px] bottom-0 border-t border-light-border-primary dark:border-dark-border-primary">
            <Button
              extraCss="w-1/2 mr-[5px]"
              onClick={() => {
                dispatch({
                  type: ACTIONS.REMOVE_ALL_CATEGORY,
                });
              }}
            >
              Deselect All
            </Button>
            <Button
              extraCss="w-1/2 ml-[5px]"
              onClick={() => {
                dispatch({ type: ACTIONS.RESET_CATEGORY });
              }}
            >
              Select All
            </Button>
          </div>
        </div>
      ) : (
        <>
          {type === "edit" && activeView?.name === "All" ? null : (
            <>
              <MediumFont className="font-bold">Name</MediumFont>
              <div className="mt-2.5 flex">
                <div
                  className="flex items-center h-[35px] md:h-[30px]
                 bg-light-bg-terciary dark:bg-dark-bg-terciary rounded-lg z-[2]
                  text-light-font-100 dark:text-dark-font-100 border
                   border-light-border-primary dark:border-dark-border-primary w-full"
                >
                  <input
                    className="w-full px-2.5 h-full text-light-font-100 dark:text-dark-font-100 rounded"
                    maxLength={25}
                    // isDisabled={activeView?.name === "All" && type === "edit"}
                    onChange={(e) => handleBasicInputChange(e)}
                    placeholder={
                      type === "create" ? "View name" : activeView?.name
                    }
                  />
                  <button
                    className="flex items-center pr-2.5"
                    onClick={() => setShowColorPopover(true)}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full mr-2`}
                      style={{ background: defaultColor }}
                    />
                    <BsChevronDown className="text-[10px]" />
                  </button>
                </div>
                {/* <InputGroup
                  borderRadius="8px"
                  h="35px"
                  bg={boxBg6}
                  border={borders}
                  color={text80}
                  zIndex="2"
                >
                  <Input
                    w="100%"
                    px="10px"
                    h="100%"
                    placeholder={
                      type === "create" ? "View name" : activeView?.name
                    }
                    color={text80}
                    isDisabled={activeView?.name === "All" && type === "edit"}
                    _placeholder={{ color: text80 }}
               
                  /> */}

                {/* <InputRightElement h="100%" mr="10px" zIndex="2">
                  <Menu>
                    <MenuButton
                      as={Button}
                      h="90%"
                      rightIcon={<ChevronDownIcon />}
                    >
                      <Flex
                        boxSize="10px"
                        bg={defaultColor}
                        borderRadius="full"
                      />
                    </MenuButton>
                    <MenuList
                      display="flex"
                      maxW="200px"
                      flexWrap="wrap"
                      zIndex="2"
                      p="10px"
                      bg={boxBg6}
                      borderRadius="16px"
                      border={borders}
                      boxShadow="none"
                    >
                      {colors.map((color) => (
                        <MenuItem
                          mx="2.5px"
                          mb="2.5px"
                          bg={boxBg6}
                          h="20px"
                          w="12px"
                          key={color}
                          display="flex"
                          justifyContent="center"
                          onClick={() =>
                            dispatch({
                              type: ACTIONS.SET_COLOR,
                              payload: { value: color },
                            })
                          }
                        >
                          <Flex
                            bg={color}
                            minH="12px"
                            w="12px"
                            h="12px"
                            maxW="12px"
                            minW="12px"
                            borderRadius="full"
                          />
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </InputRightElement> */}

                {/* </InputGroup> */}
                <Button
                  extraCss="relative ml-2.5 h-[35px] w-[35px] min-w-[35px] flex items-center justify-center"
                  onMouseEnter={() => setIsStarHover(true)}
                  onMouseLeave={() => setIsStarHover(false)}
                  onClick={() => dispatch({ type: ACTIONS.SET_FAVORITE })}
                >
                  <Icon
                    opacity={getStarIconFromActiveView().outline}
                    as={AiOutlineStar}
                    position="absolute"
                    fontSize="16px"
                    transition="all 250ms ease-in-out"
                  />
                  <Icon
                    opacity={getStarIconFromActiveView().fill}
                    as={AiFillStar}
                    position="absolute"
                    color="yellow"
                    fontSize="16px"
                    transition="all 250ms ease-in-out"
                  />
                </Button>
                {type !== "create" ? (
                  <Button extraCss="ml-2.5" onClick={() => removeView()}>
                    <Icon as={BsTrash3} fontSize="16px" />
                  </Button>
                ) : null}
              </div>
            </>
          )}
          <div className="flex items-center relative bg-light-bg-terciary dark:bg-dark-bg-terciary rounded-lg mt-2.5 p-0.5 border border-light-border-primary dark:border-dark-border-primary">
            <div
              className={`absolute bg-light-bg-hover dark:bg-dark-bg-hover h-[35px] md:h-[30px] w-1/2 ${
                showTuto ? "z-[3]" : "z-[auto]"
              } ${
                activeDisplay === "display"
                  ? "left-[calc(0% + 2px)]"
                  : "left-[calc(50% - 2px)]"
              } rounded-lg transition-all duration-250 `}
            />
            <button
              className={`w-1/2 font-normal ${
                activeStep.nbr === 1 && showTuto ? "z-[4]" : "z-[1]"
              } h-[35px] sm:h-[30px] font-normal text-light-font-100 dark:text-dark-font-100 text-sm md:text-xs`}
              onClick={() => setActiveDisplay("display")}
            >
              Display
            </button>
            <button
              className={`w-1/2 font-normal ${
                activeStep.nbr === 2 && showTuto ? "z-[4]" : "z-[1]"
              } h-[35px] sm:h-[30px] font-normal text-light-font-100 dark:text-dark-font-100 text-sm md:text-xs`}
              onClick={() => setActiveDisplay("filters")}
            >
              Filters
            </button>
          </div>
          {activeDisplay === "display" ? (
            <ReactSortableAny
              tag={CustomComponent}
              animation={200}
              delay={0}
              list={dragNdrop}
              setList={(newOrder) => {
                setDragNdrop(newOrder);
                dispatch({ type: ACTIONS.MOVE_ELEMENT, payload: newOrder });
              }}
            >
              {dragNdrop?.map((entry) => (
                <div
                  className="flex items-center px-2.5 sm:px-[7.5px] mr-[7.5px] bg-light-bg-hover dark:bg-dark-bg-hover rounded-full w-fit h-[30px] md:h-[25px] mt-[7.5px] border border-light-border-primary dark:border-dark-border-primary cursor-pointer text-sm md:text-xs"
                  key={entry.id}
                >
                  <Icon as={PiDotsNineBold} mr="7.5px" />
                  <SmallFont>{entry.value}</SmallFont>
                </div>
              ))}
            </ReactSortableAny>
          ) : null}
          {activeDisplay === "display" ? (
            <div className="flex flex-col w-full mt-2.5">
              {displays.map((display) => (
                <div className="flex flex-col" key={display.title}>
                  <MediumFont extraCss="font-bold mb-[5px]">
                    {display.title}
                  </MediumFont>
                  <div className="flex flex-wrap w-full mb-5">
                    {display.filters.map((entry) => {
                      const isInDisplay = state.display?.some(
                        (item) => item.value === entry
                      );
                      return (
                        <button
                          className={`flex px-2.5 items-center font-normal rounded-2xl mt-[7.5px] h-[30px] md:h-[25px] mr-[7.5px] ${
                            isInDisplay
                              ? "bg-light-bg-hover dark:bg-dark-bg-hover"
                              : "bg-light-bg-terciary dark:bg-dark-bg-terciary"
                          } border border-light-border-primary dark:border-dark-border-primary text-light-font-100 dark:text-dark-font-100`}
                          onClick={() =>
                            handleDisplayChange(entry, display.name)
                          }
                          key={entry}
                        >
                          <SmallFont>{entry}</SmallFont>
                          {isInDisplay ? (
                            <CloseIcon fontSize="9px" ml="5px" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col w-full my-2.5">
              {filters.map((filter, i) => (
                <AccordionCustom
                  extraCss={`${i === 0 ? "border-b" : "border-t"}`}
                  visibleContent={
                    <>
                      <MediumFont>{filter.title}</MediumFont>
                      <div className="ml-auto flex h-full items-center">
                        {getRenderForFilters(filter)}
                        <BsChevronDown className="text-light-font-100 dark:text-dark-font-100 ml-2.5 text-xs" />
                      </div>
                    </>
                  }
                  hiddenContent={
                    <div className="flex flex-col w-full">
                      {filter.title === "Blockchains" ? (
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col w-full max-h-[255px] overflow-y-scroll ">
                            {Object.keys(blockchainsContent).map((chain) => (
                              <div
                                className="my-[5px] justify-between flex cursor-pointer"
                                key={chain}
                                onClick={() => handleBlockchainsChange(chain)}
                              >
                                <div className="flex items-center">
                                  <img
                                    className="w-[22px] h-[22px] max-h-[22px] max-w-[22px] rounded-full mr-[7.5px]"
                                    src={
                                      blockchainsContent[chain]?.logo ||
                                      "/icon/unknown.png"
                                    }
                                    alt={chain + " logo"}
                                  />
                                  <SmallFont>{chain}</SmallFont>
                                </div>
                                <button className="flex items-center justify-center w-[15px] h-[15px] rounded border border-light-border-secondary dark:border-dark-border-secondary mr-[15px]">
                                  {(state?.filters?.blockchains || []).some(
                                    (item) => item === chain
                                  ) ? (
                                    <BsCheckLg className="text-blue text-[14px]" />
                                  ) : null}
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex pt-2.5 bg-light-bg-secondary dark:bg-dark-bg-secondary mb-2.5">
                            <Button
                              extraCss="mr-[5px] w-1/2"
                              onClick={() => {
                                dispatch({
                                  type: ACTIONS.DESELECT_ALL_BLOCKCHAINS,
                                });
                              }}
                            >
                              Deselect All
                            </Button>
                            <Button
                              extraCss="ml-[5px] w-1/2"
                              onClick={() => {
                                dispatch({
                                  type: ACTIONS.RESET_BLOCKCHAINS,
                                });
                              }}
                            >
                              Select All
                            </Button>
                          </div>
                        </div>
                      ) : null}
                      {filter.title !== "Blockchains" &&
                      filter.title !== "Categories" ? (
                        <div className="flex flex-col w-full">
                          <div className="flex w-full mb-2.5">
                            <div className="flex flex-col w-1/2 mr-[5px]">
                              <SmallFont extraCss="mb-[5px]">From</SmallFont>
                              <Input
                                placeholder={
                                  state.filters?.[filter.name]?.from || 0
                                }
                                name={filter.name}
                                type="number"
                                // value={state.filters[filter.name].from}
                                onChange={(e) => handleInputChange(e, "from")}
                              />
                            </div>
                            <div className="flex flex-col w-1/2 ml-[5px]">
                              <SmallFont extraCss="mb-[5px]">To</SmallFont>
                              <Input
                                placeholder={
                                  state.filters?.[filter.name]?.to === maxValue
                                    ? "Any"
                                    : state.filters?.[filter.name]?.to || "Any"
                                }
                                name={filter.name}
                                type="number"
                                onChange={(e) => handleInputChange(e, "to")}
                                // value={state.filters[filter.name].to}
                              />
                            </div>
                          </div>
                          {state.filters?.[filter.name]?.from !== 0 ||
                          state.filters?.[filter.name]?.to !== maxValue ? (
                            <button
                              className="text-sm md:text-xs text-light-font-100 dark:text-dark-font-100 flex items-center mr-auto mb-2.5"
                              onClick={() => {
                                dispatch({
                                  type: ACTIONS.RESET_FILTER,
                                  payload: { name: filter.name },
                                });
                              }}
                            >
                              <CloseIcon fontSize="8.5px" mr="7px" />
                              Reset {filter.title}
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                      {filter.title === "Categories" ? (
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col w-full">
                            <div className="flex flex-wrap w-full max-h-[255px] overflox-y-scroll">
                              {newDefault
                                ?.sort((entry) =>
                                  state.filters?.categories?.includes(entry)
                                    ? -1
                                    : 1
                                )
                                .filter((_, idx) => idx < 5)
                                .map((categorie) => (
                                  <button
                                    className={`flex items-center px-2.5 rounded-2xl mb-[7.5px] h-[30px] mr-[7.5px] ${
                                      state.filters.categories?.includes(
                                        categorie
                                      )
                                        ? "bg-light-bg-hover dark:bg-dark-bg-hover"
                                        : "bg-light-bg-terciary dark:bg-dark-bg-terciary"
                                    } border border-light-border-primary dark:border-dark-border-primary text-light-font-100 dark:text-dark-font-100`}
                                    onClick={() =>
                                      handleCategoryChange(categorie)
                                    }
                                    key={categorie}
                                  >
                                    <SmallFont>{categorie}</SmallFont>
                                    {state.filters.categories?.includes(
                                      categorie
                                    ) ? (
                                      <CloseIcon fontSize="9px" ml="5px" />
                                    ) : null}
                                  </button>
                                ))}
                              <Button
                                extraCss="rounded-2xl mr-[7.5px] mt-[7.5px] h-[30px]"
                                onClick={() => setShowCategories(true)}
                              >
                                <SmallFont>See all</SmallFont>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  }
                />
              ))}
            </div>
          )}
          <div className="flex mt-2.5">
            <Button
              extraCss="mr-[5px] w-full max-w-1/2"
              onClick={() => {
                pushData("View popup", {
                  action: "reset",
                });
                if (isConnected) {
                  dispatch({ type: ACTIONS.RESET_VIEW });
                } else setConnect(true);
              }}
            >
              Reset
            </Button>
            <Button
              extraCss="w-full max-w-1/2 ml-[5px] px-3 border border-blue"
              onClick={() => {
                pushData("View popup", {
                  action: type === "create" ? "create" : "edit",
                });
                if (isConnected) {
                  if (!checkSameNameExist()) {
                    if (!state.name) {
                      // alert.show('Please add a name for your view');
                      return;
                    }
                    if (activeView?.name === "All" && type !== "create") {
                      setIsLoading(true);
                      setActiveView({ ...state, isFirst: false });
                      if (!user || !activeView) return;
                      const activeViewStr = formatDataForFilters(
                        activeView,
                        state
                      );
                      Cookies.set(`view-${address}`, activeViewStr, {
                        secure: process.env.NODE_ENV !== "development",
                        sameSite: "strict",
                      });
                      setType("");
                    } else if (
                      activeView?.name !== "All" ||
                      type === "create"
                    ) {
                      setIsLoading(true);
                      if (type === "edit") editView();
                      else createView();
                    }
                  }
                } else setConnect(true);
              }}
            >
              {isViewsLoading ? (
                <Spinner
                  thickness="2px"
                  speed="0.65s"
                  emptyColor={boxBg3}
                  color="blue"
                  size="xs"
                  mr="7.5px"
                />
              ) : null}
              {type === "create"
                ? `Create ${state.name}`
                : `Edit ${activeView?.name}`}
            </Button>
          </div>
        </>
      )}
      {showColorPopover ? <ColorPopover dispatch={dispatch} /> : null}
    </ModalContainer>
  );
};
