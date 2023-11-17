import { Flex, Skeleton } from "@chakra-ui/react";
import { useColors } from "lib/chakra/colorMode";
import { Ths } from "../../../components/table";
import { useTop100 } from "../../../features/data/top100/context-manager";

export const SkeletonTable = ({
  isTable = false,
  isWatchlist,
  i,
}: {
  isTable: boolean;
  isWatchlist: boolean;
  i?: number;
}) => {
  const { boxBg6, hover, bgTable, text100, bgMain } = useColors();
  const { isLoading, isPortfolioLoading, portfolio, activeView } = useTop100();
  return (
    <>
      {isLoading || isPortfolioLoading ? (
        <tbody>
          <tr className="relative">
            {isTable ? (
              <>
                <Ths
                  display={["none", "none", "table-cell"]}
                  h="auto"
                  bg={isTable ? bgTable : bgMain}
                >
                  {isWatchlist ? (
                    <Flex align="center" justify="center">
                      <Skeleton
                        boxSize={["14px", "14px", "15px", "16px"]}
                        borderRadius="full"
                        startColor={boxBg6}
                        endColor={hover}
                      />
                      <Skeleton
                        h={["14px", "14px", "15px", "16px"]}
                        ml="5px"
                        borderRadius="4px"
                        w="30px"
                        startColor={boxBg6}
                        endColor={hover}
                      />
                    </Flex>
                  ) : (
                    <Flex justify="flex-start">
                      <Skeleton
                        startColor={boxBg6}
                        endColor={hover}
                        h="20px"
                        w="80px"
                      />{" "}
                    </Flex>
                  )}
                </Ths>
                <Ths
                  px={["10px", "10px", "20px"]}
                  position="sticky"
                  bg={isTable ? bgTable : bgMain}
                  top="0px"
                  left="-1px"
                >
                  {isWatchlist ? (
                    <Flex align="center">
                      <Skeleton
                        boxSize="25px"
                        borderRadius="full"
                        startColor={boxBg6}
                        endColor={hover}
                        mr="10px"
                      />
                      <Flex direction="column">
                        <Skeleton
                          h={["13px", "13px", "14px", "15px"]}
                          mb="5px"
                          borderRadius="4px"
                          w="60px"
                          startColor={boxBg6}
                          endColor={hover}
                        />
                        <Skeleton
                          h={["13px", "13px", "14px", "15px"]}
                          mb="5px"
                          borderRadius="4px"
                          w="40px"
                          startColor={boxBg6}
                          endColor={hover}
                        />
                      </Flex>
                    </Flex>
                  ) : (
                    <Flex align="center">
                      <Skeleton
                        startColor={boxBg6}
                        endColor={hover}
                        boxSize="24px"
                        borderRadius="full"
                        mr="10px"
                      />
                      <Flex direction={["column", "column", "row"]}>
                        <Skeleton
                          h="20px"
                          w="80px"
                          mb={["3px", "3px", "0px"]}
                          mr="5px"
                          startColor={boxBg6}
                          endColor={hover}
                        />
                        <Skeleton
                          h="20px"
                          w="40px"
                          mb={["3px", "3px", "0px"]}
                          mr="5px"
                          startColor={boxBg6}
                          endColor={hover}
                        />
                      </Flex>
                    </Flex>
                  )}
                </Ths>
              </>
            ) : (
              <>
                <Ths
                  position="sticky"
                  bg={isTable ? bgTable : bgMain}
                  top="0px"
                  left="-1px"
                >
                  <Flex align="center">
                    <Skeleton
                      boxSize="24px"
                      startColor={boxBg6}
                      endColor={hover}
                      borderRadius="full"
                      mr="10px"
                    />

                    <Flex direction={["column", "column", "row"]}>
                      <Skeleton
                        h="20px"
                        w="80px"
                        mb={["3px", "3px", "0px"]}
                        mr="5px"
                        startColor={boxBg6}
                        endColor={hover}
                      />
                      <Skeleton
                        h="20px"
                        w="40px"
                        mb={["3px", "3px", "0px"]}
                        mr="5px"
                        startColor={boxBg6}
                        endColor={hover}
                      />
                    </Flex>
                  </Flex>
                </Ths>
                <Ths>
                  <Flex justify={isTable ? "flex-start" : "flex-end"}>
                    <Skeleton
                      startColor={boxBg6}
                      endColor={hover}
                      h="20px"
                      w="80px"
                    />
                  </Flex>
                </Ths>
              </>
            )}

            <Ths isNumeric px={["5px", "5px", "20px"]}>
              {isWatchlist ? (
                <Flex justify="flex-end">
                  <Skeleton
                    h={["13px", "13px", "14px", "15px"]}
                    borderRadius="4px"
                    w="55px"
                    startColor={boxBg6}
                    endColor={hover}
                  />
                </Flex>
              ) : (
                <Flex justify="flex-end">
                  <Skeleton
                    startColor={boxBg6}
                    endColor={hover}
                    h="20px"
                    w="50px"
                  />
                </Flex>
              )}
            </Ths>
            <Ths isNumeric>
              {isWatchlist ? (
                <Flex justify="flex-end">
                  <Skeleton
                    h={["13px", "13px", "14px", "15px"]}
                    borderRadius="4px"
                    w="45px"
                    startColor={boxBg6}
                    endColor={hover}
                  />
                </Flex>
              ) : (
                <Flex direction="column" align="flex-end">
                  {!isTable ? (
                    <Skeleton
                      startColor={boxBg6}
                      endColor={hover}
                      h="14px"
                      w="40px"
                    />
                  ) : null}
                  <Skeleton
                    startColor={boxBg6}
                    endColor={hover}
                    h={isTable ? "20px" : "14px"}
                    mt="5px"
                    w="90px"
                  />
                </Flex>
              )}
            </Ths>
            <Ths isNumeric>
              {isWatchlist ? (
                <Flex justify="flex-end">
                  <Skeleton
                    h={["13px", "13px", "14px", "15px"]}
                    borderRadius="4px"
                    w="110px"
                    startColor={boxBg6}
                    endColor={hover}
                  />
                </Flex>
              ) : (
                <Flex justify="flex-end">
                  <Skeleton
                    startColor={boxBg6}
                    endColor={hover}
                    h="20px"
                    w="50px"
                  />
                </Flex>
              )}
            </Ths>
            <Ths isNumeric>
              {isWatchlist ? (
                <Flex justify="flex-end">
                  <Skeleton
                    h={["13px", "13px", "14px", "15px"]}
                    borderRadius="4px"
                    w="90px"
                    startColor={boxBg6}
                    endColor={hover}
                  />
                </Flex>
              ) : (
                <Flex direction="column" align="flex-end">
                  {!isTable ? (
                    <Skeleton
                      startColor={boxBg6}
                      endColor={hover}
                      h="14px"
                      w="40px"
                    />
                  ) : null}
                  <Skeleton
                    startColor={boxBg6}
                    endColor={hover}
                    h={isTable ? "20px" : "14px"}
                    mt="5px"
                    w="40px"
                  />
                </Flex>
              )}
            </Ths>
            <Ths isNumeric>
              {isWatchlist ? (
                <Flex justify="flex-end">
                  <Skeleton
                    h={["13px", "13px", "14px", "15px"]}
                    borderRadius="4px"
                    w="70px"
                    startColor={boxBg6}
                    endColor={hover}
                  />
                </Flex>
              ) : (
                <Flex align="center" justify="flex-end" w="100%">
                  <Skeleton
                    h="20px"
                    w="20px"
                    mr="5px"
                    startColor={boxBg6}
                    endColor={hover}
                  />
                  <Skeleton
                    h="20px"
                    w="20px"
                    startColor={boxBg6}
                    endColor={hover}
                  />
                </Flex>
              )}
            </Ths>

            <Ths isNumeric>
              {isWatchlist ? (
                <Flex justify="flex-end">
                  <Skeleton
                    h={["13px", "13px", "14px", "15px"]}
                    borderRadius="4px"
                    w="100px"
                    startColor={boxBg6}
                    endColor={hover}
                  />
                </Flex>
              ) : (
                <Skeleton
                  startColor={boxBg6}
                  endColor={hover}
                  h="50px"
                  w="140px"
                />
              )}
            </Ths>

            {isWatchlist ? (
              <Ths isNumeric>
                <Flex justify="center">
                  <Skeleton
                    h="20px"
                    borderRadius="4px"
                    w="30px"
                    startColor={boxBg6}
                    endColor={hover}
                  />
                  <Flex direction="column" ml="7.5px" justify="space-between">
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
            ) : null}
          </tr>
        </tbody>
      ) : null}
      {/* {activeView?.name !== "Portfolio" && !isLoading && !isPortfolioLoading ? (
        <TableCaption
          w={["100vw", "100vw", "100vw", "100%"]}
          h={["300px", "400px", "450px", "600px"]}
          display={i === 0 ? "caption" : "none"}
        >
          <Flex
            direction="column"
            align="center"
            justify="center"
            pt="100px"
            w={["100%", "calc(100% - 5%)", "calc(100% - 10%)", "auto"]}
            mr="0px"
          >
            <TextLandingLarge w="fit-content" mb="10px">
              No results
            </TextLandingLarge>
            <TextLandingSmall w="fit-content">
              Try changing your filters or search
            </TextLandingSmall>
          </Flex>
        </TableCaption>
      ) : null}
      {activeView?.name === "Portfolio" &&
      !isLoading &&
      !portfolio?.length &&
      !isPortfolioLoading ? (
        <TableCaption
          w={["100vw", "100vw", "100vw", "100%"]}
          h={["300px", "400px", "450px", "600px"]}
          display={i === 0 ? "caption" : "none"}
        >
          <Flex
            direction="column"
            align="center"
            justify="center"
            pt="100px"
            w={["100%", "calc(100% - 5%)", "calc(100% - 10%)", "auto"]}
            mr="0px"
          >
            <TextLandingLarge w="fit-content" mb="10px">
              Empty Portfolio
            </TextLandingLarge>
            <TextLandingSmall w="fit-content">
              You can add assets to your portfolio{" "}
              <NextChakraLink href="/swap" color={text100}>
                here
              </NextChakraLink>
            </TextLandingSmall>
          </Flex>
        </TableCaption>
      ) : null} */}
    </>
  );
};
