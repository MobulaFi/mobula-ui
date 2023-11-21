import {CheckIcon} from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import {useContext} from "react";
import {SwapContext} from "../../..";
import {ColorsContext} from "../../../../../../../pages/iframe/swap";
import {useColors} from "../../../../../utils/color-mode";
import {InputLines} from "./components/input-line";

export const Settings = ({setVisible, visible}) => {
  const {settings, setSettings} = useContext(SwapContext);
  const {bgMain, fontSecondary, fontMain, borderColor} =
    useContext(ColorsContext);
  const {boxBg1, borders, text60, boxBg3, text80} = useColors();
  return (
    <Modal
      motionPreset="none"
      isOpen={visible}
      onClose={() => setVisible(false)}
    >
      <ModalOverlay />
      <ModalContent
        bg={bgMain || boxBg3}
        w={["90vw", "450px"]}
        borderRadius="16px"
        border={borderColor ? `1px solid ${borderColor}` : borders}
        boxShadow="none"
        p="15px 20px 20px 20px"
      >
        <ModalHeader p="0px" mb="10px">
          <TextLandingMedium color={fontMain || text80} fontWeight="400">
            Settings
          </TextLandingMedium>
        </ModalHeader>
        <ModalCloseButton color={text80} />
        <ModalBody p="0px">
          <Flex position="relative" direction="column">
            <InputLines title="slippage">Slippage</InputLines>
            <Flex my="10px " align="center" justify="space-between" w="100%">
              <Text
                color={fontSecondary || text60}
                fontSize="14px"
                fontWeight="400"
              >
                Auto-Tax
              </Text>
              <Button
                _focus={{boxShadow: "none"}}
                onClick={() => {
                  setSettings(prev => ({
                    ...prev,
                    autoTax: !settings.autoTax,
                  }));
                }}
              >
                <Flex
                  align="center"
                  justify="center"
                  p="1px"
                  bg={bgMain || boxBg1}
                  boxSize="15px"
                  borderRadius="5px"
                  border={borderColor ? `1px solid ${borderColor}` : borders}
                >
                  <CheckIcon
                    fontSize="9px"
                    color={fontMain || text80}
                    opacity={settings.autoTax ? 1 : 0}
                    transition="all 200ms ease-in-out"
                  />
                </Flex>
              </Button>
            </Flex>
            <InputLines title="maxAutoTax">Max Auto-Tax</InputLines>{" "}
            <TextLandingMedium
              fontWeight="400"
              mt="10px"
              mb="7.5px"
              borderTop={borders}
              pt="10px"
              color={fontMain || text80}
            >
              Advanced Settings
            </TextLandingMedium>
            <InputLines title="routeRefresh" isSeconds>
              Route Refresh Time
            </InputLines>{" "}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
