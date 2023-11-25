import React from "react";
import { LargeFont } from "../../../../../../components/fonts";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { inputStyle } from "../../../styles";

export const SelectorTemplate = ({
  dispatch,
  action,
  extraCss,
  title,
  name,
  ...props
}) => {
  const handleChange = (e) => {
    dispatch({ type: action, payload: e.target.value });
  };
  return (
    <div className={cn("flex flex-col mb-5", extraCss)} {...props}>
      <LargeFont mb="10px">{title}</LargeFont>
      <button
        className={inputStyle}
        name={name}
        onChange={(e) => handleChange(e)}
      >
        {" "}
      </button>
    </div>
  );
};
