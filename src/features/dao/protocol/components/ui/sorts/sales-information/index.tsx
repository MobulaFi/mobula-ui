import {
  Flex,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Text,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {SiConvertio} from "react-icons/si";
import {getFormattedAmount} from "../../../../../../../../utils/helpers/formaters";
import {Tds} from "../../../../../../../UI/Tds";
import {Ths} from "../../../../../../../UI/Ths";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BoxContainer} from "../../../../../common/components/box-container";

export const SalesInformation = ({token}) => {
  const {borders} = useColors();
  const getDisplay = () => {
    const sales = token?.tokenomics?.sales;
    if (sales.length > 0) return "flex";
    return "none";
  };
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = `0${date.getDate()}`.slice(-2);
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const year = date.getFullYear();
    if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year))
      return "N/A";
    return `${day}/${month}/${year}`;
  }
  return (
    <BoxContainer
      mb="20px"
      position="relative"
      transition="all 300ms ease-in-out"
      p={["10px", "10px", "15px", "15px 20px"]}
      borderRadius={["0px", "16px"]}
      display={getDisplay()}
    >
      <Flex align="center" pb={["10px", "10px", "15px", "20px"]}>
        <Icon as={SiConvertio} color="blue" />
        <Text fontSize={["14px", "14px", "16px", "18px"]} ml="10px">
          Sales Information
        </Text>
      </Flex>
      <TableContainer mt="0px">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Ths py="15px" px="10px" borderTop={borders}>
                Name
              </Ths>
              <Ths py="15px" px="10px" borderTop={borders}>
                Amount Sold
              </Ths>
              <Ths py="15px" px="10px" borderTop={borders}>
                Price
              </Ths>
              <Ths py="15px" px="10px" borderTop={borders}>
                Platform
              </Ths>
              <Ths py="15px" px="10px" borderTop={borders}>
                Valuation
              </Ths>
              <Ths py="15px" px="10px" borderTop={borders} isNumeric>
                Date
              </Ths>
            </Tr>
          </Thead>
          <Tbody>
            {token?.tokenomics.sales?.map(sale => (
              <Tr key={sale}>
                <Tds px="10px" py="15px">
                  {sale.name}
                </Tds>
                <Tds px="10px" py="15px">
                  {`${sale.amount} ${token.symbol}`}
                </Tds>
                <Tds px="10px" py="15px">
                  ${getFormattedAmount(sale.price)}
                </Tds>
                <Tds px="10px" py="15px">
                  {sale.platform}
                </Tds>
                <Tds px="10px" py="15px">
                  {sale.valuation}%
                </Tds>
                <Tds px="10px" py="15px" isNumeric>
                  {formatDate(sale.date)}
                </Tds>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </BoxContainer>
  );
};

/* <Flex mt="15px" direction={["column", "column", "row"]}>
        <Flex
          direction="column"
          w={["100%", "100%", "50%"]}
          pr={["0px", "0px", "10px"]}
        >
          <TextSmall mb="10px" fontWeight="500">
            Excluded Addresses
          </TextSmall>
          {token?.excludedFromCirculationAddresses?.map(
            ({address, blockchain}) => (
              <Flex
                h="35px"
                bg={boxBg6}
                border={borders}
                color={text80}
                w="100%"
                mx="auto"
                borderRadius="8px"
                align="center"
                px="6px"
                mb="7.5px"
              >
                <Image
                  src={
                    blockchainsContent[blockchain]?.logo || "/icon/unknown.png"
                  }
                  boxSize="22px"
                  borderRadius="full"
                  mr="7.5px"
                />
                <TextLandingSmall>{addressSlicer(address)}</TextLandingSmall>
                <ExternalLinkIcon color={text40} ml="auto" />
              </Flex>
            ),
          )}
        </Flex>
        <Flex
          direction="column"
          w={["100%", "100%", "50%"]}
          pl={["0px", "0px", "10px"]}
          mt={["15px", "15px", "0px"]}
        >
          <TextSmall mb="10px" fontWeight="500">
            Share(s) & Initials Tokens
          </TextSmall>
          {token?.totalSupplyContracts?.map(({address, blockchain}) => (
            <Flex
              h="35px"
              bg={boxBg6}
              border={borders}
              color={text80}
              w="100%"
              mx="auto"
              borderRadius="8px"
              align="center"
              px="6px"
              mb="7.5px"
            >
              <Image
                src={
                  blockchainsContent[blockchain]?.logo || "/icon/unknown.png"
                }
                boxSize="22px"
                borderRadius="full"
                mr="7.5px"
              />
              <TextLandingSmall>{addressSlicer(address)}</TextLandingSmall>
              <ExternalLinkIcon color={text40} ml="auto" />
            </Flex>
          ))}
        </Flex>
      </Flex> */
