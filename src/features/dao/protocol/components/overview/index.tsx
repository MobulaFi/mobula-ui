import {CheckIcon, CloseIcon} from "@chakra-ui/icons";
import {Box, Button, Flex} from "@chakra-ui/react";
import {useContext, useEffect, useState} from "react";
import {BsKey} from "react-icons/bs";
import {RiWallet3Line} from "react-icons/ri";
import {useAccount} from "wagmi";

// eslint-disable-next-line import/no-cycle
import {OverviewContext} from "../../../../../../pages/dao/protocol/overview";
import {TextLandingSmall, TextSmall} from "../../../../../UI/Text";
import {useColors} from "../../../../../common/utils/color-mode";
import {TitleContainer} from "../../../../Misc/Dex/components/ui/container-title";
import {BoxContainer} from "../../../common/components/box-container";
import {MainContainer} from "../../../common/components/container-main";
import {RightContainer} from "../../../common/components/container-right";
import {MetricsLine} from "../../../common/components/line-metric";
import {LeftNavigation} from "../../../common/components/nav-left";
import {LeftNavigationMobile} from "../../../common/components/nav-left-mobile";
import {TimeBox} from "../../../governance/components/ui/staking-time";
import {useClaim} from "../../hooks/use-claim";
import {useInitValues} from "../../hooks/use-initValue";
import {useNonValueToken} from "../../hooks/use-nonValueToken";
import {HistoryListing} from "../../models";
import {RankBox} from "../ui/overview/box-rank";
import {StakedLine} from "../ui/overview/line-staked";

export const Overview = () => {
  const {recentlyAdded} = useNonValueToken();
  const {countdown, tokensOwed, goodDecisions, badDecisions, claimed} =
    useContext(OverviewContext);
  const {address} = useAccount();
  const [moreHistory, setMoreHistory] = useState(10);
  const [showMore, setShowMore] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const initValues = useInitValues();
  const claim = useClaim();
  const {text80, borders, text10, bordersActive, hover} = useColors();

  useEffect(() => {
    if (address) {
      initValues();
    } else {
      const timeout = setTimeout(() => {
        // alert.show("You must connect your wallet to earn MOBL.");
      }, 300);
      return () => {
        clearTimeout(timeout);
      };
    }
    return () => {};
  }, [address]);

  useEffect(() => {
    if (countdown) {
      setInterval(() => {
        const now = new Date().getTime();
        const distance = countdown ? countdown - now : 0;
        setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
        setHours(
          Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        );
        setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
        setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
      }, 1000);
    }
  }, [countdown]);

  return (
    <MainContainer>
      <Box display={["none", "none", "none", "block"]}>
        <LeftNavigation page="protocol" />
      </Box>
      <Box display={["block", "block", "block", "none"]}>
        <LeftNavigationMobile page="protocol" />
      </Box>
      <RightContainer>
        {/* RANK BOXS */}
        <Flex
          align="center"
          direction={["column", "column", "row", "row"]}
          mt="12px"
        >
          <RankBox
            goodChoice={goodDecisions}
            badChoice={badDecisions}
            tokensOwed={tokensOwed}
          />
        </Flex>
        {/* MATIC FAUCET */}
        <BoxContainer
          justify="space-between"
          direction="column"
          mb={["0px", "0px", "20px", "20px"]}
          h="auto"
          p="0px"
          align={["flex-start", "flex-start", "center", "center"]}
        >
          <TitleContainer w="100%" px="15px">
            <TextLandingSmall color={text80}>MATIC Faucet</TextLandingSmall>
          </TitleContainer>
          <Flex
            align="center"
            justify="space-between"
            w="100%"
            p={["20px", "20px", "0px"]}
            direction={["column", "row"]}
          >
            <Flex
              p={["5px 5px 5px 5px", "5px 5px 5px 5px", "20px", "20px"]}
              direction="column"
              align="flex-start"
            >
              <StakedLine
                title="Already claimed:"
                value={`${claimed} MATIC`}
                icon={RiWallet3Line}
                mb={["10px", "10px", "20px"]}
              />
              <StakedLine
                title="Next claim:"
                value={days ? `${days} Days` : "0 Days"}
                icon={BsKey}
              />
            </Flex>
            <Flex
              pl={["20px", "20px", "0px", "0px"]}
              justify="center"
              p={["5px 5px 5px 5px", "5px 5px 5px 5px", "20px", "20px"]}
              direction="column"
              align="flex-start"
            >
              <Flex>
                <TimeBox timeframe="Days" number={days} />
                <TimeBox timeframe="Hours" number={hours} />
                <TimeBox timeframe="Min" number={minutes} />
                <TimeBox timeframe="Sec" number={seconds} />
              </Flex>
              <Button
                variant="outlined"
                mt="15px"
                maxWidth="auto"
                w="100%"
                border={borders}
                onClick={claim}
                color={text80}
                _hover={{bg: hover, border: bordersActive}}
                fontWeight="400"
                fontSize={["12px", "12px", "13px", "14px"]}
              >
                Claim
              </Button>
            </Flex>
          </Flex>
        </BoxContainer>
        {/* METRICS */}
        <BoxContainer
          border={borders}
          mb="20px"
          mt={["20px", "20px", "20px", "0px"]}
          direction="column"
          h="fit-content"
        >
          <TitleContainer px="15px">
            <TextLandingSmall color={text80}>History</TextLandingSmall>
          </TitleContainer>
          <Flex direction="column" w="100%">
            {recentlyAdded.map((history: HistoryListing, i: number) => {
              const date = new Date(history.timestamp * 1000);
              const second = date.getTime();
              const postedDate = Math.round((Date.now() - second) / 1000);
              let format = {
                timeframe: "day",
                time: 0,
              };
              // TODO : if else under do not work if in a fonction ( see in utils.tsx)
              if (postedDate < 60) {
                format = {timeframe: "seconds", time: postedDate};
              } else if (postedDate >= 60 && postedDate < 120) {
                format = {
                  timeframe: "minute",
                  time: Math.floor(postedDate / 60),
                };
              } else if (postedDate >= 120 && postedDate < 3600) {
                format = {
                  timeframe: "minutes",
                  time: Math.floor(postedDate / 60),
                };
              } else if (postedDate >= 3600 && postedDate < 7200) {
                format = {
                  timeframe: "hour",
                  time: Math.floor(postedDate / 3600),
                };
              } else if (postedDate >= 7200 && postedDate < 86400) {
                format = {
                  timeframe: "hours",
                  time: Math.floor(postedDate / 3600),
                };
              } else if (postedDate >= 86400 && postedDate < 172800) {
                format = {
                  timeframe: "day",
                  time: Math.floor(postedDate / 86400),
                };
              } else if (postedDate >= 172800) {
                format = {
                  timeframe: "days",
                  time: Math.floor(postedDate / 86400),
                };
              }
              if (
                i < moreHistory &&
                history.token_data.symbol !== "chibre token"
              ) {
                return (
                  <MetricsLine
                    keys={history.token_data.name}
                    history={history}
                    logo={history.token_data.logo}
                  >
                    <Flex w={["60%", "auto", "60%"]} justify="space-between">
                      <TextSmall whiteSpace="nowrap" display={["none", "flex"]}>
                        {format.time} {format.timeframe} ago
                      </TextSmall>
                      <TextSmall whiteSpace="nowrap" ml="20px">
                        {history.final_decision === true
                          ? "Final Validation"
                          : "First Sort"}
                      </TextSmall>
                      <Flex align="center" ml="20px">
                        {history.validated ? (
                          <CheckIcon fontSize="13" color="green" mr="10px" />
                        ) : (
                          <CloseIcon fontSize="13" color="red" mr="10px" />
                        )}
                        <TextSmall whiteSpace="nowrap">
                          {history?.votes.length} VOTES
                        </TextSmall>
                      </Flex>
                    </Flex>
                  </MetricsLine>
                );
              }
              return null;
            })}
          </Flex>
          <Flex align="center" justify="center" w="100%">
            {showMore && (
              <>
                <Button
                  mx="15px"
                  my={["15px", "15px", "20px", "20px"]}
                  fontSize={["13px", "13px", "15px", "15px"]}
                  fontWeight="400"
                  color={text80}
                  _focus={{boxShadow: "none"}}
                  onClick={() => {
                    setShowMore(false);
                    setMoreHistory(10);
                  }}
                >
                  Show less
                </Button>
                <Flex w="2px" h="15px" bg={text10} borderRadius="full" />
              </>
            )}
            <Button
              mx="15px"
              my="15px"
              fontWeight="400"
              color={text80}
              fontSize={["13px", "13px", "15px", "15px"]}
              _focus={{boxShadow: "none"}}
              onClick={() => {
                setShowMore(true);
                setMoreHistory(moreHistory + 10);
              }}
            >
              See more
            </Button>
          </Flex>
        </BoxContainer>
      </RightContainer>
    </MainContainer>
  );
};
