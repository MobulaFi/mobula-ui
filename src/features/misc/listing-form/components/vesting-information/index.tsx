/* eslint-disable no-param-reassign */
import {ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";
import {Button, Flex, Icon, Input} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import {useContext, useRef} from "react";
import {
  TextExtraSmall,
  TextLandingLarge,
  TextLandingMedium,
  TextLandingSmall,
  TextMedium,
} from "../../../../../UI/Text";
import {useColors} from "../../../../../common/utils/color-mode";
import {ListingContext} from "../../context-manager";
import {ACTIONS} from "../../reducer";
import {inputStyle} from "../../styles";
import {getDateError} from "../../utils";

const EChart = dynamic(() => import("../../../../../common/charts/EChart"), {
  ssr: false,
});

export const VestingInformation = ({dispatch, state}) => {
  const {boxBg6, borders, boxBg3, bordersActive, hover, text80} = useColors();
  const dateRef = useRef<HTMLInputElement>(null);
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

  const addItem = template => {
    dispatch({type: ACTIONS.ADD_VESTING, payload: template});
  };

  const updateItem = (index, changes) => {
    const item = state.tokenomics.vestingSchedule[index];
    const newItem = [
      "timestamp" in changes ? changes.timestamp : item[0],
      "value" in changes ? changes.value : item[1],
      changes.breakdown ? changes.breakdown : item[2],
    ];

    dispatch({type: ACTIONS.UPDATE_VESTING, index, payload: newItem});
  };

  const deleteItem = index => {
    dispatch({type: ACTIONS.DELETE_VESTING, index});
  };

  const isoToTimestamp = (date, i) => {
    const fullDate = date || "27/06/2023";
    const parts = fullDate.split("/");
    const jsDateStr = `${parts[1]}/${parts[0]}/${parts[2]}`;
    const newDate = new Date(jsDateStr);
    const timestamp = newDate.getTime();
    updateItem(i, {timestamp});
  };

  const formatVesting = () => {
    const vesting: [number, number][] = state.tokenomics.vestingSchedule.map(
      v => [v[0], v[1]],
    );

    vesting.reduce((acc, curr) => {
      curr[0] += acc[0];
      curr[1] += acc[1];
      return curr;
    });

    return vesting;
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
        <TextLandingLarge>Vesting Details</TextLandingLarge>
      </Flex>
      <TextMedium>
        If the asset has a vesting schedule, you can add the unlock events here.
        If not, simply click Next.
      </TextMedium>

      {state.tokenomics.vestingSchedule.map((d, i) => (
        <Flex direction="column" mt={i !== 0 ? "30px" : "20px"}>
          <Button
            mb="-20px"
            ml="auto"
            color={text80}
            onClick={() => deleteItem(i)}
          >
            <CloseIcon fontSize="12px" />
          </Button>
          <Flex justify="space-between">
            <TextLandingMedium mb="10px">Date</TextLandingMedium>
          </Flex>
          <Input
            {...inputStyle(boxBg3, text80)}
            mb={getDateError(dateRef) ? "0px" : "20px"}
            minH="35px"
            w="100%"
            ref={dateRef}
            border={
              getDateError(dateRef)
                ? "1px solid var(--chakra-colors-red)"
                : borders
            }
            type="text"
            placeholder="DD/MM/YYYY"
            onChange={e => isoToTimestamp(e.target.value, i)}
          />
          {getDateError(dateRef) ? (
            <TextExtraSmall color="red" mb="20px" mt="3px">
              Correct format: DD/MM/YYYY
            </TextExtraSmall>
          ) : null}
          <TextLandingMedium mb="10px">Amount</TextLandingMedium>
          <Input
            {...inputStyle(boxBg3, text80)}
            mb="20px"
            minH="35px"
            w="100%"
            border={borders}
            type="number"
            placeholder="10000.00"
            onChange={e => updateItem(i, {value: parseFloat(e.target.value)})}
          />
          <TextLandingMedium mb="10px">Breakdown</TextLandingMedium>
          {d[2].map((_, j) => (
            <Flex>
              <Input
                {...inputStyle(boxBg3, text80)}
                minH="35px"
                w="100%"
                border={borders}
                placeholder="1,000.00"
                mr="10px"
                type="number"
                onChange={e => {
                  const newBreakdown = [...d[2]];
                  newBreakdown[j] = {
                    ...newBreakdown[j],
                    amount: parseFloat(e.target.value),
                  };

                  updateItem(i, {
                    breakdown: newBreakdown,
                  });
                }}
              />
              <Input
                {...inputStyle(boxBg3, text80)}
                minH="35px"
                w="150px"
                border={borders}
                type="text"
                placeholder="Role"
                mb="10px"
                onChange={e => {
                  const newBreakdown = [...d[2]];
                  newBreakdown[j] = {
                    ...newBreakdown[j],
                    name: e.target.value,
                  };

                  updateItem(i, {
                    breakdown: newBreakdown,
                  });
                }}
              />
            </Flex>
          ))}
          <Button
            {...addButtonStyle}
            onClick={() =>
              updateItem(i, {breakdown: [...d[2], {name: "", amount: ""}]})
            }
            w="fit-content"
            px="12px"
            bg={boxBg6}
            border={borders}
            _hover={{bg: hover, border: bordersActive}}
            mb="20px"
            mt="0px"
          >
            + Add breakdown
          </Button>
        </Flex>
      ))}
      <Button
        {...addButtonStyle}
        mt={["0px", "0px", "0px"]}
        onClick={() =>
          addItem([
            "",
            "",
            [
              {
                name: "",
                amount: "",
              },
            ],
          ])
        }
        w="fit-content"
        px="12px"
        bg={boxBg6}
        border={borders}
        _hover={{bg: hover, border: bordersActive}}
      >
        + Add unlock event
      </Button>
      <Flex w="100%" position="relative">
        {formatVesting().length >= 2 &&
        formatVesting()?.[1][0] &&
        formatVesting()?.[1][1] ? (
          <>
            <TextLandingSmall
              position="absolute"
              left="0px"
              top="20px"
              zIndex={1}
            >
              Token Vesting Schedule
            </TextLandingSmall>

            <EChart
              data={formatVesting()}
              leftMargin={["0%", "0%"]}
              height={300}
              timeframe="ALL"
            />
          </>
        ) : null}{" "}
      </Flex>
    </Flex>
  );
};
