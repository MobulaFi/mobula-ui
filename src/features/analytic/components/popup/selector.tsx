import { Button } from "components/button";
import { useAnalytics } from "features/analytic/context-manager";
import { useContext } from "react";
import { Modal } from "../../../../components/modal-container";
import { UserContext } from "../../../../contexts/user";
import { createView, editView } from "../../api";
import { getFakeData, initialOptions, options } from "../../constants";
import { selectedQueryProps } from "../../models";
import { PreviewOptions } from "./preview-options";
import { ViewOptions } from "./view-options";

export const SelectorPopup = () => {
  const fakeData = getFakeData();
  const { user } = useContext(UserContext);
  const {
    selectedQuery,
    views,
    setSelectedQuery,
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
    setSelectedQuery((prev) => ({
      ...prev,
      type: option,
      data: option === "pie" ? data : fakeData,
    }));
  };

  const submitView = () => {
    const newView: selectedQueryProps = {
      ...selectedQuery,
      id: Math.random(),
    };
    setViews((prev) => [...(prev || []), newView]);
    if (selectedQuery.id === 1000) {
      createView(selectedQuery, user.id);
      editView(selectedQuery);
    }
    // Reset the selected option to the initial state
    setSelectedQuery(initialOptions);
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
                    option.type === selectedQuery.type
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
          <PreviewOptions selectedQuery={selectedQuery} />
        </div>
      </Modal>
    </>
  );
};
