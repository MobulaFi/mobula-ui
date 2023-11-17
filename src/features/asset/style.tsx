import { FlexProps } from "@chakra-ui/react";

export const squareBox = {
  // bg: "box_bg.6",
  // border: "1px solid var(--chakra-colors-borders-3)",
  borderRadius: "8px",
  boxSize: "26px",
  ml: "10px",
  mt: "5px",
};

export const percentageTags = (isUp) => ({
  bg: isUp ? "darkgreen" : "red_bg",
  h: ["22px", "22px", "26px", "30px"],
  px: ["5px", "5px", "7.5px", "10px"],
  borderRadius: "8px",
  ml: "10px",
  align: "center",
  justify: "center",
});

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

export const cancelButtonStyle = {
  variant: "outlined",
  mb: "0px",
  maxW: "100px",
  w: "100%",
  fontSize: ["12px", "12px", "13px", "14px"],
  fontWeight: "400",
  h: "30px",
  mr: "10px",
};
