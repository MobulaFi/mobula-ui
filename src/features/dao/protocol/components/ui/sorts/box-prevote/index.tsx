import {
  CheckIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  LinkIcon,
  Search2Icon,
} from "@chakra-ui/icons";
import {
  Button,
  Collapse,
  Flex,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import {blockchainsIdContent} from "mobula-lite/lib/chains/constants";
import {useRouter} from "next/router";
import React, {useContext, useEffect, useState} from "react";
import {User} from "react-feather";
import {BsCodeSlash} from "react-icons/bs";
import {createPublicClient, formatEther, getContract, http} from "viem";
import {polygon} from "viem/chains";
import {PROTOCOL_ADDRESS} from "../../../../../../../../utils/constants";
import {getUrlFromName} from "../../../../../../../../utils/helpers/formaters";
import {
  TextLandingMedium,
  TextMedium,
  TextSmall,
} from "../../../../../../../UI/Text";
import {NextChakraLink} from "../../../../../../../common/components/links";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {Contracts} from "../../../../../../Assets/AssetV2/components/contracts";
import {BoxContainer} from "../../../../../common/components/box-container";
import {PROTOCOL_ABI} from "../../../../constants/abi";
import {SortContext} from "../../../../context-manager";
import {TokenDivs} from "../../../../models";
import {getPricing} from "../../../../utils";
import {CommunityPopup} from "../popup-community";
import styles from "./Prevote.module.scss";

const RenderContent = ({token, handleToggle, show}) => {
  const {boxBg6, text80, hover} = useColors();
  if (!token) {
    return (
      <Skeleton
        h={["14px", "14px", "15px", "16px"]}
        startColor={boxBg6}
        endColor={hover}
        mr="10px"
        borderRadius="6px"
        w="80px"
        mt="15px"
      />
    );
  }
  if (token?.description && token.description?.length < 190) {
    return null;
  }
  return (
    <Button color={text80} onClick={handleToggle} mt="10px">
      Show {show ? "Less" : "More"}
    </Button>
  );
};

export const BoxPreVote = ({
  token,
  isFakeToken,
}: {
  token: Partial<TokenDivs>;
  isFakeToken?: boolean;
}) => {
  const [showRawData, setShowRawData] = useState(false);
  const {
    setDisplayedToken,
    displayedToken,
    setDisplayedPool,
    displayedPool,
    isPendingPool,
  } = useContext(SortContext);
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);
  const router = useRouter();
  const {
    boxBg3,
    boxBg6,
    text80,
    text60,
    bordersActive,
    borders,
    text40,
    hover,
    tags,
    borders2x,
  } = useColors();

  const buttonPopover = {
    bg: boxBg6,
    border: borders,
    color: text80,
    fontWeight: "400",
    borderRadius: "8px",
    fontSize: "13px",
    h: "30px",
    transition: "all 250ms ease-in-out",
    px: "10px",
    _hover: {
      border: bordersActive,
      bg: hover,
    },
    mb: "10px",
  };

  const calculateValue = (): number => {
    if (!displayedToken && !isFakeToken) return 60;
    if (isFakeToken) return 20;
    return 40;
  };
  const [tokenPerVote, setTokenPerVote] = useState(0);
  const descriptionHeight = calculateValue();

  console.log("token", tokenPerVote);

  const getMOBLForVote = async () => {
    const client = createPublicClient({
      chain: polygon,
      transport: http(blockchainsIdContent[137].rpcs[0]),
    });

    const contract = getContract({
      abi: PROTOCOL_ABI,
      address: PROTOCOL_ADDRESS as never,
      publicClient: client,
    });

    const rawTokensPerVote = (await contract.read.tokensPerVote()) as bigint;
    const tokensPerVote = parseInt(formatEther(rawTokensPerVote), 10);
    setTokenPerVote(tokensPerVote);
  };

  useEffect(() => {
    getMOBLForVote();
  }, []);

  const getClassNameFromRatio = () => {
    if (Number(token.coeff) / 1000 >= 10) return styles.best;
    if (Number(token.coeff) / 1000 >= 3 && Number(token.coeff) / 1000 < 10)
      return styles.good;
    return "";
  };

  const getTypeOfToken = () => {
    switch (token?.type) {
      case "token":
        return " is a token";
      case "nft":
        return " is an NFT";
      case "coin":
        return " has its own blockchain";
      default:
        return "";
    }
  };

  const getPercentageFromCoeff = price => {
    if (price) return (price * 100) / 30;
    return 0;
  };

  if (
    router.query.sort ||
    router.query.validation ||
    (router.query.pool && token?.name)
  ) {
    if (
      !isPendingPool &&
      router.query.sort === getUrlFromName(token?.name) &&
      displayedToken !== token.name
    )
      setDisplayedToken(token.name);
    if (
      !isPendingPool &&
      router.query.validation === getUrlFromName(token?.name) &&
      displayedToken !== token.name
    )
      setDisplayedToken(token.name);
    if (
      isPendingPool &&
      router.query.pool === getUrlFromName(token?.name) &&
      displayedPool !== token.name
    ) {
      setDisplayedPool(token.name);
    }
  }

  return (
    <BoxContainer
      mb="20px"
      position="relative"
      minHeight={["auto", "auto", "210px"]}
      transition="all 300ms ease-in-out"
      p={["15px", "15px", "15px", "15px 20px"]}
      borderRadius={["0px", "16px"]}
      cursor={token?.alreadyVoted ? "not-allowed" : "pointer"}
      onClick={() => {
        if (token?.name !== "Come back later!" && !token.alreadyVoted) {
          if (!isPendingPool) {
            if (router.pathname.includes("/sort"))
              router.push(`/dao/protocol/sort/${getUrlFromName(token.name)}`);
            if (router.pathname.includes("/validation"))
              router.push(
                `/dao/protocol/validation/${getUrlFromName(token.name)}`,
              );
          } else {
            router.push(`/dao/protocol/pool/${getUrlFromName(token.name)}`);
          }
        }
      }}
    >
      <Flex
        justify="space-between"
        w="100%"
        mb={["10px", "10px", "20px"]}
        align={[isPendingPool ? "start" : "center", "center"]}
        direction={[isPendingPool ? "column" : "row", "row"]}
      >
        <Flex align="center">
          {token ? (
            <Image
              src={token?.image?.logo || token?.logo}
              mr="10px"
              boxSize="22px"
              borderRadius="full"
            />
          ) : (
            <Skeleton
              startColor={hover}
              endColor={boxBg6}
              mr="10px"
              boxSize="22px"
              borderRadius="full"
            />
          )}
          {token ? (
            <TextMedium>{token?.name}</TextMedium>
          ) : (
            <Skeleton
              h={["16px", "16px", "17px", "18px"]}
              startColor={hover}
              endColor={boxBg6}
              mr="10px"
              borderRadius="6px"
              w="120px"
            />
          )}
          {token ? (
            <TextMedium color={text40} ml="10px">
              {token?.symbol}
            </TextMedium>
          ) : (
            <Skeleton
              h={["16px", "16px", "17px", "18px"]}
              startColor={hover}
              endColor={boxBg6}
              mr="10px"
              borderRadius="6px"
              w="60px"
            />
          )}
          {token?.coeff ? (
            <Flex align="center" ml="10px" borderLeft={borders2x} pl="10px">
              <Image src="/mobula/coinMobula.png" boxSize="16px" />
              <TextMedium ml="5px">
                {token?.coeff ? Number(token.coeff) / 1000 : 0}
              </TextMedium>
            </Flex>
          ) : null}
        </Flex>
        {token?.name !== "Come back later!" &&
        token.coeff &&
        !isPendingPool &&
        token ? (
          <Flex display={["none", "flex"]}>
            <TextMedium borderLeft={borders2x} pl="10px">
              {`${token.isListing ? "Listing" : "Edit"} request`}
            </TextMedium>
          </Flex>
        ) : null}
        {isPendingPool && token?.name !== "Come back later!" ? (
          <Flex
            align="center"
            justify="end"
            w="250px"
            whiteSpace="nowrap"
            mt={["10px", "0px"]}
          >
            {getPricing(token?.coeff) < 30
              ? `$${30 - getPricing(token?.coeff)} Left`
              : "Full"}
            <Flex
              h="8px"
              borderRadius="8px"
              bg={hover}
              mt="2px"
              w="100%"
              ml="10px"
            >
              <Flex
                w={`${getPercentageFromCoeff(getPricing(token?.coeff))}%`}
                borderRadius="8px"
                h="100%"
                bg="blue"
              />
            </Flex>
          </Flex>
        ) : null}
      </Flex>
      {router.query.sort === getUrlFromName(token?.name) ||
      router.query.validation === getUrlFromName(token?.name) ||
      router.query.pool === getUrlFromName(token?.name) ? (
        <Flex align="center" wrap="wrap" w="100%">
          {token?.links?.website ? (
            <Flex
              align="center"
              mr="10px"
              maxW="200px"
              justify="center"
              {...buttonPopover}
              bg={boxBg6}
            >
              <NextChakraLink
                href={token?.links.website}
                isExternal
                _hover={{color: text80}}
                color={text80}
              >
                <Flex align="center">
                  <LinkIcon mr="7.5px" mb="1px" color={text80} />
                  <TextSmall
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    overflowX="hidden"
                    maxW="130px"
                    mb="1px"
                  >
                    {token?.links.website}
                  </TextSmall>{" "}
                </Flex>
              </NextChakraLink>
              <ExternalLinkIcon
                ml="7.5px"
                fontSize="13px"
                mb="1px"
                color={text40}
              />
            </Flex>
          ) : null}
          {token?.links?.twitter ||
          token?.links?.telegram ||
          token?.links?.discord ? (
            <Popover>
              <PopoverTrigger>
                <Button mr="10px" sx={buttonPopover} bg={boxBg6}>
                  <Icon as={User} fontSize="13px" mb="1px" mr="5px" />
                  Community
                  <ChevronDownIcon fontSize="15px" ml="5px" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                p="0px"
                w="fit-content"
                bg={boxBg3}
                border={borders}
                borderRadius="8px"
                boxShadow="1px 2px 13px 4px rgba(0,0,0,0.1)"
              >
                <PopoverBody w="100%" p="10px">
                  <CommunityPopup token={token} />
                </PopoverBody>
              </PopoverContent>
            </Popover>
          ) : null}
          {token?.contracts ? (
            <Popover>
              <PopoverTrigger>
                <Button mr="10px" sx={buttonPopover} bg={boxBg6}>
                  <Search2Icon fontSize="13px" mb="1px" mr="5px" />
                  Contracts
                  <ChevronDownIcon fontSize="15px" ml="5px" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                p="0px"
                w="fit-content"
                bg={boxBg3}
                border={borders}
                borderRadius="8px"
                boxShadow="1px 2px 13px 4px rgba(0,0,0,0.1)"
              >
                <PopoverBody w="100%" p="10px">
                  {token.contracts?.map(
                    (contract, index: number) =>
                      contract.blockchain && (
                        <Flex
                          color={text80}
                          mt={index > 0 ? "10px" : "0px"}
                          key={contract.blockchain}
                        >
                          <Contracts
                            contract={contract.address}
                            blockchain={contract.blockchain}
                          />
                        </Flex>
                      ),
                  )}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          ) : null}
          <Button
            sx={buttonPopover}
            mr="10px"
            color={text80}
            position="relative"
            onClick={() => setShowRawData(prev => !prev)}
          >
            <Icon as={BsCodeSlash} fontSize="15px" mr="5px" />
            Raw Data
          </Button>
          <Modal
            motionPreset="none"
            isOpen={showRawData}
            onClose={() => setShowRawData(false)}
          >
            <ModalOverlay />
            <ModalContent
              bg={boxBg3}
              w={["90vw", "85vw", "90vw"]}
              p="20px"
              zIndex={100}
              maxW="auto"
              display={showRawData ? "flex" : "none"}
              borderRadius="16px"
              border={borders}
              boxShadow="none"
              h="fit-content"
            >
              <ModalHeader px="15px" pb="20px" pt="0px" borderBottom={borders}>
                <TextLandingMedium color={text80}>Raw Data</TextLandingMedium>
              </ModalHeader>
              <ModalCloseButton color={text80} />
              <ModalBody p="0px" mt="10px">
                <Flex w="100%" color={text80} wrap="wrap" overflowY="hidden">
                  {token ? (
                    <pre
                      style={{
                        width: "100%",
                        wordWrap: "break-word",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {JSON.stringify(
                        token,
                        (_, v) => {
                          if (typeof v === "bigint") {
                            return v.toString();
                          }
                          return v;
                        },
                        2,
                      )}
                    </pre>
                  ) : null}
                </Flex>
              </ModalBody>
            </ModalContent>
          </Modal>
          {token?.links?.audits.length > 0 ? (
            <Popover>
              <PopoverTrigger>
                <Button mr="10px" sx={buttonPopover} bg={boxBg6}>
                  Audit
                  <ChevronDownIcon fontSize="15px" ml="5px" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                w="fit-content"
                bg={boxBg3}
                border={borders}
                borderRadius="8px"
                boxShadow="1px 2px 13px 4px rgba(0,0,0,0.1)"
                p="10px"
              >
                <PopoverBody w="100%" p="0px">
                  {token.links?.audits
                    ?.filter(entry => entry)
                    .map((audit, index: number) => (
                      <Flex
                        color={text80}
                        mt={index > 0 ? "10px" : "0px"}
                        key={audit}
                        border={borders}
                        bg={boxBg6}
                        borderRadius="8px"
                        px="10px"
                        _hover={{bg: hover, border: bordersActive}}
                        transition="all 250ms ease-in-out"
                        py="4px"
                      >
                        <NextChakraLink
                          href={audit}
                          isExternal
                          _hover={{color: text80}}
                          color={text80}
                          fontSize="13px"
                        >
                          {`${audit.slice(0, 20)}...`}
                          <ExternalLinkIcon
                            ml="7.5px"
                            fontSize="13px"
                            mb="1px"
                            color={text60}
                          />
                        </NextChakraLink>
                      </Flex>
                    ))}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          ) : null}
          {token?.links?.kycs.length > 0 ? (
            <Popover>
              <PopoverTrigger>
                <Button mr="10px" sx={buttonPopover} bg={boxBg6}>
                  <Search2Icon fontSize="13px" mb="1px" mr="5px" />
                  Kyc
                  <ChevronDownIcon fontSize="15px" ml="5px" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                w="fit-content"
                bg={boxBg3}
                border={borders}
                borderRadius="8px"
                boxShadow="1px 2px 13px 4px rgba(0,0,0,0.1)"
                p="10px"
              >
                <PopoverBody w="100%" p="0px">
                  {token.links?.kycs
                    ?.filter(entry => entry)
                    .map((kyc, index: number) => (
                      <Flex
                        color={text80}
                        mt={index > 0 ? "10px" : "0px"}
                        key={kyc}
                        border={borders}
                        bg={boxBg6}
                        borderRadius="8px"
                        px="10px"
                        _hover={{bg: hover, border: bordersActive}}
                        transition="all 250ms ease-in-out"
                        py="4px"
                      >
                        <NextChakraLink
                          href={kyc}
                          isExternal
                          _hover={{color: text80}}
                          color={text80}
                          fontSize="13px"
                        >
                          {`${kyc.slice(0, 20)}...`}
                          <ExternalLinkIcon
                            ml="7.5px"
                            fontSize="13px"
                            mb="1px"
                            color={text60}
                          />
                        </NextChakraLink>
                      </Flex>
                    ))}
                </PopoverBody>
              </PopoverContent>
            </Popover>
          ) : null}
        </Flex>
      ) : null}
      <Text
        fontSize="14px"
        fontWeight="400"
        transition="all 300ms ease-in-out"
        maxWidth="600px"
        mt={!displayedToken ? "10px" : "15px"}
        maxHeight={displayedToken ? "auto" : "300px"}
        color={text60}
        pb={["10px", "10px", "0px"]}
      >
        <Collapse startingHeight={descriptionHeight} in={show}>
          {token?.description}
        </Collapse>
        <RenderContent token={token} handleToggle={handleToggle} show={show} />
      </Text>
      {displayedToken === token?.name || displayedPool === token?.name ? (
        <Flex w="100%" wrap="wrap" mt={["10px", "20px"]}>
          {token?.categories?.map(entry => (
            <Flex
              h="24px"
              px="10px"
              mr="10px"
              borderRadius="8px"
              align="center"
              justify="center"
              w="fit-content"
              mb={["0px", "0px", "0px", "10px"]}
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
                {entry}
              </TextSmall>
            </Flex>
          ))}
        </Flex>
      ) : null}
      {isFakeToken && displayedToken !== token.name ? (
        <Text fontSize="14px" fontWeight="400" color={text40}>
          Earn up to 100 $MOBL for pushing token creator to list their asset on
          Mobula! Learn more about it at{" "}
          <NextChakraLink href="https://docs.mobula.fi" color={text80}>
            docs.mobula.fi
          </NextChakraLink>
        </Text>
      ) : null}
      {token?.alreadyVoted ? (
        <Flex
          color="green"
          mt="auto"
          px="12px"
          borderRadius="8px"
          w="fit-content"
          bg={boxBg6}
          border={borders}
          h="28px"
          align="center"
        >
          <CheckIcon />
          <TextSmall fontWeight="600" color="green" ml="5px">
            Reviewed
          </TextSmall>
        </Flex>
      ) : null}
      {(!token?.alreadyVoted && displayedToken) ||
      (!token?.alreadyVoted && displayedPool) ? (
        <Flex mt="20px" align="center" borderTop={borders} w="100%" pt="10px">
          <TextSmall fontWeight="500" ml="5px">
            {token?.name} {getTypeOfToken()}
          </TextSmall>
          <CheckIcon color="green" ml="10px" />
        </Flex>
      ) : null}
      {!displayedToken ? (
        <Flex
          className={getClassNameFromRatio()}
          w="100%"
          h={["20px", "100%"]}
          position="absolute"
          borderRadius={["0px", "8px"]}
          zIndex="-1"
        />
      ) : null}
    </BoxContainer>
  );
};
