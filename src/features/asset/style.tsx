export const squareBox = "rounded-md ml-2.5 mt-[5px]";

export const percentageTags = (isUp: boolean) =>
  `${
    isUp ? "bg-darkgreen dark:bg-darkgreen" : "bg-darkred dark:bg-darkred"
  } h-[27px] md:h-[22px] px-1.5 md:px-[5px] rounded-md ml-2.5 items-center justify-center`;

export const mainButtonStyle =
  "h-[30px] px-2 lg:px-[5px] mr-[7.5px] lg:mr-0 ml-0 lg:ml-[7.5px] rounded-md transition-all duration-200";

export const popOverStyle = {
  boxShadow: "1px 2px 13px 3px rgba(0,0,0,0.1)",
};

export const PopOverLinesStyle =
  "flex items-center relative justify-between min-w-[200px] lg:min-w-[181px] md:min-w-[135px] rounded-md px-2.5 h-[30px] w-full hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover transition-all duration-200 bg-light-bg-terciary dark:bg-dark-bg-terciary";

export const FlexBorderBox =
  "rounded-2xl mb-2.5 lg:mb-0 w-full max-w-[345px] lg:max-w-full p-5 md:p-0 flex flex-col bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border-primary dark:border-dark-border-primary lg:border-0";

export const cancelButtonStyle = "mb-0 max-w-[100px] w-full h-[30px] mr-2.5";
