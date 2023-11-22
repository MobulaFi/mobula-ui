import {CheckIcon} from "@chakra-ui/icons";
import {Button, Flex, Icon} from "@chakra-ui/react";
import {useContext, useState} from "react";
import {useAlert} from "react-alert";
import {AiOutlineWarning} from "react-icons/ai";
import {TextExtraSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {ButtonOutlined} from "../../../../../common/components/button-outlined";
import {ReasonVoteContext} from "../../../../context-manager/reason-vote";
import {VoteContext} from "../../../../context-manager/vote";
import {useVote} from "../../../../hooks/use-vote";
import {TokenDivs} from "../../../../models";

export const ButtonVote = ({token}: {token: TokenDivs}) => {
  const vote = useContext(VoteContext);
  const {reasonSocial, reasonTrust, reasonUtility} =
    useContext(ReasonVoteContext);
  const alert = useAlert();
  const hasVoted = reasonSocial && reasonTrust && reasonUtility !== 0;
  const voteToken = useVote();
  const {text80, bordersActive} = useColors();
  const [isAbleToSubmit, setIsAbleToSubmit] = useState(false);

  return (
    <Flex direction="column" w="100%">
      <Flex align="center" mb="15px">
        <Flex align="center" mr="10px">
          <Icon as={AiOutlineWarning} color="yellow" mr="5px" />
          <TextExtraSmall>
            I correctly checked if every single information is valid. I&apos;m
            aware of the consequences if I made a mistake
          </TextExtraSmall>
        </Flex>
        <Button
          border={bordersActive}
          boxSize="15px"
          ml="auto"
          mt="-2px"
          minW="15px"
          borderRadius="4px"
          onClick={() => setIsAbleToSubmit(prev => !prev)}
        >
          {isAbleToSubmit ? (
            <CheckIcon color={text80} fontSize="8px" ml="1px" mb="1px" />
          ) : null}
        </Button>
      </Flex>
      <Flex w="100%">
        <ButtonOutlined
          w="100%"
          h={["35px", "35px", "40px", "42px"]}
          maxW="100%"
          color={text80}
          borderRadius="8px"
          fontSize={["12px", "12px", "13px", "14px"]}
          mr="5px"
          border={
            token.alreadyVoted
              ? "1px solid var(--chakra-colors-borders-1)"
              : "1px solid var(--chakra-colors-green)"
          }
          _hover={{
            border: token.alreadyVoted
              ? "1px solid var(--chakra-colors-borders-1)"
              : "1px solid var(--chakra-colors-green)",
          }}
          onClick={() => {
            if (isAbleToSubmit) {
              if (hasVoted || !token.isListing) {
                const {utilityScore, socialScore, trustScore} = vote;
                voteToken(token, 0, utilityScore, socialScore, trustScore);
              } else {
                alert.error(
                  "You must select a reason for the score you assign to this asset.",
                );
              }
            } else {
              alert.error("You must check the box to submit your vote.");
            }
          }}
        >
          Validate Listing
        </ButtonOutlined>
        <ButtonOutlined
          maxW="100%"
          color={text80}
          borderRadius="8px"
          fontSize={["12px", "12px", "13px", "14px"]}
          ml="5px"
          border={
            token.alreadyVoted
              ? "1px solid var(--chakra-colors-borders-1)"
              : "1px solid var(--chakra-colors-red)"
          }
          h={["35px", "35px", "40px", "42px"]}
          _hover={{
            border: token.alreadyVoted
              ? "1px solid var(--chakra-colors-borders-1)"
              : "1px solid var(--chakra-colors-red)",
          }}
          onClick={() => {
            if (isAbleToSubmit) {
              const {utilityScore, socialScore, trustScore} = vote;
              voteToken(token, 1, utilityScore, socialScore, trustScore);
            }
          }}
        >
          Reject Listing
        </ButtonOutlined>
      </Flex>
    </Flex>
  );
};
