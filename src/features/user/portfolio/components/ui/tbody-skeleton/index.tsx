import {Tr, Td, Flex, Skeleton} from "@chakra-ui/react";
import {tdStyle} from "../../../style";
import {useColors} from "../../../../../../common/utils/color-mode";

export const TbodySkeleton = ({isActivity}: {isActivity?: boolean}) => {
  const {boxBg6, borders, hover} = useColors();
  return (
    <Tr>
      <Td
        {...tdStyle}
        borderBottom={borders}
        position="sticky"
        top="0px"
        left="-1px"
      >
        <Flex align="center">
          {isActivity ? (
            <Flex direction="column">
              <Flex
                bg={hover}
                borderRadius="full"
                zIndex={1}
                mb="-10px"
                boxSize="fit-content"
              >
                <Skeleton
                  borderRadius="full"
                  startColor={boxBg6}
                  endColor={hover}
                  border={borders}
                  boxSize="24px"
                  minH="24px"
                  minW="24px"
                />
              </Flex>
              <Flex bg={hover} borderRadius="full" ml="10px" zIndex={0}>
                <Skeleton
                  startColor={boxBg6}
                  endColor={hover}
                  border={borders}
                  boxSize="24px"
                  minH="24px"
                  minW="24px"
                  borderRadius="full"
                />
              </Flex>
            </Flex>
          ) : (
            <Skeleton
              startColor={boxBg6}
              endColor={hover}
              boxSize="28px"
              borderRadius="full"
            />
          )}

          <Flex direction="column">
            <Skeleton
              h="12px"
              startColor={boxBg6}
              endColor={hover}
              mb="5px"
              w={isActivity ? "60px" : "100px"}
              borderRadius="4px"
              ml={isActivity ? "10px" : "7.5px"}
            />
            <Skeleton
              h="15px"
              startColor={boxBg6}
              endColor={hover}
              mb="5px"
              w={isActivity ? "100px" : "60px"}
              borderRadius="4px"
              ml="7.5px"
            />
          </Flex>
        </Flex>
      </Td>
      <Td {...tdStyle} borderBottom={borders}>
        <Flex direction="column" align="flex-end" w="100%">
          <Skeleton
            h="12px"
            startColor={boxBg6}
            endColor={hover}
            mb="5px"
            w={isActivity ? "100px" : "65px"}
            borderRadius="4px"
            ml="7.5px"
          />
          <Skeleton
            h="15px"
            startColor={boxBg6}
            endColor={hover}
            mb="5px"
            w={isActivity ? "65px" : "100px"}
            borderRadius="4px"
            ml="7.5px"
          />
        </Flex>
      </Td>
      <Td {...tdStyle} borderBottom={borders}>
        {isActivity ? (
          <Flex direction="column" align="flex-end" w="100%">
            <Skeleton
              h="15px"
              startColor={boxBg6}
              endColor={hover}
              mb="5px"
              w="60px"
              ml="auto"
              borderRadius="4px"
            />
          </Flex>
        ) : (
          <Flex direction="column" align="flex-end" w="100%">
            <Skeleton
              h="12px"
              startColor={boxBg6}
              endColor={hover}
              mb="5px"
              w="65px"
              borderRadius="4px"
              ml="7.5px"
            />
            <Skeleton
              h="15px"
              startColor={boxBg6}
              endColor={hover}
              mb="5px"
              w="40px"
              borderRadius="4px"
              ml="7.5px"
            />
          </Flex>
        )}
      </Td>
      <Td {...tdStyle} borderBottom={borders}>
        <Flex w="100%" justify="flex-end">
          <Skeleton
            h="15px"
            startColor={boxBg6}
            endColor={hover}
            mb="5px"
            w={isActivity ? "90px" : "30px"}
            ml="auto"
            borderRadius="4px"
          />
        </Flex>
      </Td>
      <Td {...tdStyle} borderBottom={borders}>
        <Flex w="100%" justify="flex-end">
          <Skeleton
            h="15px"
            startColor={boxBg6}
            endColor={hover}
            mb="5px"
            w={isActivity ? "90px" : "50px"}
            ml="auto"
            borderRadius="4px"
          />
        </Flex>
      </Td>
      <Td {...tdStyle} borderBottom={borders}>
        {isActivity ? (
          <Flex direction="column" align="flex-end">
            <Skeleton
              h="12px"
              startColor={boxBg6}
              endColor={hover}
              mb="5px"
              w="70px"
              borderRadius="4px"
            />
            <Skeleton
              h="15px"
              startColor={boxBg6}
              endColor={hover}
              mb="5px"
              w="50px"
              borderRadius="4px"
            />
          </Flex>
        ) : (
          <Flex w="100%" justify="flex-end">
            <Skeleton
              h="15px"
              startColor={boxBg6}
              endColor={hover}
              mb="5px"
              w="50px"
              ml="auto"
              borderRadius="4px"
            />
          </Flex>
        )}
      </Td>
      <Td {...tdStyle} borderBottom={borders}>
        <Flex justify="flex-end">
          <Skeleton
            h={isActivity ? "24px" : "20px"}
            startColor={boxBg6}
            endColor={hover}
            mb="5px"
            w={isActivity ? "24px" : "20px"}
            ml="auto"
            borderRadius={isActivity ? "full" : "4px"}
            mr="10px"
          />
          <Flex
            direction="column"
            h="20px"
            justify="space-between"
            mr="5px"
            ml={isActivity ? "5px" : "0px"}
          >
            <Skeleton
              h="4px"
              startColor={boxBg6}
              endColor={hover}
              w="4px"
              minH="4px"
              minW="4px"
              borderRadius="full"
            />
            <Skeleton
              h="4px"
              startColor={boxBg6}
              endColor={hover}
              w="4px"
              minH="4px"
              minW="4px"
              borderRadius="full"
            />
            <Skeleton
              h="4px"
              startColor={boxBg6}
              endColor={hover}
              w="4px"
              minH="4px"
              minW="4px"
              borderRadius="full"
            />
          </Flex>
        </Flex>
      </Td>
    </Tr>
  );
};
