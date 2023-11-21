import {ArrowBackIcon} from "@chakra-ui/icons";
import {Button, Flex, Icon} from "@chakra-ui/react";
import {useContext} from "react";
import {
  TextLandingLarge,
  TextLandingMedium,
  TextSmall,
} from "../../../../../UI/Text";
import {useColors} from "../../../../../common/utils/color-mode";
import {ListingContext} from "../../context-manager";
import {ACTIONS} from "../../reducer";
import {Distribution} from "../distribution";
import {Launch} from "../launch";
import {Sales} from "../sales";
import {MultiInputTemplate} from "../ui/multi-input-template";

export const ContractInformation = ({dispatch, state}) => {
  const {boxBg6, text40, borders, bordersActive, hover, text80} = useColors();
  const {isLaunched, setIsLaunched, actualPage, setActualPage} =
    useContext(ListingContext);

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
        <TextLandingLarge>Contract Information</TextLandingLarge>
      </Flex>
      <MultiInputTemplate
        dispatch={dispatch}
        state={state}
        name="contracts"
        title="Contracts"
        placeholder="0x5FeF...7d5dd4"
        hasLogo
        template={{
          address: "",
          blockchain: "",
          blockchain_id: 1,
        }}
      />
      {state.type === "nft" ? null : (
        <>
          {state.contracts.length > 1 ? (
            <Flex direction="column" w="100%" mt="20px">
              <TextLandingMedium mb="10px">
                Token supply details
              </TextLandingMedium>
              <Button
                {...addButtonStyle}
                w="fit-content"
                px="12px"
                _hover={{bg: hover, border: bordersActive}}
                bg={state.totalSupplyContracts.length === 1 ? hover : boxBg6}
                border={
                  state.totalSupplyContracts.length === 1
                    ? bordersActive
                    : borders
                }
                onClick={() => {
                  dispatch({type: ACTIONS.CLEAR_TOTAL_SUPPLY_CONTRACTS});
                  dispatch({type: ACTIONS.ADD_FIRST_CONTRACT});
                }}
              >
                Total supply is a sum of all contracts
              </Button>
              <TextSmall mt="10px" color={text40}>
                This means the token bridge is “native” - you need to burn (and
                not vest) assets to mint them on the other chain.
              </TextSmall>
              <Button
                {...addButtonStyle}
                w="fit-content"
                mb="10px"
                px="12px"
                mt="20px"
                bg={state.totalSupplyContracts.length > 1 ? hover : boxBg6}
                border={
                  state.totalSupplyContracts.length > 1
                    ? bordersActive
                    : borders
                }
                _hover={{bg: hover, border: bordersActive}}
                onClick={() => {
                  dispatch({type: ACTIONS.CLEAR_TOTAL_SUPPLY_CONTRACTS});
                  dispatch({type: ACTIONS.ADD_ALL_CONTRACTS});
                }}
              >
                Total supply is the supply of the first contract
              </Button>
              <TextSmall color={text40}>
                This means the token bridge isn&apos;t “native” - you vest /
                lock assets to mint them on the other chain, so the supply on
                the first chain stays the same.
              </TextSmall>
            </Flex>
          ) : null}

          <MultiInputTemplate
            dispatch={dispatch}
            state={state}
            name="excludedFromCirculationAddresses"
            title="Excluded addresses"
            placeholder="0x0GeT...345234"
            text="These addresses are excluded from the circulating supply (vesting or staking contracts, etc.)"
            template={{
              address: "",
              blockchain: "",
              blockchain_id: 1,
            }}
          />

          <Flex direction="column" w="400px">
            <TextLandingMedium mt="20px">
              Is the asset already launched?
            </TextLandingMedium>
            <Flex>
              <Button
                {...addButtonStyle}
                border={isLaunched ? bordersActive : borders}
                bg={isLaunched ? hover : boxBg6}
                mr="10px"
                onClick={() => setIsLaunched(true)}
              >
                Yes
              </Button>
              <Button
                {...addButtonStyle}
                border={!isLaunched ? bordersActive : borders}
                bg={!isLaunched ? hover : boxBg6}
                onClick={() => setIsLaunched(false)}
              >
                No
              </Button>
            </Flex>
          </Flex>

          {isLaunched ? null : <Launch dispatch={dispatch} state={state} />}
          <Sales dispatch={dispatch} state={state} />
          <Distribution dispatch={dispatch} state={state} />
        </>
      )}
    </Flex>
  );
};
