import {CheckIcon, CopyIcon} from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  Image,
  Table,
  TableContainer,
  Tbody,
  Text,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {blockchainsContent} from "mobula-lite/lib/chains/constants";
import dynamic from "next/dynamic";
import {useContext, useEffect, useState} from "react";
import {getFormattedAmount} from "../../../../../../../utils/helpers/formaters";
import {createSupabaseDOClient} from "../../../../../../../utils/supabase";
import {Tds} from "../../../../../../UI/Tds";
import {TextSmall} from "../../../../../../UI/Text";
import {Ths} from "../../../../../../UI/Ths";
import {useColors} from "../../../../../../common/utils/color-mode";
import {addressSlicer} from "../../../../../../common/utils/user";
import {ILaunchpad} from "../../../../../Data/Ico/models";
import {BaseAssetContext} from "../../../context-manager";
import {Distribution} from "./distribution";
import {Lines} from "./lines";

const EChart = dynamic(() => import("../../../../../../common/charts/EChart"), {
  ssr: false,
});

export const Tokenomic = () => {
  const {baseAsset} = useContext(BaseAssetContext);
  const {text80, text40, borders, text60, text10} = useColors();
  const [isCopied, setIsCopied] = useState("");
  const [launchpads, setLaunchpads] = useState<ILaunchpad[]>([]);

  const getPercentageOfSupply = () => {
    if (baseAsset)
      return (baseAsset.circulating_supply / baseAsset.total_supply) * 100;

    return 0;
  };

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    setIsCopied(text);
    setTimeout(() => {
      setIsCopied("");
    }, 2000);
  }

  useEffect(() => {
    const supabase = createSupabaseDOClient();
    supabase
      .from("launchpads")
      .select("logo,name")
      .then(r => {
        if (r.data) setLaunchpads(r.data);
      });
  }, []);

  function timestampToDate(timestamp) {
    const date = new Date(timestamp);
    let day: string | number = date.getDate();
    let month: string | number = date.getMonth() + 1;
    const year = date.getFullYear();
    if (day < 10) day = `0${day}`;
    if (month < 10) month = `0${month}`;
    return `${day}/${month}/${year}`;
  }

  const getLogoFromLaunchpad = name => {
    const logo = launchpads?.find(l => l.name === name)?.logo;
    return logo;
  };

  return (
    <Flex
      mt={["0px", "0px", "0px", "20px"]}
      mx="auto"
      w={["95%", "95%", "100%", "100%"]}
      direction={["column-reverse", "column-reverse", "column-reverse", "row"]}
    >
      <Flex
        direction="column"
        maxW="990px"
        w={["100%", "100%", "100%", "calc(100% - 345px)"]}
        mr={["0px", "0px", "0px", "25px"]}
      >
        <Flex direction="column" mt={["20px", "20px", "20px", "0px"]}>
          <Flex align="center" justify="space-between" mb="15px">
            <Text
              fontSize={["14px", "14px", "16px", "18px"]}
              fontWeight="500"
              color={text80}
              mb={["0px", "0px", "10px"]}
            >
              Supply Breakdown
            </Text>{" "}
            <Flex
              w="350px"
              h="30px"
              align="center"
              display={["none", "none", "none", "flex"]}
            >
              <Flex
                h="7px"
                borderRadius="full"
                w="calc(100% - 30px)"
                maxW="320px"
                bg={text10}
              >
                <Flex
                  h="100%"
                  w={`${getPercentageOfSupply().toFixed(2)}%`}
                  bg="blue"
                  borderRadius="full"
                />
              </Flex>
              <TextSmall ml="10px" color={text80}>
                {getPercentageOfSupply().toFixed(2)}%
              </TextSmall>
            </Flex>
          </Flex>
          <Flex w="100%" wrap="wrap">
            <Lines
              title="Total Supply"
              value={getFormattedAmount(baseAsset.total_supply) || 0}
              odd
            />
            <Lines
              title={`${baseAsset?.blockchains[0]} contract address`}
              value={
                getFormattedAmount(baseAsset.total_supply_contracts[0]) || "--"
              }
            />
            <Lines
              title="Circulating Supply"
              value={getFormattedAmount(baseAsset.circulating_supply) || 0}
              odd
            />
            <Lines
              title="Non-Circulating Supply"
              value={
                getFormattedAmount(
                  baseAsset.total_supply - baseAsset.circulating_supply,
                ) || 0
              }
            />
          </Flex>
          <Text
            mt="30px"
            fontSize={["14px", "14px", "16px", "18px"]}
            fontWeight="500"
            color={text80}
            mb="10px"
            display={["none", "none", "none", "flex"]}
          >
            Accounts excluded from circulation
          </Text>
          <Flex w="100%" wrap="wrap">
            {baseAsset?.blockchains?.map((entry, i) => (
              <Flex
                align="center"
                justify="space-between"
                w={["100%", "100%", "50%", "50%"]}
                borderRight={i % 2 === 0 ? borders : "none"}
                py="10px"
                borderBottom={borders}
                px="15px"
              >
                <Flex align="center">
                  <Image
                    src={blockchainsContent[entry]?.logo || "/icon/unknown.png"}
                    boxSize="25px"
                    borderRadius="full"
                    mr="10px"
                  />
                  <TextSmall color={text80}>{entry}</TextSmall>
                  <TextSmall color={text60} ml="7.5px">
                    {addressSlicer(baseAsset?.contracts[i])}
                  </TextSmall>
                  <Button
                    onClick={() => copyToClipboard(baseAsset?.contracts[i])}
                    fontSize="13px"
                  >
                    {isCopied === baseAsset?.contracts[i] ? (
                      <CheckIcon color="green" ml="7.5px" />
                    ) : (
                      <CopyIcon color={text40} ml="7.5px" />
                    )}
                  </Button>
                </Flex>
                <TextSmall textAlign="end" color={text60}>
                  543,654 {baseAsset?.symbol}
                </TextSmall>
              </Flex>
            ))}
          </Flex>
        </Flex>
        <Distribution display={["flex", "flex", "flex", "none"]} mt="20px" />
        <Flex direction="column" mt={["0px", "0px", "0px", "30px"]}>
          <Accordion allowToggle allowMultiple defaultIndex={0}>
            {baseAsset?.sales
              ?.sort((a, b) => a.date - b.date)
              ?.map(sale => (
                <AccordionItem
                  p="0px"
                  border="none"
                  mb="0px"
                  borderRadius="12px"
                >
                  <AccordionButton
                    borderBottom={borders}
                    _hover={{bg: "none"}}
                    py="15px"
                    px="0px"
                  >
                    <Text
                      fontSize={["14px", "14px", "16px", "18px"]}
                      color={text80}
                    >
                      {`${sale.name} (${timestampToDate(sale.date)})`}
                    </Text>
                    <AccordionIcon ml="auto" />
                  </AccordionButton>

                  <AccordionPanel pb="10px" p="0px">
                    <TableContainer className="scroll">
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Ths py="12.5px">Price</Ths>
                            <Ths py="12.5px">Tokens For Sale</Ths>
                            <Ths py="12.5px">Raised</Ths>
                            <Ths py="12.5px" isNumeric>
                              Platform
                            </Ths>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Tds
                              color={text80}
                              fontSize={["12px", "12px", "13px", "14px"]}
                              borderBottom={borders}
                            >
                              $
                              {getFormattedAmount(sale.valuation / sale.amount)}
                            </Tds>
                            <Tds
                              color={text80}
                              fontSize={["12px", "12px", "13px", "14px"]}
                              borderBottom={borders}
                            >
                              {`${getFormattedAmount(sale.amount)} ${
                                baseAsset?.symbol
                              }`}
                            </Tds>
                            <Tds
                              color={text80}
                              fontSize={["12px", "12px", "13px", "14px"]}
                              borderBottom={borders}
                            >
                              {`$${getFormattedAmount(sale.valuation)}`}
                            </Tds>
                            <Tds
                              fontSize={["12px", "12px", "13px", "14px"]}
                              borderBottom={borders}
                              color={text80}
                              isNumeric
                            >
                              {sale.platform ? (
                                <Flex align="center" justify="end">
                                  <Image
                                    src={
                                      getLogoFromLaunchpad(sale.platform) ||
                                      "/icon/unknown.png"
                                    }
                                    boxSize="20px"
                                    borderRadius="full"
                                    mr="7.5px"
                                  />
                                  {sale.platform}{" "}
                                </Flex>
                              ) : (
                                "N/A"
                              )}
                            </Tds>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </AccordionPanel>
                </AccordionItem>
              ))}{" "}
          </Accordion>
        </Flex>
        {baseAsset?.release_schedule?.length > 0 ? (
          <>
            <Text
              mt="30px"
              fontSize={["14px", "14px", "16px", "18px"]}
              fontWeight="500"
              color={text80}
              mb="10px"
              display={["none", "none", "none", "flex"]}
            >
              Vesting schedules
            </Text>
            <EChart
              data={baseAsset?.release_schedule || []}
              timeframe="ALL"
              leftMargin={["15%", "7%"]}
            />
          </>
        ) : null}
      </Flex>

      <Flex
        direction="column"
        display={["none", "none", "none", "flex"]}
        maxW="320px"
        w="100%"
      >
        <Distribution />
        {/* <Fees /> */}
        {/* <ListingDetails /> */}
      </Flex>
    </Flex>
  );
};
