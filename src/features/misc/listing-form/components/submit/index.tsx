import {
  ArrowBackIcon,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  ExternalLinkIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import {
  blockchainsContent,
  blockchainsIdContent,
} from "mobula-lite/lib/chains/constants";
import {useCallback, useContext, useEffect, useState} from "react";
import {useAlert} from "react-alert";
import {BsTwitter} from "react-icons/bs";
import {FiShoppingCart} from "react-icons/fi";
import {erc20ABI, useAccount, useNetwork} from "wagmi";
import {
  readContract,
  switchNetwork,
  waitForTransaction,
  writeContract,
} from "wagmi/actions";
import {
  PROTOCOL_ADDRESS,
  PROTOCOL_BNB_ADDRESS,
  USDC_BNB_ADDRESS,
  USDC_MATIC_ADDRESS,
  USDT_BNB_ADDRESS,
  USDT_MATIC_ADDRESS,
} from "../../../../../../utils/constants";
import {getUrlFromName} from "../../../../../../utils/helpers/formaters";
import {
  TextLandingLarge,
  TextLandingMedium,
  TextLandingSmall,
  TextMedium,
  TextSmall,
} from "../../../../../UI/Text";
import {NextChakraLink} from "../../../../../common/components/links";
import {
  allowanceAbi,
  balanceOfAbi,
} from "../../../../../common/components/popup/fast-track/abi";
import {
  buttonsOption,
  imageOption,
  labelStyles,
  markOption,
} from "../../../../../common/components/popup/fast-track/option";
import {PopupUpdateContext} from "../../../../../common/context-manager/popup";
import {pushData} from "../../../../../common/data/utils";
import {useIPFS} from "../../../../../common/hooks/ipfs";
import {useColors} from "../../../../../common/utils/color-mode";
import {listingAbi, listingAxelarAbi} from "../../constant";
import {ListingContext} from "../../context-manager";
import {cleanFee, cleanVesting} from "../../utils";

export const Submit = ({state}) => {
  const {
    hover,
    text10,
    boxBg3,
    bordersActive,
    boxBg6,
    text80,
    text40,
    borders,
    text60,
    borders2x,
  } = useColors();
  const [pending, setPending] = useState(false);
  const {address} = useAccount();
  const [isPayingNow, setIsPayingNow] = useState(true);
  const [fastTrack, setFastTrack] = useState(100);
  const {colorMode} = useColorMode();
  const [hasPaid, setHasPaid] = useState(false);
  const isDarkMode = colorMode === "light";
  const {chain} = useNetwork();
  const alert = useAlert();
  const {actualPage, setActualPage, isLaunched} = useContext(ListingContext);
  const ipfs = useIPFS();
  const [blockchainSelected, setBlockchainSelected] = useState<string>(
    blockchainsContent.Polygon.name,
  );
  const [balance, setBalance] = useState({
    usdt: {
      owned: 0,
      approved: 0,
    },
    usdc: {owned: 0, approved: 0},
  });
  const {setShowSwitchNetwork, setConnect} = useContext(PopupUpdateContext);

  const getRewardFromTypeOfListing = () => {
    if (fastTrack < 300)
      return {
        name: "Standard",
        rewards: {
          type: "🚀 Standard Listing Request",
          medal: "🥉 Bronze Mobula Listing NFT",
          twitter: false,
        },
      };
    if (fastTrack >= 300 && fastTrack < 1000)
      return {
        name: "Fast",
        rewards: {
          type: "🚀 Fast Listing Request",
          medal: "🥈 Silver Mobula Listing NFT",
          twitter: false,
        },
      };
    return {
      name: "Blazing Fast",
      rewards: {
        type: "🚀 Blazing Fast Listing Request",
        medal: "🥇 Gold Mobula Listing NFT",
        twitter: true,
      },
    };
  };

  const addButtonStyle = {
    w: "120px",
    h: ["30px", "30px", "35px"],
    borderRadius: "8px",
    color: text80,
    fontWeight: "400",
    mt: "10px",
    fontSize: ["12px", "12px", "14px", "16px"],
  };

  useEffect(() => {
    if (chain?.id === blockchainsContent[chain?.name]?.chainId) {
      setBlockchainSelected(chain?.name);
    }
  }, [chain]);

  useEffect(() => {
    if (chain?.id !== 137 && chain?.id !== 56) switchNetwork({chainId: 137});
  }, [chain]);

  const getBalance = useCallback(async () => {
    // TODO
    const getApproval = (contractAddress: string, protocolAddress: string) =>
      readContract({
        address: contractAddress as `0x${string}`,
        abi: allowanceAbi,
        functionName: "allowance",
        args: [address, protocolAddress],
      });

    const getBalances = (contractAddress: string) =>
      readContract({
        address: contractAddress as `0x${string}`,
        abi: balanceOfAbi,
        functionName: "balanceOf",
        args: [address],
      });

    const getDecimals = contract =>
      readContract({
        address: contract as `0x${string}`,
        abi: erc20ABI as never,
        functionName: "decimals" as never,
      });

    let balanceUSDT;
    let balanceUSDC;
    let approvalUSDT;
    let approvalUSDC;
    let decimalsUSDT;
    let decimalsUSDC;

    if (chain?.id === 137) {
      balanceUSDT = await getBalances(USDT_MATIC_ADDRESS);
      balanceUSDC = await getBalances(USDC_MATIC_ADDRESS);
      approvalUSDT = await getApproval(USDT_MATIC_ADDRESS, PROTOCOL_ADDRESS);
      approvalUSDC = await getApproval(USDC_MATIC_ADDRESS, PROTOCOL_ADDRESS);
      decimalsUSDT = await getDecimals(USDT_MATIC_ADDRESS);
      decimalsUSDC = await getDecimals(USDC_MATIC_ADDRESS);
    }

    if (chain?.id === 56) {
      balanceUSDT = await getBalances(USDT_BNB_ADDRESS);
      balanceUSDC = await getBalances(USDC_BNB_ADDRESS);
      approvalUSDT = await getApproval(USDT_BNB_ADDRESS, PROTOCOL_BNB_ADDRESS);
      approvalUSDC = await getApproval(USDC_BNB_ADDRESS, PROTOCOL_BNB_ADDRESS);
      decimalsUSDT = await getDecimals(USDT_BNB_ADDRESS);
      decimalsUSDC = await getDecimals(USDC_BNB_ADDRESS);
    }

    try {
      approvalUSDC = Number(approvalUSDC) / 10 ** decimalsUSDC;
    } catch (e) {
      // Means overflow, so much more approval than needed
      if (approvalUSDC) approvalUSDC = 10 ** decimalsUSDC;
    }

    try {
      approvalUSDT = Number(approvalUSDT) / 10 ** decimalsUSDT;
    } catch (e) {
      // Means overflow, so much more approval than needed
      if (approvalUSDT) approvalUSDT = 10 ** decimalsUSDT;
    }

    setBalance({
      usdt: {
        owned: Number(balanceUSDT) / 10 ** decimalsUSDT,
        approved: Number(approvalUSDT),
      },
      usdc: {
        owned: Number(balanceUSDC) / 10 ** decimalsUSDC,
        approved: Number(approvalUSDC),
      },
    });
  }, [address, chain]);

  useEffect(() => {
    if (chain) {
      getBalance();
      const interval = setInterval(() => {
        getBalance();
      }, 1000);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [getBalance, chain]);

  const approve = async (symbol: string) => {
    let contractAddress = "";
    let protocol = "";

    if (chain?.id === 137) {
      protocol = PROTOCOL_ADDRESS;
      if (symbol === "USDT") contractAddress = USDT_MATIC_ADDRESS;
      if (symbol === "USDC") contractAddress = USDC_MATIC_ADDRESS;
    }
    if (chain?.id === 56) {
      protocol = PROTOCOL_BNB_ADDRESS;
      if (symbol === "USDT") contractAddress = USDT_BNB_ADDRESS;
      if (symbol === "USDC") contractAddress = USDC_BNB_ADDRESS;
    }

    // setLoading(true);
    const {hash} = await writeContract({
      address: contractAddress as never,
      abi: erc20ABI as never,
      functionName: "approve" as never,
      args: [
        protocol,
        BigInt("100000000000000000000000000000000000000000000"),
      ] as never,
    });
    try {
      alert.info(`Transaction to approve ${symbol} is pending...`);
      await waitForTransaction({hash});
      alert.success(`${symbol} approved successfully.`);
      getBalance();
      // setLoading(false);
    } catch (e) {
      alert.error(`Something went wrong while trying to allow ${symbol}.`);
      getBalance();
      // setLoading(false);
    }

    setPending(false);
  };

  async function submit(paymentContractAddress: string, amount: number) {
    pushData("Listing Form Submit Clicked");

    const dateToSend = {
      ...state,
      contracts: state.contracts.filter(contract => contract.address !== ""),
      excludedFromCirculationAddresses:
        state.excludedFromCirculationAddresses.filter(
          newAddress => newAddress && newAddress.address,
        ),
      tokenomics: {
        ...state.tokenomics,
        sales: state.tokenomics.sales.filter(sale => sale.name !== ""),
        vestingSchedule: state.tokenomics.vestingSchedule
          .filter(vesting => vesting[0])
          .map(cleanVesting),
        fees: state.tokenomics.fees
          .filter(fee => fee.name !== "")
          .map(cleanFee),
      },
      logo: state.image.logo,
    };

    delete dateToSend.image;

    if (!dateToSend?.tokenomics?.launch?.date)
      delete dateToSend.tokenomics.launch;

    const JSONFile = new Blob([JSON.stringify(dateToSend)], {
      type: "text/plain",
    });

    const bufferFile = await new Promise<ArrayBuffer>(resolve => {
      const fileReader = new FileReader();
      fileReader.onload = event => resolve(event.target.result as ArrayBuffer);
      fileReader.readAsArrayBuffer(JSONFile);
    });

    const fileReader = new FileReader();
    fileReader.readAsBinaryString(JSONFile);

    const hash = await new Promise(resolve => {
      ipfs.files.add(Buffer.from(bufferFile), (err, file) => {
        resolve(file[0].hash);
      });
    });

    const getDecimals = contract =>
      readContract({
        address: contract as `0x${string}`,
        abi: erc20ABI as never,
        functionName: "decimals" as never,
      });

    const decimal: any = await getDecimals(paymentContractAddress);

    pushData("Listing Form Submit Pending", {
      chain: blockchainsIdContent[chain?.id]?.name,
      hash,
    });

    try {
      if (chain?.id === 137) {
        await writeContract({
          address: PROTOCOL_ADDRESS as never,
          abi: listingAbi as never,
          functionName: "submitToken" as never,
          args: [hash, paymentContractAddress, amount, 0] as never,
        });
      }
      if (chain?.id === 56) {
        await writeContract({
          address: PROTOCOL_BNB_ADDRESS as never,
          abi: listingAxelarAbi as never,
          functionName: "submitTokenAxelar" as never,
          args: [hash, paymentContractAddress, amount, 0] as never,
          value: BigInt(0.01 * 10 ** decimal) as never,
        });
      }

      pushData("Listing Form Submit Validated", {
        chain: blockchainsIdContent[chain?.id]?.name,
      });
      setHasPaid(true);
      setPending(false);
    } catch (e) {
      if (e.data && e.data.message)
        alert.error(`Something went wrong:${e.data.message}`);
      else if (e.toString().includes("rejected"))
        alert.error("Transaction cancelled.");
      else {
        alert.error("Something went wrong.");
        console.log(e);
      }

      pushData("Listing Form Submit Error", {
        chain: blockchainsIdContent[chain?.id]?.name,
        error: e.toString(),
      });
      setPending(false);
    }
  }

  const getFallBack = () => {
    if (!address) return "Connect your wallet";
    if (chain?.id !== 137 && chain?.id !== 56) return "Switch to Polygon";
    return "Buy USDC";
  };

  return hasPaid ? (
    <Flex direction="column" w={["100%", "100%", "450px"]}>
      <TextLandingLarge>Congratulations!</TextLandingLarge>
      <Flex mt="20px" borderBottom={borders2x} pb="20px" align="center">
        <Image
          src={state.image.logo}
          boxSize={["22px", "22px", "28px"]}
          borderRadius="full"
          border={bordersActive}
        />
        <TextLandingSmall ml="10px" color={text80}>
          <Box as="span" fontWeight="bold">
            {state.name}
          </Box>{" "}
          has been sent to be reviewed by the protocol DAO
        </TextLandingSmall>
      </Flex>
      <Flex mt="20px" borderBottom={borders2x} pb="20px" direction="column">
        <TextLandingSmall ml="10px" color={text80}>
          ⚡️ Wanna boost{" "}
          <Box as="span" fontWeight="bold">
            {state.name}
          </Box>{" "}
          ?
        </TextLandingSmall>
        <TextSmall color={text60} mt="10px">
          Get exclusive access to Mobula Bot, our APIs, win-win deals etc.
        </TextSmall>
        <Button
          variant="outlined"
          color={text80}
          mt={["10px", "10px", "20px"]}
          w="fit-content"
          onClick={() => {
            window.open("https://t.me/MobulaPartnerBot?start=Token", "_blank");
            window.focus();
          }}
        >
          Get in-touch
          <ExternalLinkIcon color={text40} mb="1px" ml="5px" />
        </Button>
      </Flex>
      <Button
        variant="outlined"
        color={text80}
        mt="20px"
        w="fit-content"
        border={borders}
        bg={boxBg6}
        _hover={{border: bordersActive, bg: hover}}
        onClick={() => {
          window.open(
            `https://mobula.fi/dao/protocol/sort/${getUrlFromName(state.name)}`,
            "_blank",
          );
          window.focus();
        }}
      >
        Follow the listing process (takes 2 minutes to complete)
        <ExternalLinkIcon color={text40} mb="1px" ml="5px" />
      </Button>
    </Flex>
  ) : (
    <Flex direction="column" w={["100%", "100%", "450px"]}>
      <Flex align="center">
        <Button
          display={["flex", "flex", "none"]}
          onClick={() => {
            if (isLaunched || state.type === "nft") setActualPage(2);
            else setActualPage(actualPage - 1);
          }}
        >
          <Icon as={ArrowBackIcon} mr="5px" />
        </Button>
        <TextLandingLarge>Submit</TextLandingLarge>
      </Flex>
      <Flex mt={["0px", "0px", "10px", "20px"]}>
        <Button
          {...addButtonStyle}
          border={isPayingNow ? bordersActive : borders}
          bg={isPayingNow ? hover : boxBg6}
          px="12px"
          w="fit-content"
          mr="10px"
          onClick={() => setIsPayingNow(true)}
        >
          Normal Listing
        </Button>
        <Button
          {...addButtonStyle}
          px="12px"
          w="fit-content"
          border={!isPayingNow ? bordersActive : borders}
          bg={!isPayingNow ? hover : boxBg6}
          onClick={() => setIsPayingNow(false)}
        >
          Ask community to pay
        </Button>
      </Flex>
      {isPayingNow ? (
        <Flex w="100%" direction="column">
          <Flex
            align="flex-end"
            wrap="wrap"
            mt={["15px", "15px", "15px", "20px"]}
          >
            <TextLandingMedium color={text80}>
              How fast do you want to be listed?{" "}
            </TextLandingMedium>
          </Flex>
          {/* DO NOT DELETE */}
          {/* <Flex
            border="1px solid var(--chakra-colors-blue)"
            borderRadius="full"
            h={["30px", "30px", "36px", "43px"]}
            px={["10px", "10px", "15px", "20px"]}
            mt="15px"
            align="center"
            justify="space-between"
          >
            <TextLandingSmall color={text80} mr="5px">
              You&apos;ll be ranked #234
            </TextLandingSmall>
            <NextChakraLink href="leaderboard" isExternal>
              <Flex align="center">
                <Icon as={BsArrowRight} color="blue" />
                <TextLandingSmall color="blue" ml="5px" fontWeight="400">
                  See the listing leaderboard
                </TextLandingSmall>
              </Flex>
            </NextChakraLink>
          </Flex> */}
          <Box mt={["40px", "40px", "50px"]} position="relative">
            <Slider
              aria-label="slider-ex-6"
              onChange={val => setFastTrack(val)}
              value={fastTrack}
              min={30}
              max={1000}
            >
              <SliderMark value={30} {...labelStyles}>
                <Text fontSize="14px" ml="20px" color={text80} fontWeight="400">
                  Standard
                </Text>
              </SliderMark>
              <SliderMark value={300} {...labelStyles}>
                <Text fontSize="14px" ml="15px" color={text80} fontWeight="400">
                  Fast
                </Text>
              </SliderMark>
              <SliderMark value={1000} {...labelStyles}>
                <Text
                  fontSize="14px"
                  color={text80}
                  ml="-80px"
                  whiteSpace="nowrap"
                  fontWeight="400"
                >
                  🔥 Blazing Fast
                </Text>
              </SliderMark>
              <Flex
                // max={1000}
                sx={markOption}
                transform="translateY(-50%)"
                top="50%"
                left="10px"
                color={text80}
              />
              <Flex
                sx={markOption}
                transform="translateY(-50%) translateX(50%)"
                top="50%"
                color={text80}
                left="27%"
              />
              <Flex
                sx={markOption}
                transform="translateY(-50%)"
                top="50%"
                color={text80}
                right="10px"
              />
              <SliderTrack bg={text10}>
                <SliderFilledTrack bg={isDarkMode ? "borders.blue" : "blue"} />
              </SliderTrack>
              <SliderThumb bg={isDarkMode ? "blue" : "borders.blue"}>
                <Box
                  bg={isDarkMode ? "borders.blue" : "blue"}
                  h="95%"
                  w="95%"
                  borderRadius="full"
                />
              </SliderThumb>
            </Slider>
          </Box>
          <TextLandingSmall mt="10px" fontWeight="400" color={text80}>
            You must pay{" "}
            <Box as="span" fontWeight={500} color={text80}>
              ${fastTrack} USD on {blockchainSelected}
            </Box>
          </TextLandingSmall>
          <TextLandingSmall mt="20px" mb="10px" fontWeight="400" color={text80}>
            You will get{" "}
            <Box as="span" color={text40}>
              ({getRewardFromTypeOfListing().name} Listing)
            </Box>
          </TextLandingSmall>
          <Flex align="center" mb="5px">
            <TextLandingSmall color={text80}>
              {getRewardFromTypeOfListing().rewards.type}
            </TextLandingSmall>
            <CheckIcon color="blue" ml="7.5px" />
          </Flex>
          <Flex align="center" mb="5px">
            <TextLandingSmall color={text80}>
              {getRewardFromTypeOfListing().rewards.medal}
              <CheckIcon color="blue" ml="7.5px" />
            </TextLandingSmall>
          </Flex>
          <Flex align="center">
            <Icon as={BsTwitter} ml="3px" mr="9px" color="#1DA1F2" />
            <TextLandingSmall color={text80}>
              An exclusive Tweet from{" "}
              <NextChakraLink
                href="https://twitter.com/MobulaFi"
                isExternal
                color="blue"
              >
                @MobulaFI
              </NextChakraLink>
            </TextLandingSmall>
            {getRewardFromTypeOfListing().rewards.twitter ? (
              <CheckIcon color="blue" ml="7.5px" />
            ) : (
              <CloseIcon color="red" ml="7.5px" />
            )}
          </Flex>
          <Flex
            direction={["column", "column", "row"]}
            mt="20px"
            mb="20px"
            wrap="wrap"
          >
            <Menu matchWidth>
              <MenuButton
                {...addButtonStyle}
                bg={boxBg6}
                px={["8px", "8px", "12px"]}
                fontSize={["12px", "12px", "14px", "16px"]}
                border={borders}
                w="fit-content"
                _hover={{bg: hover, border: bordersActive}}
                as={Button}
              >
                <Flex w="100%" align="center">
                  <Image
                    src={
                      blockchainsContent[blockchainSelected]?.logo ||
                      blockchainsContent.Polygon.logo
                    }
                    boxSize={["18px", "18px", "20px"]}
                    borderRadius="full"
                    mr={["7.5px", "7.5px", "10px"]}
                  />
                  {blockchainSelected === "BNB Smart Chain (BEP20)"
                    ? "Binance Chain"
                    : blockchainSelected}
                  <ChevronDownIcon ml="10px" />
                </Flex>
              </MenuButton>
              <MenuList
                fontSize={["12px", "12px", "14px", "16px"]}
                color={text80}
                fontWeight="400"
                bg={boxBg3}
                border={borders}
                boxShadow="none"
                borderRadius="8px"
                zIndex={2}
                maxH="300px"
              >
                {Object.keys(blockchainsContent)
                  .filter(
                    entry =>
                      entry === "BNB Smart Chain (BEP20)" ||
                      entry === "Polygon",
                  )
                  .map(blockchain => (
                    <MenuItem
                      bg={boxBg3}
                      _hover={{bg: hover}}
                      onClick={() => {
                        switchNetwork({
                          chainId: blockchainsContent[blockchain].chainId,
                        });
                      }}
                    >
                      <Image
                        src={blockchainsContent[blockchain].logo}
                        boxSize="20px"
                        borderRadius="full"
                        mr="10px"
                      />
                      {blockchainsContent[blockchain].name ===
                      "BNB Smart Chain (BEP20)"
                        ? "Binance Chain"
                        : blockchainsContent[blockchain].name}
                    </MenuItem>
                  ))}
              </MenuList>
            </Menu>
            <Flex mt="10px" ml={["0px", "0px", "10px"]}>
              {balance.usdt.owned >= fastTrack ||
              balance.usdc.owned >= fastTrack ? (
                <>
                  {" "}
                  {balance.usdt.owned >= fastTrack && (
                    <Button
                      sx={buttonsOption}
                      variant="outlined"
                      color={text80}
                      maxW="fit-content"
                      h={["30px", "30px", "35px"]}
                      fontSize={["12px", "12px", "13px", "14px"]}
                      onClick={() => {
                        setPending(true);
                        if (balance.usdt.approved < fastTrack) approve("USDT");
                        else if (chain?.id === 137) {
                          submit(USDT_MATIC_ADDRESS, fastTrack);
                        } else if (chain?.id === 56) {
                          submit(USDT_BNB_ADDRESS, fastTrack);
                        }
                      }}
                    >
                      <Flex align="center" w="100%">
                        {pending && <Spinner h="10px" w="10px" ml="5px" />}
                        <Image
                          src="/logo/usdt.webp"
                          alt="usdt logo"
                          sx={imageOption}
                        />
                        {balance.usdt.approved < fastTrack ? "Approve" : "Pay"}{" "}
                        with USDT
                        {pending && <Spinner h="10px" w="10px" ml="5px" />}
                      </Flex>
                    </Button>
                  )}
                  {balance.usdc.owned >= fastTrack && (
                    <Button
                      {...buttonsOption}
                      variant="outlined"
                      color={text80}
                      maxW="fit-content"
                      h={["30px", "30px", "35px"]}
                      mt="0px"
                      fontSize={["12px", "12px", "13px", "14px"]}
                      ml="0px"
                      onClick={() => {
                        if (balance.usdc.approved < fastTrack) approve("USDC");
                        else if (chain?.id === 137) {
                          submit(USDC_MATIC_ADDRESS, fastTrack);
                        } else if (chain?.id === 56) {
                          submit(USDC_BNB_ADDRESS, fastTrack);
                        }
                      }}
                    >
                      <Flex align="center" w="100%">
                        <Image
                          src="https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
                          alt="usdc logo"
                          sx={imageOption}
                        />
                        {balance.usdc.approved < fastTrack ? "Approve" : "Pay"}{" "}
                        with USDC
                        {pending && <Spinner h="10px" w="10px" ml="5px" />}
                      </Flex>
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  sx={buttonsOption}
                  variant="outlined"
                  color={text80}
                  onClick={() => {
                    switch (getFallBack()) {
                      case "Connect your wallet":
                        setConnect(true);
                        pushData("Listing Form Connect Wallet Clicked");
                        break;
                      case "Switch to Polygon":
                        pushData("Listing Form Switch Network Clicked");
                        setShowSwitchNetwork(137);
                        break;
                      case "Buy USDC":
                        pushData("Listing Form Buy USDC Clicked");
                        window.open("https://mobula.fi/trade/usdc", "_blank");
                        break;
                      default:
                        break;
                    }
                  }}
                >
                  <Flex align="center" w="100%">
                    <Icon
                      as={FiShoppingCart}
                      minW="20px"
                      fontSize="18px"
                      mr="5px"
                    />
                    {getFallBack()}
                  </Flex>
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <Flex direction="column">
          <TextMedium my={["10px", "10px", "10px", "20px"]}>
            Community members will be able to pay for the listing granularly.
          </TextMedium>
          <Button
            {...buttonsOption}
            variant="outlined"
            color={text80}
            maxW="fit-content"
            h={["30px", "30px", "35px"]}
            fontSize={["12px", "12px", "13px", "14px"]}
            onClick={() => {
              if (chain?.id === 137) submit(USDC_MATIC_ADDRESS, 0);
              else submit(USDC_BNB_ADDRESS, 0);
            }}
          >
            <Flex align="center" w="100%">
              Submit
            </Flex>
          </Button>
        </Flex>
      )}
    </Flex>
  );
};
