import {Button, Flex} from "@chakra-ui/react";
import {TextLandingMedium, TextSmall} from "../../../../../UI/Text";
import {useColors} from "../../../../../common/utils/color-mode";

export const StepPopup = ({activeStep, getNextStep, setShowTuto}) => {
  const {boxBg1, text80, boxBg6, text40, borders} = useColors();

  const arrowBottomTop = ["105%", "105%", "47%"];
  const arrowBottomRight = ["50%", "50%", "-25px"];
  return (
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
          transform={[
            "rotate(360deg) translateY(-50%) translateX(50%)",
            "rotate(180deg) translateY(-50%) translateX(50%)",
            "rotate(90deg) translateY(-50%)",
          ]}
          position="absolute"
          top={["-18%", "105%", "47%"]}
          right={["20%", "50%", "-25px"]}
        />
        <TextSmall mb={["5px", "5px", "10px"]} color={text40}>
          Step {activeStep.nbr}
        </TextSmall>
        <TextLandingMedium fontWeight="400">
          {activeStep.title}
        </TextLandingMedium>
        <TextLandingMedium fontWeight="400">
          {activeStep.subtitle}
        </TextLandingMedium>
        <Flex
          mt={["5px", "5px", "10px"]}
          w="100%"
          justify="space-between"
          align="center"
        >
          <TextSmall color={text40}>{activeStep.nbr}/3</TextSmall>
          <Flex>
            {activeStep.nbr < 3 ? (
              <Button
                fontWeight="400"
                color={text80}
                h="30px"
                ml="10px"
                fontSize={["12px", "12px", "13px", "14px"]}
                onClick={() => {
                  setShowTuto(false);
                  localStorage.setItem("showTuto", "false");
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
              onClick={() => getNextStep()}
            >
              {activeStep.nbr < 3 ? "Next" : "Done"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
