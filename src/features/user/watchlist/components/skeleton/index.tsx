import {
  Flex,
  Image,
  Table,
  TableContainer,
  Thead,
  Tr,
  useColorMode,
} from "@chakra-ui/react";
import {TextLandingSmall, TextSmall} from "../../../../../UI/Text";
import {NextChakraLink} from "../../../../../common/components/links";
import {TableHeaderEntry} from "../../../../../common/ui/tables/components/table-header-entry";
import {useColors} from "../../../../../common/utils/color-mode";

export const SkeletonTable = () => {
  const {borders, bgMain, text80, text40} = useColors();
  const {colorMode} = useColorMode();
  const isWhiteMode = colorMode === "light";

  return (
    <>
      <TableContainer
        mb="0px"
        mx="auto"
        flexDirection="column"
        alignItems="center"
        position="relative"
        overflow="auto"
        top="0px"
        className="scroll"
        w="100%"
      >
        <Table
          w={["auto", "auto", "100%"]}
          cursor="pointer"
          margin="0px auto"
          position="relative"
        >
          <Thead
            textTransform="capitalize"
            fontFamily="Inter"
            borderTop={borders}
            color="text60"
            position="sticky"
            top="0px"
          >
            <Tr textAlign="left" position="sticky" top="0px">
              <TableHeaderEntry
                title="Rank"
                w="86px"
                canOrder
                zIndex="102"
                bg={bgMain}
              />
              <TableHeaderEntry
                title="Name"
                w="170px"
                canOrder
                zIndex="102"
                bg={bgMain}
              />
              <TableHeaderEntry
                title="Price"
                canOrder
                zIndex="102"
                bg={bgMain}
              />
              <TableHeaderEntry
                title="24 (%)"
                canOrder
                zIndex="102"
                bg={bgMain}
              />
              <TableHeaderEntry
                title="Market Cap"
                canOrder
                zIndex="102"
                bg={bgMain}
              />
              <TableHeaderEntry
                title="Volume (24h)"
                canOrder
                w="162.41px"
                zIndex="102"
                bg={bgMain}
              />{" "}
              <TableHeaderEntry
                title="Chart"
                canOrder
                zIndex="102"
                bg={bgMain}
                w="89px"
              />{" "}
              <TableHeaderEntry
                title="Interact"
                w="89px"
                canOrder
                zIndex="102"
                bg={bgMain}
              />
            </Tr>
          </Thead>
          {/* {isLoading
            ? Array.from({length: 10}).map((_, i) => (
                <Tbody>
                  <Tr position="relative">
                    <Ths isNumeric px={["5px", "5px", "20px"]}>
                      <Flex justify="flex-end">
                        <Skeleton
                          h={["13px", "13px", "14px", "15px"]}
                          borderRadius="4px"
                          w="55px"
                          startColor={boxBg6}
                          endColor={hover}
                        />
                      </Flex>
                    </Ths>
                    <Ths isNumeric>
                      <Flex justify="flex-end">
                        <Skeleton
                          h={["13px", "13px", "14px", "15px"]}
                          borderRadius="4px"
                          w="45px"
                          startColor={boxBg6}
                          endColor={hover}
                        />
                      </Flex>
                    </Ths>
                    <Ths isNumeric>
                      <Flex justify="flex-end">
                        <Skeleton
                          h={["13px", "13px", "14px", "15px"]}
                          borderRadius="4px"
                          w="110px"
                          startColor={boxBg6}
                          endColor={hover}
                        />
                      </Flex>
                    </Ths>
                    <Ths isNumeric>
                      <Flex justify="flex-end">
                        <Skeleton
                          h={["13px", "13px", "14px", "15px"]}
                          borderRadius="4px"
                          w="90px"
                          startColor={boxBg6}
                          endColor={hover}
                        />
                      </Flex>
                    </Ths>
                    <Ths isNumeric>
                      <Flex justify="flex-end">
                        <Skeleton
                          h={["13px", "13px", "14px", "15px"]}
                          borderRadius="4px"
                          w="70px"
                          startColor={boxBg6}
                          endColor={hover}
                        />
                      </Flex>
                    </Ths>

                    <Ths isNumeric>
                      <Flex justify="flex-end">
                        <Skeleton
                          h={["13px", "13px", "14px", "15px"]}
                          borderRadius="4px"
                          w="100px"
                          startColor={boxBg6}
                          endColor={hover}
                        />
                      </Flex>
                    </Ths>
                    <Ths isNumeric>
                      <Flex justify="flex-end">
                        <Skeleton
                          h={["13px", "13px", "14px", "15px"]}
                          borderRadius="4px"
                          w="100px"
                          startColor={boxBg6}
                          endColor={hover}
                        />
                      </Flex>
                    </Ths>
                    <Ths isNumeric>
                      <Flex justify="center">
                        <Skeleton
                          h="20px"
                          borderRadius="4px"
                          w="30px"
                          startColor={boxBg6}
                          endColor={hover}
                        />
                        <Flex
                          direction="column"
                          ml="7.5px"
                          justify="space-between"
                        >
                          <Skeleton
                            boxSize="3px"
                            borderRadius="full"
                            startColor={boxBg6}
                            endColor={hover}
                          />
                          <Skeleton
                            boxSize="3px"
                            borderRadius="full"
                            startColor={boxBg6}
                            endColor={hover}
                          />
                          <Skeleton
                            boxSize="3px"
                            borderRadius="full"
                            startColor={boxBg6}
                            endColor={hover}
                          />
                        </Flex>
                      </Flex>
                    </Ths>
                  </Tr>
                </Tbody>
              ))
            : null} */}
        </Table>
      </TableContainer>

      <Flex
        align="center"
        justify="center"
        my="00px"
        direction="column"
        border={borders}
        borderTop="none"
        pb="50px"
        borderRadius="0px 0px 4px 4px"
      >
        <Image
          mt={isWhiteMode ? "40px" : "0px"}
          src={isWhiteMode ? "/asset/empty-light.png" : "/asset/empty.png"}
          w={[
            isWhiteMode ? "110px" : "180px",
            isWhiteMode ? "110px" : "180px",
            isWhiteMode ? "150px" : "250px",
          ]}
        />{" "}
        <TextLandingSmall
          mt={isWhiteMode ? "15px" : "-20px"}
          textAlign="center"
          color={text80}
        >
          Empty Watchlist
        </TextLandingSmall>
        <Flex align="center" direction="column">
          <TextSmall
            textAlign="center"
            color={text40}
            maxWidth={["340px", "340px", "400px"]}
            w="90%"
          >
            Search for your favorite assets or find new ones by using the views
            on the
          </TextSmall>
          <NextChakraLink color={text80} href="/">
            top 100
          </NextChakraLink>{" "}
          <TextSmall
            textAlign="center"
            color={text40}
            maxWidth={["340px", "340px", "400px"]}
            w="90%"
          >
            page
          </TextSmall>
        </Flex>
      </Flex>
    </>
  );
};
