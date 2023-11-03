import {ChevronDownIcon} from "@chakra-ui/icons";
import {Button, Flex, Image} from "@chakra-ui/react";
import {
  blockchainsContent,
  blockchainsIdContent,
} from "mobula-lite/lib/chains/constants";
import {useContext} from "react";
import {useNetwork} from "wagmi";
import {SwapContext} from "../../../../..";
import {ColorsContext} from "../../../../../../../../../pages/iframe/swap";
import {TextSmall} from "../../../../../../../../UI/Text";
import {useColors} from "../../../../../../../utils/color-mode";

export const BlockchainChanger = ({
  setShowBlockchainSelector,
  selector = true,
}: {
  setShowBlockchainSelector: any;
  selector?: boolean;
}) => {
  const {tokenOut, chainNeeded} = useContext(SwapContext);
  const {chain} = useNetwork();
  const {fontMain} = useContext(ColorsContext);
  const {text80} = useColors();

  if (tokenOut) {
    const blockchain =
      "blockchain" in tokenOut
        ? tokenOut.blockchain
        : blockchainsIdContent[chainNeeded || chain?.id || 1]?.name;
    const isBnbChain: boolean = blockchain === "BNB Smart Chain (BEP20)";
    return (
      <Button
        _focus={{boxShadow: "none"}}
        onClick={() => setShowBlockchainSelector(prev => !prev)}
      >
        <Flex align="center">
          <Image
            src={blockchainsContent[blockchain].logo}
            boxSize={["13px", "13px", "15px"]}
            borderRadius="full"
          />
          <TextSmall mx="5px" color={fontMain || text80}>
            {isBnbChain ? "BNB Chain" : blockchain}
          </TextSmall>
          {selector && (
            <ChevronDownIcon
              color={fontMain || text80}
              fontSize={["15px", "15px", "17px"]}
              mr="10px"
            />
          )}
        </Flex>
      </Button>
    );
  }
  return null;
};
