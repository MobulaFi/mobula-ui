"use client";
import { useContext, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsCheckLg, BsKey } from "react-icons/bs";
import { RiWallet3Line } from "react-icons/ri";
import { useAccount } from "wagmi";
import { Button } from "../../../../../components/button";
import { Container } from "../../../../../components/container";
import { MediumFont, SmallFont } from "../../../../../components/fonts";
import { TitleContainer } from "../../../../../components/title";
import { triggerAlert } from "../../../../../lib/toastify";
import { BoxContainer } from "../../../common/components/box-container";
import { RightContainer } from "../../../common/components/container-right";
import { MetricsLine } from "../../../common/components/line-metric";
import { LeftNavigation } from "../../../common/components/nav-left";
import { LeftNavigationMobile } from "../../../common/components/nav-left-mobile";
import { TimeBox } from "../../../common/components/time-box";
import { OverviewContext } from "../../context-manager/overview";
import { useClaim } from "../../hooks/use-claim";
import { useInitValues } from "../../hooks/use-initValue";
import { useNonValueToken } from "../../hooks/use-nonValueToken";
import { HistoryListing } from "../../models";
import { RankBox } from "../ui/overview/box-rank";
import { StakedLine } from "../ui/overview/line-staked";

export const Overview = () => {
  const { recentlyAdded } = useNonValueToken();
  const { countdown, tokensOwed, goodDecisions, badDecisions, claimed } =
    useContext(OverviewContext);
  const { address } = useAccount();
  const [moreHistory, setMoreHistory] = useState(10);
  const [showMore, setShowMore] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const initValues = useInitValues();
  const claim = useClaim();

  useEffect(() => {
    if (address) {
      initValues();
    } else {
      const timeout = setTimeout(() => {
        triggerAlert("Warning", "You must connect your wallet to earn MOBL.");
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
        const distance = countdown - now;
        setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
        setHours(
          Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        );
        setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
        setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
      }, 1000);
    }
  }, [countdown]);

  return (
    <Container extraCss="flex-row lg:flex-col">
      <div className="block lg:hidden">
        <LeftNavigation page="protocol" />
      </div>
      <div className="hidden lg:block">
        <LeftNavigationMobile page="protocol" />
      </div>
      <RightContainer>
        {/* RANK BOXS */}
        <div className="flex items-center flex-row md:flex-col mt-3 md:mt-0.5">
          <RankBox goodChoice={goodDecisions} badChoice={badDecisions} />
        </div>
        {/* MATIC FAUCET */}
        <BoxContainer extraCss="justify-between flex-col mb-5 md:mb-0 h-auto p-0 items-center md:items-start">
          <TitleContainer extraCss="w-full px-[15px]">
            <MediumFont extraCss="md:px-2.5">MATIC Faucet</MediumFont>
          </TitleContainer>
          <div className="flex items-center justify-between w-full p-0 md:p-5 flex-row sm:flex-col">
            <div className="flex flex-col items-start p-5 md:p-[5px]">
              <StakedLine
                title="Already claimed:"
                value={`${claimed} MATIC`}
                icon={
                  <RiWallet3Line className="text-light-font-100 dark:text-dark-font-100 text-lg mt-[1px] mr-2.5" />
                }
                extraCss="mb-5 md:mb-2.5"
              />
              <StakedLine
                title="Next claim:"
                value={days ? `${days} Days` : "0 Days"}
                icon={
                  <BsKey className="text-light-font-100 dark:text-dark-font-100 text-lg mt-[1px] mr-2.5" />
                }
              />
            </div>
            <div className="pl-0 md:pl-5 flex items-start justify-center p-5 md:p-[5px] flex-col">
              <div className="flex">
                <TimeBox timeframe="Days" number={days} />
                <TimeBox timeframe="Hours" number={hours} />
                <TimeBox timeframe="Min" number={minutes} />
                <TimeBox timeframe="Sec" number={seconds} />
              </div>
              <Button extraCss="mt-[15px] max-w-auto w-full" onClick={claim}>
                Claim
              </Button>
            </div>
          </div>
        </BoxContainer>
        {/* METRICS */}
        <BoxContainer extraCss="mb-5 md:mt-2.5 flex-col h-fit">
          <TitleContainer extraCss="px-[15px]">
            <MediumFont extraCss="md:px-2.5">History</MediumFont>
          </TitleContainer>
          <div
            className={`flex flex-col w-full overflow-y-hidden transition-all duration-300 ease-in-out`}
            style={{
              height: (moreHistory / 10) * 514 + "px",
            }}
          >
            {recentlyAdded
              ?.filter((entry) => entry?.votes?.length > 0)
              .map((history: HistoryListing, i: number) => {
                const date = new Date(history.timestamp * 1000);
                const second = date.getTime();
                const postedDate = Math.round((Date.now() - second) / 1000);
                let format = {
                  timeframe: "day",
                  time: 0,
                };
                // TODO : if else under do not work if in a fonction ( see in utils.tsx)
                if (postedDate < 60) {
                  format = { timeframe: "seconds", time: postedDate };
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
                if (i < moreHistory) {
                  return (
                    <MetricsLine
                      keys={history.token_data.name}
                      history={history}
                      logo={history.token_data.logo}
                      key={history.token_data.name}
                    >
                      <div className="flex w-[60%] md:w-auto sm:w-[60%] justify-between">
                        <SmallFont extraCss="whitespace-nowrap flex sm:hidden">
                          {format.time} {format.timeframe} ago
                        </SmallFont>
                        <SmallFont extraCss="whitespace-nowrap ml-5">
                          {history.final_decision === true
                            ? "Final Validation"
                            : "First Sort"}
                        </SmallFont>
                        <div className="flex items-center ml-5">
                          {history.validated ? (
                            <BsCheckLg className="text-sm text-green dark:text-green mr-2" />
                          ) : (
                            <AiOutlineClose className="text-sm text-red dark:text-red mr-2" />
                          )}
                          <SmallFont extraCss="whitespace-nowrap">
                            {history?.votes?.length} VOTES
                          </SmallFont>
                        </div>
                      </div>
                    </MetricsLine>
                  );
                }
                return null;
              })}
          </div>
          <div className="flex items-center justify-center w-full">
            {showMore && (
              <>
                <button
                  className="mx-[15px] my-[15px] md:mt-[15px] flex items-center justify-center text-light-font-100 
                  dark:text-dark-font-100 text-[15px] md:text-[13px] hover:text-blue hover:dark:text-blue transition-all duration-200"
                  onClick={() => {
                    setShowMore(false);
                    setMoreHistory(10);
                  }}
                >
                  Show less
                </button>
                <div className="w-0.5 h-[15px] bg-light-border-primary dark:bg-dark-border-primary rounded-full" />
              </>
            )}
            {moreHistory < 30 ? (
              <button
                className="mx-[15px] my-2.5 flex items-center justify-center text-light-font-100 
            dark:text-dark-font-100 text-[15px] md:text-[13px] hover:text-blue hover:dark:text-blue transition-all duration-200"
                onClick={() => {
                  setShowMore(true);
                  if (moreHistory < 30) setMoreHistory(moreHistory + 10);
                }}
              >
                See more
              </button>
            ) : null}
          </div>
        </BoxContainer>
      </RightContainer>
    </Container>
  );
};
