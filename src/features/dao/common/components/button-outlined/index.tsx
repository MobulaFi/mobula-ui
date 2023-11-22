import {Button} from "@chakra-ui/react";
import {useColors} from "../../../../../common/utils/color-mode";

export const ButtonOutlined = ({
  children,
  ...props
}: {
  children: JSX.Element | JSX.Element[] | string;
  [key: string]: any;
}) => {
  const {text80} = useColors();
  return (
    <Button
      fontSize="14px"
      fontWeight="400"
      h={["30px", "30px", "32px", "35px"]}
      w="100%"
      maxWidth="110px"
      color={text80}
      variant="outlined"
      transition="all 250ms ease-in-out"
      borderRadius="8px"
      {...props}
    >
      {children}
    </Button>
  );
};
