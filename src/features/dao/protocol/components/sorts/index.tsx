import {Box, Flex, useColorMode} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {useContext, useEffect} from "react";
import {useColors} from "../../../../../common/utils/color-mode";
import {MainContainer} from "../../../common/components/container-main";
import {RightContainer} from "../../../common/components/container-right";
import {LeftNavigation} from "../../../common/components/nav-left";
import {LeftNavigationMobile} from "../../../common/components/nav-left-mobile";
import {SortContext} from "../../context-manager";
import {
  ReasonVoteContext,
  ShowReasonContext,
} from "../../context-manager/reason-vote";
import {useSort} from "../../hooks/use-sort";
import {ReasonVote} from "../reason-vote";
import {BoxPreVote} from "../ui/sorts/box-prevote";
import {VoteBox} from "../ui/sorts/box-vote";
import {ButtonVote} from "../ui/sorts/button-vote";
import {ChangeTemplate} from "../ui/sorts/change-template";
import {ContractInformation} from "../ui/sorts/contract-information";
import {Countdown} from "../ui/sorts/countdown";
import {Distribution} from "../ui/sorts/distribution";
import {LaunchInformation} from "../ui/sorts/launch-information";
import {SalesInformation} from "../ui/sorts/sales-information";
import {SimiliratyCheck} from "../ui/sorts/similarity-check";
import {TeamMembers} from "../ui/sorts/team-members";
import {TokenFees} from "../ui/sorts/token-fees";
import {VestingInformation} from "../ui/sorts/vesting-information";

export const Sort = () => {
  const router = useRouter();
  const {tokenDivs, displayedToken, displayedPool, setVotes, isFirstSort} =
    useContext(SortContext);
  const {boxBg1, borders} = useColors();
  const {colorMode} = useColorMode();
  const isWhiteMode = colorMode === "light";
  const {
    reasonUtility,
    setReasonUtility,
    reasonSocial,
    setReasonSocial,
    reasonTrust,
    setReasonTrust,
  } = useContext(ReasonVoteContext);
  const {showSocial, showTrust, showUtility} = useContext(ShowReasonContext);
  useSort();

  useEffect(() => {
    if (localStorage.getItem("votes")) {
      setVotes(
        JSON.parse(
          localStorage.getItem(isFirstSort ? "votes" : "votesFinal")!,
        ) || [],
      );
    }
  }, []);

  const renderNonListingToken = token => (
    <Box opacity={token.alreadyVoted ? 0.5 : 1}>
      {token.edits?.map(edit => (
        <ChangeTemplate
          oldImage={token.oldToken.logo || "/icon/unknown.png"}
          newImage={token.logo || "/icon/unknown.png"}
          type={edit}
          oldValue={token.oldToken[edit]}
          newValue={token[edit]}
        />
      ))}
      <Countdown token={token} mt="20px" />
      <Flex p="20px" bg={boxBg1} border={borders} direction="column">
        <ButtonVote token={token} />
      </Flex>
    </Box>
  );

  const renderToken = token => (
    <>
      <BoxPreVote token={token} />
      {token.isListing ? (
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
  console.log(tokenDivs);
  const renderTokens = () => {
    if (tokenDivs?.length > 0) {
      if (displayedToken || displayedPool) {
        return tokenDivs
          .filter(
            entry =>
              entry.name === displayedToken || entry.name === displayedPool,
          )
          .map(token => renderToken(token));
      }
      return tokenDivs
        .sort((a, b) => Number(b.coeff) - Number(a.coeff))
        .map(token => <BoxPreVote token={token} />);
    }
    return (
      <BoxPreVote
        token={{
          name: "Come back later!",
          description: "No new listings are currently available :(",
          logo: isWhiteMode
            ? "/mobula/mobula-logo-light.svg"
            : "/mobula/mobula-logo.svg",
        }}
        isFakeToken
      />
    );
  };

  return (
    <MainContainer>
      <Box w="fit-content" display={["none", "none", "none", "block"]}>
        <LeftNavigation
          page={
            router.pathname.includes("protocol") ? "protocol" : "governance"
          }
        />
      </Box>
      <Box display={["block", "block", "block", "none"]}>
        <LeftNavigationMobile page="protocol" />
      </Box>
      <RightContainer>
        <Box mt={["0px", "0px", "0px", "12px"]}>{renderTokens()}</Box>
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
    </MainContainer>
  );
};
