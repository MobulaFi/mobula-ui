import { Button } from "components/button";
import { useAnalytics } from "features/analytic/context-manager";
import React from "react";
import { Modal } from "../../../../components/modal-container";
import { getFakeData, initialOptions, options } from "../../constants";
import { selectedOptionProps } from "../../models";
import { PreviewOptions } from "./preview-options";
import { ViewOptions } from "./view-options";

export const SelectorPopup = () => {
  const fakeData = getFakeData();
  const {
    selectedOption,
    views,
    setSelectedOption,
    setViews,
    isOpen,
    setIsOpen,
  } = useAnalytics();

  const handleOptionClick = (option: string) => {
    const data = [
      ["Testing", 40],
      ["Testing 2", 60],
      ["Testing 3", 20],
      ["Testing 4", 80],
    ];
    setSelectedOption((prev) => ({
      ...prev,
      type: option,
      data: option === "pie" ? data : fakeData,
    }));
  };

  const submitView = () => {
    // If the selected option is a title, we need to set the width to 100%
    if (selectedOption.type === "title") {
      const newView: selectedOptionProps = {
        ...selectedOption,
        id: Math.random(),
        width: "100%",
      };
      setViews((prev) => [...(prev || []), newView]);
    } else {
      const newView: selectedOptionProps = {
        ...selectedOption,
        id: Math.random(),
      };
      setViews((prev) => [...(prev || []), newView]);
    }
    // Reset the selected option to the initial state
    setSelectedOption(initialOptions);
    // Close the modal
    setIsOpen(false);
  };

  return (
    <>
      <Modal title="Create view" isOpen={isOpen} extraCss="max-w-[1000px]">
        <div className="flex w-full">
          <div className="w-2/4 pr-2.5 flex flex-col">
            <div className="flex flex-wrap">
              {options.map((option) => (
                <Button
                  extraCss={`mr-2.5 mb-2.5 ${
                    option.type === selectedOption.type
                      ? "bg-light-bg-hover dark:bg-dark-bg-hover"
                      : ""
                  }`}
                  onClick={() => handleOptionClick(option.type)}
                >
                  {option.name}
                </Button>
              ))}
            </div>
            <div className="flex flex-col h-full justify-between w-full pt-5">
              <ViewOptions />
              <Button onClick={submitView}>Submit</Button>
            </div>
          </div>
          <PreviewOptions selectedOption={selectedOption} />
        </div>
      </Modal>
    </>
  );
};
