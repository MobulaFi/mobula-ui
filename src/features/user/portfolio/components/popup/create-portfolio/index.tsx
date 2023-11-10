import { CloseIcon } from "@chakra-ui/icons";
import { Button, Collapse, Flex, Icon, Input, Switch } from "@chakra-ui/react";
import { useContext, useRef } from "react";
// import {useAlert} from "react-alert";
import React from "react";
import { BsDatabaseDown, BsTrash3 } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { AddressAvatar } from "../../../../../../components/avatar";
import {
  TextExtraSmall,
  TextMedium,
  TextSmall,
} from "../../../../../../components/fonts";
import { UserContext } from "../../../../../../contexts/user";
import { useSignerGuard } from "../../../../../../hooks/signer";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { pushData } from "../../../../../../lib/mixpanel";
import { GET } from "../../../../../../utils/fetch";
import { addressSlicer } from "../../../../../../utils/formaters";
import { PortfolioV2Context } from "../../../context-manager";
import { IPortfolio } from "../../../models";
import { flexGreyBoxStyle } from "../../../style";

export const CreatePortfolio = () => {
  const { user } = useContext(UserContext);
  const signerGuard = useSignerGuard();
  const inputRef = useRef<HTMLInputElement>();

  // const alert = useAlert();
  const { boxBg6, borders, text40, text10, text80, hover } = useColors();
  const {
    setShowCreatePortfolio,
    setUserPortfolio,
    setActivePortfolio,
    userPortfolio,
    setShowPortfolioSelector,
    portfolioSettings,
    setPortfolioSettings,
  } = useContext(PortfolioV2Context);
  const { address } = useAccount();

  const createPortfolio = () => {
    // Sometimes, the user won't click on the button to add the last wallet
    // So we add it here
    let finalWallets = portfolioSettings.wallets;
    if (inputRef.current.value !== "" && isAddress(inputRef.current.value))
      finalWallets = [...finalWallets, inputRef.current.value]
        .map((e) => e.toLowerCase())
        .filter((value, index, self) => self.indexOf(value) === index);

    const newPortfolio: IPortfolio = {
      user: user.id,
      name: portfolioSettings.name,
      public: portfolioSettings.public,
      wallets: finalWallets,
      removed_transactions: [],
      base_wallet: "",
      id: 0,
      last_cached: Date.now(),
      removed_assets: [],
      reprocess: false,
      hidden_assets: [],
      portfolio: [],
    };

    GET("/portfolio/create", {
      account: address,
      user: user.id,
      name: portfolioSettings.name,
      public: portfolioSettings.public,
      reprocess: true,
      wallets: finalWallets.join(","),
      removed_transactions: "[]",
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.error) {
          return;
          // alert.error(resp.error);
        } else {
          // alert.success("Successfully created a new portfolio");
          setUserPortfolio([
            ...userPortfolio,
            { ...newPortfolio, id: resp.id, base_wallet: resp.base_wallet },
          ]);
          setActivePortfolio({
            ...newPortfolio,
            id: resp.id,
            base_wallet: resp.base_wallet,
          });
          setShowPortfolioSelector(false);
        }
      });

    pushData("Portfolio Created");
  };

  return (
    <Flex direction="column">
      <Flex align="center" justify="space-between" mb="10px">
        <Flex align="center">
          <Icon as={BsDatabaseDown} color={text80} mr="7.5px" />
          <TextSmall>Portfolio name</TextSmall>
        </Flex>
        <Button onClick={() => setShowCreatePortfolio(false)}>
          <CloseIcon fontSize="10px" color={text80} />
        </Button>
      </Flex>
      <Input
        mb="5px"
        px="10px"
        onChange={(e) => {
          setPortfolioSettings((prev) => ({ ...prev, name: e.target.value }));
        }}
        placeholder="My Best Portfolio"
        value={portfolioSettings.name}
        h="35px"
        borderRadius="8px"
        bg={boxBg6}
        w="100%"
        color={text80}
        fontWeight="400"
        _placeholder={{ color: text80 }}
        border={borders}
      />
      <Flex align="center" justify="space-between" mb="10px">
        <TextExtraSmall mt="-4px" color={text40}>
          Make this portfolio public
        </TextExtraSmall>
        <Switch
          size="sm"
          mt="4px"
          bg={portfolioSettings.public ? "blue" : text10}
          borderRadius="full"
          defaultChecked={false}
          onChange={() =>
            setPortfolioSettings((prev) => ({ ...prev, public: !prev.public }))
          }
        />
      </Flex>
      <Flex align="center" justify="space-between" mb="10px">
        <Flex align="center">
          <Icon as={BsDatabaseDown} color={text80} mr="7.5px" />
          <TextSmall>Add wallet</TextSmall>
        </Flex>
      </Flex>
      <Flex mb="10px">
        <Input
          px="10px"
          ref={inputRef}
          placeholder="0x"
          h="35px"
          borderRadius="8px"
          bg={boxBg6}
          w="100%"
          color={text80}
          fontWeight="400"
          border={borders}
          _placeholder={{ color: text80 }}
        />
        <Button
          boxSize="35px"
          bg={boxBg6}
          borderRadius="8px"
          ml="10px"
          border={borders}
          _hover={{ bg: hover }}
          transition="all 250ms ease-in-out"
          onClick={() => {
            if (!isAddress(inputRef.current.value)) {
              // alert.error("Invalid address");
              return;
            }
            if (!portfolioSettings.wallets.includes(inputRef.current.value)) {
              setPortfolioSettings((prev) => ({
                ...prev,
                wallets: [...prev.wallets, inputRef.current.value],
              }));
            }
            // else alert.show("This wallet has already been added");
            inputRef.current.value = "";
          }}
        >
          <Icon as={IoMdAddCircleOutline} color={text80} />
        </Button>
      </Flex>
      <Collapse in={portfolioSettings.wallets.length > 0} startingHeight={0}>
        <Flex direction="column" mb="10px">
          {portfolioSettings.wallets?.map((entry, index) => (
            <Flex align="center" justify="space-between" mb="5px">
              <Flex
                align="center"
                mb={
                  index !== portfolioSettings.wallets.length - 1 ? "5px" : "0px"
                }
                ml="2px"
              >
                <AddressAvatar boxSize="32px" address={entry} />
                <Flex direction="column" ml="10px">
                  <TextMedium>{addressSlicer(entry)}</TextMedium>
                </Flex>
              </Flex>
              <Button
                boxSize="fit-content"
                onClick={() => {
                  setPortfolioSettings((prev) => ({
                    ...prev,
                    wallets: prev.wallets.filter((wallet) => wallet !== entry),
                  }));
                }}
              >
                <Flex {...flexGreyBoxStyle} bg="red" mr="3px">
                  <Icon as={BsTrash3} color={text80} />
                </Flex>
              </Button>
            </Flex>
          ))}
        </Flex>
      </Collapse>
      <Flex mt="15px">
        <Button
          variant="outlined"
          fontSize={["12px", "12px", "13px", "14px"]}
          fontWeight="400"
          color={text80}
          w="100%"
          maxW="100%"
          borderRadius="8px"
          onClick={() => {
            signerGuard(() => {
              if (portfolioSettings.name !== "") {
                createPortfolio();
                setShowCreatePortfolio(false);
              }
            });
          }}
        >
          Create
        </Button>
      </Flex>
    </Flex>
  );
};
