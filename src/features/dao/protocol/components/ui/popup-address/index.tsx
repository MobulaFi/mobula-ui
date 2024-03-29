import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React from "react";
import { SmallFont } from "../../../../../../components/fonts";
import { Modal } from "../../../../../../components/modal-container";

export const PopupAddress = ({ isOpen, setIsOpen, distribution }) => {
  return (
    <Modal
      title={distribution?.name || "Distribution"}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    >
      {distribution?.addresses?.map(({ address, blockchain }, i) => (
        <div
          key={address}
          className={`flex items-center ${i !== 0 ? "mt-2.5" : ""} ${
            distribution.addresses.length - 1 === i ? "pb-2.5" : "pb-[5px]"
          }`}
        >
          {blockchain && (
            <img
              src={blockchainsContent[blockchain].logo}
              className="w-5 h-5 rounded-full mr-[7.5px] md:h-4 md:w-4"
              alt={`${blockchain} logo`}
            />
          )}
          <SmallFont extraCss="word-break-all whitespace-pre-wrap">
            {address}
          </SmallFont>
        </div>
      ))}
    </Modal>
  );
};
