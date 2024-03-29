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
import { FaArrowLeftLong } from "react-icons/fa6";
import { PiDotsNineBold } from "react-icons/pi";
import { ReactSortable } from "react-sortablejs";
import { useAccount } from "wagmi";
import { Accordion as AccordionCustom } from "../../../../../../components/accordion";
import { Button } from "../../../../../../components/button";
import { MediumFont, SmallFont } from "../../../../../../components/fonts";
import { Input } from "../../../../../../components/input";
import { Modal } from "../../../../../../components/modal-container";
import { Spinner } from "../../../../../../components/spinner";
import { PopupUpdateContext } from "../../../../../../contexts/popup";
import { UserContext } from "../../../../../../contexts/user";
import { pushData } from "../../../../../../lib/mixpanel";
import { triggerAlert } from "../../../../../../lib/toastify";
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
  isEdit: boolean;
}

export const ViewPopup = ({
  type,
  setType,
  state,
  dispatch,
  activeDisplay,
  setActiveDisplay,
  isEdit,
}: ViewPopupProps) => {
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
    if (isEdit && (user?.views?.length || 0) > 0)
      dispatch({
        type: ACTIONS.SET_USER_VALUE,
        payload: { value: activeView },
      });
    if (
      (!isEdit && (user?.views?.length || 0) > 0) ||
      (!isEdit && activeView?.name === "All")
    )
      dispatch({
        type: ACTIONS.SET_USER_VALUE,
        payload: { value: INITIAL_VALUE },
      });
  }, [type]);

  const getTitleFromType = () => {
    if (!isEdit) return " filter & view";
    return activeView?.name;
  };

  const getStarIconFromActiveView = () => {
    if (isStarHover && state.is_favorite)
      return {
        fill: 0,
        outline: 1,
        color: "text-light-font-100 dark:text-dark-font-100",
      };
    if (!isStarHover && state.is_favorite)
      return {
        fill: 1,
        outline: 0,
        color: "text-yellow dark:text-yellow",
      };
    if (isStarHover && !state.is_favorite)
      return {
        fill: 1,
        outline: 0,
        color: "text-yellow dark:text-yellow",
      };
    return {
      fill: 0,
      outline: 1,
      color: "text-light-font-100 dark:text-dark-font-100",
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
          triggerAlert("Error", r.error);
          return;
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
        id: id as number,
      })
        .then((r) => r.json())
        .then((r) => {
          if (r.error) {
            triggerAlert("Error", r.error);
            return;
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
    else
      triggerAlert(
        "Warning",
        "You should be connected to be able to remove a view"
      );
  };

  const getRenderForFilters = useCallback(
    (filter: { name: string; title: string; icon: any }) => {
      if (filter.name === "blockchains") {
        return (
          <div className="flex items-center h-fit">
            {state.filters[filter.name]
              ?.filter((_, i) => i < 7)
              ?.map((item) => (
                <img
                  className="w-[20px] h-[20px] min-w-[20px] rounded-full ml-[-5px] bg-light-bg-hover dark:bg-dark-bg-hover"
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
          <SmallFont className="text-blue dark:text-blue font-medium">
            {state.filters[filter.name]?.length} categories
          </SmallFont>
        );
      }

      const { from, to } = state.filters[filter.name] || {
        from: 0,
        to: maxValue,
      };
      let valueMax: number | string | React.ReactNode = maxValue;
      if (to === maxValue) valueMax = "Any";
      else valueMax = getFormattedAmount(to);

      if (to !== maxValue || from !== 0)
        return (
          <SmallFont className="text-blue dark:text-blue font-medium">
            {getFormattedAmount(from)} - {valueMax}
          </SmallFont>
        );
      return null;
    },
    [state.filters]
  );

  const checkSameNameExist = () => {
    if (!user) return false;
    if (user?.views?.length > 0 && !isEdit) {
      const alreadyExist = user
        ? user.views.find((view) => view.name === state.name)
        : false;
      if (alreadyExist)
        triggerAlert(
          "Error",
          "You already have a view with this name. Please change it and retry"
        );

      return alreadyExist;
    }
    if (state.name !== "All" && activeView?.name === "All" && isEdit) {
      triggerAlert("Error", "Can't change the name of this view.");
      return true;
    }
    return false;
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
  const ReactSortableAny = ReactSortable;

  const createButtonHandler = () => {
    pushData("View popup", {
      action: !isEdit ? "create" : "edit",
    });
    if (isConnected) {
      if (!checkSameNameExist()) {
        if (!state.name) {
          triggerAlert("Warning", "Please add a name for your view");
          return;
        }
        if (activeView?.name === "All" && type !== "create") {
          setIsLoading(true);
          setActiveView({ ...state, isFirst: false });
          if (!user || !activeView) return;
          const activeViewStr = formatDataForFilters(activeView, state);
          Cookies.set(`view-${address}`, activeViewStr, {
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
          });
          setType("");
        } else if (activeView?.name !== "All" || !isEdit) {
          setIsLoading(true);
          if (isEdit) editView();
          else createView();
        }
      }
    } else setConnect(true);
  };

  return (
    <Modal
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
      <div className="w-full relative">
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
                <FaArrowLeftLong className="text-light-font-100 dark:text-dark-font-100 mr-[7.5px]" />
                <MediumFont extraCss="text-bold">
                  Categories ({filteredCategories.length})
                </MediumFont>{" "}
              </button>
              <Input
                extraCss="border-0"
                type="text"
                placeholder="Search a category"
                onChange={(e) => setSearchCategorie(e.target.value)}
              />
            </div>
            {filteredCategories.length > 0 ? (
              <div className="flex flex-wrap max-h-[487px] min-h-[175px] overflow-y-scroll">
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
                extraCss="w-1/2 mr-[5px] h-[40px] md:h-[35px]"
                onClick={() => {
                  dispatch({
                    type: ACTIONS.REMOVE_ALL_CATEGORY,
                  });
                }}
              >
                Deselect All
              </Button>
              <Button
                extraCss="w-1/2 ml-[5px] h-[40px] md:h-[35px]"
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
            {isEdit && activeView?.name === "All" ? null : (
              <>
                <MediumFont className="font-bold">Name</MediumFont>
                <div className="mt-2.5 flex">
                  <div
                    className="flex items-center h-[35px] 
                 bg-light-bg-terciary dark:bg-dark-bg-terciary rounded-lg z-[2]
                  text-light-font-100 dark:text-dark-font-100 border
                   border-light-border-primary dark:border-dark-border-primary w-full"
                  >
                    <input
                      className="w-full px-2.5 h-full text-light-font-100 dark:text-dark-font-100 rounded
                     bg-light-bg-terciary dark:bg-dark-bg-terciary"
                      maxLength={25}
                      // isDisabled={activeView?.name === "All" && type === "edit"}
                      onChange={(e) => handleBasicInputChange(e)}
                      placeholder={!isEdit ? "View name" : activeView?.name}
                    />
                    <button
                      className="flex items-center pr-2.5 relative"
                      onClick={() => setShowColorPopover((prev) => !prev)}
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full mr-2`}
                        style={{ background: defaultColor }}
                      />
                      <BsChevronDown className="text-[10px]" />
                      {showColorPopover ? (
                        <div
                          className="flex max-w-[200px] flex-wrap z-[2] p-2.5 bg-light-bg-terciary dark:bg-dark-bg-terciary
                      rounded-xl border border-light-border-primary dark:border-dark-border-primary shadow-md absolute
                       w-[200px] right-0 top-[28px]"
                        >
                          {colors.map((color) => (
                            <button
                              key={color}
                              className="m-1.5 h-[12px] w-[12px] flex justify-center bg-light-bg-terciary dark:bg-dark-bg-terciary"
                              onClick={() =>
                                dispatch({
                                  type: ACTIONS.SET_COLOR,
                                  payload: { value: color },
                                })
                              }
                            >
                              <div
                                className="min-h-[12px] w-[12px] h-[12px] max-w-[12px] min-w-[12px] rounded-full"
                                style={{ background: color }}
                              />
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </button>
                  </div>
                  <Button
                    extraCss="relative ml-2.5 h-[35px] w-[35px] min-w-[35px] md:h-[35px] flex items-center justify-center"
                    onMouseEnter={() => setIsStarHover(true)}
                    onMouseLeave={() => setIsStarHover(false)}
                    onClick={() => dispatch({ type: ACTIONS.SET_FAVORITE })}
                  >
                    <AiOutlineStar
                      className={`absolute text-base transition-all duration-200 ${
                        getStarIconFromActiveView().outline
                      }`}
                    />
                    <AiFillStar
                      className={`absolute text-base text-yellow dark:text-yellow transition-all duration-200 ${
                        getStarIconFromActiveView().fill
                      }`}
                    />
                  </Button>
                  {type !== "create" ? (
                    <Button
                      extraCss="ml-2.5 md:h-[35px]"
                      onClick={() => removeView()}
                    >
                      <BsTrash3 className="text-base text-light-font-100 dark:text-dark-font-100" />
                    </Button>
                  ) : null}
                </div>
              </>
            )}
            <div
              className="flex items-center relative bg-light-bg-terciary dark:bg-dark-bg-terciary rounded
           mt-2.5 p-0.5 border border-light-border-primary dark:border-dark-border-primary"
            >
              <div
                className={`absolute bg-light-bg-hover dark:bg-dark-bg-hover h-[35px] md:h-[30px] w-1/2 ${
                  showTuto ? "z-[3]" : "z-[auto]"
                } rounded-md transition-all duration-200 `}
                style={{
                  left:
                    activeDisplay === "display"
                      ? "calc(0% + 2px)"
                      : "calc(50% - 2px)",
                }}
              />
              <button
                className={`w-1/2 ${
                  activeStep.nbr === 1 && showTuto ? "z-[4]" : "z-[1]"
                } h-[35px] md:h-[30px] text-sm md:text-xs 
              ${
                activeDisplay === "display"
                  ? "text-light-font-100 dark:text-dark-font-100"
                  : "text-light-font-40 dark:text-dark-font-40"
              }
              `}
                onClick={() => setActiveDisplay("display")}
              >
                Display
              </button>
              <button
                className={`w-1/2 ${
                  activeStep.nbr === 2 && showTuto ? "z-[4]" : "z-[1]"
                } h-[35px] md:h-[30px] text-light-font-100 dark:text-dark-font-100 text-sm md:text-xs ${
                  activeDisplay === "filters"
                    ? "text-light-font-100 dark:text-dark-font-100"
                    : "text-light-font-40 dark:text-dark-font-40"
                }`}
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
                    className="flex items-center px-2.5 sm:px-[7.5px] mr-[7.5px] bg-light-bg-hover
                   dark:bg-dark-bg-hover rounded-full w-fit h-[30px] md:h-[25px] mt-[7.5px] 
                   border border-light-border-primary dark:border-dark-border-primary cursor-pointer 
                   text-sm md:text-xs"
                    key={entry.id}
                  >
                    <PiDotsNineBold className="mr-[7.5px]" />
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
                              <AiOutlineClose className="text-light-font-100 dark:text-dark-font-100 ml-[5px] text-[10px]" />
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
                    key={filter.name}
                    extraCss={`${
                      i === 0
                        ? "border-b dark:border-dark:-border-primary border-light-border-primary"
                        : "border-t border-light-border-primary dark:border-dark-border-primary"
                    }`}
                    visibleContent={
                      <>
                        <MediumFont>{filter.title}</MediumFont>
                        <div className="ml-auto flex h-full items-center">
                          {getRenderForFilters(filter)}
                          <BsChevronDown className="text-light-font-100 dark:text-dark-font-100 ml-2.5 text-xs" />
                        </div>
                      </>
                    }
                  >
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
                                    className="w-[22px] h-[22px] min-h-[22px] min-w-[22px] rounded-full mr-[7.5px]"
                                    src={
                                      blockchainsContent[chain]?.logo ||
                                      "/empty/unknown.png"
                                    }
                                    alt={chain + " logo"}
                                  />
                                  <SmallFont>{chain}</SmallFont>
                                </div>
                                <button className="flex items-center justify-center w-[15px] h-[15px] rounded-md border border-light-border-secondary dark:border-dark-border-secondary mr-[15px]">
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
                              <AiOutlineClose className="text-[10px] mr-[7px]" />
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
                                    className={`flex items-center px-2.5 rounded-2xl mb-[7.5px] h-[30px] md:h-[25px] mr-[7.5px] ${
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
                                      <AiOutlineClose className="text-[10px] ml-[5px]" />
                                    ) : null}
                                  </button>
                                ))}
                              <Button
                                extraCss="rounded-2xl mr-[7.5px] mt-[7.5px] h-[30px] md:h-[25px]"
                                onClick={() => setShowCategories(true)}
                              >
                                <SmallFont>See all</SmallFont>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </AccordionCustom>
                ))}
              </div>
            )}
            <div className="flex mt-2.5 md:mt-0">
              <Button
                extraCss="mr-[5px] w-full max-w-1/2 h-[40px] md:h-[35px]"
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
                extraCss="w-full max-w-1/2 ml-[5px] px-3 border border-darkblue dark:border-darkblue
               hover:border-blue hover:dark:border-blue h-[40px] md:h-[35px]"
                onClick={createButtonHandler}
              >
                {isViewsLoading ? (
                  <Spinner extraCss="w-[15px] h-[15px] mr-[7.5px]" />
                ) : null}
                {!isEdit ? `Create ${state.name}` : `Edit ${activeView?.name}`}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
