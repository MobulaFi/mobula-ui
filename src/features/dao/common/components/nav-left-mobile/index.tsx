import {Box, Button, Flex, Image, Text} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {useThemeValue} from "../../../../../../utils/chakra";
import {TextLandingSmall} from "../../../../../UI/Text";
import {useColors} from "../../../../../common/utils/color-mode";
import {useMember} from "../../hooks/use-members";
import {usePathnameInfo} from "../../hooks/use-pathname-info";
import {ButtonOutlined} from "../button-outlined";

export const LeftNavigationMobile = ({page}) => {
  const theme = useThemeValue();
  const [selectedSection, setSelectedSection] = useState("");
  const router = useRouter();
  const infos = usePathnameInfo(page);
  const membersQuantity = useMember();
  const {text80, text40, text60, text10} = useColors();

  const getActiveButtonFromPath = () => {
    if (router.pathname.includes("/protocol/overview"))
      setSelectedSection("Overview");
    if (router.pathname.includes("/protocol/sort"))
      setSelectedSection("First Sort");
    if (router.pathname.includes("/protocol/validation"))
      setSelectedSection("Final Validation");
    if (router.pathname.includes("/protocol/metrics"))
      setSelectedSection("Sorts");
    if (router.pathname.includes("/protocol/pool"))
      setSelectedSection("Pending Pool");
    if (router.pathname.includes("/governance/new"))
      setSelectedSection("New Proposal");
    if (router.pathname.includes("/governance/overview"))
      setSelectedSection("Overview");
    if (router.pathname.includes("/governance/staking"))
      setSelectedSection("Staking");
    if (router.pathname.includes("/governance/metrics"))
      setSelectedSection("Stats");
  };

  useEffect(() => {
    getActiveButtonFromPath();
  }, []);

  return (
    <Flex direction="column" w="100%" mt={["0px", "0px", "28px", "28px"]}>
      <Box mb="20px" ml="10px">
        <Text fontSize="20px" fontWeight="600" color={text80}>
          {" "}
          Mobula DAOs
        </Text>
        <Flex align="center" mt="20px">
          <Button
            fontSize="13px"
            fontWeight="500"
            _focus={{boxShadow: "none"}}
            onClick={() => router.push("/dao/governance/overview")}
            color={router.pathname.includes("governance") ? text80 : text40}
          >
            Governance
          </Button>
          <Box h="16px" w="2px" bg={text10} mx="10px" />
          <Button
            fontSize="13px"
            fontWeight="500"
            color={router.pathname.includes("protocol") ? text80 : text40}
            _focus={{boxShadow: "none"}}
            onClick={() => router.push("/dao/protocol/overview")}
          >
            Protocol
          </Button>
        </Flex>
      </Box>
      <Flex align="center" ml="10px">
        <Image
          src={
            router.pathname.includes("governance")
              ? "/header/new/governance.svg"
              : "/header/new/protocol.svg"
          }
          boxSize="50px"
          mr="15px"
        />
        <Box mr="20px">
          <Text fontSize="22px" color={text80} fontWeight="400">
            {infos.title}
          </Text>
          <Text color={text60} fontSize="15px" fontWeight="400">
            {membersQuantity} {infos.subtitle}
          </Text>
        </Box>
        <ButtonOutlined
          border="1px solid var(--chakra-colors-blue)"
          w="90px"
          h="25px"
          fontSize={["12px", "12px", "13px"]}
          fontWeight="400"
          color={text80}
          onClick={() => {
            router.push(`/discover/${page}`);
          }}
        >
          Join
        </ButtonOutlined>
      </Flex>
      <Flex
        align="center"
        pb="0px"
        mt="10px"
        overflowX="scroll"
        position="relative"
        className="scroll"
        borderBottom={`1px solid ${theme.border} !important`}
      >
        {infos.list.map(info => {
          const isActive = selectedSection === info?.name;
          return (
            <Box key={info.id}>
              <Button
                py="10px"
                pb="20px"
                px="15px"
                borderRadius="0px"
                borderBottom={
                  isActive ? "1px solid var(--chakra-colors-blue)" : "none"
                }
                onClick={() => {
                  if (info.url === "validation")
                    router.push("/dao/protocol/validation");
                  else if (info.url === "sort")
                    router.push("/dao/protocol/sort");
                  else router.push(`/dao${info.url}`);
                }}
              >
                <TextLandingSmall color={isActive ? text80 : text40}>
                  {info?.name}
                </TextLandingSmall>
              </Button>
            </Box>
          );
        })}
      </Flex>
    </Flex>
  );
};
