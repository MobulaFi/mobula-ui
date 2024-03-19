import React from "react";
import { MediumFont } from "../../../../../components/fonts";
import { selectedOptionProps } from "../../../models";
import { contentFromType } from "../../../utils";

export const PreviewOptions = ({
  selectedOption,
  isPreview = true,
}: {
  selectedOption: selectedOptionProps;
  isPreview?: boolean;
}) => {
  const render = contentFromType(selectedOption);

  return (
    <div className={`${isPreview ? "w-2/4" : "w-full"}`}>
      {selectedOption.type !== "title" && (
        <MediumFont extraCss="mb-2.5">{selectedOption.name}</MediumFont>
      )}
      {render}
    </div>
  );
};
