import {CheckIcon} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Image,
  Skeleton,
  useColorMode,
} from "@chakra-ui/react";
import {useContext, useEffect, useState} from "react";
import {getUrlFromName} from "../../../../../../../utils/helpers/formaters";
import {TextSmall} from "../../../../../../UI/Text";
import {HoldingNFT} from "../../../../../../common/model/holdings";
import {useColors} from "../../../../../../common/utils/color-mode";
import {PortfolioV2Context} from "../../../context-manager";

export const NftPortfolioCard = ({
  nft,
  showDeleteSelector,
}: {
  showDeleteSelector: boolean;
  nft: HoldingNFT;
}) => {
  const {setNftToDelete, nftToDelete, isNftLoading} =
    useContext(PortfolioV2Context);
  const [nftImage, setNftImage] = useState<string | undefined>(undefined);
  const [isHover, setIsHover] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const {colorMode} = useColorMode();
  const {boxBg6, hover, borders, bordersActive, text80, bgMain, text60} =
    useColors();
  console.log(showDeleteSelector);

  useEffect(() => {
    if (!nft?.image && !isNftLoading) {
      fetch(nft.token_uri)
        .then(r => r.json())
        .then((r: {image: string}) => {
          setNftImage(r.image);
        });
    }
  }, [nft]);

  const sx = !error
    ? {
        w: ["160px", "160px", "210px", "210px"],
        h: ["160px", "160px", "210px", "210px"],
      }
    : {};

  const openInNewTab = (url: string) => {
    const win = window.open(url, "_blank");
    win?.focus();
  };

  //   if (!nft?.name) return null;
  return (
    <Flex
      direction="column"
      // css="width:calc(20% - 10px)"
      m="5px"
      borderRadius="8px"
      bg={boxBg6}
      position="relative"
      minW={["160px", "100px", "210px", "210px"]}
      minH={["160px", "100px", "210px", "210px"]}
      w={[
        "calc(50% - 10px)",
        "calc(33% - 10px)",
        "calc(33% -8px)",
        "calc(20% - 10px)",
      ]}
      border={borders}
      onMouseEnter={() => setIsHover(nft?.token_hash)}
      onMouseLeave={() => setIsHover("")}
    >
      <Box
        w="100%"
        h="auto"
        mb="auto"
        display="flex"
        alignItems="center"
        bg={boxBg6}
      >
        {isNftLoading ? (
          <Skeleton
            h="210px"
            borderRadius="8px 8px 0 0"
            w="100%"
            startColor={bgMain}
            endColor={hover}
          />
        ) : (
          <>
            {(nft?.image || nftImage)?.includes(".mp4") ? (
              <Box
                as="video"
                src={nft?.image || nftImage}
                borderRadius="8px 8px 0 0"
                w="100%"
                autoPlay
                muted
              />
            ) : (
              <Flex
                direction="column"
                align="center"
                justify="center"
                position="relative"
                w="100%"
              >
                <Image
                  src={nft?.image || nftImage}
                  fallbackSrc={
                    error
                      ? colorMode === "light"
                        ? "/asset/no-image.png"
                        : "/asset/no-image-dark.png"
                      : colorMode === "light"
                      ? "/asset/load.png"
                      : "asset/load-dark.png"
                  }
                  borderRadius="8px 8px 0 0"
                  w="100%"
                  p="0px"
                  h="auto"
                  maxH="210px"
                  bg={hover}
                  onError={() => {
                    setError(true);
                  }}
                />
              </Flex>
            )}
          </>
        )}
      </Box>
      <Flex p="10px" direction="column" justify="center" h="auto">
        {isNftLoading ? (
          <Skeleton h="20px" w="90px" startColor={bgMain} endColor={hover} />
        ) : (
          <TextSmall whiteSpace="pre-wrap" fontWeight="500">
            {nft.name} {showDeleteSelector}
            <Box as="span" ml="5px" color={text60}>
              {String(nft?.token_id).length < 10 ? `#${nft?.token_id}` : ""}
            </Box>
          </TextSmall>
        )}
        {/* <TextExtraSmall color={text60}>Est. Value</TextExtraSmall>
          <Flex align="center">
            <TextMedium mr="5px" color="text.80">
              $000
            </TextMedium>
            <TextSmall color="red">-52%</TextSmall>
          </Flex> */}
      </Flex>
      <Flex
        position="absolute"
        w="100%"
        h="100%"
        maxH="250px"
        bg={bgMain}
        borderRadius="8px"
        transition="all 250ms ease-in-out"
        minW={["160px", "100px", "210px", "210px"]}
        minH={["160px", "100px", "210px", "210px"]}
        opacity={showDeleteSelector || isHover ? "0.8" : "0"}
        cursor={isHover && !showDeleteSelector ? "pointer" : "default"}
      />

      {showDeleteSelector ? (
        <Button
          onClick={() => {
            if (nftToDelete?.includes(nft?.token_hash))
              setNftToDelete(
                nftToDelete.filter(nftHash => nftHash !== nft.token_hash),
              );
            else setNftToDelete([...nftToDelete, nft.token_hash]);
          }}
          boxSize="20px"
          borderRadius="8px"
          border={bordersActive}
          left="10px"
          position="absolute"
          top="10px"
        >
          {nftToDelete?.includes(nft?.token_hash) ? (
            <CheckIcon color={text80} mt="2px" fontSize="10px" />
          ) : null}
        </Button>
      ) : null}
      {isHover === nft?.token_hash && !showDeleteSelector ? (
        <Button
          right="50%"
          top="45%"
          position="absolute"
          transform="translate(50%,-50%)"
          w="80%"
          h="100%"
          transition="all 250ms ease-in-out"
          opacity={isHover === nft.token_hash ? "1" : "0"}
          onClick={() => {
            openInNewTab(
              `https://opensea.io/collection/${getUrlFromName(nft?.name)}`,
            );
          }}
        >
          <Flex direction="column" align="center" justify="center">
            <TextSmall
              mb="10px"
              fontWeight="600"
              textAlign="center"
              whiteSpace="pre-wrap"
            >
              Watch on Opensea
            </TextSmall>
            <Image
              src="https://opensea.io/static/images/logos/opensea-logo.svg"
              boxSize="35px"
              border={bordersActive}
              borderRadius="full"
              boxShadow="1px 2px 13px 4px rgba(0,0,0,0.1)"
            />
          </Flex>
        </Button>
      ) : null}
    </Flex>
  );
};
