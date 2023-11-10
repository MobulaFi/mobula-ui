import {Flex, Image, useColorMode} from "@chakra-ui/react";
import {useContext} from "react";
import {TextLandingSmall} from "../../../../../../UI/Text";
// eslint-disable-next-line import/no-cycle
import {useMultiWalletNftHoldings} from "../../../../../../common/hooks/holdings";
import {useColors} from "../../../../../../common/utils/color-mode";
import {PortfolioV2Context} from "../../../context-manager";
import {NftPortfolioCard} from "./card";

export const blacklistedNft: Record<string, true> = {
  "0xdc2d620faa02c6fca6abc37148faf8c3d085cf94": true,
  "0x6fbb904d7bf0a8e1df1510cecd6edc0184472281": true,
  "0xbb3e57c694578f8d4d291404ae75b73a288c55bd": true,
  "0x3b0a003455e9df1d5259f65702734c18371d750d": true,
  "0xc666408027a92376f63ba1d95bacb19cd7e5fd29": true,
  "0xb9deacba386d75d91f795031947dcbe85139ea45": true,
  "0xc02e930304ecabc5e52754899c1601d6ed4dd419": true,
  "0xcff08239b74a14046788fc537dd80e5839975999": true,
  "0x1aa8d39db2187b95083d910b3137173bee4acffd": true,
  "0xf709b4358be9f28a1ec73a75b12cc84213486abb": true,
  "0xa85fea538a3e6ccefb90af72ea11a2a6f8f6b169": true,
  "0x3a0e13bd9b0aa50fc7b5b321b904de5e858e2562": true,
  "0x7d22c7f48c8253dcdd539f33bd9e0fef47376268": true,
  "0x4339187beaba7cc16057b0996fdb7aceb90f2e46": true,
  "0x9665d4518a8f4069a442f1d54269c7c240dca023": true,
};

export const blacklistedName: Record<string, true> = {
  "$1000 USDC": true,
  "$1250 USDC": true,
  "5000 USDC": true,
  "GALA Airdrop": true,
  "LIDO AIRDROP": true,
  "APE NFT TICKETS": true,
  "Loopring Airdrop": true,
  "UNI EVENT": true,
  "DAI Aridrop": true,
  "OPTIMISM NFT TICKETS": true,
  "$1000 BLUR": true,
  "$2000 USDT": true,
  $ETH: true,
  "MATIC EVENT": true,
  "Ledger Stax: Giveaway": true,
  "$-$30000 BONE": true,
  "$-$100,000 BONE": true,
  "$1250 LINK": true,
  "Optimism Airdrop": true,
  OnlyVerse: true,
  "BitCase FREESPIN": true,
};

export const blacklistedUri: Record<string, true> = {
  "https://ethercb.com/info.json": true,
  "https://daievent.com": true,
  "https://daidrop.com": true,
};
export const NFTs = () => {
  const {activePortfolio, isWalletExplorer, isNftLoading, showDeleteSelector} =
    useContext(PortfolioV2Context);

  useMultiWalletNftHoldings(
    isWalletExplorer ? [isWalletExplorer] : activePortfolio?.wallets,
  );

  const {nfts} = useContext(PortfolioV2Context);
  const {boxBg1, borders, text40} = useColors();
  const {colorMode} = useColorMode();
  const isWhiteMode = colorMode === "light";

  return (
    <Flex direction="column">
      {(nfts?.length > 0 && !isNftLoading) || isNftLoading ? (
        <Flex wrap="wrap">
          {(nfts || Array.from({length: 3})).map((nft, i) => (
            <NftPortfolioCard
              key={nft?.token_hash || i}
              nft={nft}
              showDeleteSelector={showDeleteSelector}
            />
          ))}
        </Flex>
      ) : null}
      {!isNftLoading && !nfts?.length ? (
        <Flex
          h="300px"
          w="100%"
          bg={boxBg1}
          borderRadius="8px"
          align="center"
          justify="center"
          border={borders}
          direction="column"
        >
          <Image
            src={
              isWhiteMode
                ? "/asset/empty-bracket-light.png"
                : "/asset/empty-bracket.png"
            }
            h="100px"
            mb="-20px"
            mt="25px"
          />
          <Flex
            maxW="80%"
            direction="column"
            mt="40px"
            align="center"
            justify="center"
            mb="20px"
          >
            <TextLandingSmall mb="5px" textAlign="center" color={text40}>
              No NFTs found{" "}
            </TextLandingSmall>
          </Flex>
        </Flex>
      ) : null}
    </Flex>
  );
};
