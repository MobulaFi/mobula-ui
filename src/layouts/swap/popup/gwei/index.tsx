import {Icon} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import {useContext} from "react";
import {FaGasPump} from "react-icons/fa";
import {useFeeData, useNetwork} from "wagmi";
import {SwapContext} from "../../../../..";
import {ColorsContext} from "../../../../../../../../../pages/iframe/swap";
import {TextLandingMedium, TextSmall} from "../../../../../../../../UI/Text";
import {useColors} from "../../../../../../../utils/color-mode";
import {floors} from "../../../../../constants";
import {cleanNumber} from "../../../../../utils";

export const GweiSettings = ({setShowGweiSettings, showGweiSettings}) => {
  const {settings, setSettings, chainNeeded} = useContext(SwapContext);
  const {chain} = useNetwork();
  const {data: gasData} = useFeeData({chainId: chainNeeded || chain?.id || 1});
  const {bgMain, fontSecondary, fontMain, borderColor} =
    useContext(ColorsContext);
  const {text40, borders, text80, boxBg3, text60} = useColors();

  return (
    <Modal
      motionPreset="none"
      isOpen={showGweiSettings}
      onClose={() => setShowGweiSettings(false)}
    >
      <ModalOverlay />
      <ModalContent
        bg={bgMain || boxBg3}
        w={["90vw", "350px"]}
        borderRadius="16px"
        border={borderColor ? `1px solid ${borderColor}` : borders}
        boxShadow="none"
        p="15px 20px 20px 20px"
      >
        <ModalHeader p="0px" mb="20px">
          <TextLandingMedium color={fontMain || text80} fontWeight="400">
            Gas Price
          </TextLandingMedium>
        </ModalHeader>
        <ModalCloseButton color={fontMain || text80} />
        <ModalBody p="0px">
          <Flex direction="column">
            <Flex mb="20px" align="center">
              <Icon
                as={FaGasPump}
                color={fontSecondary || text40}
                fontSize="18px"
              />
              <TextSmall ml="10px" color={fontMain || text80}>
                Current:{" "}
                <Box
                  transition="all 300ms ease-in-out"
                  as="span"
                  color={
                    settings.gasPriceRatio > 1.5 ? "red" : fontMain || text80
                  }
                  fontWeight="500"
                >
                  {`${(
                    cleanNumber(gasData?.gasPrice, 9) * settings.gasPriceRatio
                  ).toFixed(2)} Gwei`}
                </Box>
              </TextSmall>
            </Flex>
            {floors.map(floor => (
              <Flex
                mx="auto"
                mb="15px"
                w="100%"
                align="center"
                justify="space-between"
                key={floor.ratio}
              >
                <Button
                  onClick={() =>
                    setSettings({
                      ...settings,
                      gasPriceRatio: floor.ratio,
                    })
                  }
                  _focus={{boxShadow: "none"}}
                >
                  <Flex align="center">
                    <Box
                      mr="10px"
                      borderRadius="full"
                      transition="all 200ms ease-in-out"
                      border="1px solid rgba(127, 143, 169, 1)"
                      boxSize="14px"
                      minW="14px"
                      bg={
                        floor.ratio === settings.gasPriceRatio
                          ? fontMain || text80
                          : "transparent"
                      }
                    />
                    <TextSmall color={fontMain || text80}>
                      {floor.title}
                    </TextSmall>
                  </Flex>
                </Button>

                <TextSmall color={fontSecondary || text60}>
                  {`${(cleanNumber(gasData?.gasPrice, 9) * floor.ratio).toFixed(
                    2,
                  )} Gwei`}
                </TextSmall>
              </Flex>
            ))}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
