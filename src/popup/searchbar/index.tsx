import React from "react";
import { ModalContainer } from "../../components/modal-container";
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
    <ModalContainer
      isOpen={trigger}
      onClose={() => setTrigger(false)}
      extraCss="max-w-[500px]"
    >
      <CoreSearchBar trigger={trigger} setTrigger={setTrigger} />
    </ModalContainer>
  );
};
