import {ChevronDownIcon, CloseIcon} from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {createSupabaseDOClient} from "../../../../../../utils/supabase";
import {
  TextLandingMedium,
  TextLandingSmall,
  TextMedium,
} from "../../../../../UI/Text";
import {useColors} from "../../../../../common/utils/color-mode";
import {ILaunchpad} from "../../../../Data/Ico/models";
import {ACTIONS} from "../../reducer";
import {inputStyle} from "../../styles";
import {getInfoFromIndex, getNameFromNumber} from "../../utils";

export const Sales = ({dispatch, state}) => {
  const {boxBg6, borders, boxBg3, bordersActive, hover, text80} = useColors();
  const [launchpads, setLaunchpads] = useState<ILaunchpad[]>([]);
  const [activePlateform, setActivePlateform] = useState<ILaunchpad>(
    {} as ILaunchpad,
  );

  function formatDate(timestamp) {
    return new Date(timestamp).getTime();
  }

  const addButtonStyle = {
    w: "120px",
    h: "35px",
    borderRadius: "8px",
    color: text80,
    fontWeight: "400",
    mt: "10px",
    fontSize: ["12px", "12px", "14px", "16px"],
  };

  useEffect(() => {
    const supabase = createSupabaseDOClient();
    supabase
      .from("launchpads")
      .select("*")
      .then(({data, error}) => {
        if (error) console.error(error);
        else
          setLaunchpads([...data, {name: "Other", logo: "/icon/unknown.png"}]);
      });
  }, []);

  return (
    <>
      <TextLandingMedium mt="30px" pt="20x">
        Presale(s)
      </TextLandingMedium>
      {state.tokenomics.sales.map((d, i) => (
        <>
          <Flex justify="space-between" mt={i !== 0 ? "50px" : "20px"}>
            <TextMedium>
              {getNameFromNumber(i + 1)} Round Sale Information
            </TextMedium>
            <Button
              color={text80}
              onClick={() =>
                dispatch({
                  type: ACTIONS.REMOVE_ELEMENT_TOKENOMICS,
                  payload: {object: "sales", i},
                })
              }
            >
              <CloseIcon fontSize="12px" />
            </Button>
          </Flex>

          <Flex direction="column" mt="20px">
            {Object.keys(d).map((entry, j) => {
              const {placeholder, title, type} = getInfoFromIndex(j);

              return (
                <>
                  <TextLandingSmall mb="10px">{title}</TextLandingSmall>
                  {j !== Object.keys(d).length - 1 ? (
                    <Input
                      {...inputStyle(boxBg3, text80)}
                      mb="20px"
                      minH="35px"
                      name={entry}
                      border={borders}
                      type={type}
                      placeholder={placeholder}
                      onChange={e => {
                        let value: string | number = "";
                        if (
                          entry === "valuation" ||
                          entry === "price" ||
                          entry === "amount"
                        )
                          value = parseFloat(e.target.value);
                        else if (entry === "date")
                          value = formatDate(e.target.value);
                        else value = e.target.value;
                        dispatch({
                          type: ACTIONS.SET_ELEMENT_TOKENOMICS,
                          payload: {
                            object: "sales",
                            name: e.target.name,
                            value,
                            i,
                          },
                        });
                      }}
                      value={d[entry]}
                    />
                  ) : (
                    <Menu matchWidth>
                      <MenuButton
                        {...addButtonStyle}
                        bg={boxBg6}
                        w="fit-content"
                        px="12px"
                        mt="0px"
                        mb="10px"
                        fontSize={["12px", "12px", "14px", "16px"]}
                        border={borders}
                        _hover={{bg: hover, border: bordersActive}}
                        as={Button}
                      >
                        <Flex h="100%" align="center">
                          {d.platform ? (
                            <Image
                              src={activePlateform.logo || "/icon/unknown.png"}
                              boxSize={["18px", "18px", "20px"]}
                              mr="7.5px"
                              borderRadius="full"
                            />
                          ) : null}
                          {d.platform ? d.platform : "Select a Platform"}{" "}
                          <ChevronDownIcon ml="10px" />
                        </Flex>
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
                        {launchpads.map(launchpad => (
                          <MenuItem
                            bg={boxBg3}
                            _hover={{bg: hover}}
                            onClick={() => {
                              setActivePlateform(launchpad);
                              dispatch({
                                type: ACTIONS.SET_ELEMENT_TOKENOMICS,
                                payload: {
                                  object: "sales",
                                  name: "platform",
                                  value: launchpad.name,
                                  i,
                                },
                              });
                            }}
                          >
                            <Image
                              src={launchpad.logo || "/icon/unknown.png"}
                              boxSize={["18px", "18px", "22px"]}
                              mr="7.5px"
                              borderRadius="full"
                            />
                            {launchpad.name}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </Menu>
                  )}
                </>
              );
            })}
          </Flex>
        </>
      ))}
      <Button
        {...addButtonStyle}
        mt="10px"
        onClick={() =>
          dispatch({
            type: ACTIONS.ADD_ELEMENT_TOKENOMICS,
            payload: {
              object: "sales",
              template: {
                name: "",
                date: "",
                valuation: 0,
                price: 0,
                amount: 0,
                platform: "",
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
        + Add {getNameFromNumber(state.tokenomics.sales.length + 1)} Presale
      </Button>
    </>
  );
};
