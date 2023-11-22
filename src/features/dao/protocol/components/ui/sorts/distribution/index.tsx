import {ChevronDownIcon} from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Icon,
  Image,
  Table,
  TableContainer,
  Tbody,
  Text,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {blockchainsContent} from "mobula-lite/lib/chains/constants";
import {useState} from "react";
import {SiConvertio} from "react-icons/si";
import {Tds} from "../../../../../../../UI/Tds";
import {TextSmall} from "../../../../../../../UI/Text";
import {Ths} from "../../../../../../../UI/Ths";
import {InfoPopup} from "../../../../../../../common/components/popup-hover";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {addressSlicer} from "../../../../../../../common/utils/user";
import {BoxContainer} from "../../../../../common/components/box-container";
import {colors} from "../../../../constants";
import {PopupAddress} from "../../popup-address";

export const Distribution = ({token}) => {
  const {borders, text40} = useColors();
  const [isOpen, setIsOpen] = useState(false);

  const getDisplay = () => {
    if (token?.tokenomics?.distribution?.length > 0) return "flex";
    return "none";
  };
  const getRadiusFromIndex = index => {
    if (index === 0) return "8px  0 0 8px";
    if (index === (token?.tokenomics?.distribution?.length || 1) - 1)
      return "0px 8px 8px 0px";
    return "0";
  };

  return (
    <BoxContainer
      mb="20px"
      position="relative"
      transition="all 300ms ease-in-out"
      p={["10px", "10px", "15px", "15px 20px"]}
      borderRadius={["0px", "16px"]}
      display={getDisplay()}
    >
      <Flex
        align="center"
        pb={["10px", "10px", "15px", "20px"]}
        borderBottom={borders}
      >
        <Icon as={SiConvertio} color="blue" />
        <Text fontSize={["14px", "14px", "16px", "18px"]} ml="10px">
          Distribution
        </Text>
        <InfoPopup mb="3px" />
      </Flex>
      <TableContainer mt="0px">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Ths py="15px" px="10px" w="33%" borderTop={borders}>
                Name
              </Ths>
              <Ths py="15px" px="10px" w="33%" borderTop={borders}>
                Percentage
              </Ths>
              <Ths py="15px" px="10px" w="33%" borderTop={borders} isNumeric>
                Address
              </Ths>
            </Tr>
          </Thead>
          <Tbody>
            {token?.tokenomics.distribution?.map((distribution, i) => (
              <Tr key={distribution}>
                <Tds px="10px" py="15px" w="33%">
                  {distribution.name}
                </Tds>
                <Tds px="10px" py="15px" w="33%%">
                  {distribution.percentage}%
                </Tds>
                <Tds px="10px" py="15px" pr="0px" isNumeric w="33%">
                  <Button
                    mr="10px"
                    px="0px"
                    onClick={() => {
                      if (distribution.addresses?.[0]?.address)
                        setIsOpen(distribution.name);
                    }}
                  >
                    <Image
                      src={
                        blockchainsContent[
                          distribution.addresses?.[0]?.blockchain
                        ]?.logo || "/icon/unkown.png"
                      }
                      borderRadius="full"
                      mr="7.5px"
                      boxSize="16px"
                    />{" "}
                    {addressSlicer(distribution.addresses?.[0]?.address)}
                    {distribution.addresses?.[0]?.address ? (
                      <ChevronDownIcon fontSize="15px" ml="5px" />
                    ) : null}
                  </Button>
                  <PopupAddress
                    isOpen={isOpen === distribution.name}
                    setIsOpen={setIsOpen}
                    distribution={
                      token?.tokenomics?.distribution[i]?.name ===
                      distribution?.name
                        ? token?.tokenomics?.distribution[i]
                        : null
                    }
                  />
                  <Flex justify="end" align="center" />
                </Tds>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <TextSmall mt={["15px", "15px", "20px"]} mb="15px" fontWeight="500">
        Supply repartition
      </TextSmall>
      <Flex
        align="center"
        w="100%"
        h={["10px", "12px", "15px"]}
        borderRadius="8px"
      >
        {token?.tokenomics?.distribution?.map(({percentage}, i) => (
          <Flex
            w={`${percentage}%`}
            h="100%"
            bg={colors[i]}
            borderRadius={getRadiusFromIndex(i)}
          />
        ))}
      </Flex>
      <Flex align="center" wrap="wrap">
        {token?.tokenomics?.distribution?.map(({name, percentage}, i) => (
          <Flex align="center" mt="10px">
            <Flex
              borderRadius="full"
              boxSize="12px"
              minW="12px"
              bg={colors[i]}
              mr="5px"
            />
            <TextSmall mr="5px" color={text40}>
              {name}:
            </TextSmall>
            <TextSmall mr="20px">{percentage}%</TextSmall>
          </Flex>
        ))}
      </Flex>
    </BoxContainer>
  );
};
