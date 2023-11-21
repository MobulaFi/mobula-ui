import {Flex, Input} from "@chakra-ui/react";
import {useState} from "react";
import {TextExtraSmall, TextLandingMedium} from "../../../../../../UI/Text";
import {useColors} from "../../../../../../common/utils/color-mode";
import {inputStyle} from "../../../styles";

const WEBSITE_MIN_LENGTH = 8;
const WEBSITE_PREFIX = "https://";
const BORDER_STYLE_ERROR = "1px solid red";
const BORDER_STYLE_NORMAL = "1px solid var(--chakra-colors-borders-3)";

const validateWebsite = website => website.includes(WEBSITE_PREFIX);

interface InputTemplateProps {
  dispatch: any;
  isWebsite?: boolean;
  title: string;
  name: string;
  action: any;
  placeholder: string;
  icon?: JSX.Element;
  [x: string]: any;
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
  ...props
}: InputTemplateProps) => {
  const {boxBg3, text80} = useColors();
  const [errorMessageVisible, setErrorMessageVisible] = useState(false);
  const [borderStyle, setBorderStyle] = useState(BORDER_STYLE_NORMAL);

  const handleChange = e => {
    dispatch({
      type: action,
      payload: {name: e.target.name, value: e.target.value},
    });
  };

  const handleWebsiteError = e => {
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
    <Flex direction="column">
      <Flex direction="column" mt="20px">
        <Flex align="center" mb="10px">
          {icon}
          <TextLandingMedium>{title}</TextLandingMedium>
        </Flex>
        <Input
          {...inputStyle(boxBg3, text80)}
          name={name}
          placeholder={placeholder}
          id={name}
          value={state?.[name]}
          border={borderStyle}
          onChange={e => {
            handleWebsiteError(e);
            handleChange(e);
          }}
          {...props}
        />{" "}
      </Flex>
      {errorMessageVisible ? (
        <TextExtraSmall color="red" mt="5px">
          Website should includes https://
        </TextExtraSmall>
      ) : null}
    </Flex>
  );
};
