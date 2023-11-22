import {
  Flex,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Text,
  Thead,
  Tr,
  useColorMode,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import {AiOutlineLineChart} from "react-icons/ai";
import {getFormattedAmount} from "../../../../../../../../utils/helpers/formaters";
import {Tds} from "../../../../../../../UI/Tds";
import {TextSmall} from "../../../../../../../UI/Text";
import {Ths} from "../../../../../../../UI/Ths";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BoxContainer} from "../../../../../common/components/box-container";

const EChart = dynamic(
  () => import("../../../../../../../common/charts/EChart"),
  {
    ssr: false,
  },
);

export const VestingInformation = ({token}) => {
  const {borders} = useColors();
  const {colorMode} = useColorMode();
  const whiteMode = colorMode === "dark";

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const day = `0${date.getDate()}`.slice(-2);
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const formatVesting = () => {
    const vesting = token?.tokenomics.vestingSchedule.map(v => [v[0], v[1]]);
    return vesting;
  };

  const getDisplay = () => {
    const vesting = token?.tokenomics.vestingSchedule;
    if (vesting.length > 0) return "flex";
    return "none";
  };

  console.log(token?.tokenomics.vestingSchedule, "vestingSchedule");

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
        <Icon as={AiOutlineLineChart} color="blue" fontSize="18px" />
        <Text fontSize={["14px", "14px", "16px", "18px"]} ml="10px">
          Vesting Information
        </Text>
      </Flex>
      <TableContainer mt="0px">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Ths py="15px" px="10px" borderTop={borders}>
                Unlocked Amount
              </Ths>
              <Ths py="15px" px="10px" borderTop={borders} isNumeric>
                Date
              </Ths>
              <Ths py="15px" px="10px" borderTop={borders} isNumeric>
                Breakdown
              </Ths>
            </Tr>
          </Thead>
          <Tbody>
            {token?.tokenomics.vestingSchedule?.map(vesting => (
              <Tr key={vesting}>
                <Tds px="10px" py="15px">
                  {getFormattedAmount(vesting[1])} {token?.symbol}
                </Tds>
                <Tds px="10px" py="15px" isNumeric>
                  {formatDate(vesting[0])}
                </Tds>
                <Tds px="10px" py="15px" isNumeric>
                  {vesting[2].length
                    ? vesting[2].map(entry => (
                        <TextSmall>
                          {entry.name}: {getFormattedAmount(entry.amount)}{" "}
                          {token?.symbol}
                        </TextSmall>
                      ))
                    : "--"}
                </Tds>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex w="100%" mt="20px" position="relative">
        {formatVesting().length >= 2 &&
        formatVesting()?.[1][0] &&
        formatVesting()?.[1][1] ? (
          <>
            <TextSmall
              position="absolute"
              fontWeight="500"
              left="0px"
              top="0px"
              zIndex={1}
            >
              Vesting schedule chart
            </TextSmall>
            <EChart
              data={formatVesting()}
              leftMargin={["0%", "0%"]}
              height={300}
              timeframe="ALL"
              bg={whiteMode ? "#F7F7F7" : "#151929"}
            />
            {/* #151929 */}
          </>
        ) : null}{" "}
      </Flex>
    </BoxContainer>
  );
};
