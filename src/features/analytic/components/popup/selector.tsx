import { Button } from "components/button";
import { getFakeData, options } from "features/analytic/constants";
import { useAnalytics } from "features/analytic/context-manager";
import React, { useState } from "react";
import { Modal } from "../../../../components/modal-container";
import { initialOptions } from "../../constants";
import { PreviewOptions } from "./preview-options";
import { ViewOptions } from "./view-options";

export const SelectorPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const fakeData = getFakeData();
  const { selectedOption, setSelectedOption, setViews, views } = useAnalytics();

  const handleOptionClick = (option: string) => {
    if (option === "pie") {
      const data = [
        ["Testing", 40],
        ["Testing 2", 60],
        ["Testing 3", 20],
        ["Testing 4", 80],
      ];
      setSelectedOption((prev) => ({ ...prev, type: option, data }));
    } else
      setSelectedOption((prev) => ({ ...prev, type: option, data: fakeData }));
  };

  const submitView = () => {
    if (selectedOption.type === "title") {
      const newView = {
        ...selectedOption,
        width: "100%",
      };
      setViews((prev) => [...(prev || []), newView]);
    } else setViews((prev) => [...(prev || []), selectedOption]);
    setSelectedOption(initialOptions);
    setIsOpen(false);
  };

  return (
    <>
      <Button extraCss="my-10" onClick={() => setIsOpen(true)}>
        Open
      </Button>
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
