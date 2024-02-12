import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
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
  const { showHiddenNfts, setNftsDeleted, nftsDeleted, isNftLoading } =
    useContext(PortfolioV2Context);
  const [nftImage, setNftImage] = useState<string | undefined>(undefined);
  const [isHover, setIsHover] = useState<string>("");
  const { theme } = useTheme();
  const isWhiteMode = theme === "light";
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageState, setImageState] = useState<string>("");

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

  const getNftImage = () => {
    if (isImageLoading) {
      if (isWhiteMode) return "/asset/load-dark.png";
      return "/asset/load-dark.png";
    }
    if (imageState === "error") {
      if (isWhiteMode) return "/asset/no-image.png";
      return "/asset/no-image-dark.png";
    }
    return nft?.image || nftImage || "/asset/no-image-dark.png";
  };
  const image = getNftImage();

  const handleHiddenNft = (hash: string) => {
    const nfts = localStorage.getItem("hiddenNft");
    try {
      if (!nftsDeleted?.includes(hash)) {
        setNftsDeleted((prev) => [...(prev || []), hash]);
        localStorage.setItem(
          "hiddenNft",
          JSON.stringify([...(JSON.parse(nfts) || []), hash])
        );
      } else {
        setNftsDeleted((prev) => [...prev.filter((entry) => entry !== hash)]);
        localStorage.setItem(
          "hiddenNft",
          JSON.stringify([
            ...JSON.parse(nfts)?.filter((entry) => entry !== hash),
          ])
        );
      }
    } catch (e) {
      console.log(e);
    }
    // console.log("isNftDeleted", isNftDeleted, isNftToHide);

    // if (isNftDeleted || isNftToHide) {
    //   setNftsDeleted(
    //     nftsDeleted.filter((nftHash) => nftHash !== nft.token_hash)
    //   );
    // } else {
    //   setNftToDelete([...nftToDelete, nft.token_hash]);
    // }
  };

  const isHiddenNFT = nftsDeleted?.includes(nft?.token_hash);

  // console.log("neft", nftsDeleted);

  return (
    <div
      className="flex flex-col rounded-xl bg-light-bg-terciary dark:bg-dark-bg-terciary relative 
    border border-light-border-primary dark:border-dark-border-primary nft-card"
      onMouseEnter={() => setIsHover(nft?.token_hash)}
      onMouseLeave={() => setIsHover("")}
    >
      <div className="w-full h-auto flex items-center bg-light-bg-terciary dark:bg-dark-bg-terciary">
        {isNftLoading && !nft?.image && !nftImage ? (
          <Skeleton extraCss="h-[150px] w-full rounded-t" />
        ) : (
          <>
            {(nft?.image || nftImage)?.includes(".mp4") ? (
              <div className="flex flex-col items-center justify-center relative w-full overflow-hidden">
                <video
                  className="w-full rounded-t nft-image object-cover"
                  src={nft?.image || nftImage}
                  autoPlay
                  muted
                  loop
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center relative w-full overflow-hidden">
                <Image
                  src={image}
                  width={158}
                  height={158}
                  onLoad={() => setIsImageLoading(false)}
                  className="rounde-t w-full p-0 h-auto object-cover bg-light-bg-hover dark:bg-dark-bg-hover rounded-t-xl nft-image"
                  onError={() => setImageState("error")}
                  loading="eager"
                  alt="nft image"
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
          <div className="flex flex-col">
            <SmallFont extraCss="font-normal truncate">
              {nft.name} {showDeleteSelector}
            </SmallFont>
            <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
              {String(nft?.token_id).length < 10 ? `#${nft?.token_id}` : ""}
            </SmallFont>
          </div>
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
        className={`flex absolute w-full h-full bg-light-bg-primary dark:bg-dark-bg-primary rounded
       transition-all duration-200 ${
         showDeleteSelector || isHover || showHiddenNfts
           ? "opacity-60"
           : "opacity-0"
       } ${
          isHover && !showDeleteSelector ? "cursor-pointer" : "cursor-default"
        }`}
      />
      {showDeleteSelector || showHiddenNfts ? (
        <button
          className="h-full w-full flex items-center justify-center flex-col rounded-full border border-light-border-primary
           dark:border-dark-border-primary z-[1] absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 "
          onClick={() => handleHiddenNft(nft?.token_hash)}
        >
          <AiOutlineDelete
            className={`text-light-font-100 dark:text-dark-font-100 transition-all duration-200 ease-in-out mt-0.5 text-4xl ${
              isHiddenNFT || isHover ? "opacity-100" : "opacity-0"
            }`}
          />
        </button>
      ) : null}
      {isHover === nft?.token_hash && !showDeleteSelector && !showHiddenNfts ? (
        <button
          className={`flex items-center justify-center absolute  w-[100%] h-full transition-all duration-200 ${
            isHover === nft?.token_hash ? "opacity-100" : "opacity-0"
          } z-[1]`}
          onClick={() => {
            openInNewTab(
              `https://opensea.io/collection/${getUrlFromName(nft?.name)}`
            );
          }}
        >
          <div className="flex flex-col items-center justify-center">
            <SmallFont extraCss="mb-3 font-medium text-center whitespace-pre-wrap">
              Watch on Opensea
            </SmallFont>
            <img
              className="w-[35px] h-[35px] md:h-[30px] md:w-[30px] rounded-full shadow-md border border-light-border-secondary dark:border-dark-border-secondary"
              src="https://opensea.io/static/images/logos/opensea-logo.svg"
              alt="Opensea logo"
            />
          </div>
        </button>
      ) : null}
    </div>
  );
};
