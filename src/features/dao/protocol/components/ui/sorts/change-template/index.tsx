import {ArrowDownIcon, CheckIcon, CopyIcon} from "@chakra-ui/icons";
import {Button, Flex, Image, Text, useClipboard} from "@chakra-ui/react";
import React from "react";
import {addressSlicer} from "../../../../../../../common/utils/user";
import {TextLandingSmall, TextSmall} from "../../../../../../../UI/Text";
import {BoxContainer} from "../../../../../common/components/box-container";
import {EditingTemplate} from "../../../../models";
import {TitleContainer} from "../../../../../../Misc/Dex/components/ui/container-title";

export const ChangeTemplate = ({
  oldImage,
  newImage,
  oldValue,
  newValue,
  type,
}: EditingTemplate) => {
  const {onCopy, hasCopied} = useClipboard("");
  const isContract = type === "Contract";
  return (
    <BoxContainer mb="20px">
      <TitleContainer px="15px">
        <TextLandingSmall color="text.80">{type} change</TextLandingSmall>
      </TitleContainer>
      <Flex p="20px" direction="column">
        <BoxContainer>
          <TitleContainer px="15px">
            <TextSmall color="text.80">Old {type}</TextSmall>
          </TitleContainer>
          <Flex
            p="10px"
            align="center"
            color="text.80"
            fontSize={["12px", "12px", "13px", "14px"]}
          >
            <Image
              src={oldImage}
              mr="10px"
              borderRadius="full"
              boxSize="26px"
            />
            <Text
              display={["none", "none", "flex"]}
              fontWeight="400"
              overflowX="scroll"
              className="scroll"
              whiteSpace="pre-wrap"
              textAlign="start"
              fontSize={["12px", "12px", "13px", "14px"]}
            >
              {oldValue}
            </Text>
            <Text
              display={["flex", "flex", "none"]}
              fontWeight="400"
              fontSize={["12px", "12px", "13px", "14px"]}
              overflowX="scroll"
              className="scroll"
              whiteSpace="pre-wrap"
              textAlign="start"
            >
              {isContract
                ? `${oldValue?.slice(0, 4)}...${oldValue?.slice(-4)}`
                : oldValue}
            </Text>
            {/* <CopyIcon cursor="pointer" color="text.40" ml="10px" /> */}
          </Flex>
        </BoxContainer>
        <ArrowDownIcon fontSize="30px" my="10px" ml="1.1%" color="text.60" />
        <BoxContainer>
          <TitleContainer px="15px">
            <TextSmall color="text.80">New {type}</TextSmall>
          </TitleContainer>
          <Flex p="10px" align="center" color="text.80">
            <Image
              src={newImage}
              mr="10px"
              borderRadius="full"
              boxSize="26px"
            />
            <Text
              display={[
                isContract ? "none" : "flex",
                isContract ? "none" : "flex",
                "flex",
              ]}
              fontWeight="400"
              overflowX="scroll"
              className="scroll"
              whiteSpace="pre-wrap"
              textAlign="start"
              fontSize={["12px", "12px", "13px", "14px"]}
            >
              {newValue}
            </Text>
            {isContract ? (
              <Text
                display={["flex", "flex", "none"]}
                fontWeight="400"
                overflowX="scroll"
                className="scroll"
                whiteSpace="pre-wrap"
                textAlign="start"
                fontSize={["12px", "12px", "13px", "14px"]}
              >
                {addressSlicer(newValue)}
              </Text>
            ) : null}
            <Button
              cursor="pointer"
              whiteSpace="pre-wrap"
              w="fit-content"
              onClick={() => {
                onCopy();
                navigator.clipboard.writeText(newValue);
              }}
            >
              {hasCopied ? (
                <CheckIcon ml="10px" color="green" />
              ) : (
                <CopyIcon color="text.40" ml="10px" />
              )}
            </Button>
          </Flex>
        </BoxContainer>
      </Flex>
    </BoxContainer>
  );
};
