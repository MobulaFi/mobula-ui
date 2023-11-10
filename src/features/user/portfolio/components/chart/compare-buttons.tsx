/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-var */
/* eslint-disable block-scoped-var */
import {SmallCloseIcon} from "@chakra-ui/icons";
import {Box, Button, Flex, FlexProps, Spinner} from "@chakra-ui/react";
import {Dispatch, SetStateAction} from "react";
import {colors} from "../../constants";
import {ComparedEntity} from "../../models";

export const CompareButtons = ({
  buttonH = "38px",
  comparedEntities,
  setComparedEntities,
  noMaxW = false,
  ...props
}: {
  buttonH?: string;
  comparedEntities: ComparedEntity[];
  setComparedEntities: Dispatch<SetStateAction<ComparedEntity[]>>;
  noMaxW?: boolean;
} & FlexProps) => (
  <Flex
    mr="auto"
    maxW={[
      noMaxW ? "95%" : "300px",
      noMaxW ? "95%" : "300px",
      noMaxW ? "95%" : "500px",
    ]}
    ml={[noMaxW ? "2.5%" : "0px", noMaxW ? "2.5%" : "0px", "0px"]}
    flexWrap="wrap"
    {...props}
  >
    {comparedEntities?.map((entity, i) => (
      <Button
        variant="outlined_grey"
        zIndex={1}
        px="8px"
        h={buttonH}
        onClick={() => {
          comparedEntities.splice(i, 1);
          setComparedEntities([...comparedEntities]);
        }}
        mr="10px"
        mt="10px"
      >
        <Box bg={colors[i]} borderRadius="full" w="10px" h="10px" mr="5px" />
        {entity.label}
        {entity.data.length ? (
          <SmallCloseIcon ml="5px" />
        ) : (
          <Spinner h="10px" w="10px" ml="5px" />
        )}
      </Button>
    ))}
  </Flex>
);
