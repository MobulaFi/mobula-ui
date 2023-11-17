import {ChevronDownIcon} from "@chakra-ui/icons";
import {
  Button,
  Icon,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import {TextSmall} from "../../../../../../UI/Text";
import {useColors} from "../../../../../../common/utils/color-mode";
import {mainButtonStyle} from "../../../style";

export const CustomPopOver = ({
  title,
  icon,
  children,
  isMobile,
  logo,
}: {
  title: string;
  icon?: any;
  children: JSX.Element | JSX.Element[] | string;
  isMobile?: boolean;
  logo?: string;
}) => {
  const {boxBg6, text80, borders, boxBg3, bordersActive, hover} = useColors();
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          sx={mainButtonStyle}
          bg={boxBg6}
          border={borders}
          color={text80}
          _hover={{
            border: bordersActive,
            bg: hover,
          }}
          mb="5px"
        >
          {isMobile ? (
            <Image
              src={logo}
              boxSize="15px"
              ml="10px"
              borderRadius="full"
              mr="5px"
            />
          ) : (
            <Icon
              as={icon}
              fontSize="13px"
              color={text80}
              mr={!isMobile ? "5px" : "0px"}
            />
          )}
          <TextSmall fontWeight="500" mt="1px">
            {title}
          </TextSmall>
          <ChevronDownIcon fontSize="16px" ml="2.5px" />
        </Button>
      </PopoverTrigger>
      <PopoverContent border={borders} bg={boxBg3} borderRadius="16px">
        <PopoverBody maxH="246px" pr="0px" overflowY="scroll">
          {children}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
