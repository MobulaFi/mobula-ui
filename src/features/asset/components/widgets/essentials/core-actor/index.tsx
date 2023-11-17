/* eslint-disable import/no-cycle */
import {Flex, Text, useColorMode} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {useContext} from "react";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../../context-manager";
import {FlexBorderBox} from "../../../../style";
import {ActorsBox} from "../../../ui/actors-box";

export const CoreActor = ({...props}) => {
  const {boxBg3, borders, text80} = useColors();
  const {baseAsset} = useContext(BaseAssetContext);
  const {colorMode} = useColorMode();
  const isDarkMode = colorMode === "dark";
  const router = useRouter();

  return (
    <Flex
      {...FlexBorderBox}
      bg={boxBg3}
      border={["none", "none", "none", borders]}
      p={["15px", "15px", "15px", "20px"]}
      borderRadius={["0px", "0px", "0px", "16px"]}
      {...props}
    >
      <Text
        fontSize={["16px", "16px", "16px", "18px"]}
        fontWeight="500"
        color={text80}
        mb={["7.5px", "7.5px", "7.5px", "0px"]}
      >
        Core Actors
      </Text>
      {baseAsset?.investors?.length > 0 ? (
        <>
          {Object.values(baseAsset?.team || {}).length > 0 ? (
            <ActorsBox data={baseAsset?.team} title="Team" />
          ) : null}
          {baseAsset?.investors?.length > 0 ? (
            <ActorsBox
              data={baseAsset?.investors || []}
              title="Top investors"
            />
          ) : null}
          {/* {cexs?.length > 0 ? (
        <ActorsBox data={cexs || []} title="Exchanges" />
      ) : null} */}
        </>
      ) : null}
      {/* ADD DATA FOR EDIT SYSTEM / DO NOT REMOVE!!!
      
      (
        <Flex direction="column" align="center" justify="center" mt="20px">
          <Image
            src={
              isDarkMode ? "/asset/no-actors.png" : "/asset/empty-roi-light.png"
            }
            boxSize={["120px", "120px", "150px"]}
          />
          <TextSmall mt="15px" mb="10px" fontWeight="500">
            No core actors found
          </TextSmall>
          <Button
            mt={["5px", "5px", "10px"]}
            maxW="160px"
            onClick={() => router.push("/list")}
            variant="outlined"
          >
            + Add Data
          </Button>
        </Flex>
      )}
      
      */}
    </Flex>
  );
};
