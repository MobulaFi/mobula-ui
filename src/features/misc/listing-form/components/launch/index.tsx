import {ChevronDownIcon} from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import {blockchainsContent} from "mobula-lite/lib/chains/constants";
import {useEffect, useRef, useState} from "react";
import {
  TextExtraSmall,
  TextLandingMedium,
  TextLandingSmall,
  TextSmall,
} from "../../../../../UI/Text";
import {InfoPopup} from "../../../../../common/components/popup-hover";
import {useColors} from "../../../../../common/utils/color-mode";
import {ACTIONS} from "../../reducer";
import {inputStyle} from "../../styles";
import {getDateError} from "../../utils";

export const Launch = ({dispatch, state}) => {
  const {boxBg6, borders, boxBg3, text60, bordersActive, hover, text80} =
    useColors();
  const dateRef = useRef<HTMLInputElement>(null);
  const hoursRef = useRef<HTMLInputElement>(null);
  const [date, setDate] = useState({
    date: "",
    time: "",
  });
  const selectors = [
    {
      name: "exchange",
      select: blockchainsContent[state.contracts[0].blockchain]?.routers,
      title: "Exchange",
      button_name: "Add Exchange",
    },
    {
      name: "vsToken",
      select: blockchainsContent[state.contracts[0]?.blockchain]?.tokens,
      title: "Initial Pair",
      button_name: "Add Pair",
    },
  ];

  const addButtonStyle = {
    w: "120px",
    h: "35px",
    borderRadius: "8px",
    color: text80,
    fontWeight: "400",
    mt: "10px",
    fontSize: ["12px", "12px", "14px", "16px"],
  };

  const ISOtoTimestamp = () => {
    const fullDate = `${date.date ? date.date : "27/06/2023"} ${
      date.time ? date.time : "00:00"
    }`;
    const parts = fullDate.split("/");
    const jsDateStr = `${parts[1]}/${parts[0]}/${parts[2]}`;
    const newDate = new Date(jsDateStr);
    const timestamp = newDate.getTime();
    dispatch({
      type: ACTIONS.SET_LAUNCH,
      payload: {name: "date", value: timestamp},
    });
  };

  useEffect(() => {
    ISOtoTimestamp();
  }, [date]);

  const getNameFromSelector = (
    name: string,
    selector: {[key: string]: any},
  ) => {
    if (name === "vsToken")
      return `${state.symbol}/${state.tokenomics.launch[selector.name]}`;
    return state.tokenomics.launch[selector.name];
  };

  const getHoursError = () => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (hoursRef.current === null || hoursRef.current.value === "")
      return false;
    if (!regex.test(hoursRef.current.value)) return true;
    return false;
  };

  return (
    <>
      <TextLandingMedium mt="20px">Launch Details</TextLandingMedium>
      <TextLandingSmall mt="20px" mb="10px">
        Public launch date & hour
      </TextLandingSmall>
      <Flex align="center">
        <Input
          {...inputStyle(boxBg3, text80)}
          ref={dateRef}
          border={getDateError(dateRef) ? "1px solid red" : borders}
          w="135px"
          mr="10px"
          placeholder="DD/MM/YYYY"
          onChange={e => setDate(prev => ({...prev, date: e.target.value}))}
        />
        <Input
          {...inputStyle(boxBg3, text80)}
          border={getHoursError() ? "1px solid red" : borders}
          w="100px"
          mr="10px"
          ref={hoursRef}
          placeholder="HH:MM"
          onChange={e => setDate(prev => ({...prev, time: e.target.value}))}
        />
        <TextSmall color={text80}>UTC</TextSmall>
      </Flex>
      {getDateError(dateRef) ? (
        <TextExtraSmall mt="3px" color="red">
          Correct format: DD/MM/YYYY
        </TextExtraSmall>
      ) : null}
      {getHoursError() ? (
        <TextExtraSmall mt="3px" color="red">
          Correct format: HH:MM
        </TextExtraSmall>
      ) : null}
      <TextLandingSmall mt="20px" mb="10px">
        Floating Time
      </TextLandingSmall>
      <Flex align="center">
        <Input
          {...inputStyle(boxBg3, text80)}
          type="number"
          w="100px"
          placeholder="2 (Default)"
          onChange={e =>
            dispatch({
              type: ACTIONS.SET_LAUNCH,
              payload: {
                name: "lag",
                value: (Number(e.target.value) * 3600).toString(),
              },
            })
          }
        />
        <TextSmall ml="10px" color={text80}>
          Hours
        </TextSmall>
        <InfoPopup
          mb="4px"
          info="What's the range from launch date (hours) you expect for your launch"
        />
      </Flex>
      {selectors?.map(selector => (
        <>
          <TextLandingSmall mt="20px">{selector.title}</TextLandingSmall>
          <Menu matchWidth>
            <MenuButton
              {...addButtonStyle}
              bg={boxBg6}
              w="fit-content"
              px="12px"
              isDisabled={!state.contracts[0].address}
              fontSize={["12px", "12px", "14px", "16px"]}
              border={borders}
              _hover={{bg: hover, border: bordersActive}}
              as={Button}
            >
              {state.tokenomics.launch[selector.name]
                ? getNameFromSelector(selector.name, selector)
                : `Select a ${selector.button_name}`}
              <ChevronDownIcon ml="10px" />
            </MenuButton>
            <MenuList
              fontSize={["12px", "12px", "14px", "16px"]}
              color={text80}
              fontWeight="400"
              bg={boxBg3}
              border={borders}
              boxShadow="none"
              borderRadius="8px"
              zIndex={2}
            >
              {selector?.select?.map(item => (
                <MenuItem
                  bg={boxBg3}
                  _hover={{bg: hover}}
                  onClick={() => {
                    dispatch({
                      type: ACTIONS.SET_LAUNCH,
                      payload: {
                        name: selector.name,
                        value: item.name,
                      },
                    });
                  }}
                >
                  {selector.title === "Exchange" ? item.name : item.symbol}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          {state.contracts[0].address ? null : (
            <TextExtraSmall mt="5px" color={text60}>
              Please enter an contract address to unlock this{" "}
            </TextExtraSmall>
          )}
        </>
      ))}
    </>
  );
};
