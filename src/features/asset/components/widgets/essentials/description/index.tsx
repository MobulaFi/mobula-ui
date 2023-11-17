import {Flex} from "@chakra-ui/react";
import {useContext} from "react";
import {TextLandingMedium, TextSmall} from "../../../../../../../UI/Text";
import {HoverLink} from "../../../../../../../common/ui/hover";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../../context-manager";

export const Description = () => {
  const {baseAsset} = useContext(BaseAssetContext);
  const {text60} = useColors();
  return (
    <Flex
      w={["95%", "95%", "100%", "100%"]}
      mx="auto"
      direction="column"
      mt={["30px", "30px", "50px"]}
    >
      <TextLandingMedium mb="15px">
        About {baseAsset?.name} {baseAsset?.symbol}
      </TextLandingMedium>
      {baseAsset?.description ? (
        <TextSmall color={text60}>{baseAsset?.description}</TextSmall>
      ) : (
        <Flex
          align="center"
          fontSize={["12px", "12px", "13px", "14px"]}
          fontWeight="400"
          color={text60}
        >
          No token description provided. Provide one <HoverLink>now</HoverLink>
          to improve Mobula!
        </Flex>
      )}
    </Flex>
  );
};
