import {Flex} from "@chakra-ui/react";

export const Privacy = ({...props}: {[key: string]: any}) => (
  <Flex
    borderRadius="8px"
    color="text.80"
    fontSize={["12px", "12px", "13px", "14px"]}
    fontWeight="400"
    transition="all 250ms ease-in-out"
    align="center"
    justify="flex-start"
    {...props}
  >
    ****
  </Flex>
);
