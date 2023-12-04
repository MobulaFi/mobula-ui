"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";

export const needRedirection = () => {
  const { isDisconnected } = useAccount();

  useEffect(() => {
    if (isDisconnected) {
      redirect("/watchlist/discover");
    }
  }, [isDisconnected]);
};
