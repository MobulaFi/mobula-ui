import {ExternalLinkIcon} from "@chakra-ui/icons";
import {
  Flex,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Text,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {RiTeamFill} from "react-icons/ri";
import {Tds} from "../../../../../../../UI/Tds";
import {TextSmall} from "../../../../../../../UI/Text";
import {Ths} from "../../../../../../../UI/Ths";
import {NextChakraLink} from "../../../../../../../common/components/links";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BoxContainer} from "../../../../../common/components/box-container";

export const TeamMembers = ({token}) => {
  const {borders, text40} = useColors();

  const getDisplay = () => {
    if (token?.team?.length > 0) return "flex";
    return "none";
  };

  return (
    <BoxContainer
      mb="20px"
      position="relative"
      transition="all 300ms ease-in-out"
      p={["10px", "10px", "15px", "15px 20px"]}
      borderRadius={["0px", "16px"]}
      display={getDisplay()}
    >
      <Flex align="center">
        <Icon as={RiTeamFill} color="blue" />
        <Text fontSize={["14px", "14px", "16px", "18px"]} ml="10px">
          Team members
        </Text>
      </Flex>
      <TableContainer
        mt={["10px", "10px", "15px", "20px"]}
        overflowX="scroll"
        className="scroll"
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Ths py="15px" px="10px" borderTop={borders}>
                Role
              </Ths>
              <Ths py="15px" px="10px" borderTop={borders}>
                Name
              </Ths>
              <Ths py="15px" px="10px" borderTop={borders}>
                Telegram
              </Ths>
              <Ths py="15px" px="10px" borderTop={borders}>
                Twitter
              </Ths>
              <Ths py="15px" px="10px" borderTop={borders}>
                Linkedin
              </Ths>
            </Tr>
          </Thead>
          <Tbody>
            {token?.team?.map(member => {
              console.log(member.linkedin.split("/in/")[1]);
              console.log(member.twitter.split("twitter.com/")[1]);
              return (
                <Tr key={member}>
                  <Tds px="10px" py="15px">
                    <Flex align="center">
                      <TextSmall>{member.role}</TextSmall>
                    </Flex>
                  </Tds>
                  <Tds px="10px" py="15px">
                    {member.name}
                  </Tds>{" "}
                  <Tds px="10px" py="15px">
                    <NextChakraLink
                      href={member.telegram}
                      isExternal
                      color={member.telegram ? "blue" : text40}
                    >
                      {member.telegram?.split("t.me/")[1] || "--"}
                      {member.telegram ? (
                        <ExternalLinkIcon color={text40} ml="7.5px" mb="2px" />
                      ) : null}
                    </NextChakraLink>
                  </Tds>
                  <Tds px="10px" py="15px">
                    <NextChakraLink
                      href={member.twitter}
                      isExternal
                      color={member.twitter ? "blue" : text40}
                    >
                      {member.twitter.split("twitter.com/")[1] || "--"}
                      {member.twitter ? (
                        <ExternalLinkIcon color={text40} ml="7.5px" mb="2px" />
                      ) : null}
                    </NextChakraLink>
                  </Tds>
                  <Tds px="10px" py="15px">
                    <NextChakraLink
                      href={member.linkedin}
                      isExternal
                      color={member.linkedin ? "blue" : text40}
                    >
                      {member.linkedin?.split("/in/")[1] || "--"}
                      {member.linkedin ? (
                        <ExternalLinkIcon color={text40} ml="7.5px" mb="2px" />
                      ) : null}
                    </NextChakraLink>
                  </Tds>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </BoxContainer>
  );
};
