import React from "react";
import { BsCheck } from "react-icons/bs";
import { SmallFont } from "../../../../../components/fonts";
import { Input } from "../../../../../components/input";
import { useAnalytics } from "../../../context-manager";
import { ColorInput } from "../color-input";

export const SelectorContent = () => {
  const { selectedOption, setSelectedOption } = useAnalytics();
  const handleChange = (name: string, value: string) => {
    setSelectedOption((prev) => ({ ...prev, [name]: value }));
  };
  console.log("selectedOption", selectedOption);
  const renderContent = () => {
    if (selectedOption.type === "line")
      return (
        <>
          <div className="flex flex-col w-[45%] mr-2.5">
            <SmallFont extraCss="mb-2">Color Up</SmallFont>
            <ColorInput type="up" />
          </div>
          <div className="flex flex-col w-[45%] mr-2.5">
            <SmallFont extraCss="mb-2">Color Down</SmallFont>
            <ColorInput type="down" />
          </div>
        </>
      );
    if (selectedOption.type === "bar" || selectedOption.type === "large-area")
      return (
        <>
          <div className="flex flex-col w-[45%] mr-2.5">
            <SmallFont extraCss="mb-2">Color </SmallFont>
            <ColorInput type="up" />
          </div>
        </>
      );
    return <></>;
  };
  const content = renderContent();

  const percentages = [
    {
      value: "25%",
      selected: selectedOption.width === "25%",
    },
    {
      value: "33.33%",
      selected: selectedOption.width === "33.33%",
    },
    {
      value: "50%",
      selected: selectedOption.width === "50%",
    },
    {
      value: "66.66%",
      selected: selectedOption.width === "66.66%",
    },
    {
      value: "75%",
      selected: selectedOption.width === "75%",
    },
    {
      value: "100%",
      selected: selectedOption.width === "100%",
    },
  ];

  return (
    <div className="flex items-center flex-wrap">
      {/* <button className="h-4 w-4 rounded-full bg-light-bg-hover dark:bg-dark-bg-hover mr-3"></button> */}
      {content}
      <div className="flex flex-col w-[45%] mr-2.5 mb-2.5">
        <SmallFont extraCss="mb-2">Name</SmallFont>
        <Input
          extraCss="w-full border-l-0 rounded-r rounded-l-none"
          placeholder="Chart Title"
          name="name"
          value={selectedOption.name}
          onChange={(e) => handleChange(e.target.name, e.target.value)}
        />
      </div>
      <div className="flex flex-col w-[45%] mr-2.5 mb-2.5">
        <SmallFont extraCss="mb-2">Width</SmallFont>
        <div className="flex items-center justify-between w-full flex-wrap">
          {percentages.map((percent) => (
            <button
              className="flex items-center"
              onClick={() => handleChange("width", percent.value)}
            >
              <div className="w-4 h-4 rounded bg-light-bg-hover dark:bg-dark-bg-hover mr-2 flex items-center justify-center">
                {percent.selected && (
                  <BsCheck className="text-light-font-100 dark:text-dark-font-100 text-base" />
                )}
              </div>
              <SmallFont>{percent.value}</SmallFont>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
