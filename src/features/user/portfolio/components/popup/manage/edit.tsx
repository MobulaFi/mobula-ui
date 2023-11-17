import { CheckIcon } from "@chakra-ui/icons";
import { Button, Flex, Image } from "@chakra-ui/react";
import { ModalContainer } from "components/modal-container";
import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { TextSmall } from "../../../../../../components/fonts";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { createSupabaseDOClient } from "../../../../../../lib/supabase";
import { GET } from "../../../../../../utils/fetch";
import { PortfolioV2Context } from "../../../context-manager";
import { useWebSocketResp } from "../../../hooks";

const supabase = createSupabaseDOClient();

export const ManageEdit = () => {
  const {
    setShowManage,
    activePortfolio,
    setActivePortfolio,
    setShowHiddenTokensPopup,
    hiddenTokens,
    showHiddenTokensPopup,
    setIsLoading,
  } = useContext(PortfolioV2Context);
  const { boxBg6, bordersActive, borders, boxBg1, text10, text80, hover } =
    useColors();
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [isCheck, setIsCheck] = useState<Record<number, boolean>>({});
  const { address } = useAccount();

  const refreshPortfolio = useWebSocketResp();

  const handleCheckboxChange = (tokenId: number) => {
    setIsCheck((prev) => ({
      ...prev,
      [tokenId]: !prev[tokenId],
    }));
  };

  const restoreHiddenAssets = async () => {
    if (activePortfolio) {
      setIsLoading(true);

      let updatedRemovedAssets = activePortfolio.removed_assets.filter(
        (tokenId) => !selectedTokens.includes(tokenId)
      );

      if (updatedRemovedAssets.length === 0) {
        updatedRemovedAssets = [];
      }

      activePortfolio.removed_assets = updatedRemovedAssets;

      const freshPortfolio = {
        ...activePortfolio,
        removed_assets: [...activePortfolio.removed_assets],
      };
      setActivePortfolio(freshPortfolio);
      refreshPortfolio(freshPortfolio);

      try {
        const data = await GET("/portfolio/edit", {
          account: address,
          removed_assets: [activePortfolio.removed_assets].join(","),
          removed_transactions: activePortfolio.removed_transactions.join(","),
          wallets: activePortfolio.wallets.join(","),
          id: activePortfolio.id,
          name: activePortfolio.name,
          reprocess: true,
          public: activePortfolio.public,
        });
      } catch (error) {
        console.log(error);
      }

      setIsLoading(false);
      setShowHiddenTokensPopup(false);
    }
  };

  useEffect(() => {
    const newSelectedTokens = Object.keys(isCheck)
      .filter((id) => isCheck[Number(id)])
      .map(Number);
    setSelectedTokens(newSelectedTokens);
  }, [isCheck]);

  return (
    <ModalContainer
      extraCss="max-w-[400px]"
      title="Hidden assets"
      isOpen={showHiddenTokensPopup}
      onClose={() => setShowHiddenTokensPopup(false)}
    >
      <Flex wrap="wrap">
        {Object.entries(hiddenTokens).map(([tokenId, tokenData], index) => (
          <Flex
            key={index}
            align="center"
            justify="space-between"
            mt="10px"
            bg={boxBg6}
            p="10px"
            w="calc(50% - 10px)"
            mr={index % 2 === 0 ? "10px" : "0px"}
            ml={index % 2 === 0 ? "0px" : "10px"}
            borderRadius="8px"
            border={borders}
            onClick={() => handleCheckboxChange(Number(tokenId))}
            cursor="pointer"
            _hover={{ bg: hover }}
            transition="all 200ms ease-in-out"
          >
            <Flex align="center">
              <Image
                src={tokenData.logo}
                alt={`${tokenData.symbol} logo`}
                boxSize={["25px"]}
                borderRadius="full"
              />
              <TextSmall ml="10px" fontWeight="500">
                {tokenData.symbol}
              </TextSmall>
            </Flex>

            <Flex
              align="center"
              justify="center"
              width="15px"
              height="15px"
              border={bordersActive}
              borderRadius="3px"
            >
              <CheckIcon
                fontSize="10px"
                opacity={isCheck[Number(tokenId)] ? 1 : 0}
                transition={"all 200ms ease-in-out"}
              />
            </Flex>
          </Flex>
        ))}
      </Flex>
      <Button
        variant="outlined"
        borderRadius="8px"
        fontWeight="400"
        color={text80}
        mt="10px"
        onClick={() => {
          restoreHiddenAssets();
          setShowHiddenTokensPopup(false);
          setShowManage(false);
        }}
      >
        Delete from hidden assets ({selectedTokens.length})
      </Button>
    </ModalContainer>
  );
};
