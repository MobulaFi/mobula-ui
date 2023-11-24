import React from "react";
import { SortProvider } from "../../../features/dao/protocol/context-manager";
import {
  ReasonVoteProvider,
  ShowReasonProvider,
} from "../../../features/dao/protocol/context-manager/reason-vote";
import { VoteProvider } from "../../../features/dao/protocol/context-manager/vote";

interface GeneralLayoutProps {
  children: React.ReactNode;
  isPendingPool?: boolean;
  isFirstSort?: boolean;
}

export default function GeneralLayout({
  children,
  isPendingPool,
  isFirstSort,
}: GeneralLayoutProps) {
  return (
    <SortProvider isPendingPool={isPendingPool} isFirstSort={isFirstSort}>
      <ShowReasonProvider>
        <ReasonVoteProvider>
          <VoteProvider>{children}</VoteProvider>
        </ReasonVoteProvider>
      </ShowReasonProvider>
    </SortProvider>
  );
}
