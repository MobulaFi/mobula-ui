import {CloseIcon} from "@chakra-ui/icons";
import {Button, Flex, Input, Textarea} from "@chakra-ui/react";
import {useRef} from "react";
import {TextExtraSmall, TextLandingSmall} from "../../../../../UI/Text";
import {useColors} from "../../../../../common/utils/color-mode";
import {ACTIONS} from "../../reducer";
import {inputStyle} from "../../styles";

export const FeeBreakdown = ({state, dispatch, side}) => {
  const feeRef = useRef<HTMLInputElement>(null);
  const {borders, boxBg3, text80} = useColors();

  const getInfoFromIndex = (index: number) => {
    switch (index) {
      case 0:
        return {
          placeholder: "Liquidity",
          title: "Type of fees",
          type: "text",
        };
      case 1:
        return {
          placeholder: "0.5",
          title: "Fees (%)",
          type: "number",
          width: "100px",
        };
      case 2:
        return {
          placeholder: "Details about the fee",
          title: "Details",
          type: "text",
        };
      default:
        return {
          placeholder: "",
          title: "",
          type: "",
        };
    }
  };

  const handleChange = (e: any, i: number, value: string | number) => {
    dispatch({
      type: ACTIONS.SET_ELEMENT_TOKENOMICS,
      payload: {
        object: "fees",
        name: e.target.name,
        value,
        i,
      },
    });
    if (state.tokenomics.fees[i + 1]?.side === "sell")
      dispatch({
        type: ACTIONS.SET_ELEMENT_TOKENOMICS,
        payload: {
          object: "fees",
          name: e.target.name,
          value,
          i: i + 1,
        },
      });
  };

  function getBorderValue(j: number) {
    if (feeRef.current === null) return false;
    if (j === 1 && parseFloat(feeRef.current.value) > 100) return true;
    return false;
  }

  return (
    <>
      {state.tokenomics.fees.map(
        (d, i) =>
          d.side === side && (
            <Flex direction="column" mt="20px">
              <Button
                mb="-20px"
                ml="auto"
                color={text80}
                onClick={() => {
                  dispatch({
                    type: ACTIONS.REMOVE_ELEMENT_TOKENOMICS,
                    payload: {object: "fees", i},
                  });
                  dispatch({
                    type: ACTIONS.REMOVE_ELEMENT_TOKENOMICS,
                    payload: {object: "fees", i},
                  });
                }}
              >
                <CloseIcon fontSize="12px" />
              </Button>
              {Object.keys(d).map((entry, j) => {
                const {placeholder, title, width, type} = getInfoFromIndex(j);
                return (
                  <>
                    <Flex justify="space-between">
                      <TextLandingSmall mb="10px">{title}</TextLandingSmall>
                    </Flex>
                    {j === 2 ? (
                      <Textarea
                        w={["100%", "100%", "400px"]}
                        h="200px"
                        borderRadius="8px"
                        bg={boxBg3}
                        name="details"
                        value={d[entry]}
                        _hover={{border: borders}}
                        _active={{border: borders}}
                        border={borders}
                        placeholder={placeholder}
                        _focus={{
                          border: borders,
                        }}
                        onChange={e => handleChange(e, i, e.target.value)}
                      />
                    ) : null}

                    {j !== 2 && j !== 3 ? (
                      <>
                        <Input
                          {...inputStyle(boxBg3, text80)}
                          mb={getBorderValue(j) ? "0px" : "20px"}
                          minH="35px"
                          w={width || "100%"}
                          name={entry}
                          border={
                            getBorderValue(j)
                              ? "1px solid var(--chakra-colors-red)"
                              : borders
                          }
                          ref={j === 1 ? feeRef : null}
                          type={type}
                          value={d[entry]}
                          placeholder={placeholder}
                          onChange={e => {
                            if (j === 1)
                              handleChange(e, i, parseFloat(e.target.value));
                            else handleChange(e, i, e.target.value);
                          }}
                        />
                        {getBorderValue(j) ? (
                          <TextExtraSmall color="red" mt="3px" mb="20px">
                            Fees must be between 0 and 100
                          </TextExtraSmall>
                        ) : null}
                      </>
                    ) : null}
                  </>
                );
              })}
            </Flex>
          ),
      )}
    </>
  );
};
