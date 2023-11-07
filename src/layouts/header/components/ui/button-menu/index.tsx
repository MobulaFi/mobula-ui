import {Button, ButtonProps} from "@chakra-ui/react";
import {useColors} from "../../../../../common/utils/color-mode";

export const MenuButton = ({
  top,
  isVisible,
  isConnected,
  children,
  ...props
}: {
  top: string;
  isVisible: boolean;
  isConnected: boolean;
  children: JSX.Element | JSX.Element[];
} & ButtonProps) => {
  const {borders, hover} = useColors();
  return (
    <Button
      position="absolute"
      visibility={isConnected && isVisible ? "visible" : "hidden"}
      right="0px"
      opacity={isConnected && isVisible ? 1 : 0}
      transition="all 300ms ease-in-out"
      top={isConnected && isVisible ? top : "0px"}
      border={borders}
      h="35px"
      w="145px"
      borderRadius="10px"
      _hover={{bg: hover}}
      {...props}
    >
      {children}
    </Button>
  );
};
