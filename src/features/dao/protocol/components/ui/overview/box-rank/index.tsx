import {CheckIcon, CloseIcon} from "@chakra-ui/icons";
import {Box, Button, Flex, Text} from "@chakra-ui/react";
import {useContext} from "react";
import {useAlert} from "react-alert";
import {useNetwork, useSwitchNetwork} from "wagmi";
import {writeContract} from "wagmi/actions";
import {PROTOCOL_ADDRESS} from "../../../../../../../../utils/constants";
import {TextLandingSmall, TextSmall} from "../../../../../../../UI/Text";
import {PopupUpdateContext} from "../../../../../../../common/context-manager/popup";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {TitleContainer} from "../../../../../../Misc/Dex/components/ui/container-title";
import {BoxContainer} from "../../../../../common/components/box-container";
import {BoxTime} from "../../../../../common/components/box-time";
// eslint-disable-next-line import/no-cycle
import {OverviewContext} from "../../../../../../../../pages/dao/protocol/overview";

export const RankBox = ({
  goodChoice,
  badChoice,
  tokensOwed,
}: {
  goodChoice: number;
  badChoice: number;
  tokensOwed?: number;
}) => {
  const alert = useAlert();
  const {setConnect} = useContext(PopupUpdateContext);
  const {chain} = useNetwork();
  const {switchNetwork} = useSwitchNetwork();
  const {text80, borders, bordersBlue, boxBg6, hover, bordersActive} =
    useColors();
  const {setTokensOwed} = useContext(OverviewContext);

  const handleClaim = async (e: {
    preventDefault: () => void;
  }): Promise<void> => {
    e.preventDefault();
    if (!chain) {
      setConnect(true);
      return;
    }
    if (chain?.id !== 137) {
      if (switchNetwork) {
        switchNetwork(137);
      } else {
        alert.error("Please connect your wallet to the Polygon network.");
      }
      return;
    }
    try {
      await writeContract({
        address: PROTOCOL_ADDRESS as never,
        abi: [
          {
            inputs: [],
            outputs: [],
            name: "claimRewards",
            type: "function",
            stateMutability: "nonpayable",
          },
        ] as never,
        functionName: "claimRewards" as never,
      });
      setTokensOwed(0);
    } catch (error) {
      console.log(error);
      alert.show("You don't have anything to claim.");
    }
  };

  return (
    <BoxContainer mb="20px" w="100%">
      <TitleContainer px={["5px", "5px", "15px"]}>
        <TextLandingSmall color={text80} ml="10px">
          Overview
        </TextLandingSmall>
      </TitleContainer>
      <Flex
        p="20px 20px 20px 20px"
        align={["flex-start", "center"]}
        justify="space-between"
        color={text80}
        direction={["column", "row"]}
        mb={["0px", "20px", "0px"]}
      >
        <Flex
          w={["100%", "66%", "45%"]}
          justify="space-between"
          color={text80}
          mb={["20px", "0px", "0px"]}
        >
          <Box w={["100%", "auto", "auto", "auto"]} mr="20px">
            <Flex mb="15px" align="center">
              <CheckIcon mr="7.5px" color="green" />
              <Text
                fontSize={["12px", "12px", "13px", "14px"]}
                fontWeight="400"
                whiteSpace="nowrap"
              >
                Correct Decisions
              </Text>
            </Flex>
            <BoxTime>{goodChoice}</BoxTime>
          </Box>
          <Box w={["100%", "auto", "auto", "auto"]} mr="20px">
            <Flex
              mb="15px"
              fontSize={["12px", "12px", "13px", "14px"]}
              fontWeight="400"
              align="center"
            >
              <CloseIcon h="100%" my="auto" mr="7.5px" color="red" />{" "}
              <Text
                fontSize={["12px", "12px", "13px", "14px"]}
                fontWeight="400"
                whiteSpace="nowrap"
              >
                Wrong Decisions
              </Text>
            </Flex>
            <BoxTime>{badChoice}</BoxTime>
          </Box>
        </Flex>
        <Box
          w={["100%", "auto", "auto", "auto"]}
          display={["none", "block"]}
          mr={["0px", "0px", "20px"]}
        >
          <Text
            mb="15px"
            fontSize={["12px", "12px", "13px", "14px"]}
            fontWeight="400"
            whiteSpace="nowrap"
          >
            Mobula owes you
          </Text>
          <Flex align="center">
            <BoxTime>{tokensOwed || 0}</BoxTime>
            <TextSmall ml="10px">MOBL</TextSmall>
          </Flex>
        </Box>
        <Flex
          mb="15px"
          fontSize={["12px", "12px", "13px", "14px"]}
          fontWeight="400"
          align="center"
          display={["flex", "none"]}
        >
          Mobula owes you {tokensOwed || 0} MOBL
        </Flex>
        <Flex
          maxW="230px"
          w={["100%", "100%", "100%", "15%"]}
          display={["flex", "none", "flex"]}
        >
          <Button
            variant="outlined"
            color={text80}
            fontWeight="400"
            fontSize={["12px", "12px", "13px", "14px"]}
            h="30px"
            bg={boxBg6}
            border={tokensOwed && tokensOwed > 0 ? bordersBlue : borders}
            _hover={{
              border:
                tokensOwed && tokensOwed > 0
                  ? bordersActive
                  : "1px solid var(--chakra-colord-blue)",
              bg: hover,
            }}
            w="100%"
            onClick={(e: {preventDefault: () => void}) => handleClaim(e)}
          >
            Claim
          </Button>
        </Flex>
      </Flex>
      <Flex
        maxW="230px"
        w="100%"
        p="20px"
        mt="-40px"
        display={["none", "flex", "none"]}
      >
        <Button
          variant="outlined"
          color={text80}
          fontWeight="400"
          fontSize={["12px", "12px", "13px", "14px"]}
          h="30px"
          border={tokensOwed && tokensOwed > 0 ? bordersBlue : borders}
          w="100%"
          bg={boxBg6}
          _hover={{
            border:
              tokensOwed && tokensOwed > 0
                ? "1px solid var(--chakra-colord-blue)"
                : bordersActive,
            bg: hover,
          }}
          onClick={(e: {preventDefault: () => void}) => handleClaim(e)}
        >
          Claim
        </Button>
      </Flex>
    </BoxContainer>
  );
};
