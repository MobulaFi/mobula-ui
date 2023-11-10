import { Button, Flex, FlexProps } from "@chakra-ui/react";
import React, { useContext } from "react";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { pushData } from "../../../../../../lib/mixpanel";
import { PortfolioV2Context } from "../../../context-manager";
import { getPositionOfSwitcherButton } from "../../../utils";

export const ButtonSlider = ({
  switcherOptions,
  typeSelected,
  setTypeSelected,
  callback,
  ...props
}: {
  switcherOptions: string[];
  typeSelected: string;
  setTypeSelected: React.Dispatch<React.SetStateAction<string>>;
  callback?: (type: string) => void;
} & FlexProps) => {
  const { activeStep } = useContext(PortfolioV2Context);
  const { boxBg6, text40, text80, hover } = useColors();
  return (
    <Flex
      h="38px"
      align="center"
      bg={boxBg6}
      position="relative"
      px="8px"
      borderRadius="8px"
      mb="15px"
      {...props}
    >
      <Flex
        w={`${100 / switcherOptions.length}%`}
        h="30px"
        bg={hover}
        borderRadius="6px"
        position="absolute"
        transition="all 250ms ease-in-out"
        left={getPositionOfSwitcherButton(typeSelected)}
      />
      {switcherOptions.map((type) => (
        <Button
          w={`${100 / switcherOptions.length}%`}
          h="30px"
          fontSize={["12px", "12px", "13px", "14px"]}
          color={typeSelected === type ? text80 : text40}
          fontWeight="400"
          transition="all 250ms ease-in-out"
          isDisabled={type === "Staking"}
          onClick={() => {
            pushData("Portfolio Switch Clicked", {
              type,
            });
            setTypeSelected(type);
            if (callback) callback(type);
          }}
          zIndex={type === "Activity" && activeStep.nbr === 4 ? 5 : 0}
        >
          {type}
        </Button>
      ))}
    </Flex>
  );
};
