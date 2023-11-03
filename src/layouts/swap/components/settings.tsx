import {CheckIcon} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {X} from "react-feather";
import {useThemeValue} from "../../../../../utils/chakra";
import {useColors} from "../../../utils/color-mode";
import {Settings as SettingsType} from "../model";

const SettingBox = ({
  title,
  value,
  setValue,
  min,
  max,
  addOn,
  text,
  width = "90%",
  isSlippage,
  setVisible,
}: {
  title: string;
  value: number;
  setValue: Dispatch<SetStateAction<SettingsType>>;
  min: number;
  max: number;
  addOn?: string;
  text?: string;
  width?: string;
  isSlippage?: boolean;
  setVisible?: any;
}) => {
  const {text3, activeBorder} = useThemeValue();
  return (
    <>
      {isSlippage ? (
        <Flex align="center" justify="space-between">
          <Text fontSize="14px" fontWeight="500">
            {title}
          </Text>
          <Icon
            ml="auto"
            as={X}
            onClick={() => setVisible(false)}
            cursor="pointer"
          />
        </Flex>
      ) : (
        <Text fontSize="14px" fontWeight="500" mt={3}>
          {title}
        </Text>
      )}

      <Flex mt={3} align="center" justify="space-between" width={width}>
        <InputGroup borderRadius="4px" display="flex" alignItems="center">
          <Input
            width="90%"
            borderRadius="4px"
            height="30px"
            border={`1px solid ${activeBorder}`}
            value={value}
            type="number"
            onChange={e =>
              setValue(prev => ({
                ...prev,
                slippage: Math.min(
                  Math.max(parseFloat(e.target.value), min),
                  max,
                ),
              }))
            }
            padding="5px"
            fontSize="0.8rem"
          />
          {addOn ? (
            <InputRightAddon borderRadius="4px" position="absolute" right="14%">
              {addOn}{" "}
            </InputRightAddon>
          ) : null}
        </InputGroup>
        {text ? (
          <Text color={text3} fontSize="0.8rem">
            {text}
          </Text>
        ) : null}
      </Flex>
    </>
  );
};

export const ProInputLines = ({
  children,
  title,
  setSettings,
  settings,
  isSeconds,
  isMobile,
  ...props
}: {
  children: string;
  title: string;
  setSettings: any;
  settings?: any;
  isSeconds?: boolean;
  isMobile?: boolean;
  [key: string]: any;
}) => {
  const {text80, borders, boxBg3} = useColors();
  return (
    <Flex my="10px" align="center" justify="space-between" w="100%">
      <Text color={text80} fontSize="14px" fontWeight="400">
        {children}
      </Text>
      <InputGroup
        mr={isMobile ? "10px" : "0px"}
        border={borders}
        maxWidth="80px"
        h={["25px", "25px", "30px", "30px"]}
        borderRadius="4px"
        bg={boxBg3}
        minWidth="50px"
        {...props}
      >
        <Input
          pr="22px"
          type="number"
          pl="5px"
          color="text.60"
          pt="0px"
          onChange={e => {
            setSettings(prev => ({...prev, [e.target.name]: e.target.value}));
          }}
          value={settings[title]}
          name={title}
        />
        <InputRightElement>
          <Text mr="5px" mt="0px" color="text_color.blue_grey" fontSize="16px">
            {isSeconds ? "sec" : "%"}
          </Text>
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

export const ProCheckBoxLines = ({
  setSettings,
  settings,
  title,
  children,
}: {
  setSettings: any;
  settings: any;
  title: string;
  children: string;
}) => (
  <Flex my="10px " align="center" justify="space-between" w="100%">
    <Text color="text_color.blue_grey" fontSize="14px" fontWeight="400">
      {children}
    </Text>
    <Button
      _focus={{boxShadow: "none"}}
      onClick={() => {
        setSettings(prev => ({...prev, [title]: !settings[title]}));
      }}
    >
      <Flex
        align="center"
        justify="center"
        p="1px"
        bg="box_bg.1"
        boxSize="15px"
        borderRadius="5px"
        border="1px solid var(--chakra-colors-blue)"
      >
        <CheckIcon
          fontSize="11px"
          color="text.80"
          opacity={settings[title] ? 1 : 0}
          transition="all 200ms ease-in-out"
        />
      </Flex>
    </Button>
  </Flex>
);

export const Settings = ({
  setVisible,
  visible,
  settings,
  setSettings,
  deadline,
  setDeadline,
}) => {
  const {borders, boxBg3, text80, text10} = useColors();
  const [isPro, setIsPro] = useState<boolean | null>(null);
  useEffect(() => {
    if (localStorage.getItem("isPro") === "true") {
      setIsPro(true);
    } else {
      setIsPro(false);
    }
  }, []);

  return (
    <Modal
      motionPreset="none"
      isOpen={visible}
      onClose={() => setVisible(false)}
    >
      <ModalOverlay />
      <ModalContent
        boxShadow="none"
        borderRadius="16px"
        maxWidth="550px"
        w={["90vw", "100%"]}
        border={borders}
        bg={boxBg3}
        p="15px 20px"
        position="relative"
      >
        <ModalBody p="0px">
          {isPro ? (
            <Flex>
              <Flex align="center" mb="15px" justify="space-between">
                <Flex align="center">
                  <Text
                    fontSize="19px"
                    color={text80}
                    fontWeight="400"
                    mr="10px"
                  >
                    Settings
                  </Text>
                  {/* <Text fontSize="14px" fontWeight="400" color="text.30">
                  Reset by default
                </Text> */}
                </Flex>
                <Button
                  _focus={{boxShadow: "none"}}
                  onClick={() => setVisible(false)}
                >
                  <Text fontSize="14px" fontWeight="400" color="red">
                    Go Back
                  </Text>
                </Button>
              </Flex>
              <ProInputLines
                settings={settings}
                title="slippage"
                setSettings={setSettings}
              >
                Slippage
              </ProInputLines>
              <ProCheckBoxLines
                settings={settings}
                title="autoTax"
                setSettings={setSettings}
              >
                Auto-Tax
              </ProCheckBoxLines>
              <ProInputLines
                settings={settings}
                title="maxAutoTax"
                setSettings={setSettings}
              >
                Max Auto-Tax
              </ProInputLines>{" "}
              <Text
                mb="25px"
                mt="10px"
                fontSize="19px"
                color={text80}
                fontWeight="400"
                mr="10px"
              >
                Advanced Settings
              </Text>
              <Flex
                position="absolute"
                h="1px"
                top="255px"
                left="0px"
                w="100%"
                bg={text10}
              />
              <ProInputLines
                settings={settings}
                title="routeRefresh"
                setSettings={setSettings}
                isSeconds
              >
                Route Refresh Time
              </ProInputLines>{" "}
            </Flex>
          ) : (
            <Box w="100%">
              <SettingBox
                title="Slippage tolerence"
                min={0}
                max={50}
                setVisible={setVisible}
                isSlippage
                value={settings.slippage}
                setValue={setSettings}
                addOn="%"
              />
              <SettingBox
                title="Transaction deadline"
                min={0}
                max={1000}
                value={deadline}
                setValue={setDeadline}
                text="minutes"
                width="70%"
              />
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
