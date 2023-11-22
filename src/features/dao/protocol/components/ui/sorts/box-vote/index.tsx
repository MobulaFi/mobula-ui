import {Button, Flex, Icon} from "@chakra-ui/react";
import {useContext} from "react";
import {Eye} from "react-feather";
import {TextLandingSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {getScores} from "../../../../constants/sorts";
import {ShowReasonContext} from "../../../../context-manager/reason-vote";
import {VoteContext} from "../../../../context-manager/vote";
import {TokenDivs} from "../../../../models";
import {ButtonVote} from "../button-vote";
import {Countdown} from "../countdown";

export const VoteBox = ({
  typeVote,
  token,
}: {
  token: TokenDivs;
  typeVote: string;
}) => {
  const scores = getScores();
  const grades = [1, 2, 3, 4, 5];
  const {text80, borders, boxBg3, hover, text60} = useColors();
  const {setShowUtility, setShowSocial, setShowTrust} =
    useContext(ShowReasonContext);
  const context = useContext(VoteContext);

  const getColorFromGrad = (bad, good, neutral) => {
    if (bad) return "red";
    if (good) return "green";
    if (neutral) return "yellow";
    return text80;
  };

  const getBorderFromGrad = (bad, good, neutral) => {
    if (bad) return "var(--chakra-colors-red)";
    if (good) return "var(--chakra-colors-green)";
    if (neutral) return "var(--chakra-colors-yellow)";
    return "1px solid invisible";
  };

  return (
    <Flex
      direction="column"
      borderRadius={["0px", "16px"]}
      bg={boxBg3}
      w="100%"
      border={borders}
      mt={typeVote ? "10px" : "0px"}
      opacity={token.alreadyVoted ? 0.5 : 1}
    >
      <Countdown token={token} />
      <Flex direction="column" p="5px 0px">
        {scores.map(entry => {
          const {
            [`${entry.title.toLowerCase()}Score`]: score,
            [`set${entry.title}Score`]: setScore,
          } = context;
          const bar = (() => {
            switch (score) {
              case 0:
                return 0;
              case 1:
                return 0;
              case 2:
                return 25;
              case 3:
                return 48;
              case 4:
                return 68;
              case 5:
                return 88;
              default:
                return 0;
            }
          })();
          return (
            <Flex p={["10px", "15px", "15px 20px"]} align="center">
              <TextLandingSmall color={text80} w="100px">
                {entry.title}
              </TextLandingSmall>
              <Flex
                w="100%"
                justify="space-between"
                align="center"
                position="relative"
                pl="20px"
              >
                <Flex
                  bg={hover}
                  color={text80}
                  position="absolute"
                  transition="all 300ms ease-in-out"
                  top="3px"
                  left="20px"
                  borderRadius="8px"
                  h="30px"
                  w={`${bar}%`}
                />
                {grades.map(grade => {
                  const badNote = score === grade && score < 3;
                  const goodNote = score === grade && score > 3;
                  const neutralNote = score === grade;
                  return (
                    <Button
                      w="70px"
                      bg={score === grade ? hover : "none"}
                      transition="all 300ms ease-in-out"
                      border={`1px solid ${getBorderFromGrad(
                        badNote,
                        goodNote,
                        neutralNote,
                      )}`}
                      color={getColorFromGrad(badNote, goodNote, neutralNote)}
                      h="34px"
                      borderRadius="12px"
                      onClick={() => {
                        setScore(grade);
                        if (grade) {
                          setTimeout(() => {
                            // eslint-disable-next-line default-case
                            switch (entry.title) {
                              case "Utility":
                                setShowUtility(true);
                                return;
                              case "Social":
                                setShowSocial(true);
                                return;
                              case "Trust":
                                setShowTrust(true);
                            }
                          }, 300);
                        }
                      }}
                    >
                      <Flex
                        fontSize={["12px", "12px", "14px", "14px"]}
                        justify="space-around"
                        w="70%"
                        align="center"
                      >
                        {grade}
                        {true && typeVote === "review" && (
                          <Icon ml="5px" color={text60} as={Eye} />
                        )}
                      </Flex>
                    </Button>
                  );
                })}
              </Flex>
            </Flex>
          );
        })}
      </Flex>
      <Flex p="0px 20px 20px 20px" direction="column" mt="10px">
        <ButtonVote token={token} />
      </Flex>
    </Flex>
  );
};
