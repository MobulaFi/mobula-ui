import {CloseIcon} from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import {blockchainsContent} from "mobula-lite/lib/chains/constants";
import {ChangeEvent} from "react";
import {isAddress} from "viem";
import {TextLandingMedium, TextMedium} from "../../../../../../UI/Text";
import {fetchContract} from "../../../../../../common/providers/swap/utils";
import {useColors} from "../../../../../../common/utils/color-mode";
import {ACTIONS} from "../../../reducer";
import {inputStyle} from "../../../styles";

export const MultiInputTemplate = ({
  dispatch,
  state,
  name,
  template,
  title,
  hasLogo,
  placeholder,
  text,
}: {
  dispatch: any;
  state: any;
  name: string;
  template: {[key: string]: any};
  title: string;
  placeholder: string;
  hasLogo?: boolean;
  text?: string;
}) => {
  const {boxBg6, boxBg3, borders, text80, bordersActive, hover} = useColors();
  const deleteButtonStyle = {
    w: "40px",
    ml: "10px",
    bg: boxBg6,
    h: "35px",
    borderRadius: "8px",
    color: text80,
    fontWeight: "400",
    mt: "10px",
    _hover: {bg: hover, border: bordersActive},
    border: borders,
    transition: "all 250ms ease-in-out",
    fontSize: ["12px", "12px", "14px", "16px"],
  };
  const addButtonStyle = {
    w: "120px",
    bg: boxBg6,
    h: "35px",
    borderRadius: "8px",
    color: text80,
    fontWeight: "400",
    _hover: {bg: hover, border: bordersActive},
    border: borders,
    transition: "all 250ms ease-in-out",
    fontSize: ["12px", "12px", "14px", "16px"],
  };

  const handleNewContract = (
    e: ChangeEvent<HTMLInputElement>,
    i: string,
    object: string,
  ) => {
    if (isAddress(e.target.value)) {
      dispatch({
        type: ACTIONS.SET_ELEMENT,
        payload: {
          i,
          name: "address",
          value: e.target.value,
          object,
        },
      });
      const getBlockchain = async (address: string) => {
        const fetchResults = await Promise.all(fetchContract(address));
        const {blockchain: blockchainBuffer} =
          fetchResults.filter(entry => entry)[0] || {};
        dispatch({
          type: ACTIONS.SET_ELEMENT,
          payload: {
            i,
            name: "blockchain",
            value: blockchainBuffer,
            object,
          },
        });
        const {chainId} = blockchainsContent[blockchainBuffer];
        dispatch({
          type: ACTIONS.SET_ELEMENT,
          payload: {
            i,
            name: "blockchain_id",
            value: chainId,
            object,
          },
        });
        if (title === "Contracts")
          if (state.totalSupplyContracts.length === 0)
            dispatch({
              type: ACTIONS.INITIAL_CONTRACT,
              payload: {
                address: e.target.value,
                blockchain: blockchainBuffer,
                blockchain_id: chainId,
              },
            });
      };
      getBlockchain(e.target.value);
    }
  };

  return (
    <Flex direction="column" w="100%" mt="20px">
      <TextLandingMedium>{title}</TextLandingMedium>{" "}
      {text && <TextMedium mb="15px">{text}</TextMedium>}
      {state[name].map((contract, i) => (
        <Flex
          direction="column"
          w="100%"
          // eslint-disable-next-line react/no-array-index-key
          key={contract.name + i}
        >
          <Flex align="center" mb="10px">
            <InputGroup
              {...inputStyle(boxBg3, text80)}
              border={borders}
              h="35px"
            >
              {hasLogo ? (
                <>
                  <InputLeftElement h="100%" ml="10px">
                    <Image
                      boxSize="20px"
                      src={
                        blockchainsContent[state.contracts[i]?.blockchain]
                          ?.logo || "/icon/unknown.png"
                      }
                    />
                  </InputLeftElement>
                  <Input
                    pl="30px"
                    w="100%"
                    pr="10px"
                    h="100%"
                    placeholder={placeholder}
                    overflow="scroll"
                    textOverflow="ellipsis"
                    onChange={e => {
                      handleNewContract(e, i, name);
                    }}
                  />
                </>
              ) : (
                <Input
                  pl="5px"
                  w="100%"
                  pr="10px"
                  h="100%"
                  overflow="scroll"
                  placeholder={placeholder}
                  textOverflow="ellipsis"
                  color={text80}
                  onChange={e => {
                    handleNewContract(e, i, name);
                    if (title === "Contracts")
                      if (state.totalSupplyContracts.length === 0)
                        dispatch({type: ACTIONS.ADD_FIRST_CONTRACT});
                  }}
                />
              )}
            </InputGroup>

            {i > 0 ? (
              <Button
                {...deleteButtonStyle}
                mt="0px"
                onClick={() => {
                  dispatch({
                    type: ACTIONS.REMOVE_ELEMENT,
                    payload: {i, object: name},
                  });
                  dispatch({type: ACTIONS.CLEAR_TOTAL_SUPPLY_CONTRACTS});
                  if (state.totalSupplyContracts.length === 1)
                    dispatch({type: ACTIONS.ADD_FIRST_CONTRACT});
                  else dispatch({type: ACTIONS.ADD_ALL_CONTRACTS});
                }}
              >
                <CloseIcon fontSize="12px" color={text80} />
              </Button>
            ) : null}
          </Flex>
        </Flex>
      ))}
      <Button
        {...addButtonStyle}
        w="170px"
        onClick={() =>
          dispatch({
            type: ACTIONS.ADD_ELEMENT,
            payload: {
              object: name,
              template,
            },
          })
        }
      >
        + Add contract
      </Button>
    </Flex>
  );
};
