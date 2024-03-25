"use client";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { Container } from "../../../../../components/container";
import { Skeleton } from "../../../../../components/skeleton";
import { BoxContainer } from "../../../common/components/box-container";
import { RightContainer } from "../../../common/components/container-right";
import { LeftNavigation } from "../../../common/components/nav-left";
import { LeftNavigationMobile } from "../../../common/components/nav-left-mobile";
import { SortContext } from "../../context-manager";
import {
  ReasonVoteContext,
  ShowReasonContext,
} from "../../context-manager/reason-vote";
import { useSort } from "../../hooks/use-sort";
import { TokenDivs } from "../../models";
import { ReasonVote } from "../reason-vote";
import { BoxPreVote } from "../ui/sorts/box-prevote";
import { VoteBox } from "../ui/sorts/box-vote";
import { ButtonVote } from "../ui/sorts/button-vote";
import { ChangeTemplate } from "../ui/sorts/change-template";
import { ContractInformation } from "../ui/sorts/contract-information";
import { Countdown } from "../ui/sorts/countdown";
import { Distribution } from "../ui/sorts/distribution";
import { LaunchInformation } from "../ui/sorts/launch-information";
import { SalesInformation } from "../ui/sorts/sales-information";
import { SimiliratyCheck } from "../ui/sorts/similarity-check";
import { TeamMembers } from "../ui/sorts/team-members";
import { TokenFees } from "../ui/sorts/token-fees";
import { VestingInformation } from "../ui/sorts/vesting-information";

export const Sort = () => {
  const {
    tokenDivs,
    displayedToken,
    displayedPool,
    setVotes,
    isFirstSort,
    isLoading,
  } = useContext(SortContext);
  const pathname = usePathname();
  const { theme } = useTheme();
  const isWhiteMode = theme === "light";
  const {
    reasonUtility,
    setReasonUtility,
    reasonSocial,
    setReasonSocial,
    reasonTrust,
    setReasonTrust,
  } = useContext(ReasonVoteContext);
  const { showSocial, showTrust, showUtility } = useContext(ShowReasonContext);
  useSort();

  useEffect(() => {
    if (localStorage.getItem("votes")) {
      setVotes(
        JSON.parse(
          localStorage.getItem(isFirstSort ? "votes" : "votesFinal")!
        ) || []
      );
    }
  }, []);

  const renderNonListingToken = (token: TokenDivs) => (
    <div className={token?.alreadyVoted ? "opacity-50" : "opacity-100"}>
      {token?.edits
        ?.filter((edit) => edit !== "edits" && edit !== "protocol_id")
        ?.map((edit) => (
          <ChangeTemplate
            key={edit}
            oldImage={token?.oldToken?.logo || "/empty/unknown.png"}
            newImage={token?.logo || "/empty/unknown.png"}
            type={edit}
            oldValue={token?.oldToken?.[edit]}
            newValue={token?.[edit]}
          />
        ))}
      <Countdown extraCss="mt-5" token={token} />
      <div className="p-5 flex flex-col bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border-primary dark:border-dark-borde-primary">
        <ButtonVote token={token} />
      </div>
    </div>
  );

  const renderToken = (token: TokenDivs) => (
    <>
      <BoxPreVote token={token} />
      {token?.isListing ? (
        <>
          <SimiliratyCheck token={token} />
          <TeamMembers token={token} />
          <ContractInformation token={token} />
          <Distribution token={token} />
          <LaunchInformation token={token} />
          <TokenFees token={token} />
          <SalesInformation token={token} />
          <VestingInformation token={token} />
          <VoteBox token={token} typeVote="cast" />
        </>
      ) : (
        renderNonListingToken(token)
      )}
    </>
  );

  const renderTokens = () => {
    if (tokenDivs?.length > 0 && !isLoading) {
      if (displayedToken || displayedPool) {
        return tokenDivs
          .filter(
            (entry) =>
              entry.name === displayedToken || entry.name === displayedPool
          )
          .map((token) => renderToken(token));
      }
      return tokenDivs
        .sort((a, b) => Number(b.coeff) - Number(a.coeff))
        .map((token) => <BoxPreVote key={token.name} token={token} />);
    }
    if (isLoading) {
      return (
        <BoxContainer
          extraCss={`mb-5 relative min-h-[210px] md:min-h-[160px] md:mb-2.5 md:min-h-auto transition-all duration-200 py-[15px] px-5 lg:px-[15px] 
          rounded-2xl sm:rounded-0`}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center">
              <Skeleton extraCss="mr-2.5 h-[22px] w-[22px] rounded-full" />
              <Skeleton extraCss="h-[18px] md:h-[16px] w-[80px] mr-2.5 md:mr-2" />
              <Skeleton extraCss="h-[18px] md:h-[16px] w-[40px] mr-5 md:mr-4" />
              <Skeleton extraCss="mr-1 h-[18px] w-[18px] md:h-[16px] md:w-[16px] rounded-full" />
              <Skeleton extraCss="h-[16px] w-[16px] mr-2.5" />
            </div>
            <Skeleton extraCss="h-[16px] w-[110px] ml-2.5 md:hidden" />
          </div>
          <div className="mt-2.5 flex flex-col">
            <Skeleton extraCss="h-[12px] w-[80%] rounded-full" />
            <Skeleton extraCss="h-[12px] w-[85%] mt-2 rounded-full" />
            <Skeleton extraCss="h-[12px] w-[70%] mt-2 rounded-full" />
            <Skeleton extraCss="h-[12px] w-[60%] mt-2 rounded-full" />
          </div>
        </BoxContainer>
      );
    }
    if (!isLoading && !tokenDivs?.length)
      return (
        <BoxPreVote
          token={
            {
              name: "Come back later!",
              description: "No new listings are currently available :(",
              logo: isWhiteMode
                ? "/mobula/mobula-logo-light.svg"
                : "/mobula/mobula-logo.svg",
            } as TokenDivs
          }
          isFakeToken
        />
      );

    return null;
  };

  const render = renderTokens();

  return (
    <Container extraCss="flex-row lg:flex-col">
      <div className="w-fit block lg:hidden">
        <LeftNavigation
          page={pathname.includes("protocol") ? "protocol" : "governance"}
        />
      </div>
      <div className="hidden lg:block">
        <LeftNavigationMobile page="protocol" />
      </div>
      <RightContainer>
        <div className="mt-3 lg:mt-0">{render}</div>
      </RightContainer>
      {showUtility && (
        <ReasonVote
          type="Utility"
          reason={reasonUtility}
          setReason={setReasonUtility}
        />
      )}
      {showSocial && (
        <ReasonVote
          type="Social"
          reason={reasonSocial}
          setReason={setReasonSocial}
        />
      )}
      {showTrust && (
        <ReasonVote
          type="Trust"
          reason={reasonTrust}
          setReason={setReasonTrust}
        />
      )}
    </Container>
  );
};
