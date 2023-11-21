export const inputStyle =
  "h-[35px] bg-light-bg-secondary dark:bg-dark-bg-secondary rounded pl-2.5 text-light-font-100 dark:text-dark-font-100 font-medium";

export const buttonStyle = (
  bg: string,
  bgActive: string,
  border: string,
  borderActive: string,
  color: string,
  isActive: boolean
) => {
  const style = {
    h: "35px",
    bg: isActive ? bgActive : bg,
    fontSize: ["12px", "12px", "14px", "16px"],
    borderRadius: "8px",
    border: isActive ? borderActive : border,
    pl: "10px",
    fontWeight: "400",
    color,
    _hover: {
      bg: bgActive,
    },
    transition: "all 250ms ease-in-out",
  };
  return style;
};

export const buttonsOption = {
  fontWeight: 400,
  w: ["100%", "100%", "fit-content"],
  px: "13px",
  fontSize: "14px",
  mt: ["10px", "10px", "0px"],
  mr: "10px",
};
export const imageOption = {
  minW: "20px",
  boxSize: "20px",
  h: "20px",
  borderRadius: "full",
  mr: "5px",
};
export const labelStyles = {
  mt: "-10",
  ml: "-5",
  fontSize: "sm",
};
export const markOption = {
  h: "5px",
  zIndex: 1,
  w: "3px",
  bg: "blue",
  position: "absolute",
};
