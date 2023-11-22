import {CheckIcon, CopyIcon} from "@chakra-ui/icons";
import {Button, Flex, Icon, Image, Text} from "@chakra-ui/react";
import {blockchainsContent} from "mobula-lite/lib/chains/constants";
import {useState} from "react";
import {HiOutlineNewspaper} from "react-icons/hi";
import {TextLandingSmall, TextSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {addressSlicer} from "../../../../../../../common/utils/user";
import {BoxContainer} from "../../../../../common/components/box-container";

export const ContractInformation = ({token}) => {
  const {borders, boxBg6, text80} = useColors();
  const [isCopied, setIsCopied] = useState(false);
  const copyToClipboard = text => {
    navigator.clipboard.writeText(text);
  };

  return (
    <BoxContainer
      mb="20px"
      position="relative"
      transition="all 300ms ease-in-out"
      p={["10px", "10px", "15px", "15px 20px"]}
      borderRadius={["0px", "16px"]}
    >
      <Flex
        align="center"
        borderBottom={borders}
        pb={["10px", "10px", "15px", "20px"]}
      >
        <Icon as={HiOutlineNewspaper} color={text80} />
        <Text fontSize={["14px", "14px", "16px", "18px"]} ml="10px">
          Contract & Information
        </Text>
      </Flex>
      {token?.excludedFromCirculationAddresses.filter(entry => entry.address)
        .length > 0 ? (
        <Flex mt="15px" direction={["column", "column", "row"]}>
          <Flex direction="column" w="100%">
            <TextSmall mb="10px" fontWeight="500">
              Excluded Addresses
            </TextSmall>
            <Flex wrap="wrap">
              {token?.excludedFromCirculationAddresses?.map(
                ({address, blockchain}, i) => (
                  <Flex
                    h="35px"
                    bg={boxBg6}
                    border={borders}
                    color={text80}
                    borderRadius="8px"
                    align="center"
                    mb="7.5px"
                    w={["100%", "100%", "calc(50% - 10px)"]}
                    mr={["0px", "0px", i % 2 !== 0 ? "0px" : "5px"]}
                    ml={["0px", "0px", i % 2 !== 0 ? "5px" : "0px"]}
                    px="7.5px"
                  >
                    <Image
                      src={
                        blockchainsContent[blockchain]?.logo ||
                        "/icon/unknown.png"
                      }
                      boxSize="22px"
                      borderRadius="full"
                      mr="7.5px"
                    />
                    <TextLandingSmall>
                      {addressSlicer(address)}
                    </TextLandingSmall>
                    <Button
                      onClick={() => {
                        copyToClipboard(address);
                        setIsCopied(true);
                        setTimeout(() => {
                          setIsCopied(false);
                        }, 2000);
                      }}
                      opacity={0.6}
                      _hover={{opacity: 1}}
                      w="fit-content"
                      ml="auto"
                    >
                      {!isCopied ? (
                        <CopyIcon color={text80} ml="auto" />
                      ) : (
                        <CheckIcon color="green" ml="auto" />
                      )}
                    </Button>
                  </Flex>
                ),
              )}{" "}
            </Flex>
          </Flex>
        </Flex>
      ) : null}
      <TextSmall
        mt={["15px", "15px", "20px", "30px"]}
        mb="10px"
        fontWeight="500"
      >
        Total supply details
      </TextSmall>
      {token?.totalSupplyContracts[0]?.address ===
      token?.contracts[0]?.address ? (
        <Flex align="center" mb="10px">
          <TextSmall>
            Total supply is the supply of the first contract
          </TextSmall>
          <CheckIcon color="green" ml="10px" />
        </Flex>
      ) : (
        <Flex align="center" mb="10px">
          <TextSmall mb="10px">
            Total supply us a sum of all contracts
          </TextSmall>
          <CheckIcon color="green" ml="10px" />
        </Flex>
      )}
    </BoxContainer>
  );
};
