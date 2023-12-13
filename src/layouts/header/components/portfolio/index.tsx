import { useRouter } from "next/navigation";
import React from "react";
import { AiOutlineLineChart } from "react-icons/ai";
import { useAccount } from "wagmi";
import { Button } from "../../../../components/button";
import { useShouldConnect } from "../../../../hooks/connect";
import { useUrl } from "../../../../hooks/url";
import { pushData } from "../../../../lib/mixpanel";
import { getFormattedAmount } from "../../../../utils/formaters";
import { useUserBalance } from "../../context-manager/balance";

interface PortfolioButtonProps {
  extraCss?: string;
}

export const PortfolioButton = ({ extraCss }: PortfolioButtonProps) => {
  const { portfolioUrl } = useUrl();
  const router = useRouter();
  const { userBalance } = useUserBalance();
  const { isDisconnected } = useAccount();
  const handleConnect = useShouldConnect(() => router.push(portfolioUrl));
  return (
    <Button
      extraCss={`mr-2.5 lg:mr-[7.5px] text-sm ${extraCss}`}
      onClick={() => {
        handleConnect();
        pushData("Header Clicked", {
          name: "Portfolio",
        });
      }}
    >
      {userBalance?.actual_balance !== 0 && !isDisconnected ? (
        <div className="flex items-center">
          <p
            className={`text-sm md:text-xs font-normal transition-all duration-200 ${
              userBalance?.change_color
                ? userBalance?.color
                : "text-light-font-100 dark:text-dark-font-100"
            }`}
          >
            ${getFormattedAmount(userBalance?.actual_balance)}
          </p>
          <AiOutlineLineChart className="text-lg flex lg:hidden ml-[7.5px] lg:ml-0 text-light-font-100 dark:text-dark-font-100" />
        </div>
      ) : null}
      {userBalance?.actual_balance === 0 || isDisconnected ? (
        <div className="flex items-center">
          <p className="text-light-font-100 dark:text-dark-font-100 text-sm font-normal flex lg:hidden">
            Portfolio
          </p>
          <AiOutlineLineChart className="ml-[7.5px] lg:ml-0 text-base lg:text-lg text-light-font-100 dark:text-dark-font-100" />
        </div>
      ) : null}
    </Button>
  );
};
