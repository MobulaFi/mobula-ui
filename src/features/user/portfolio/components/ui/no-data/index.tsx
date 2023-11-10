import {Flex} from "@chakra-ui/react";
import {TextLandingSmall} from "../../../../../../UI/Text";
import {NextChakraLink} from "../../../../../../common/components/links";
import {useColors} from "../../../../../../common/utils/color-mode";

export const NoData = ({
  text,
  url,
  urlText,
  ...props
}: {
  text: string;
  url?: string;
  urlText?: string;
  [key: string]: any;
}) => {
  const {text80, text40} = useColors();
  return (
    <Flex maxW="80%" direction="column" m="auto" mt="40px" {...props}>
      <TextLandingSmall mb="5px" textAlign="center" color={text40}>
        {" "}
        {text}
      </TextLandingSmall>
      {url ? (
        <NextChakraLink fontWeight="500" href={url} color={text80}>
          {urlText}
        </NextChakraLink>
      ) : null}
    </Flex>
  );
};
