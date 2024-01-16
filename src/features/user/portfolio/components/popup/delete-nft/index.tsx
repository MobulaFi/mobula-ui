import { Button } from "components/button";
import { MediumFont } from "components/fonts";
import React, { useContext } from "react";
import { Modal } from "../../../../../../components/modal-container";
import { PortfolioV2Context } from "../../../context-manager";

export const DeleteNftPopup = () => {
  const { showDeleteNft, setShowDeleteNft, setNftsDeleted } =
    useContext(PortfolioV2Context);

  const getNftHidden = () => {
    const nfts = localStorage.getItem("hiddenNft");
    if (nfts) {
      localStorage.setItem(
        "hiddenNft",
        JSON.stringify([...JSON.parse(nfts), showDeleteNft.token_hash])
      );
      setNftsDeleted([...JSON.parse(nfts), showDeleteNft.token_hash]);
      return null;
    }
    localStorage.setItem(
      "hiddenNft",
      JSON.stringify([showDeleteNft.token_hash])
    );
    setNftsDeleted([showDeleteNft.token_hash]);
    return null;
  };

  return (
    <Modal
      extraCss="max-w-[355px]"
      title="Delete your NFT"
      isOpen={showDeleteNft !== null}
      onClose={() => setShowDeleteNft(null)}
    >
      <div className="bg-light-border-primary dark:bg-dark-border-primary h-[1px] w-[60%] mx-auto mt-[15px]" />
      <MediumFont extraCss="my-5">
        Are you sure that you want to delete {showDeleteNft?.name}?
      </MediumFont>
      <div className="flex border-t pt-[15px] pb-0 border-light-border-primary dark:border-dark-border-primary">
        <Button
          extraCss="max-w-fit mr-2.5"
          onClick={() => setShowDeleteNft(null)}
        >
          Cancel
        </Button>
        <Button
          extraCss="max-w-fit border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue"
          onClick={() => {
            setShowDeleteNft(null);
            getNftHidden();
          }}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
};
