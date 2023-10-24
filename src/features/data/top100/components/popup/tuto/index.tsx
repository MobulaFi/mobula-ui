import { Button, Flex } from "@chakra-ui/react";
import React, { SetStateAction, useEffect } from "react";
import {
  TextLandingMedium,
  TextLandingSmall,
  TextSmall,
} from "../../../../../../components/fonts";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { pushData } from "../../../../../../lib/mixpanel";
import { steps } from "../../../constants";
import { useTop100 } from "../../../context-manager";
import { IViewStep } from "../../../models";

export const Tutorial = ({
  setActiveDisplay,
  setShowTuto,
}: {
  setActiveDisplay: React.Dispatch<SetStateAction<string>>;
  setShowTuto: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const { hover, text80, text40, borders } = useColors();
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
    <Flex
      bg={hover}
      zIndex="10010"
      direction="column"
      p={["10px", "10px", "15px"]}
      position="absolute"
      borderRadius="16px"
      border={borders}
      w="290px"
      right={activeStep.right}
      top={activeStep.top}
      transform={activeStep.transform || "translateX(50%)"}
    >
      <Flex direction="column" w="100%" h="100%" position="relative">
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
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  ) : null;
};
