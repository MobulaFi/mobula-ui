import {
  Flex,
  Image,
  Table,
  TableContainer,
  Tbody,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {useContext, useState} from "react";
import {TextLandingMedium, TextSmall} from "../../../../../../../UI/Text";
import {Ths} from "../../../../../../../UI/Ths";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../../context-manager";
import {Tds} from "../../../ui/td";

export const Investors = () => {
  const {text80, hover, boxBg6, shadow, borders} = useColors();
  const {baseAsset} = useContext(BaseAssetContext);
  const [isHover, setIsHover] = useState("");
  const isMobile =
    (typeof window !== "undefined" ? window.innerWidth : 0) < 768;

  const investorsPerSales = baseAsset?.sales?.map(sale => ({
    name: sale.name,
    investors: sale.investors,
  }));

  const getStageForInvestors = investorID => {
    const investors = [];
    investorsPerSales.forEach(sale => {
      sale?.investors?.forEach(investor => {
        if (investorID === investor.name) {
          investors.push(sale.name);
        }
      });
    });
    return investors;
  };

  const getNameTypeFormatted = type => {
    if (!isMobile) return type;
    switch (type) {
      case "Ventures Capital":
        return "VC";
      case "Angel Investor":
        return "BA";
      case "Exchange":
        return "CEX";
      default:
        return type;
    }
  };

  return (
    <>
      <TextLandingMedium color={text80} mb="15px" mt="20px">
        Investors
      </TextLandingMedium>
      <TableContainer className="scroll">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Ths
                px={["5px", "10px", "20px"]}
                textAlign="center"
                maxW="50px"
                pr="0px"
                pl="0px"
                display={["none", "none", "table-cell"]}
              >
                Rank
              </Ths>
              <Ths px={["5px", "10px", "20px"]}>Name</Ths>
              <Ths px={["5px", "10px", "20px"]} textAlign="start">
                Tier
              </Ths>
              <Ths px={["10px", "10px", "20px"]}>Type</Ths>
              <Ths px={["5px", "10px", "20px"]}>Stage</Ths>
            </Tr>
          </Thead>
          <Tbody>
            {baseAsset?.investors
              ?.sort((a, b) => b.rating - a.rating)
              ?.map((investor, i) => {
                const stages = getStageForInvestors(investor.name);
                const hasMoreThanOneStage = stages?.length > 1;
                const typeFormatted = getNameTypeFormatted(investor.type);
                return (
                  <Tr>
                    <Tds
                      borderBottom={borders}
                      maxW="100px"
                      pr="0px"
                      py="14px"
                      pl="0px"
                      display={["none", "none", "table-cell"]}
                    >
                      <TextSmall textAlign="center" w="100%">
                        {i + 1}
                      </TextSmall>
                    </Tds>
                    <Tds
                      borderBottom={borders}
                      py="14px"
                      px={["5px", "10px", "20px"]}
                    >
                      <Flex align="center">
                        <Flex
                          position="relative"
                          w="fit-content"
                          h="fit-content"
                        >
                          <Image
                            src={investor.image}
                            fallbackSrc="/icon/unknown.png"
                            boxSize={["25px", "25px", "30px"]}
                            borderRadius="full"
                            minW={["25px"]}
                            mr={["10px", "10px", "7.5px"]}
                          />
                          <Image
                            src={investor?.country?.flag}
                            boxSize="14px"
                            borderRadius="full"
                            bottom="-5px"
                            position="absolute"
                            display={["flex", "flex", "none"]}
                            right="5px"
                            border={borders}
                            zIndex={1}
                          />
                        </Flex>
                        <Flex direction="column">
                          <TextSmall
                            fontWeight="500"
                            minW={["110px", "auto"]}
                            whiteSpace="pre-wrap"
                          >
                            {investor.name}
                          </TextSmall>
                          <TextSmall
                            fontSize={["10px", "10px", "11px", "12px"]}
                            display={["none", "none", "flex"]}
                          >
                            {investor?.country?.name}
                          </TextSmall>
                        </Flex>
                      </Flex>
                    </Tds>
                    <Tds
                      borderBottom={borders}
                      py="14px"
                      isNumeric
                      px={["5px", "10px", "20px"]}
                    >
                      <TextSmall fontWeight="500" textAlign="start">
                        {investor.tier || "--"}
                      </TextSmall>
                    </Tds>
                    <Tds
                      borderBottom={borders}
                      py="14px"
                      px={["10px", "10px", "20px"]}
                    >
                      <TextSmall
                        fontWeight="500"
                        textAlign={["center", "start"]}
                      >
                        {typeFormatted}
                      </TextSmall>
                    </Tds>
                    <Tds
                      borderBottom={borders}
                      py="14px"
                      px={["5px", "10px", "20px"]}
                    >
                      <Flex
                        bg={boxBg6}
                        px="8px"
                        borderRadius="8px"
                        fontWeight="500"
                        fontSize={["12px", "12px", "13px", "14px"]}
                        color={text80}
                        align="center"
                        justify="center"
                        w="fit-content"
                        position="relative"
                        cursor={hasMoreThanOneStage ? "pointer" : "default"}
                        border={borders}
                        onMouseEnter={() => {
                          if (hasMoreThanOneStage) setIsHover(investor.name);
                        }}
                        onMouseLeave={() => setIsHover("")}
                      >
                        {hasMoreThanOneStage
                          ? `${stages?.length || 0} Rounds`
                          : stages?.[0] || "--"}
                        {isHover === investor.name ? (
                          <Flex
                            position="absolute"
                            top="calc(100% + 5px)"
                            zIndex={1}
                            bg={hover}
                            boxShadow={shadow}
                            border={borders}
                            px="10px"
                            py="5px"
                            borderRadius="8px"
                            maxW="fit-content"
                            minW="fit-content"
                            w="100%"
                            direction="column"
                            onMouseLeave={() => setIsHover("")}
                            fontWeight="500"
                            fontSize={["12px", "12px", "13px", "14px"]}
                          >
                            {stages?.map(entry => (
                              <TextSmall>{entry}</TextSmall>
                            ))}
                          </Flex>
                        ) : null}
                      </Flex>
                    </Tds>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
