import {Flex} from "@chakra-ui/react";
import {TextSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";

export const Lines = ({
  title,
  value,
  odd,
}: {
  title: string;
  value: number | string;
  odd?: boolean;
}) => {
  const {text80, text60, borders} = useColors();
  return (
    <Flex
      align="center"
      justify="space-between"
      w={["100%", "100%", "50%"]}
      borderRight={odd ? borders : "none"}
      py="10px"
      borderBottom={borders}
      px="15px"
    >
      <TextSmall color={text80}>{title}</TextSmall>
      <TextSmall color={text60}>{value}</TextSmall>
    </Flex>
  );
};
