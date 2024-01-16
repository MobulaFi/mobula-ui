import React, { useContext } from "react";
import { pushData } from "../../../../../../lib/mixpanel";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { PortfolioV2Context } from "../../../context-manager";
import { getPositionOfSwitcherButton } from "../../../utils";

interface ButtonSliderProps {
  switcherOptions: string[];
  typeSelected: string;
  setTypeSelected: React.Dispatch<React.SetStateAction<string>>;
  callback?: (type: string) => void;
  extraCss?: string;
}

export const ButtonSlider = ({
  switcherOptions,
  typeSelected,
  setTypeSelected,
  callback,
  extraCss,
}: ButtonSliderProps) => {
  const { activeStep } = useContext(PortfolioV2Context);
  return (
    <div
      className={cn(
        "flex items-center bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary h-[38px] rounded-lg mb-[15px] relative px-2",
        extraCss
      )}
    >
      <div
        className="h-[30px] bg-light-bg-hover dark:bg-dark-bg-hover rounded-md absolute transition-all duration-200 z-[0]"
        style={{
          left: getPositionOfSwitcherButton(typeSelected),
          width: `${100 / switcherOptions.length}%`,
        }}
      />
      {switcherOptions.map((type) => (
        <button
          key={type}
          className={`${
            typeSelected === type
              ? "text-light-font-100 dark:text-dark-font-100"
              : "text-light-font-40 dark:text-dark-font-40"
          } h-[30px] text-sm lg:text-[13px] md:text-xs transition-all duration-200 relative ${
            type === "Activity" && activeStep.nbr === 4 ? "z-[5]" : "z-[1]"
          }`}
          style={{ width: `${100 / switcherOptions.length}%` }}
          onClick={() => {
            pushData("Portfolio Switch Clicked", {
              type,
            });
            setTypeSelected(type);
            if (callback) callback(type);
          }}
        >
          {type}
        </button>
      ))}
    </div>
  );
};
