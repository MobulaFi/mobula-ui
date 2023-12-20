import { Button } from "components/button";
import { LargeFont, MediumFont, SmallFont } from "components/fonts";
import React, { useContext, useEffect } from "react";
import { UserContext } from "../../../../../../contexts/user";
import { pushData } from "../../../../../../lib/mixpanel";
import { PortfolioV2Context } from "../../../context-manager";
import { ActiveStep } from "../../../models";
import { steps } from "../../../utils";

export const StepPopup = () => {
  const { activeStep, setActiveStep, setActiveCategory, activePortfolio } =
    useContext(PortfolioV2Context);
  const { user } = useContext(UserContext);

  const handleStopTuto = () => {
    localStorage.setItem("showTutoPortfolio", "false");
    setActiveStep({} as ActiveStep);
  };

  const isUserPortfolio = activePortfolio?.user !== user?.id;

  useEffect(() => {
    if (
      localStorage.getItem("showTutoPortfolio") !== "false" &&
      isUserPortfolio
    ) {
      setTimeout(() => {
        pushData("Portfolio Tuto Started");
        setActiveStep(steps[0]);
      }, 1000 * 10);
    }
  }, []);

  useEffect(() => {
    if (activeStep.nbr === 4) {
      setActiveCategory("Activity");
    }
  }, [activeStep]);

  let arrowDetails;

  if (activeStep.arrowPosition !== "none")
    arrowDetails =
      activeStep.arrowPosition === "top"
        ? {
            transform: "rotate(360deg) translateY(-50%) translateX(50%)",
            top: activeStep.arrowTop || "-18%",
            right: activeStep.arrowRight || ["20%", "50%", "-25px"],
          }
        : {
            transform: [
              "rotate(180deg) translateY(-50%) translateX(50%)",
              "rotate(360deg) translateY(-50%) translateX(50%)",
              "rotate(270deg) translateY(-50%)",
            ],
            top: activeStep.arrowTop || ["105%", "-18%", "47%"],
            right: activeStep.arrowRight || ["50%", "20%", "-25px"],
          };
  else arrowDetails = { display: "none" };

  //   const arrowBottomTop = ["105%", "105%", "47%"];
  //   const arrowBottomRight = ["50%", "50%", "-25px"];
  return activeStep.nbr ? (
    <div
      className="bg-light-bg-terciary dark:bg-dark-bg-terciary shadow-md z-[5] flex flex-col
     p-[15px] md:p-2.5 absolute rounded-2xl border border-light-border-primary dark:border-light-border-primary
      w-[290px]"
      style={{
        right: activeStep.right,
        top: activeStep.top,
        transform: activeStep.transform || "translateX(50%)",
      }}
    >
      <div className="flex flex-col w-full h-full relative">
        <div className="flex items-center justify-between">
          <LargeFont fontWeight="400" mb={["5px", "5px", "10px"]}>
            {activeStep.title}
          </LargeFont>
          <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
            Step {activeStep.nbr}
          </SmallFont>
        </div>
        <MediumFont>{activeStep.subtitle}</MediumFont>
        <div className="mt-2.5 md:mt-[5px] w-full flex justify-between items-center">
          <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
            {activeStep.nbr}/{steps.length}
          </SmallFont>
          <div className="flex">
            {activeStep.nbr < steps.length ? (
              <button
                className="text-light-font-100 dark:text-dark-font-100 h-[30px] ml-2.5 text-sm lg:text-[13px] md:text-xs"
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
              extraCss="border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue h-[30px] ml-2.5 px-2.5"
              onClick={() => {
                const nextStep = steps[activeStep.nbr];
                if (nextStep) setActiveStep(nextStep);
                else {
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
