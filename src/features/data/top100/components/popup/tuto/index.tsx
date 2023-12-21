import React, { SetStateAction, useEffect } from "react";
import { Button } from "../../../../../../components/button";
import {
  LargeFont,
  MediumFont,
  SmallFont,
} from "../../../../../../components/fonts";
import { pushData } from "../../../../../../lib/mixpanel";
import { steps } from "../../../constants";
import { useTop100 } from "../../../context-manager";
import { IViewStep } from "../../../models";

interface TutorialProps {
  setActiveDisplay: React.Dispatch<SetStateAction<string>>;
  setShowTuto: React.Dispatch<SetStateAction<boolean>>;
}

export const Tutorial = ({ setActiveDisplay, setShowTuto }: TutorialProps) => {
  const { activeStep, setActiveStep } = useTop100();

  const handleStopTuto = () => {
    localStorage.setItem("showTutoViews", "false");
    setActiveStep({} as IViewStep);
    setShowTuto(false);
  };

  useEffect(() => {
    if (localStorage.getItem("showTutoViews") !== "false") {
      setTimeout(() => {
        pushData("Portfolio Tuto Started");
        setActiveStep(steps[0]);
      }, 1000 * 10);
    }
  }, []);

  return activeStep.nbr ? (
    <div
      className="bg-light-bg-hover dark:bg-dark-bg-hover z-[1000] flex flex-col
     p-[15px] md:px-2.5 absolute rounded-2xl border border-light-border-primary
      dark:border-dark-border-primary w-[290px]"
      style={{
        right: activeStep.right,
        top: "50px",
        transform: "translateX(50%)",
      }}
    >
      <div className="flex flex-col w-full h-full relative">
        <div className="flex items-center justify-between">
          <LargeFont extraCss="mb-2.5 md:mb-[5px]">
            {activeStep.title}
          </LargeFont>
          <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
            Step {activeStep.nbr}
          </SmallFont>
        </div>
        <MediumFont>{activeStep.subtitle}</MediumFont>
        <div className="flex mt-2.5 md:mt-[5px] w-full justify-between items-center">
          <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
            {activeStep.nbr}/{steps.length}
          </SmallFont>
          <div className="flex">
            {activeStep.nbr < steps.length ? (
              <button
                className="text-light-font-100 dark:text-dark-font-100 text-sm lg:text-[13px] md:text-xs 
              h-[30px] ml-2.5"
                onClick={() => {
                  pushData("Portfolio Tuto Skipped", {
                    step: activeStep.nbr,
                  });
                  handleStopTuto();
                }}
              >
                Skip
              </button>
            ) : null}
            <Button
              extraCss="ml-2.5 px-2.5 h-[30px] border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue"
              onClick={() => {
                const nextStep = steps[activeStep.nbr];
                if (nextStep) {
                  setActiveDisplay("filters");
                  setActiveStep(nextStep);
                } else {
                  pushData("Portfolio Tuto Completed");
                  handleStopTuto();
                }
              }}
            >
              {activeStep.nbr < steps.length ? "Next" : "Done"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};
