import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { readContract } from "wagmi/actions";
import React, { useEffect, useState } from "react";

import { POOLS } from "../../../../../../constants";
import { balanceOfAbi } from "../../../../../../utils/abi";
import { SmallFont, LargeFont } from "../../../../../../components/fonts";

export const Protocols = () => {
  const { address } = useAccount();

  const [balances, setBalances] = useState<any[]>([]);

  useEffect(() => {
    const fetchProtocolInfo = async () => {
      const poolBalances = await Promise.all(
        POOLS.map(async (pool: any) => {
          const poolsInfo = await Promise.all(
            pool.pools.map(async (poolItem) => {
              const balance = await readContract({
                address: poolItem.address as `0x${string}`,
                abi: balanceOfAbi,
                chainId: pool.chainid,
                functionName: "balanceOf",
                args: [address],
              });

              return {
                balance: formatEther(balance as bigint),
                name: poolItem.name,
                logo: pool.logo,
                protocol: pool.name,
              };
            })
          );

          return poolsInfo;
        })
      );

      setBalances(poolBalances);
    };

    fetchProtocolInfo();
  }, [address]);

  return (
    <div className="relative md:pb-5 w-full">
      {balances.length > 0
        ? balances.map((protocols: any) => (
            <div
              key={protocols[0].protocol}
              className={
                "flex-col mt-2.5 p-4 border rounded-2xl border-light-border-primary dark:border-dark-border-primary bg-light-bg-secondary dark:bg-dark-bg-secondary"
              }
            >
              <LargeFont extraCss="text-light-font-100 dark:text-dark-font-100 mb-0 ml-[5px] font-medium">
                {protocols[0].protocol}
              </LargeFont>
              {protocols.map((protocol: any) => (
                <div
                  key={protocol.name}
                  className={
                    "h-[70px] bg-light-bg-secondary dark:bg-dark-bg-secondary w-full transition-all duration-500 overflow-y-hidden rounded-2xl ease-in-out mt-2.5 cursor-pointer border border-light-border-primary dark:border-dark-border-primary pt-0"
                  }
                >
                  <div className="flex flex-col w-full">
                    <div className="flex justify-between items-center w-full h-[70px] mt-0">
                      <div className="h-full flex items-center w-full p-2.5">
                        <img
                          className="w-[34px] h-[34px] rounded-full mr-2"
                          src={protocol.logo || "/empty/unknown.png"}
                          alt="logo"
                        />
                        <div className="flex flex-col items-start">
                          <p className="text-light-font-100 md:hidden dark:text-dark-font-100 text-sm lg:text-[13px] md:text-xs font-normal md:font-normal">
                            {protocol.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center p-2.5">
                        <div className="flex flex-col items-end mr-5 md:mr-3">
                          <SmallFont
                            extraCss={`font-normal text-end md:font-normal whitespace-nowrap text-[13px] md:text-[13px]`}
                          >
                            {`${protocol.balance} ${protocol.name}`}
                          </SmallFont>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        : null}
    </div>
  );
};
