import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useChains } from "../../context-manager";
import { OldPairsProps, PairsProps } from "../../models";
import { TableRow } from "../table-row";

export const TableTbody = () => {
  const { pairs: pairsBuffer } = useChains();
  const router = useRouter();
  const [isHover, setIsHover] = useState("");
  const [pairs, setPairs] = useState<{
    pair: PairsProps[];
    oldPairs: OldPairsProps;
  }>({
    pair: pairsBuffer,
    oldPairs: {},
  });

  useEffect(() => {
    if (!pairs?.pair?.[0]?.pair?.blockchain) return;
    const socket = new WebSocket(
      process.env.NEXT_PUBLIC_PRICE_WSS_ENDPOINT as string
    );

    socket.addEventListener("open", () => {
      const chain = pairs?.pair?.[0]?.pair?.blockchain;
      socket.send(
        JSON.stringify({
          type: "pair",
          authorization: process.env.NEXT_PUBLIC_PRICE_KEY,
          payload: {
            blockchain: chain,
            interval: 5,
          },
        })
      );
    });

    socket.addEventListener("message", (event) => {
      const { data } = JSON.parse(event.data);

      const pairsReduced = pairs?.pair?.reduce((acc, item) => {
        acc[item.pair.address] = [
          item.price,
          item.pair.liquidity,
          item.pair.volume24h,
          item.last_trade,
        ];
        return acc;
      }, {});

      setPairs((prevPairs) => ({
        ...prevPairs,
        pair: data,
        oldPairs: pairsReduced,
      }));
      setTimeout(() => {
        setPairs((prevPairs) => ({
          ...prevPairs,
          oldPairs: Object.keys(prevPairs.oldPairs).reduce((acc, address) => {
            acc[address] = [null, null, null];
            return acc;
          }, {}),
        }));
      }, 2000);
    });
  }, []);

  return (
    <>
      {pairs?.pair
        ?.filter((entry) => entry)
        ?.map((item, i) => {
          const pair = item?.pair;
          const oldPairInfo = pairs?.oldPairs?.[pair?.address];
          return (
            <TableRow
              key={i}
              item={item}
              isHover={isHover}
              setIsHover={setIsHover}
              router={router}
              pair={pair}
              oldPairInfo={oldPairInfo}
            />
          );
        })}
    </>
  );
};
