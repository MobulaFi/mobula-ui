import { useContext, useState } from "react";
// import {useAlert} from "react-alert";
import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { useAccount } from "wagmi";
import { Button } from "../../../../../../components/button";
import { SmallFont } from "../../../../../../components/fonts";
import { Input } from "../../../../../../components/input";
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
    <div className="flex flex-col border-b border-light-border-primary dark:border-dark-border-primary">
      <div className="flex items-center justify-between my-2.5">
        <SmallFont>Rename</SmallFont>
        <button onClick={() => setShow(false)}>
          <AiOutlineClose className="text-xs mr-[13px] text-light-font-100 dark:text-dark-font-100" />
        </button>
      </div>
      <div className="flex items-center mt-0 mb-[15px]">
        <Input
          extraCss="w-full"
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button
          extraCss="min-w-[35px] w-[35px] h-[35px] ml-2.5"
          onClick={() => {
            signerGuard(() => {
              if (newName !== "") {
                renamePortfolio();
                setShow(false);
              }
              // else alert.show("Name cannot be empty");
            });
          }}
        >
          <BsCheckLg className="text-xs text-light-font-100 dark:text-dark-font-100" />
        </Button>
      </div>
    </div>
  );
};
