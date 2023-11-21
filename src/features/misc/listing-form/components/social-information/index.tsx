import {ArrowBackIcon, CloseIcon} from "@chakra-ui/icons";
import {Button, Flex, Icon, Input} from "@chakra-ui/react";
import {useContext, useState} from "react";
import {BsShieldFillCheck} from "react-icons/bs";
import {MdVisibility} from "react-icons/md";
import {
  TextLandingLarge,
  TextLandingMedium,
  TextLandingSmall,
} from "../../../../../UI/Text";
import {useColors} from "../../../../../common/utils/color-mode";
import {getLinks} from "../../constant";
import {ListingContext} from "../../context-manager";
import {ACTIONS} from "../../reducer";
import {inputStyle} from "../../styles";
import {getIconFromMemberTitle} from "../../utils";
import {InputTemplate} from "../ui/inputs-template";

export const SocialInformation = ({dispatch, state}) => {
  const {boxBg6, boxBg3, borders, bordersActive, hover, text80} = useColors();
  const [inputs, setInputs] = useState([{id: 1}]);
  const [inputsKyc, setInputsKyc] = useState([{id: 1}]);
  const [inputsTeam, setInputsTeam] = useState([{id: 1}]);
  const links = getLinks(text80);
  const {actualPage, setActualPage} = useContext(ListingContext);

  const addInput = type => {
    if (type === "kyc") {
      setInputsKyc([
        ...inputsKyc,
        {id: inputsKyc[inputsKyc.length - 1].id + 1},
      ]);
      dispatch({
        type: ACTIONS.ADD_TO_ARRAY,
        payload: {
          name: "kycs",
          value: "",
        },
      });
    }
    if (type === "team")
      setInputsTeam([
        ...inputsTeam,
        {id: inputsTeam[inputsTeam.length - 1].id + 1},
      ]);
    if (type === "audit") {
      setInputs([...inputs, {id: inputs[inputs.length - 1].id + 1}]);
      dispatch({
        type: ACTIONS.ADD_TO_ARRAY,
        payload: {
          name: "audits",
          value: "",
        },
      });
    }
  };

  const removeInput = (id, i, name) => {
    if (name !== "team") {
      dispatch({
        type: ACTIONS.REMOVE_FROM_ARRAY,
        payload: {
          name,
          i,
        },
      });
      if (name === "kyc")
        setInputsKyc(inputsKyc.filter(input => input.id !== id));
      if (name === "audits") setInputs(inputs.filter(input => input.id !== id));
    } else {
      setInputsTeam(inputsTeam.filter(input => input.id !== id));
      dispatch({
        type: ACTIONS.REMOVE_ELEMENT,
        payload: {
          name,
          i,
        },
      });
    }
  };

  const handleArrayChange = (e, i) => {
    if (state.links[e.target.name].length > 0) {
      dispatch({
        type: ACTIONS.SET_ARRAY,
        payload: {
          name: e.target.name,
          value: e.target.value,
          i,
        },
      });
    } else {
      dispatch({
        type: ACTIONS.ADD_TO_ARRAY,
        payload: {
          name: e.target.name,
        },
      });
      dispatch({
        type: ACTIONS.SET_ARRAY,
        payload: {
          name: e.target.name,
          value: e.target.value,
          i,
        },
      });
    }
  };

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
  };

  const addButtonStyle = {
    w: "120px",
    bg: boxBg6,
    h: "35px",
    borderRadius: "8px",
    color: text80,
    fontWeight: "400",
    mt: "10px",
    _hover: {bg: hover, border: bordersActive},
    border: borders,
  };

  return (
    <Flex direction="column" mb="20px">
      <Flex align="center">
        <Button
          display={["flex", "flex", "none"]}
          onClick={() => setActualPage(actualPage - 1)}
        >
          <Icon as={ArrowBackIcon} mr="5px" />
        </Button>
        <TextLandingLarge>Social Information</TextLandingLarge>
      </Flex>
      {links.map(link => (
        <InputTemplate
          name={link.name}
          dispatch={dispatch}
          title={link.title}
          action={ACTIONS.SET_INPUT_LINKS}
          icon={link.icon}
          placeholder={link.placeholder}
          isWebsite
          w={["100%", "100%", "400px"]}
        />
      ))}
      <Flex direction="column" w={["100%", "100%", "400px"]}>
        <Flex direction="column" mt="20px">
          <Flex align="center">
            <Icon
              as={BsShieldFillCheck}
              color={text80}
              mr="7.5px"
              fontSize={["16px", "16px", "18px", "20px"]}
            />
            <TextLandingMedium>Audits</TextLandingMedium>
          </Flex>
          {inputs.map((input, i) => (
            <Flex>
              <Input
                {...inputStyle(boxBg3, text80)}
                border={borders}
                name="audits"
                mt="10px"
                key={input.id}
                placeholder="www.certik.com/audit"
                onChange={e => handleArrayChange(e, i)}
              />
              <Button
                {...deleteButtonStyle}
                display={i > 0 ? "flex" : "none"}
                onClick={() => removeInput(input.id, i, "audits")}
              >
                <CloseIcon fontSize="12px" color={text80} />
              </Button>
            </Flex>
          ))}
          <Button {...addButtonStyle} onClick={() => addInput("audit")}>
            Add more
          </Button>
        </Flex>
        <Flex direction="column" mt="20px">
          <Flex align="center">
            <Icon
              as={MdVisibility}
              color={text80}
              mr="7.5px"
              fontSize={["16px", "16px", "18px", "20px"]}
            />
            <TextLandingMedium>KYCs</TextLandingMedium>
          </Flex>
          {inputsKyc.map((input, i) => (
            <Flex>
              <Input
                {...inputStyle(boxBg3, text80)}
                border={borders}
                name="kycs"
                mt="10px"
                key={input.id}
                value={state.links.kycs[i]}
                placeholder="www.certik.com/kyc"
                onChange={e => handleArrayChange(e, i)}
              />
              <Button
                {...deleteButtonStyle}
                display={i > 0 ? "flex" : "none"}
                onClick={() => removeInput(input.id, i, "kycs")}
              >
                <CloseIcon fontSize="12px" color={text80} />
              </Button>
            </Flex>
          ))}
          <Button {...addButtonStyle} onClick={() => addInput("kyc")}>
            Add more
          </Button>
        </Flex>
        <Flex direction="column" mt="30px" pt="20px" borderTop={borders}>
          <TextLandingMedium>Team member(s)</TextLandingMedium>
          {state.team.map((member, i) => (
            <Flex
              mt={i !== 0 ? "50px" : "0px"}
              direction="column"
              w="100%"
              // eslint-disable-next-line react/no-array-index-key
              key={member.name + i}
            >
              <Button
                w="fit-content"
                ml="auto"
                onClick={() =>
                  dispatch({
                    type: ACTIONS.REMOVE_ELEMENT,
                    payload: {i, object: "team"},
                  })
                }
              >
                <CloseIcon fontSize="12px" color={text80} />
              </Button>
              {Object.keys(member).map(key => (
                <>
                  <Flex align="center" mb="10px">
                    {getIconFromMemberTitle(key, text80)}
                    <TextLandingSmall>
                      {key.slice(0, 1)[0].toUpperCase() +
                        key.slice(1, key.length)}
                    </TextLandingSmall>{" "}
                  </Flex>
                  <Input
                    key={key}
                    {...inputStyle(boxBg3, text80)}
                    value={member[key]}
                    border={borders}
                    mb="20px"
                    placeholder={`${
                      key.slice(0, 1).toLocaleUpperCase() + key.slice(1)
                    } of team member`}
                    onChange={e =>
                      dispatch({
                        type: ACTIONS.SET_ELEMENT,
                        payload: {
                          i,
                          name: key,
                          value: e.target.value,
                          object: "team",
                        },
                      })
                    }
                  />
                </>
              ))}
            </Flex>
          ))}
          <Button
            {...addButtonStyle}
            w="170px"
            onClick={() => {
              addInput("team");
              dispatch({
                type: ACTIONS.ADD_ELEMENT,
                payload: {
                  object: "team",
                  template: {
                    role: "",
                    name: "",
                    telegram: "",
                    twitter: "",
                    linkedin: "",
                  },
                },
              });
            }}
          >
            + Add team member
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
