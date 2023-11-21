import {Button, Flex} from "@chakra-ui/react";
import {TextLandingMedium} from "../../../../../../UI/Text";
import {useColors} from "../../../../../../common/utils/color-mode";
import {inputStyle} from "../../../styles";

export const SelectorTemplate = ({dispatch, action, title, name, ...props}) => {
  const {boxBg6, text80} = useColors();
  const handleChange = e => {
    dispatch({type: action, payload: e.target.value});
  };
  return (
    <Flex direction="column" mb="20px" {...props}>
      <TextLandingMedium mb="10px">{title}</TextLandingMedium>
      <Button
        {...inputStyle(boxBg6, text80)}
        name={name}
        onChange={e => handleChange(e)}
      >
        {" "}
      </Button>
    </Flex>
  );
};
