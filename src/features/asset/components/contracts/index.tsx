import {CheckIcon, CopyIcon} from "@chakra-ui/icons";
import {Button, Flex, Image, useClipboard} from "@chakra-ui/react";
import {blockchainsContent} from "mobula-lite/lib/chains/constants";
import {BlockchainName} from "mobula-lite/lib/model";
import {useContext} from "react";
import {useAlert} from "react-alert";
import {useNetwork} from "wagmi";
import {TextSmall} from "../../../../../UI/Text";
import {useColors} from "../../../../../common/utils/color-mode";
import {addressSlicer} from "../../../../../common/utils/user";
import {BaseAssetContext} from "../../context-manager";

export function Contracts({
  contract,
  blockchain,
}: {
  contract: string;
  blockchain: string;
}) {
  const {onCopy, hasCopied} = useClipboard(contract);
  const alert = useAlert();
  const {baseAsset} = useContext(BaseAssetContext);
  const {chain} = useNetwork();
  const {text80, text60, boxBg6, hover, borders, bordersActive} = useColors();
  const shortenedName =
    blockchain === "BNB Smart Chain (BEP20)"
      ? "BNB Chain"
      : blockchain.split(" ")[0];

  const AddTokenToMetamask = async () => {
    if (chain) {
      try {
        await (window as any).ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address:
                baseAsset.contracts[
                  baseAsset.blockchains.indexOf(chain?.name as BlockchainName)
                ],
              symbol: baseAsset.symbol,
              decimals:
                baseAsset.decimals[
                  baseAsset.blockchains.indexOf(chain?.name as BlockchainName)
                ],
              image: baseAsset.logo, // A string url of the token logo
            },
          },
        });
      } catch (error) {
        // Empty error
      }
    } else {
      alert.error(
        `Please switch to a network compatible with ${baseAsset.name}`,
      );
    }
  };

  return (
    <Flex
      align="center"
      position="relative"
      justify="space-between"
      minWidth={["135px", "135px", "181px", "220px"]}
      borderRadius="8px"
      bg={boxBg6}
      border={borders}
      px="10px"
      h="32px"
      w="100%"
      _hover={{bg: hover, border: bordersActive}}
      transition="all 250ms ease-in-out"
    >
      <Flex w="100%" align="center">
        {blockchain ? (
          <Image
            width="17px"
            borderRadius="50%"
            height="17px"
            mr="7px"
            src={
              blockchainsContent[blockchain]?.logo ||
              `/logo/${blockchain.toLowerCase().split(" ")[0]}.png`
            }
          />
        ) : null}
        <TextSmall color={text60}>{shortenedName}</TextSmall>
      </Flex>
      <Flex w="100%" justify="flex-end" ml="20px">
        <TextSmall
          mt="1px"
          mr="10px"
          onClick={() => {
            window.open(
              `${blockchainsContent[blockchain]?.explorer}/address/${contract}`,
              "_blank",
            );
            window.focus();
          }}
          ml="9px"
          textAlign="start"
          color={text80}
        >
          {addressSlicer(contract)}
        </TextSmall>
        <Button onClick={onCopy} fontSize="12px">
          {hasCopied ? (
            <CheckIcon color="green" />
          ) : (
            <CopyIcon color={text60} />
          )}
        </Button>
        <Image
          onClick={AddTokenToMetamask}
          cursor="pointer"
          src="/logo/metamask.png"
          ml="7.5px"
          mt="2px"
          boxSize="17px"
        />
      </Flex>
    </Flex>
  );
}
