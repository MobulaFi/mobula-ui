import {ArrowBackIcon} from "@chakra-ui/icons";
import {Button, Flex, Icon} from "@chakra-ui/react";
import {useContext, useState} from "react";
import {
  TextLandingLarge,
  TextLandingMedium,
  TextMedium,
} from "../../../../../UI/Text";
import {useColors} from "../../../../../common/utils/color-mode";
import {ListingContext} from "../../context-manager";
import {ACTIONS} from "../../reducer";
import {FeeBreakdown} from "./fee-breakdown";

export const FeesInformation = ({dispatch, state}) => {
  const {boxBg6, borders, boxBg3, bordersActive, hover, text80} = useColors();
  const [sellFees, setSellFees] = useState("");
  const {actualPage, setActualPage} = useContext(ListingContext);
  const addButtonStyle = {
    w: "120px",
    h: "35px",
    borderRadius: "8px",
    color: text80,
    fontWeight: "400",
    mt: "10px",
    fontSize: ["12px", "12px", "14px", "16px"],
  };

  return (
    <Flex direction="column" mb="20px" w={["100%", "100%", "400px"]}>
      <Flex align="center">
        <Button
          display={["flex", "flex", "none"]}
          onClick={() => setActualPage(actualPage - 1)}
        >
          <Icon as={ArrowBackIcon} mr="5px" />
        </Button>
        <TextLandingLarge>Fees Details</TextLandingLarge>
      </Flex>
      <TextMedium>
        If the asset has fees on transfers (i.e. Safemoon), you can add them
        here. If not, simply click Next. If multiple fees (liquidity, marketing,
        etc) make sure to break them down individually.
      </TextMedium>
      <TextLandingMedium mt="10px">Buy fees</TextLandingMedium>

      <FeeBreakdown dispatch={dispatch} state={state} side="buy" />

      <Button
        {...addButtonStyle}
        mb="20px"
        onClick={() =>
          dispatch({
            type: ACTIONS.ADD_ELEMENT_TOKENOMICS,
            payload: {
              object: "fees",
              template: {
                name: "",
                percentage: 0,
                details: "",
                side: "buy",
              },
            },
          })
        }
        w="fit-content"
        px="12px"
        bg={boxBg6}
        border={borders}
        _hover={{bg: hover, border: bordersActive}}
      >
        + Add another buy fee
      </Button>
      <Flex direction="column">
        <TextLandingMedium>Sell fees</TextLandingMedium>
        <FeeBreakdown dispatch={dispatch} state={state} side="sell" />

        <Flex>
          {/* <Button
            bg={boxBg6}
            border={borders}
            _hover={{bg: hover, border: bordersActive}}
            {...addButtonStyle}
            mr="10px"
            w="fit-content"
            px="12px"
            // onClick={() => {
            //   if (
            //     state.tokenomics.fees[state.tokenomics.fees.length - 2]
            //       ?.side !== "sell"
            //   ) {
            //     if (
            //       state.tokenomics.fees[state.tokenomics.fees.length - 1]
            //         .side === "sell"
            //     ) {
            //       dispatch({
            //         type: ACTIONS.REMOVE_ELEMENT_TOKENOMICS,
            //         payload: {
            //           object: "fees",
            //           i: state.tokenomics.fees.length - 1,
            //         },
            //       });
            //       dispatch({
            //         type: ACTIONS.ADD_ELEMENT_TOKENOMICS,
            //         payload: {
            //           object: "fees",
            //           template: {
            //             ...state.tokenomics.fees[i],
            //             side: "sell",
            //           },
            //         },
            //       });
            //     }
            //   }
            //   if (
            //     state.tokenomics.fees[state.tokenomics.fees.length - 1].side ===
            //     "buy"
            //   )
            //     dispatch({
            //       type: ACTIONS.ADD_ELEMENT_TOKENOMICS,
            //       payload: {
            //         object: "fees",
            //         template: {
            //           ...state.tokenomics.fees[i],
            //           side: "sell",
            //         },
            //       },
            //     });
            // }}
          >
            Copy buy fees
          </Button> */}
          <Button
            {...addButtonStyle}
            mb="20px"
            onClick={() =>
              dispatch({
                type: ACTIONS.ADD_ELEMENT_TOKENOMICS,
                payload: {
                  object: "fees",
                  template: {
                    name: "",
                    percentage: 0,
                    details: "",
                    side: "sell",
                  },
                },
              })
            }
            w="fit-content"
            px="12px"
            bg={boxBg6}
            border={borders}
            _hover={{bg: hover, border: bordersActive}}
          >
            + Add sell fee
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
