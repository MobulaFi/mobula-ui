import React, { useState } from "react";
import { LargeFont, SmallFont } from "../../../../../../components/fonts";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { inputStyle } from "../../../styles";

const WEBSITE_MIN_LENGTH = 8;
const WEBSITE_PREFIX = "https://";
const BORDER_STYLE_ERROR = "border border-red dark:border-red";
const BORDER_STYLE_NORMAL =
  "border border-light-border-primary dark:border-dark-border-primary";

const validateWebsite = (website) => website.includes(WEBSITE_PREFIX);

interface InputTemplateProps {
  dispatch: any;
  isWebsite?: boolean;
  title: string;
  name: string;
  action: any;
  placeholder: string;
  icon?: JSX.Element;
  extraCss?: string;
  state?: any;
  isLink?: boolean;
}

export const InputTemplate = ({
  dispatch,
  isWebsite = false,
  title,
  name,
  action,
  icon,
  state,
  placeholder,
  extraCss,
  isLink,
}: InputTemplateProps) => {
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);
  const [borderStyle, setBorderStyle] = useState(BORDER_STYLE_NORMAL);

  const handleChange = (e) => {
    dispatch({
      type: action,
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleWebsiteError = (e) => {
    if (
      e.target.value !== "" &&
      e.target.value.length > WEBSITE_MIN_LENGTH &&
      isWebsite
    ) {
      if (validateWebsite(e.target.value)) {
        setBorderStyle(BORDER_STYLE_NORMAL);
        setErrorMessageVisible(false);
      } else {
        setBorderStyle(BORDER_STYLE_ERROR);
        setErrorMessageVisible(true);
      }
    } else {
      setBorderStyle(BORDER_STYLE_NORMAL);
      setErrorMessageVisible(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col mt-5">
        <div className="flex items-center mb-2.5">
          {icon}
          <LargeFont>{title}</LargeFont>
        </div>
        <input
          className={cn(`${inputStyle} ${borderStyle}`, extraCss)}
          name={name}
          placeholder={placeholder}
          id={name}
          value={!isLink ? state?.[name] : state?.links[name]}
          onChange={(e) => {
            handleWebsiteError(e);
            handleChange(e);
          }}
        />{" "}
      </div>
      {errorMessageVisible ? (
        <SmallFont extraCss="text-[10px] lg:text-[9px] md:text-[8px] text-red dark:text-red mt-[5px]">
          Website should includes https://
        </SmallFont>
      ) : null}
    </div>
  );
};
