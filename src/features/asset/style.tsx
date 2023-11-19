import { FlexProps } from "@chakra-ui/react";

export const squareBox =
  "rounded w-[26px] h-[26px] min-w-[26px] ml-2.5 mt-[5px]";

export const percentageTags = (isUp: boolean) =>
  `${
    isUp ? "bg-darkgreen dark:bg-darkgreen" : "bg-darkred dark:bg-darkred"
  } h-[30px] lg:h-[26px] md:h-[22px] px-2.5 lg:px-[7.5px] md:px-[5px] rounded ml-2.5 items-center justify-center`;

export const mainButtonStyle =
  "h-[30px] px-2.5 lg:px-[7.5px] mr-[7.5px] lg:mr-0 ml-0 lg:ml-[7.5px] rounded transition-all duration-250 font-medium";

export const popOverStyle = {
  boxShadow: "1px 2px 13px 3px rgba(0,0,0,0.1)",
};

export const PopOverLinesStyle: FlexProps = {
  align: "center",
  position: "relative",
  justify: "space-between",
  minWidth: ["135px", "135px", "181px", "200px"],
  borderRadius: "4px",
  px: "10px",
  h: "30px",
  w: "100%",
  _hover: { bg: "box_bg.5" },
  transition: "all 0.2s ease-in-out",
};

export const FlexBorderBox: FlexProps = {
  borderRadius: "16px",
  mb: ["0px", "0px", "0px", "10px"],
  w: "100%",
  maxW: ["100%", "100%", "100%", "320px"],
  // bg: ["none", "none", "none", "box_bg.3"],
  // border: ["none", "none", "none", "1px solid var(--chakra-colors-borders-3)"],
  p: ["0px 0px", "0px 0px", "0px 0px", "20px"],
  direction: "column",
};

export const cancelButtonStyle = "mb-0 max-w-[100px] w-full h-[30px] mr-2.5";
