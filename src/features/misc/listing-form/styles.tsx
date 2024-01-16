export const inputStyle =
  "h-[35px] bg-light-bg-terciary dark:bg-dark-bg-terciary rounded-md pl-2.5 text-light-font-100 dark:text-dark-font-100 font-medium";

export const addButtonStyle =
  "flex items-center w-[120px] rounded-md h-[35px] mt-2.5 flex justify-center align-center text-light-font-80 dark:text-dark-font-80 text-sm md:text-xs md:h-[30px] hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover  lg:text-sm md:text-xs bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary";

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

export const buttonsOption =
  "text-sm mt-0 md:mt-2.5 mr-2.5 px-3 w-fit md:w-full";

export const imageStyle =
  "min-w-[20px] w-[20px] h-[20px] rounded-full mr-[5px]";

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
