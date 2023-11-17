import {ChevronDownIcon} from "@chakra-ui/icons";
import {
  Avatar,
  AvatarGroup,
  Button,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import {blockchainsContent} from "mobula-lite/lib/chains/constants";
import React from "react";
import {TextSmall} from "../../../../../../UI/Text";
import {useColors} from "../../../../../../common/utils/color-mode";
import {mainButtonStyle} from "../../../style";

export const PopoverTrade = ({
  title,
  isImage,
  children,
}: {
  title: string | string[];
  isImage?: boolean;
  children: JSX.Element[] | JSX.Element | any;
}) => {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {boxBg3, borders, bgMain, text80, boxBg6, bordersActive, hover} =
    useColors();
  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      onOpen={onOpen}
      placement="bottom"
    >
      <PopoverTrigger>
        <Button
          isDisabled={title === "All Liquidity Pool"}
          {...mainButtonStyle}
          bg={boxBg6}
          color={text80}
          border={borders}
          fontWeight="500"
          _hover={{
            border: bordersActive,
            bg: hover,
          }}
        >
          {!isImage || !Array.isArray(title) ? title : null}
          {isImage && title?.length > 0 ? (
            <AvatarGroup size="xs" spacing="-5px">
              {Array.isArray(title)
                ? title
                    .filter((_, i) => i < 4)
                    .map((item, i) => (
                      <Avatar
                        border="none"
                        w="18px"
                        h="18px"
                        key={item}
                        bg={bgMain}
                        name={blockchainsContent[title[i]]?.name}
                        src={
                          blockchainsContent[title[i]]?.logo ||
                          `/logo/${title[i]?.toLowerCase().split(" ")[0]}.png`
                        }
                      />
                    ))
                : null}
            </AvatarGroup>
          ) : null}
          {isImage && title?.length > 4 ? (
            <TextSmall ml="5px" mr="5px">
              +{title.length - 4}
            </TextSmall>
          ) : null}
          <ChevronDownIcon fontSize="16px" ml="5px" />
        </Button>
      </PopoverTrigger>
      <PopoverContent bg={boxBg3} p="10px" borderRadius="16px" border={borders}>
        <PopoverCloseButton />
        <PopoverBody>{React.cloneElement(children, {onClose})}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
