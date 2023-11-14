import React, { useContext, useEffect, useState } from "react";
import { BsCheck } from "react-icons/bs";
import { SmallFont } from "../../../../../../components/fonts";
import { Skeleton } from "../../../../../../components/skeleton";
import { HoldingNFT } from "../../../../../../interfaces/holdings";
import { getUrlFromName } from "../../../../../../utils/formaters";
import { PortfolioV2Context } from "../../../context-manager";

interface NftPortfolioCardProps {
  showDeleteSelector: boolean;
  nft: HoldingNFT;
}

export const NftPortfolioCard = ({
  nft,
  showDeleteSelector,
}: NftPortfolioCardProps) => {
  const { setNftToDelete, nftToDelete, isNftLoading } =
    useContext(PortfolioV2Context);
  const [nftImage, setNftImage] = useState<string | undefined>(undefined);
  const [isHover, setIsHover] = useState<string>("");

  useEffect(() => {
    if (!nft?.image && !isNftLoading) {
      fetch(nft.token_uri)
        .then((r) => r.json())
        .then((r: { image: string }) => {
          setNftImage(r.image);
        });
    }
  }, [nft]);

  const openInNewTab = (url: string) => {
    const win = window.open(url, "_blank");
    win?.focus();
  };

  return (
    <div
      className="flex flex-col m-[5px] rounded bg-light-bg-terciary dark:bg-dark-bg-terciary relative 
    min-w-[210px] md:min-w-[100px] sm:min-w-[160px] min-h-[210px] md:min-h-[100px] sm:min-h-[160px] 
    border border-light-border-primary dark:border-dark-border-primary w-calc-1/5-10 lg:w-calc-1/3-8 md:w-calc-1/3-10 sm:w-calc-half-10"
      onMouseEnter={() => setIsHover(nft?.token_hash)}
      onMouseLeave={() => setIsHover("")}
    >
      <div className="w-full h-auto mb-auto flex items-center bg-light-bg-terciary dark:bg-dark-bg-terciary">
        {isNftLoading ? (
          <Skeleton extraCss="h-[210px] w-full rounded-t" />
        ) : (
          <>
            {(nft?.image || nftImage)?.includes(".mp4") ? (
              <video
                className="w-full rounded-t"
                src={nft?.image || nftImage}
                autoPlay
                muted
              />
            ) : (
              <div className="flex flex-col items-center justify-center relative w-full">
                <img
                  className="rounde-t w-full p-0 h-auto max-h-[210px] bg-light-bg-hover dark:bg-dark-bg-hover"
                  src={nft?.image || nftImage}
                  // error
                  //     ? colorTheme === "light"
                  //       ? "/asset/no-image.png"
                  //       : "/asset/no-image-dark.png"
                  //     : colorTheme === "light"
                  //     ? "/asset/load.png"
                  //     : "asset/load-dark.png"
                />
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex p-2.5 flex-col justify-center h-auto">
        {isNftLoading ? (
          <Skeleton extraCss="h-[20px] w-[90px]" />
        ) : (
          <SmallFont extraCss="whitespace-pre-wrap font-medium">
            {nft.name} {showDeleteSelector}
            <span className="ml-[5px] text-light-font-60 dark:text-dark-font-60">
              {String(nft?.token_id).length < 10 ? `#${nft?.token_id}` : ""}
            </span>
          </SmallFont>
        )}
        {/* <TextExtraSmall color={text60}>Est. Value</TextExtraSmall>
          <Flex align="center">
            <TextMedium mr="5px" color="text.80">
              $000
            </TextMedium>
            <TextSmall color="red">-52%</TextSmall>
          </Flex> */}
      </div>
      <div
        className={`flex absolute w-full h-full max-h-[250px] bg-light-bg-primary dark:bg-dark-bg-primary rounded
       transition-all duration-250 min-w-[210px] md:min-w-[100px] sm:min-w-[160px] min-h-[210px] md:min-h-[100px]
        sm:min-h-[160px] ${
          showDeleteSelector || isHover ? "opacity-80" : "opacity-0"
        } ${
          isHover && !showDeleteSelector ? "cursor-pointer" : "cursor-default"
        }`}
      />
      {showDeleteSelector ? (
        <button
          className="flex items-center justify-center rounded w-[20px] h-[20px] min-w-[20px] left-[10px] 
        top-[10px] absolute border border-light-border-secondary dark:border-dark-border-secondary"
          onClick={() => {
            if (nftToDelete?.includes(nft?.token_hash))
              setNftToDelete(
                nftToDelete.filter((nftHash) => nftHash !== nft.token_hash)
              );
            else setNftToDelete([...nftToDelete, nft.token_hash]);
          }}
        >
          {nftToDelete?.includes(nft?.token_hash) ? (
            <BsCheck className="text-light-font-100 dark:text-dark-font-100 mt-0.5 text-xs" />
          ) : null}
        </button>
      ) : null}
      {isHover === nft?.token_hash && !showDeleteSelector ? (
        <button
          className={`flex items-center justify-center right-1/2 top-[45%] absolute -translate-x-1/2 translate-y-1/2 w-[80%] h-full transition-all duration-250 ${
            isHover === nft.token_hash ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => {
            openInNewTab(
              `https://opensea.io/collection/${getUrlFromName(nft?.name)}`
            );
          }}
        >
          <div className="flex flex-col items-center justify-center">
            <SmallFont className="mb-2.5 font-bold text-center whitespace-pre-wrap">
              Watch on Opensea
            </SmallFont>
            <img
              className="w-[35px] h-[35px] rounded-full shadow-md border border-light-border-secondary dark:border-dark-border-secondary"
              src="https://opensea.io/static/images/logos/opensea-logo.svg"
              alt="Opensea logo"
            />
          </div>
        </button>
      ) : null}
    </div>
  );
};
