import {Box, useColorMode} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {useContext} from "react";
import {MainContainer} from "../../../common/components/container-main";
import {RightContainer} from "../../../common/components/container-right";
import {LeftNavigation} from "../../../common/components/nav-left";
import {LeftNavigationMobile} from "../../../common/components/nav-left-mobile";
import {SortContext} from "../../context-manager";
import {useSort} from "../../hooks/use-sort";
import {Contribute} from "../ui/pending-pool/contribute";
import {BoxPreVote} from "../ui/sorts/box-prevote";
import {ContractInformation} from "../ui/sorts/contract-information";
import {Distribution} from "../ui/sorts/distribution";
import {LaunchInformation} from "../ui/sorts/launch-information";
import {SalesInformation} from "../ui/sorts/sales-information";
import {SimiliratyCheck} from "../ui/sorts/similarity-check";
import {TeamMembers} from "../ui/sorts/team-members";
import {TokenFees} from "../ui/sorts/token-fees";
import {VestingInformation} from "../ui/sorts/vesting-information";

export const PendingPool = () => {
  const router = useRouter();
  const {tokenDivs, displayedPool} = useContext(SortContext);
  const {colorMode} = useColorMode();
  const isWhiteMode = colorMode === "dark";
  useSort();

  const renderToken = token => (
    <>
      <BoxPreVote token={token} />
      <SimiliratyCheck token={token} />
      <TeamMembers token={token} />
      <ContractInformation token={token} />
      <Distribution token={token} />
      <LaunchInformation token={token} />
      <TokenFees token={token} />
      <SalesInformation token={token} />
      <VestingInformation token={token} />
      <Contribute token={token} />
      {/* <Contributors token={token} /> */}
    </>
  );

  const renderTokens = () => {
    if (tokenDivs?.length > 0) {
      if (displayedPool) {
        return tokenDivs
          .filter(entry => entry.name === displayedPool)
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
    </MainContainer>
  );
};
