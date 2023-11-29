import React from "react";
import { Button } from "../../../../../components/button";
import { LargeFont, SmallFont } from "../../../../../components/fonts";

export const StepPopup = ({ activeStep, getNextStep, setShowTuto }) => {
  return (
    <div
      className="bg-light-bg-primary dark:bg-dark-bg-primary z-[5] flex flex-col p-[15px] md:p-2.5 absolute 
    rounded-2xl border border-light-border-primary dark:border-dark-border-primary w-[290px]"
      style={{
        right: activeStep.right,
        top: activeStep.top,
        transform: activeStep.transform || "translateX(50%)",
      }}
    >
      <div className="flex flex-col w-full h-full relative">
        <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 mb-2.5 md:mb-[5px]">
          Step {activeStep.nbr}
        </SmallFont>
        <LargeFont>{activeStep.title}</LargeFont>
        <LargeFont>{activeStep.subtitle}</LargeFont>
        <div className="flex w-full items-center justify-between mt-2.5 md:mt-[5px]">
          <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
            {activeStep.nbr}/3
          </SmallFont>
          <div className="flex">
            {activeStep.nbr < 3 ? (
              <button
                className="text-light-font-100 dark:text-dark-font-100 ml-2.5 h-[30px] text-sm lg:text-[13px] md:text-xs"
                onClick={() => {
                  setShowTuto(false);
                  localStorage.setItem("showTuto", "false");
                }}
              >
                Skip
              </button>
            ) : null}
            <Button
              extraCss="h-[30px] ml-2.5 px-2.5 border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue"
              onClick={() => getNextStep()}
            >
              {activeStep.nbr < 3 ? "Next" : "Done"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
