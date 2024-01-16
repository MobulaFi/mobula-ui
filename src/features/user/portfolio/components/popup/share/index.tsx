import { useTheme } from "next-themes";
import React, { useContext, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { BsCheckLg, BsShare } from "react-icons/bs";
import { SmallFont } from "../../../../../../components/fonts";
import { Modal } from "../../../../../../components/modal-container";
import {
  addressSlicer,
  getFormattedAmount,
} from "../../../../../../utils/formaters";
import { PortfolioV2Context } from "../../../context-manager";
import { copyText } from "../../../utils";

interface SharePopupProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

export const SharePopup = ({ show, setShow }: SharePopupProps) => {
  const [isCopied, setIsCopied] = useState("");
  const { activePortfolio, isWalletExplorer, wallet } =
    useContext(PortfolioV2Context);
  const { resolvedTheme } = useTheme();

  return (
    <Modal
      extraCss="max-w-[390px]"
      title="Share Portfolio"
      isOpen={show}
      onClose={() => setShow(false)}
    >
      <div>
        <div className="flex pb-[15px] items-center">
          <img
            className="w-[34px] h-[34px] mr-[5px]"
            src={
              resolvedTheme === "dark"
                ? "/mobula/fullicon.png"
                : "/mobula/mobula-logo.svg"
            }
            alt="mobula logo"
          />
          <div className="flex flex-col ml-[7.5px]">
            <SmallFont extraCss="font-normal">
              {isWalletExplorer
                ? addressSlicer(isWalletExplorer)
                : activePortfolio?.name}
            </SmallFont>
            <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
              ${getFormattedAmount(wallet?.estimated_balance)}
            </SmallFont>
          </div>
        </div>
      </div>
      <div className="pt-[15px] border-t border-light-border-primary dark:border-dark-border-primary">
        <div className="flex flex-col w-full">
          <div className="flex items-center mb-2.5">
            <BsShare className="text-light-font-100 dark:text-dark-font-100 mr-2.5" />
            <SmallFont>Share to Community</SmallFont>
          </div>
          <div
            className="flex items-center justify-between px-2.5 bg-light-bg-terciary dark:bg-dark-bg-terciary rounded-md h-[35px]
             text-light-font-100 dark:text-dark-font-100 border-light-border-primary dark:border-dark-border-primary"
          >
            <SmallFont>
              {isWalletExplorer
                ? `https://mobula.fi/wallet/${addressSlicer(isWalletExplorer)}`
                : `https://mobula.fi/portfolio/explore/${activePortfolio?.id}`}
            </SmallFont>
            <button
              className="text-light-font-100 dark:text-dark-font-100 text-sm lg:text-[13px] md:text-xs"
              onClick={() =>
                copyText(
                  isWalletExplorer
                    ? `https://mobula.fi/wallet/${isWalletExplorer}`
                    : `https://mobula.fi/portfolio/explore/${activePortfolio?.id}`,
                  setIsCopied
                )
              }
            >
              {isCopied ? (
                <BsCheckLg className="text-green dark:text-green ml-[7.5px] text-[15px]" />
              ) : (
                <BiCopy className="ml-[7.5px] text-light-font-40 dark:text-dark-font-40 text-[15px]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
