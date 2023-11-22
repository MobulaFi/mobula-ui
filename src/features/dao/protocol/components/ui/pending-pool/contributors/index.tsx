import {Flex, Icon, Img, Text} from "@chakra-ui/react";
import {SiConvertio} from "react-icons/si";
import {TextSmall} from "../../../../../../../UI/Text";
import {InfoPopup} from "../../../../../../../common/components/popup-hover";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BoxContainer} from "../../../../../common/components/box-container";

export const Contributors = () => {
  const {borders} = useColors();

  const contributors = [
    {
      name: "John Doe",
      amount: "1000",
      symbol: "USDC",
      profile_pic: "/mobula/coinMobula.png",
      logo: "/logo/bnb.png",
    },
    {
      name: "John Doe",
      amount: "1000",
      symbol: "USDC",
      profile_pic: "/mobula/coinMobula.png",
      logo: "/logo/cardano.png",
    },
    {
      name: "John Doe",
      amount: "1000",
      symbol: "USDC",
      profile_pic: "/mobula/coinMobula.png",
      logo: "/logo/bitcoin.png",
    },
    {
      name: "John Doe",
      amount: "1000",
      symbol: "USDC",
      profile_pic: "/mobula/coinMobula.png",
      logo: "/logo/ethereum.png",
    },
  ];

  return (
    <BoxContainer
      mb="20px"
      position="relative"
      transition="all 300ms ease-in-out"
      p={["10px", "10px", "15px", "15px 20px"]}
      borderRadius={["0px", "16px"]}
    >
      <Flex
        align="center"
        pb={["10px", "10px", "15px", "20px"]}
        borderBottom={borders}
      >
        <Icon as={SiConvertio} color="blue" />
        <Text fontSize={["14px", "14px", "16px", "18px"]} ml="10px">
          Contributors
        </Text>
        <InfoPopup mb="3px" />
      </Flex>
      {contributors.map(contributor => (
        <Flex
          align="center"
          justify="space-between"
          py="15px"
          borderBottom={borders}
        >
          <Flex align="center">
            <Img
              src={contributor.profile_pic || "/icon/unknown.png"}
              boxSize="20px"
              mr="10px"
              borderRadius="full"
            />
            <TextSmall>{contributor.name}</TextSmall>
          </Flex>
          <Flex align="center">
            <TextSmall>{`${contributor.amount} ${contributor.symbol}`}</TextSmall>
            <Img
              src={contributor.logo || "/icon/unknown.png"}
              boxSize="20px"
              ml="10px"
              borderRadius="full"
            />
          </Flex>
        </Flex>
      ))}
    </BoxContainer>
  );
};
