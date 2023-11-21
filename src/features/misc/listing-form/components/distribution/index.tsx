import {CloseIcon} from "@chakra-ui/icons";
import {Button, Flex, Input, InputGroup} from "@chakra-ui/react";
import {useRef} from "react";
import {isAddress} from "viem";
import {
  TextExtraSmall,
  TextLandingMedium,
  TextLandingSmall,
} from "../../../../../UI/Text";
import {useColors} from "../../../../../common/utils/color-mode";
import {ACTIONS} from "../../reducer";
import {inputStyle} from "../../styles";

export const Distribution = ({dispatch, state}) => {
  const {boxBg6, borders, bordersActive, boxBg3, hover, text80} = useColors();
  const amountRef = useRef<HTMLInputElement>(null);
  const deleteButtonStyle = {
    w: "40px",
    ml: "10px",
    bg: boxBg6,
    h: "35px",
    borderRadius: "8px",
    color: text80,
    fontWeight: "400",
    fontSize: ["12px", "12px", "14px", "16px"],
    mt: "10px",
    _hover: {bg: hover, border: bordersActive},
    border: borders,
  };
  const addButtonStyle = {
    w: "120px",
    h: "35px",
    borderRadius: "8px",
    color: text80,
    fontWeight: "400",
    mt: "10px",
    fontSize: ["12px", "12px", "14px", "16px"],
  };

  const pushAddress = async (address: string, i: number, j: number) => {
    const newAddressObject = {
      address,
    };
    if (!state.tokenomics.distribution[i].addresses[0].address)
      dispatch({
        type: ACTIONS.REMOVE_DISTRIBUTION_ADDRESS,
        payload: {j, i},
      });
    dispatch({
      type: ACTIONS.ADD_DISTRIBUTION_ADDRESS,
      payload: {address: newAddressObject, i, j},
    });
  };
  return (
    <>
      <TextLandingMedium mt="40px">Token distribution</TextLandingMedium>

      {state.tokenomics.distribution.map((d, i) => (
        <>
          <Flex direction="column" mt="20px">
            <Button
              w="fit-content"
              ml="auto"
              onClick={() =>
                dispatch({
                  type: ACTIONS.REMOVE_ELEMENT_TOKENOMICS,
                  payload: {i, object: "distribution"},
                })
              }
            >
              <CloseIcon fontSize="12px" color={text80} />
            </Button>
            <TextLandingSmall mb="10px">Name</TextLandingSmall>
            <Input
              {...inputStyle(boxBg3, text80)}
              mb="20px"
              minH="35px"
              name="name"
              placeholder="Type a name "
              border={borders}
              onChange={e =>
                dispatch({
                  type: ACTIONS.SET_DISTRIBUTION,
                  payload: {name: e.target.name, value: e.target.value, i},
                })
              }
            />{" "}
            <TextLandingSmall mb="10px">Amount (%)</TextLandingSmall>
            <Input
              {...inputStyle(boxBg3, text80)}
              name="percentage"
              minH="35px"
              border={
                parseFloat(amountRef?.current?.value) > 100 || 0
                  ? "1px solid var(--chakra-colors-red)"
                  : borders
              }
              w="100px"
              placeholder="12"
              type="number"
              ref={amountRef}
              onChange={e =>
                dispatch({
                  type: ACTIONS.SET_DISTRIBUTION,
                  payload: {
                    name: e.target.name,
                    value: parseFloat(e.target.value),
                    i,
                  },
                })
              }
            />
            {parseFloat(amountRef?.current?.value) > 100 || 0 ? (
              <TextExtraSmall color="red" mt="3px">
                The amount should be less than 100%
              </TextExtraSmall>
            ) : null}
            <TextLandingSmall mt="20px">Address</TextLandingSmall>
            {state.tokenomics.distribution[i].addresses?.map((a, j) => (
              <Flex mt="10px">
                <InputGroup
                  {...inputStyle(boxBg3, text80)}
                  border={borders}
                  h="35px"
                  minH="35px"
                  maxH="35px"
                >
                  {/* <InputLeftElement h="100%" ml="10px">
                    <Image
                      boxSize="20px"
                      src={
                        blockchainsContent[a.blockchain]?.logo ||
                        "/icon/unknown.png"
                      }
                    />
                  </InputLeftElement> */}
                  <Input
                    w="100%"
                    pr="10px"
                    h="100%"
                    overflow="scroll"
                    textOverflow="ellipsis"
                    placeholder="0x77A8...459135"
                    color={text80}
                    onChange={e => {
                      if (
                        isAddress(e.target.value) &&
                        a.address !== e.target.value
                      )
                        pushAddress(e.target.value, i, j);
                    }}
                  />
                </InputGroup>
                <Button
                  {...deleteButtonStyle}
                  mt="0px"
                  onClick={() => {
                    dispatch({
                      type: ACTIONS.REMOVE_DISTRIBUTION_ADDRESS,
                      payload: {
                        i,
                        k: j,
                      },
                    });
                  }}
                >
                  <CloseIcon fontSize="12px" color={text80} />
                </Button>
              </Flex>
            ))}
          </Flex>
          <Button
            {...addButtonStyle}
            w="220px"
            bg={boxBg6}
            border={borders}
            _hover={{bg: hover, border: bordersActive}}
            onClick={() =>
              dispatch({
                type: ACTIONS.ADD_DISTRIBUTION_INPUT_ADDRESS,
                payload: {i},
              })
            }
          >
            + Add recipient address
          </Button>
        </>
      ))}
      <Button
        {...addButtonStyle}
        mt="20px"
        onClick={() => dispatch({type: ACTIONS.ADD_DISTRIBUTION})}
        w="fit-content"
        px="12px"
        bg={boxBg6}
        border={borders}
        _hover={{bg: hover, border: bordersActive}}
      >
        + Add distribution recipient
      </Button>
    </>
  );
};
