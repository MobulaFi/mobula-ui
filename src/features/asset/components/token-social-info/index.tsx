import {ExternalLinkIcon, LinkIcon} from "@chakra-ui/icons";
import {Button, Flex, Icon, Image} from "@chakra-ui/react";
import {blockchainsContent} from "mobula-lite/lib/chains/constants";
import {useContext} from "react";
import {BsLink45Deg, BsShieldCheck} from "react-icons/bs";
import {FaRegUser} from "react-icons/fa";
import {FiExternalLink} from "react-icons/fi";
import {SlMagnifier} from "react-icons/sl";
import {VscGlobe} from "react-icons/vsc";
import {useNetwork} from "wagmi";

import {TextSmall} from "../../../../../UI/Text";
import {NextChakraLink} from "../../../../../common/components/links";
import {useColors} from "../../../../../common/utils/color-mode";
import {addressSlicer} from "../../../../../common/utils/user";
import {BaseAssetContext} from "../../context-manager";
import {PopOverLinesStyle, mainButtonStyle} from "../../style";
import {openInNewTab} from "../../utils";
import {Contracts} from "../contracts";
import {CustomPopOver} from "../ui/popover";

export const TokenSocialsInfo = () => {
  const {baseAsset, setShowPopupSocialMobile, setShowSeeAllTags} =
    useContext(BaseAssetContext);
  const {
    text80,
    boxBg6,
    hover,
    boxBg3,
    borders,
    bordersActive,
    text40,
    text60,
    tags,
    borders2x,
  } = useColors();

  const socials = [
    baseAsset.twitter
      ? {
          name: "Twitter",
          logo: "/social/twitter.png",
          url: baseAsset?.twitter,
          username: baseAsset?.twitter.split("https://twitter.com/")[1],
        }
      : null,
    baseAsset.chat
      ? {
          name: "Telegram",
          logo: "/social/telegram.png",
          url: baseAsset?.chat,
          username: baseAsset?.chat.split("https://t.me/")[1],
        }
      : null,
    baseAsset.discord
      ? {
          name: "Discord",
          logo: "/social/discord.png",
          url: baseAsset?.discord,
        }
      : null,
  ];

  const {chain} = useNetwork();

  function reorganizeArrays(currentChain, chains, contracts) {
    let newChains: string[];
    let newContracts: string[];
    if (currentChain) {
      const currentIndex = chains.indexOf(currentChain);
      newChains = chains;
      newContracts = contracts;
      if (currentIndex === -1) return {newChains, newContracts};
      newChains = [
        currentChain,
        ...chains.filter(blockchain => blockchain !== currentChain),
      ];
      newContracts = [
        contracts[currentIndex],
        ...contracts.slice(0, currentIndex),
        ...contracts.slice(currentIndex + 1),
      ];
      return {newChains, newContracts};
    }
    newChains = chains;
    newContracts = contracts;
    return {newChains, newContracts};
  }

  const {newChains, newContracts} = reorganizeArrays(
    chain?.name,
    baseAsset?.blockchains,
    baseAsset?.contracts,
  );
  const links = [
    baseAsset?.twitter || null,
    baseAsset?.chat || null,
    baseAsset?.discord || null,
    baseAsset?.white_paper || null,
    baseAsset?.telegram || null,
    baseAsset?.audit || null,
    baseAsset?.kyc || null,
  ];

  return (
    <Flex
      direction="column"
      w={["100%", "100%", "100%", "40%"]}
      mt={["0px", "0px", "0px", "0px"]}
    >
      <Flex
        align={["center", "center", "center", "flex-start"]}
        justify="space-between"
        direction={["row", "row", "row", "column"]}
      >
        <Flex direction="column" w="100%">
          {baseAsset.tags?.length > 0 ? (
            <TextSmall
              color={text40}
              display={["none", "none", "none", "flex"]}
            >
              Tags
            </TextSmall>
          ) : null}
          <Flex align="center" mt={["0px", "0px", "0px", "10px"]} w="100%">
            <Flex justify="space-between" align="center" w="100%">
              {baseAsset.tags?.length > 0 ? (
                <Flex align="center" wrap="wrap">
                  {baseAsset.tags.map((tag, i) => {
                    if (i < 3)
                      return (
                        <Flex
                          display={["none", "none", "none", "flex"]}
                          h="24px"
                          mt="10px"
                          px="10px"
                          mr="7.5px"
                          borderRadius="8px"
                          align="center"
                          justify="center"
                          bg={tags}
                        >
                          <TextSmall
                            h="100%"
                            mt={["4px", "6px", "5.2px", "3px"]}
                            mb={["0px", "0px", "0px", "2px"]}
                            color={text80}
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                          >
                            {tag}
                          </TextSmall>
                        </Flex>
                      );
                    return null;
                  })}

                  {baseAsset?.tags.length <= 3 ? (
                    <Flex
                      display={["flex", "flex", "flex", "none"]}
                      h="24px"
                      mt="10px"
                      px="10px"
                      mr="7.5px"
                      borderRadius="8px"
                      align="center"
                      justify="center"
                      bg={tags}
                    >
                      <TextSmall
                        h="100%"
                        mt={["4px", "6px", "5.2px", "3px"]}
                        mb={["0px", "0px", "0px", "2px"]}
                        color={text80}
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {baseAsset.tags[0].length > 14
                          ? `${baseAsset.tags[0].slice(0, 14)}...`
                          : baseAsset.tags[0]}
                      </TextSmall>
                    </Flex>
                  ) : null}
                  {baseAsset?.tags.length > 3 ? (
                    <Button
                      h="24px"
                      mt="10px"
                      px="8px"
                      mr="7.5px"
                      borderRadius="8px"
                      bg={boxBg6}
                      border={borders}
                      _hover={{
                        border: bordersActive,
                        bg: hover,
                      }}
                      onClick={() => setShowSeeAllTags(true)}
                    >
                      <TextSmall display={["none", "flex"]} color={text60}>
                        See all
                      </TextSmall>
                      <TextSmall display={["flex", "none"]} color={text60}>
                        Tags
                      </TextSmall>
                    </Button>
                  ) : null}
                </Flex>
              ) : null}
            </Flex>
          </Flex>
        </Flex>

        <Flex
          align="center"
          mt={["15px", "15px", "15px", "20px"]}
          wrap={["nowrap", "nowrap", "nowrap", "wrap"]}
        >
          <Flex display={["none", "none", "none", "flex"]}>
            {baseAsset.website ? (
              <Button
                sx={mainButtonStyle}
                border={borders}
                bg={boxBg6}
                _hover={{bg: hover, border: bordersActive}}
                color={text80}
                onClick={() => openInNewTab(baseAsset.website)}
                mb="5px"
              >
                <Icon
                  as={BsLink45Deg}
                  fontSize="16px"
                  color={text80}
                  mr="5px"
                />
                Website
                <Icon
                  as={FiExternalLink}
                  ml="5px"
                  fontSize="14px"
                  color={text60}
                />
              </Button>
            ) : null}{" "}
          </Flex>
          {/* MOBILE START */}

          <Flex
            w="fit-content"
            display={[
              newContracts?.length > 0 ? "flex" : "none",
              newContracts?.length > 0 ? "flex" : "none",
              newContracts?.length > 0 ? "flex" : "none",
              "none",
            ]}
          >
            <CustomPopOver
              title={addressSlicer(newContracts?.[0])}
              logo={
                blockchainsContent[newChains?.[0]]?.logo ||
                `/logo/${newChains[0]?.toLowerCase().split(" ")[0]}.png`
              }
              isMobile
            >
              {newChains?.map(
                (blockchain, index: number) =>
                  blockchain && (
                    <Flex
                      color={text80}
                      mt={index > 0 ? "10px" : "0px"}
                      key={(newContracts?.[index] || 0) + blockchain}
                    >
                      <Contracts
                        contract={newContracts?.[index]}
                        blockchain={blockchain}
                      />
                    </Flex>
                  ),
              )}
            </CustomPopOver>
          </Flex>

          <Flex display={["flex", "flex", "flex", "none"]}>
            {baseAsset.website ? (
              <Button
                sx={mainButtonStyle}
                bg={boxBg6}
                border={borders}
                color={text80}
                _hover={{
                  border: bordersActive,
                }}
                onClick={() => openInNewTab(baseAsset.website)}
                mb="5px"
                px="5px !important"
              >
                <Icon as={VscGlobe} color={text80} fontSize="16px" />
              </Button>
            ) : null}{" "}
          </Flex>
          <Button
            display={["flex", "flex", "flex", "none"]}
            sx={mainButtonStyle}
            bg={boxBg6}
            border={borders}
            color={text80}
            _hover={{
              border: bordersActive,
            }}
            mb="5px"
            onClick={() => setShowPopupSocialMobile(true)}
          >
            <LinkIcon mr="7.5px" ml="2px" />{" "}
            <TextSmall mt="1px" mr="2px">
              {links.filter(entry => entry !== null).length > 0
                ? `+ ${links.filter(entry => entry !== null).length}`
                : ""}
            </TextSmall>
          </Button>
          {/* MOBILE END */}
          <Flex
            display={[
              "none",
              "none",
              "none",
              newContracts?.length > 0 ? "flex" : "none",
            ]}
          >
            <CustomPopOver title="Contracts" icon={SlMagnifier}>
              {newChains?.map(
                (blockchain, index: number) =>
                  blockchain && (
                    <Flex
                      color={text80}
                      mt={index > 0 ? "10px" : "0px"}
                      key={(newContracts?.[index] || 0) + blockchain}
                    >
                      <Contracts
                        contract={newContracts?.[index]}
                        blockchain={blockchain}
                      />
                    </Flex>
                  ),
              )}
            </CustomPopOver>{" "}
          </Flex>
          <Flex
            display={[
              "none",
              "none",
              "none",
              baseAsset?.twitter ||
              baseAsset?.discord ||
              baseAsset?.telegram ||
              baseAsset?.chat
                ? "flex"
                : "none",
            ]}
          >
            {socials.filter(entry => entry !== null).length > 0 ? (
              <CustomPopOver title="Community" icon={FaRegUser}>
                {socials
                  .filter(entry => entry !== null)
                  ?.map((entry, i) => {
                    if (entry) {
                      return (
                        <NextChakraLink
                          isExternal
                          href={entry.url}
                          target="_blank"
                          rel="norefferer"
                          mb="4px"
                        >
                          <Flex
                            mb={
                              i !== 0 || i !== socials.length ? "0px" : "10px"
                            }
                            key={entry.url}
                            border={borders}
                            bg={boxBg6}
                            _hover={{bg: hover, border: bordersActive}}
                            mt={i !== 0 ? "7.5px" : "0px"}
                            w="100%"
                            justify="space-between"
                            px="10px"
                            borderRadius="8px"
                            h="32px"
                          >
                            <Flex align="center" mr="15px">
                              <Image
                                src={entry.logo}
                                w="14px"
                                alt={`${entry.name} logo`}
                                mr="5px"
                              />
                              <TextSmall mb="2px">{entry.name}</TextSmall>
                            </Flex>
                            <Flex align="center">
                              <TextSmall mb="2px">
                                {entry.username ? entry.username : "N/A"}
                              </TextSmall>

                              <ExternalLinkIcon ml="10px" color={text40} />
                            </Flex>
                          </Flex>{" "}
                        </NextChakraLink>
                      );
                    }
                    return null;
                  })}
              </CustomPopOver>
            ) : null}{" "}
          </Flex>
          <Flex
            display={[
              "none",
              "none",
              "none",
              baseAsset?.audit || baseAsset?.kyc,
            ]}
          >
            {baseAsset?.audit || baseAsset?.kyc ? (
              <CustomPopOver title="Audits" icon={BsShieldCheck}>
                {baseAsset?.audit ? (
                  <Flex {...PopOverLinesStyle}>
                    <Flex align="center" mr="15px">
                      <TextSmall mb="2px">Audit</TextSmall>
                      <TextSmall
                        maxW="200px"
                        whiteSpace="nowrap"
                        textOverflow="ellipsis"
                        overflow="hidden"
                        mb="2px"
                        ml="10px"
                      >
                        {baseAsset.audit}
                      </TextSmall>
                    </Flex>
                    <Flex align="center">
                      <NextChakraLink
                        isExternal
                        href={baseAsset.audit}
                        target="_blank"
                        rel="norefferer"
                        mb="4px"
                      >
                        <ExternalLinkIcon ml="10px" color={text40} />
                      </NextChakraLink>
                    </Flex>
                  </Flex>
                ) : null}
                {baseAsset.kyc ? (
                  <Flex
                    {...PopOverLinesStyle}
                    bg={boxBg3}
                    border={borders}
                    mt="7.5px"
                    mb="10px"
                  >
                    <Flex align="center" mr="15px">
                      <TextSmall mb="2px">KYC</TextSmall>
                      <TextSmall
                        maxW="200px"
                        whiteSpace="nowrap"
                        textOverflow="ellipsis"
                        overflow="hidden"
                        mb="2px"
                        ml="10px"
                      >
                        {baseAsset.kyc}
                      </TextSmall>
                    </Flex>
                    <Flex align="center">
                      <NextChakraLink
                        isExternal
                        href={baseAsset.kyc}
                        target="_blank"
                        rel="norefferer"
                        mb="4px"
                      >
                        <ExternalLinkIcon ml="10px" color={text40} />
                      </NextChakraLink>
                    </Flex>
                  </Flex>
                ) : null}
              </CustomPopOver>
            ) : null}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
