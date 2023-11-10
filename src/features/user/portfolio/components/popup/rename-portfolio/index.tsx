import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Button, Flex, Input } from "@chakra-ui/react";
import { useContext, useState } from "react";
// import {useAlert} from "react-alert";
import React from "react";
import { useAccount } from "wagmi";
import { TextSmall } from "../../../../../../components/fonts";
import { useSignerGuard } from "../../../../../../hooks/signer";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { pushData } from "../../../../../../lib/mixpanel";
import { GET } from "../../../../../../utils/fetch";
import { PortfolioV2Context } from "../../../context-manager";
import { IPortfolio } from "../../../models";

interface IRenamePortfolio {
  portfolio: IPortfolio;
  setShow: (value: number | false) => void;
}

export const RenamePortfolio = ({ portfolio, setShow }: IRenamePortfolio) => {
  const signerGuard = useSignerGuard();
  const [newName, setNewName] = useState("");
  const { boxBg6, borders, text80, hover } = useColors();
  // const alert = useAlert();
  const { setActivePortfolio, setShowPortfolioSelector } =
    useContext(PortfolioV2Context);
  const { address } = useAccount();

  const renamePortfolio = () => {
    pushData("Portfolio Renamed");
    GET("/portfolio/edit", {
      id: portfolio.id,
      name: newName,
      public: portfolio.public,
      reprocess: true,
      wallets: portfolio.wallets.join(","),
      removed_transactions: portfolio.removed_transactions.join(","),
      removed_assets: portfolio.removed_assets.join(","),
      account: address,
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.error) {
          return;
          // alert.error(resp.error);
        } else {
          setActivePortfolio({ ...portfolio, name: newName });
          setShowPortfolioSelector(false);
        }
      });
  };

  return (
    <Flex direction="column" borderBottom={borders}>
      <Flex align="center" justify="space-between" my="10px">
        <TextSmall>Rename</TextSmall>
        <Button onClick={() => setShow(false)}>
          <CloseIcon fontSize="10px" mr="13px" color={text80} />
        </Button>
      </Flex>
      <Flex mt="0px" mb="15px">
        <Input
          px="10px"
          onChange={(e) => {
            setNewName(e.target.value);
          }}
          placeholder="Name"
          value={newName}
          h="35px"
          borderRadius="8px"
          bg={boxBg6}
          w="100%"
          color={text80}
          fontWeight="400"
          _placeholder={{ color: text80 }}
          border={borders}
        />

        <Button
          variant="outlined"
          minW="35px"
          bg={boxBg6}
          color={text80}
          _hover={{ bg: hover, color: "green" }}
          border={borders}
          boxSize="35px"
          w="fit-content"
          ml="10px"
          borderRadius="8px"
          onClick={() => {
            signerGuard(() => {
              if (newName !== "") {
                renamePortfolio();
                setShow(false);
              } else alert.show("Name cannot be empty");
            });
          }}
        >
          <CheckIcon fontSize="12px" />
        </Button>
      </Flex>
    </Flex>
  );
};
