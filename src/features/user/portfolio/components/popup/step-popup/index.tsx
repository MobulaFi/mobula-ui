import { Button, Flex } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import {
  TextLandingMedium,
  TextLandingSmall,
  TextSmall,
} from "../../../../../../components/fonts";
import { UserContext } from "../../../../../../contexts/user";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { pushData } from "../../../../../../lib/mixpanel";
import { PortfolioV2Context } from "../../../context-manager";
import { ActiveStep } from "../../../models";
import { steps } from "../../../utils";

export const StepPopup = () => {
  const { boxBg1, text80, boxBg6, text40, borders } = useColors();
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
    <Flex
      bg={boxBg1}
      zIndex="5"
      direction="column"
      p={["10px", "10px", "15px"]}
      position="absolute"
      borderRadius="16px"
      border={borders}
      w="290px"
      right={activeStep.right}
      top={activeStep.top}
      transform={activeStep.transform}
    >
      <Flex direction="column" w="100%" h="100%" position="relative">
        <Flex
          borderRight="10px solid transparent"
          borderLeft="10px solid transparent"
          borderBottom={`15px solid ${boxBg6}`}
          position="absolute"
          {...arrowDetails}
        />
        <Flex align="center" justify="space-between">
          <TextLandingMedium fontWeight="400" mb={["5px", "5px", "10px"]}>
            {activeStep.title}
          </TextLandingMedium>
          <TextSmall color={text40}>Step {activeStep.nbr}</TextSmall>
        </Flex>
        <TextLandingSmall fontWeight="400">
          {activeStep.subtitle}
        </TextLandingSmall>
        <Flex
          mt={["5px", "5px", "10px"]}
          w="100%"
          justify="space-between"
          align="center"
        >
          <TextSmall color={text40}>
            {activeStep.nbr}/{steps.length}
          </TextSmall>
          <Flex>
            {activeStep.nbr < steps.length ? (
              <Button
                fontWeight="400"
                color={text80}
                h="30px"
                ml="10px"
                fontSize={["12px", "12px", "13px", "14px"]}
                onClick={() => {
                  pushData("Portfolio Tuto Skipped", {
                    step: activeStep.nbr,
                  });
                  handleStopTuto();
                }}
              >
                Skip
              </Button>
            ) : null}
            <Button
              variant="outlined"
              fontWeight="400"
              color={text80}
              fontSize={["12px", "12px", "13px", "14px"]}
              h="30px"
              ml="10px"
              px="10px"
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
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  ) : null;
};
