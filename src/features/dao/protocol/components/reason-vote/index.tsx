import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import {useContext, useState} from "react";
import {useColors} from "../../../../../common/utils/color-mode";
import {ShowReasonContext} from "../../context-manager/reason-vote";
import {VoteContext} from "../../context-manager/vote";
import {possibilities} from "./constants/possibilities";
import {Lines} from "./lines";

export const ReasonVote = ({type, setReason, reason}) => {
  const [invisible, setInvisible] = useState(false);
  const showContext = useContext(ShowReasonContext);
  const voteContext = useContext(VoteContext);
  const {text80, borders, boxBg1} = useColors();
  const {[`${type.toLowerCase()}Score`]: score} = voteContext;
  const {[`setShow${type}`]: setShowType} = showContext;
  const texts = possibilities[type]?.[score - 1 || 0];
  const getColor = () => {
    if (score === 3) return "yellow";
    if (score > 3) return "green";
    return "red";
  };

  return (
    <Modal motionPreset="none" isOpen={!invisible} onClose={setShowType}>
      <ModalOverlay />
      <ModalContent borderRadius="20px">
        <ModalCloseButton color={text80} />
        <ModalBody p="20px" borderRadius="16px" bg={boxBg1} border={borders}>
          {type !== "Reject" ? (
            <Text fontSize="15px" color={text80} fontWeight="600" mb="5px">
              Why this {type} Score ? (
              <Box as="span" color={getColor()}>
                {score}/5
              </Box>
              )
            </Text>
          ) : (
            <Text fontSize="15px" color={text80} fontWeight="600" mb="5px">
              Why are you rejecting?
            </Text>
          )}
          {texts.map((entry, idx) => (
            <Lines
              texts={entry}
              idx={idx}
              setReason={setReason}
              reason={reason}
            />
          ))}
          <Button
            w="100%"
            py="8px"
            borderRadius="8px"
            fontSize="12px"
            fontWeight="500"
            color={text80}
            border="1px solid var(--chakra-colors-blue)"
            onClick={() => {
              if (reason !== 0) setInvisible(true);
            }}
          >
            OK
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
