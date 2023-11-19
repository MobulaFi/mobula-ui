import { Avatar, AvatarGroup, Flex, Img } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { TextSmall } from "../../../../../components/fonts";
import { useColors } from "../../../../../lib/chakra/colorMode";
import { boxStyle } from "../../../../user/portfolio/style";
import { ActorsPopup } from "../popup-actors";

export const ActorsBox = ({ data, title }) => {
  const { borders, text40, bordersActive, hover, boxBg6 } = useColors();
  const [showActors, setShowActors] = useState(false);
  const router = useRouter();
  return (
    <>
      <Flex
        {...boxStyle}
        direction="row"
        border={borders}
        bg={boxBg6}
        mt={["7.5px", "7.5px", "10px", "15px"]}
        align="center"
        w="100%"
        _hover={{
          bg: hover,
          cursor: "pointer",
          border: bordersActive,
        }}
        transition="all 250ms ease-in-out"
        onClick={() => {
          if (data?.[0].name === "Click here to add some") router.push("/list");
          else setShowActors(true);
        }}
      >
        <Img
          src={data[0]?.image}
          boxSize={["28px", "28px", "30px", "34px"]}
          borderRadius="full"
          mr="10px"
        />
        <Flex direction="column" w="100%">
          <Flex align="center" justify="space-between">
            <Flex direction="column" mb="4px">
              <TextSmall
                color={text40}
                maxW="120px"
                textOverlfow="ellipsis"
                whiteSpace="nowrap"
              >
                {title}
              </TextSmall>
              <TextSmall>{data[0]?.name}</TextSmall>
            </Flex>
            {data.length > 1 ? (
              <Flex align="flex-end" direction="column" ml="15px">
                <AvatarGroup size="xs" fontSize="xs" max={2}>
                  {data
                    .filter((_, i) => i !== 0)
                    .map((item) => (
                      <Avatar
                        bg={hover}
                        border={borders}
                        fontSize="2xs"
                        name={item.name}
                        src={item.image}
                      />
                    ))}
                </AvatarGroup>
              </Flex>
            ) : null}
          </Flex>
        </Flex>
      </Flex>
      <ActorsPopup
        data={data}
        visible={showActors}
        setVisible={setShowActors}
      />
    </>
  );
};
