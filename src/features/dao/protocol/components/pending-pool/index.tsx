"use client";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";
import { Container } from "../../../../../components/container";
import { RightContainer } from "../../../common/components/container-right";
import { LeftNavigation } from "../../../common/components/nav-left";
import { LeftNavigationMobile } from "../../../common/components/nav-left-mobile";
import { SortContext } from "../../context-manager";
import { useSort } from "../../hooks/use-sort";
import { TokenDivs } from "../../models";
import { Contribute } from "../ui/pending-pool/contribute";
import { BoxPreVote } from "../ui/sorts/box-prevote";
import { ContractInformation } from "../ui/sorts/contract-information";
import { Distribution } from "../ui/sorts/distribution";
import { LaunchInformation } from "../ui/sorts/launch-information";
import { SalesInformation } from "../ui/sorts/sales-information";
import { SimiliratyCheck } from "../ui/sorts/similarity-check";
import { TeamMembers } from "../ui/sorts/team-members";
import { TokenFees } from "../ui/sorts/token-fees";
import { VestingInformation } from "../ui/sorts/vesting-information";

export const PendingPool = () => {
  const pathname = usePathname();
  const { tokenDivs, displayedPool } = useContext(SortContext);
  const { resolvedTheme } = useTheme();
  const isWhiteMode = resolvedTheme === "dark";
  useSort();

  const renderToken = (token: TokenDivs) => (
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
          .filter((entry) => entry.name === displayedPool)
          .map((token) => renderToken(token));
      }
      return tokenDivs
        .sort((a, b) => Number(b.coeff) - Number(a.coeff))
        .map((token) => <BoxPreVote key={token.id} token={token} />);
    }
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
  };

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
        <div className="mt-3 lg:mt-0">{renderTokens()}</div>
      </RightContainer>
    </Container>
  );
};
