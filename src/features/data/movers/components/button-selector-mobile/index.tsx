import { IoMdTrendingDown, IoMdTrendingUp } from "react-icons/io";

interface ButtonSelectorMobileProps {
  isGainer?: boolean;
  activeTab?: boolean;
  [key: string]: any;
}

export const ButtonSelectorMobile = ({
  isGainer,
  activeTab,
  ...props
}: ButtonSelectorMobileProps) => (
  <button
    className={`flex items-center justify-center border ${
      activeTab
        ? "text-light-font-100 dark:text-dark-font-100 border-blue dark:border-dark-blue"
        : "text-light-font-40 dark:text-dark-font-40 border-light-border-primary dark:border-dark-border-primary"
    } rounded-md min-w-[90px] h-[30px] px-3 mr-2.5 text-sm md:text-xs hover:text-light-font-100 dark:hover:text-dark-font-100
     transition-all duration-200 ease-in-out`}
    {...props}
  >
    {isGainer ? "Gainers" : "Losers"}
    {isGainer ? (
      <IoMdTrendingUp className="text-[15px] ml-2.5" />
    ) : (
      <IoMdTrendingDown className="text-[15px] ml-2.5" />
    )}
  </button>
);
