import React from "react";
import { Modal } from "../../components/modal-container";
import { CoreSearchBar } from "./core";

interface SearchBarPopupProps {
  trigger: boolean;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SearchBarPopup = ({
  trigger,
  setTrigger,
}: SearchBarPopupProps) => {
  return (
    <Modal
      isOpen={trigger}
      onClose={() => setTrigger(false)}
      extraCss="max-w-[500px] sm:h-screen sm:w-screen sm:top-0 sm:pt-[80px] md:w-full p-0 sm:w-full sm:max-w-full"
    >
      <CoreSearchBar trigger={trigger} setTrigger={setTrigger} />
    </Modal>
  );
};
