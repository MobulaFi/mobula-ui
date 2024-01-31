import { MediumFont, SmallFont } from "components/fonts";
import { NextChakraLink } from "components/link";
import { TableHeaderEntry } from "layouts/tables/components/table-header-entry";
import { useTheme } from "next-themes";

export const SkeletonTable = () => {
  const { theme } = useTheme();
  const isWhiteMode = theme === "light";

  return (
    <>
      <div className="flex flex-col mx-auto w-full scroll relative overflow-scroll items-center top-0">
        <table className="w-full md:w-auto relative mx-auto cursor-pointer">
          <thead className="border-t border-light-border-primary dark:border-dark-border-primary sticky top-0">
            <tr className="text-start sticky top-0">
              <TableHeaderEntry
                title="Rank"
                extraCss="w-[86px] z-[102] bg-light-bg-primary dark:bg-dark-bg-primary"
                canOrder
              />
              <TableHeaderEntry
                title="Name"
                extraCss="w-[170px] z-[102] bg-light-bg-primary dark:bg-dark-bg-primary"
                canOrder
              />
              <TableHeaderEntry
                title="Price"
                canOrder
                extraCss="z-[102] bg-light-bg-primary dark:bg-dark-bg-primary"
              />
              <TableHeaderEntry
                title="24 (%)"
                canOrder
                extraCss="z-[102] bg-light-bg-primary dark:bg-dark-bg-primary"
              />
              <TableHeaderEntry
                title="Market Cap"
                canOrder
                extraCss="z-[102] bg-light-bg-primary dark:bg-dark-bg-primary"
              />
              <TableHeaderEntry
                title="Volume (24h)"
                canOrder
                extraCss="w-[162.5px] z-[102] bg-light-bg-primary dark:bg-dark-bg-primary"
              />{" "}
              <TableHeaderEntry
                title="Chart"
                canOrder
                extraCss="w-[89px] z-[102] bg-light-bg-primary dark:bg-dark-bg-primary"
              />{" "}
              <TableHeaderEntry
                title="Swap"
                canOrder
                extraCss="w-[89px] z-[102] bg-light-bg-primary dark:bg-dark-bg-primary"
              />
            </tr>
          </thead>
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
        </table>
      </div>
      <div
        className="flex items-center justify-center flex-col border border-light-border-primary
       dark:border-dark-border-primary border-t-0 pb-[50px] rounded-b"
      >
        <img
          className={`${
            isWhiteMode
              ? "mt-[40px] w-[150px] md:w-[110px]"
              : "w-[250px] md:w-[180px]"
          }`}
          src={isWhiteMode ? "/asset/empty-light.png" : "/asset/empty.png"}
          alt="empty state image"
        />{" "}
        <MediumFont
          extraCss={`${
            isWhiteMode ? "mt-[15px]" : "mt-[-20px]"
          } text-center text-light-font-100 dark:text-dark-font-100`}
        >
          Empty Watchlist
        </MediumFont>
        <div className="flex items-center flex-col">
          <SmallFont extraCss="text-center text-light-font-40 dark:text-dark-font-40 max-w-[400px] md:max-w-[340px] w-[90%]">
            Search for your favorite assets or find new ones by using the views
            on the
          </SmallFont>
          <NextChakraLink href="/home">top 100</NextChakraLink>
          <SmallFont extraCss="text-center text-light-font-40 dark:text-dark-font-40 max-w-[400px] md:max-w-[340px] w-[90%]">
            page
          </SmallFont>
        </div>
      </div>
    </>
  );
};
