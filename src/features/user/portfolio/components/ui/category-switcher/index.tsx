import { DownloadIcon } from "@chakra-ui/icons";
import { Button, Flex, Icon } from "@chakra-ui/react";
import { useContext, useEffect } from "react";
// import {useAlert} from "react-alert";
import React from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { BiCoinStack, BiImage } from "react-icons/bi";
import { RiBankLine } from "react-icons/ri";
import { TextLandingSmall } from "../../../../../../components/fonts";
import { NextChakraLink } from "../../../../../../components/link";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { pushData } from "../../../../../../lib/mixpanel";
import { PortfolioV2Context } from "../../../context-manager";
import { buttonDeleteNft } from "../../../style";

export const CategorySwitcher = () => {
  const {
    manager,
    activeCategory,
    setActiveCategory,
    setNftsDeleted,
    setNftToDelete,
    nftToDelete,
    setShowDeleteSelector,
    showDeleteSelector,
    activeStep,
  } = useContext(PortfolioV2Context);
  // const alert = useAlert();
  const { text40, text80, text10, boxBg6, hover, borders, bordersActive } =
    useColors();

  const categories = [
    {
      title: "Cryptos",
      icon: BiCoinStack,
    },
    {
      title: "NFTs",
      icon: BiImage,
    },
    {
      title: "Activity",
      icon: AiOutlineSwap,
    },
    {
      title: "Staking",
      icon: RiBankLine,
    },
  ];
  useEffect(() => {
    setNftsDeleted(JSON.parse(localStorage.getItem("hiddenNft")));
  }, []);

  const getNftHidden = () => {
    const arrToDelete = JSON.parse(localStorage.getItem("hiddenNft")) || [];
    nftToDelete?.forEach((nft) => {
      if (!arrToDelete.includes(nft)) {
        arrToDelete.push(nft);
      }
    });
    localStorage.setItem("hiddenNft", JSON.stringify(arrToDelete));
    setNftsDeleted(arrToDelete);
    setNftToDelete([]);
    setShowDeleteSelector(false);
  };
  return (
    <Flex
      justify="space-between"
      align="center"
      my="25px"
      overflowX={["scroll", "visible"]}
      pb={["10px", "0px"]}
      mt={!manager.portfolio_chart ? "0px" : "25px"}
      w="100%"
    >
      <Flex>
        {categories.map((entry, i) => (
          <Flex
            // zIn
            zIndex={entry.title === "Activity" && activeStep.nbr === 4 ? 5 : 0}
          >
            <Button
              onClick={() => {
                if (entry.title === "Cryptocurrencies")
                  setActiveCategory("Cryptos");
                else setActiveCategory(entry.title);

                pushData("Portfolio Switch Clicked", {
                  type: entry.title,
                });
              }}
              isDisabled={entry.title === "Staking"}
              color={activeCategory === entry.title ? text80 : text40}
            >
              <Icon as={entry.icon} mr="7.5px" />
              <TextLandingSmall
                color={activeCategory === entry.title ? text80 : text40}
              >
                {entry.title}
              </TextLandingSmall>
            </Button>
            <Flex
              h="20px"
              w="2px"
              bg={text10}
              mx="20px"
              borderRadius="full"
              display={i !== categories.length - 1 ? "flex" : "none"}
            />
          </Flex>
        ))}
      </Flex>
      <Flex ml="auto" fontSize="12px" mr="10px">
        Need data?
        <NextChakraLink
          href="https://developer.mobula.fi/reference/wallet-explorer-api?utm_source=website&utm_medium=portfolio&utm_campaign=portfolio"
          target="_blank"
          rel="noreferrer"
          ml="5px"
          color="blue"
          onClick={() => {
            pushData("API Clicked");
          }}
        >
          Check our API
        </NextChakraLink>
      </Flex>
      {activeCategory === "Activity" ? (
        <Flex w="fit-content">
          <Button
            sx={buttonDeleteNft}
            bg={boxBg6}
            color={text80}
            border={borders}
            _placeholder={{ border: bordersActive, bg: hover }}
            onClick={() => {
              // alert.show("Coming soon, stay tuned Mobuler, we keep building!");
              pushData("Export CSV Clicked");
            }}
            display="flex"
            alignContent="center"
          >
            CSV <DownloadIcon ml="5px" />
          </Button>
        </Flex>
      ) : null}
      {activeCategory === "NFTs" ? (
        <Flex w="fit-content">
          {(nftToDelete.length > 0 && showDeleteSelector) ||
          !showDeleteSelector ? (
            <Button
              sx={buttonDeleteNft}
              bg={boxBg6}
              color={text80}
              border={borders}
              _placeholder={{ border: bordersActive, bg: hover }}
              onClick={() => {
                if (!showDeleteSelector) setShowDeleteSelector(true);
                else getNftHidden();
              }}
            >
              {nftToDelete?.length > 0
                ? `Hide (${nftToDelete.length})`
                : "Manage NFTs"}
            </Button>
          ) : null}

          {showDeleteSelector ? (
            <Button
              sx={buttonDeleteNft}
              bg={boxBg6}
              color={text80}
              border={borders}
              _placeholder={{ border: bordersActive, bg: hover }}
              ml="10px"
              onClick={() => {
                setShowDeleteSelector(false);
                setNftToDelete([]);
              }}
            >
              Cancel
            </Button>
          ) : null}
        </Flex>
      ) : null}
    </Flex>
  );
};
