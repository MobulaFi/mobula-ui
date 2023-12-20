import { NextImageFallback } from "components/image";
import {
  blockchainsContent,
  blockchainsIdContent,
} from "mobula-lite/lib/chains/constants";
import { useTheme } from "next-themes";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsCheckLg, BsChevronDown, BsTwitter } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import { FiExternalLink, FiShoppingCart } from "react-icons/fi";
import { erc20ABI, useAccount, useNetwork } from "wagmi";
import {
  readContract,
  switchNetwork,
  waitForTransaction,
  writeContract,
} from "wagmi/actions";
import { Button } from "../../../../../components/button";
import {
  ExtraLargeFont,
  LargeFont,
  MediumFont,
  SmallFont,
} from "../../../../../components/fonts";
import { NextChakraLink } from "../../../../../components/link";
import { Menu } from "../../../../../components/menu";
import { Spinner } from "../../../../../components/spinner";
import {
  PROTOCOL_ADDRESS,
  PROTOCOL_BNB_ADDRESS,
  USDC_BNB_ADDRESS,
  USDC_MATIC_ADDRESS,
  USDT_BNB_ADDRESS,
  USDT_MATIC_ADDRESS,
} from "../../../../../constants";
import { PopupUpdateContext } from "../../../../../contexts/popup";
import { useIPFS } from "../../../../../hooks/ipfs";
import { pushData } from "../../../../../lib/mixpanel";
import { triggerAlert } from "../../../../../lib/toastify";
import { getUrlFromName } from "../../../../../utils/formaters";
import {
  allowanceAbi,
  balanceOfAbi,
  listingAbi,
  listingAxelarAbi,
} from "../../constant";
import { ListingContext } from "../../context-manager";
import { addButtonStyle, buttonsOption, imageStyle } from "../../styles";
import { cleanFee, cleanVesting } from "../../utils";

export const Submit = ({ state }) => {
  const [pending, setPending] = useState(false);
  const { address } = useAccount();
  const [isPayingNow, setIsPayingNow] = useState(true);
  const [fastTrack, setFastTrack] = useState(100);
  const { theme } = useTheme();
  const [hasPaid, setHasPaid] = useState(false);
  const isDarkMode = theme === "light";
  const { chain } = useNetwork();
  const { actualPage, setActualPage, isLaunched } = useContext(ListingContext);
  const ipfs = useIPFS();
  const [blockchainSelected, setBlockchainSelected] = useState<string>(
    blockchainsContent.Polygon.name
  );
  const [balance, setBalance] = useState({
    usdt: {
      owned: 0,
      approved: 0,
    },
    usdc: { owned: 0, approved: 0 },
  });
  const { setShowSwitchNetwork, setConnect } = useContext(PopupUpdateContext);

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

  useEffect(() => {
    if (chain?.id === blockchainsContent[chain?.name]?.chainId) {
      setBlockchainSelected(chain?.name);
    }
  }, [chain]);

  useEffect(() => {
    if (chain?.id !== 137 && chain?.id !== 56) switchNetwork({ chainId: 137 });
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

    const getDecimals = (contract) =>
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
    const { hash } = await writeContract({
      address: contractAddress as never,
      abi: erc20ABI as never,
      functionName: "approve" as never,
      args: [
        protocol,
        BigInt("100000000000000000000000000000000000000000000"),
      ] as never,
    });
    try {
      triggerAlert(
        "Information",
        `Transaction to approve ${symbol} is pending...`
      );
      await waitForTransaction({ hash });
      triggerAlert("Success", `${symbol} approved successfully.`);
      getBalance();
      // setLoading(false);
    } catch (e) {
      triggerAlert(
        "Error",
        `Something went wrong while trying to allow ${symbol}.`
      );
      getBalance();
      // setLoading(false);
    }

    setPending(false);
  };

  async function submit(paymentContractAddress: string, amount: number) {
    pushData("Listing Form Submit Clicked");

    const dateToSend = {
      ...state,
      contracts: state.contracts.filter((contract) => contract.address !== ""),
      excludedFromCirculationAddresses:
        state.excludedFromCirculationAddresses.filter(
          (newAddress) => newAddress && newAddress.address
        ),
      tokenomics: {
        ...state.tokenomics,
        sales: state.tokenomics.sales.filter((sale) => sale.name !== ""),
        vestingSchedule: state.tokenomics.vestingSchedule
          .filter((vesting) => vesting[0])
          .map(cleanVesting),
        fees: state.tokenomics.fees
          .filter((fee) => fee.name !== "")
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

    const bufferFile = await new Promise<ArrayBuffer>((resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = (event) =>
        resolve(event.target.result as ArrayBuffer);
      fileReader.readAsArrayBuffer(JSONFile);
    });

    const fileReader = new FileReader();
    fileReader.readAsBinaryString(JSONFile);

    const hash = await new Promise((resolve) => {
      ipfs.files.add(Buffer.from(bufferFile), (err, file) => {
        resolve(file[0].hash);
      });
    });

    const getDecimals = (contract) =>
      readContract({
        address: contract as `0x${string}`,
        abi: erc20ABI as never,
        functionName: "decimals" as never,
      });

    const decimal: any = await getDecimals(paymentContractAddress);

    pushData("Listing Form Submit Pending", {
      chain: blockchainsIdContent[chain?.id as number]?.name,
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
          address: PROTOCOL_BNB_ADDRESS,
          abi: listingAxelarAbi as never,
          functionName: "submitTokenAxelar" as never,
          args: [hash, paymentContractAddress, amount, 0] as never,
          value: BigInt(0.01 * 10 ** decimal) as never,
        });
      }

      pushData("Listing Form Submit Validated", {
        chain: blockchainsIdContent[chain?.id as number]?.name,
      });
      setHasPaid(true);
      setPending(false);
    } catch (e) {
      if (e.data && e.data.message)
        triggerAlert("Error", `Something went wrong:${e.data.message}`);
      else if (e.toString().includes("rejected"))
        triggerAlert("Error", "Transaction cancelled.");
      else {
        triggerAlert("Error", "Something went wrong.");
      }

      pushData("Listing Form Submit Error", {
        chain: blockchainsIdContent[chain?.id as number]?.name,
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

  const fallbackMessage = getFallBack();

  return hasPaid ? (
    <div className="flex flex-col w-[450px] md:w-full">
      <ExtraLargeFont>Congratulations!</ExtraLargeFont>
      <div className="flex mt-5 border-b-2 border-light-border-primary dark:border-dark-border-primary pb-5 items-center">
        <img
          className="w-7 h-7 md:w-[22px] md:h-[22px] rounded-full border border-light-border-primary dark:border-dark-border-primary"
          src={state.image.logo}
          alt={`${state.name} logo`}
        />
        <MediumFont extraCss="ml-2.5">
          <span className="font-bold">{state.name}</span> has been sent to be
          reviewed by the protocol DAO
        </MediumFont>
      </div>
      <div className="flex mt-5 border-b-2 border-light-border-primary dark:border-dark-border-primary pb-5 flex-col">
        <MediumFont extraCss="ml-2.5">
          ⚡️ Wanna boost <span className="font-bold">{state.name}</span> ?
        </MediumFont>
        <SmallFont extraCss="mt-2.5 text-light-font-60 dark:text-dark-font-60">
          Get exclusive access to Mobula Bot, our APIs, win-win deals etc.
        </SmallFont>
        <Button
          extraCss="border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue mt-5 md:mt-2.5 w-fit"
          onClick={() => {
            window.open("https://t.me/MobulaPartnerBot?start=Token", "_blank");
            window.focus();
          }}
        >
          Get in-touch
          <FiExternalLink className="text-light-font-40 dark:text-dark-font-40 mb-[1px] ml-[5px]" />
        </Button>
      </div>
      <Button
        extraCss="mt-5 md:mt-2.5 w-fit"
        onClick={() => {
          window.open(
            `https://mobula.fi/dao/protocol/sort/${getUrlFromName(state.name)}`,
            "_blank"
          );
          window.focus();
        }}
      >
        Follow the listing process (takes 2 minutes to complete)
        <FiExternalLink className="text-light-font-40 dark:text-dark-font-40 mb-[1px] ml-[5px]" />
      </Button>
    </div>
  ) : (
    <div className="flex flex-col w-[450px] md:w-full">
      <div className="flex items-center">
        <button
          className="hidden md:flex"
          onClick={() => {
            if (isLaunched || state.type === "nft") setActualPage(2);
            else setActualPage(actualPage - 1);
          }}
        >
          <FaArrowLeft className="text-light-font-100 dark:text-dark-font-100 mr-[5px]" />
        </button>
        <ExtraLargeFont>Submit</ExtraLargeFont>
      </div>
      <div className="flex mt-0 md:mt-0">
        <button
          className={`${addButtonStyle} whitespace-nowrap px-3 w-fit mr-2.5 ${
            isPayingNow
              ? "bg-light-bg-hover dark:bg-dark-bg-hover"
              : "bg-light-bg-terciary dark:bg-dark-bg-terciary"
          }`}
          onClick={() => setIsPayingNow(true)}
        >
          Normal Listing
        </button>
        <button
          className={`${addButtonStyle} whitespace-nowrap px-3 w-fit mr-2.5 ${
            !isPayingNow
              ? "bg-light-bg-hover dark:bg-dark-bg-hover"
              : "bg-light-bg-terciary dark:bg-dark-bg-terciary"
          }`}
          onClick={() => setIsPayingNow(false)}
        >
          Ask community to pay
        </button>
      </div>
      {isPayingNow ? (
        <div className="flex w-full flex-col">
          <div className="flex items-end flex-wrap mt-5 lg:mt-[15px]">
            <LargeFont>How fast do you want to be listed? </LargeFont>
          </div>
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
          {/* SLIDER TO REPLACE */}
          {/* <div className="mt-[50px] md:mt-[40px] relative">
            <Slider
              aria-label="slider-ex-6"
              onChange={(val) => setFastTrack(val)}
              value={fastTrack}
              min={30}
              max={1000}
            >
              <SliderMark value={30} {...labelStyles}>
                <p
                // fontSize="14px" ml="20px" color={"text80"} fontWeight="400"
                >
                  Standard
                </p>
              </SliderMark>
              <SliderMark value={300} {...labelStyles}>
                <p
                // fontSize="14px" ml="15px" color={"text80"} fontWeight="400"
                >
                  Fast
                </p>
              </SliderMark>
              <SliderMark value={1000} {...labelStyles}>
                <p
                // fontSize="14px"
                // color={"text80"}
                // ml="-80px"
                // whiteSpace="nowrap"
                // fontWeight="400"
                >
                  🔥 Blazing Fast
                </p>
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
          </div> */}
          <div className="relative w-full pb-5">
            <input
              type="range"
              min="30"
              max="1000"
              defaultValue="30"
              value={fastTrack}
              onChange={(e) => setFastTrack(Number(e.target.value))}
              className="mt-2.5 w-full h-2.5 bg-light-font-10 dark:bg-dark-font-10 border border-light-border-primary
             dark:border-dark-border-primary rounded-full range-thumb relative"
            />
            <p className="text-light-font-100 dark:text-dark-font-100 text-sm whitespace-nowrap absolute right-0">
              🔥 Blazing Fast
            </p>
            <div className="absolute left-[27.85%] top-[10px] h-2.5 w-0.5 bg-light-font-60 dark:bg-dark-font-60" />
            <p className="text-light-font-100 dark:text-dark-font-100 text-sm whitespace-nowrap absolute left-[24.5%]">
              Fast
            </p>
            <p className="text-light-font-100 dark:text-dark-font-100 text-sm whitespace-nowrap absolute left-0">
              Standard
            </p>
          </div>
          <SmallFont extraCss="mt-2.5">
            You must pay{" "}
            <span className="font-medium">
              ${fastTrack} USD on {blockchainSelected}
            </span>
          </SmallFont>
          <SmallFont extraCss="mt-5 mb-2.5">
            You will get{" "}
            <span className="text-light-font-40 dark:text-dark-font-40">
              ({getRewardFromTypeOfListing().name} Listing)
            </span>
          </SmallFont>
          <div className="flex items-center mb-[5px]">
            <SmallFont>{getRewardFromTypeOfListing().rewards.type}</SmallFont>
            <BsCheckLg className="text-blue dark:text-blue ml-[7.5px]" />
          </div>
          <div className="flex items-center mb-[5px]">
            <SmallFont>{getRewardFromTypeOfListing().rewards.medal} </SmallFont>
            <BsCheckLg className="text-blue dark:text-blue ml-[7.5px]" />
          </div>
          <div className="flex items-center">
            <BsTwitter className="ml-[3px] mr-[9px] text-twitter dark:text-twitter" />
            <SmallFont>
              An exclusive Tweet from{" "}
              <NextChakraLink
                href="https://twitter.com/MobulaFi"
                target="_blank"
                rel="noopener noreferrer"
                extraCss="text-blue dark:text-blue"
              >
                @MobulaFI
              </NextChakraLink>
            </SmallFont>
            {getRewardFromTypeOfListing().rewards.twitter ? (
              <BsCheckLg className="text-blue dark:text-blue ml-[7.5px]" />
            ) : (
              <AiOutlineClose className="text-red dark:text-red ml-[7.5px]" />
            )}
          </div>
          <div className="flex flex-row md:flex-col my-5 flex-wrap">
            <Menu
              extraCss="w-[200px] h-fit left-0"
              titleCss={`${addButtonStyle} px-3 md:px-2 w-fit`}
              title={
                <div className="flex w-full items-center">
                  <NextImageFallback
                    width={18}
                    height={18}
                    style={{
                      borderRadius: "50%",
                      marginRight: "7.5px",
                    }}
                    fallbackSrc="/empty/unknown.png"
                    alt={`${blockchainSelected} logo`}
                    src={blockchainsContent[blockchainSelected]?.logo}
                  />
                  {blockchainSelected === "BNB Smart Chain (BEP20)"
                    ? "Binance Chain"
                    : blockchainSelected}
                  <BsChevronDown className="ml-1.5" />
                </div>
              }
            >
              <div className="w-full ">
                {Object.keys(blockchainsContent)
                  .filter(
                    (entry) =>
                      entry === "BNB Smart Chain (BEP20)" || entry === "Polygon"
                  )
                  .map((blockchain) => (
                    <div
                      key={blockchain}
                      className="flex items-center bg-light-bg-terciary dark:bg-dark-bg-terciary
                       text-light-font-60 dark:text-dark-font-60 whitespace-nowrap my-1.5 cursor-pointer"
                      onClick={() => {
                        switchNetwork({
                          chainId: blockchainsContent[blockchain].chainId,
                        });
                      }}
                    >
                      <NextImageFallback
                        className="mr-2.5 rounded-full"
                        height={18}
                        width={18}
                        fallbackSrc="/empty/unknown.png"
                        src={blockchainsContent[blockchain].logo}
                        alt={`${blockchain} logo`}
                      />
                      {blockchainsContent[blockchain].name ===
                      "BNB Smart Chain (BEP20)"
                        ? "Binance Chain"
                        : blockchainsContent[blockchain].name}
                    </div>
                  ))}
              </div>
            </Menu>
            <div className="flex mt-2.5 ml-2.5 md:ml-0">
              {balance.usdt.owned >= fastTrack ||
              balance.usdc.owned >= fastTrack ? (
                <>
                  {balance.usdt.owned >= fastTrack && (
                    <Button
                      extraCss={`${buttonsOption} max-w-fit border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue`}
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
                      <div className="flex items-center w-full">
                        {pending && (
                          <Spinner extraCss="h-[10px] w-[10px] ml-[5px]" />
                        )}
                        <NextImageFallback
                          height={18}
                          width={18}
                          className={imageStyle}
                          src="/logo/usdt.webp"
                          alt="usdt logo"
                          fallbackSrc={""}
                        />
                        {balance.usdt.approved < fastTrack ? "Approve" : "Pay"}{" "}
                        with USDT
                        {pending && (
                          <Spinner extraCss="h-[10px] w-[10px] ml-[5px]" />
                        )}
                      </div>
                    </Button>
                  )}
                  {balance.usdc.owned >= fastTrack && (
                    <Button
                      extraCss={`${buttonsOption} max-w-fit mt-0 ml-0 border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue`}
                      onClick={() => {
                        if (balance.usdc.approved < fastTrack) approve("USDC");
                        else if (chain?.id === 137) {
                          submit(USDC_MATIC_ADDRESS, fastTrack);
                        } else if (chain?.id === 56) {
                          submit(USDC_BNB_ADDRESS, fastTrack);
                        }
                      }}
                    >
                      <div className="flex items-center w-full">
                        <NextImageFallback
                          src="https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
                          alt="usdc logo"
                          height={18}
                          width={18}
                          className={imageStyle}
                          fallbackSrc="/empty/unknown.png"
                        />
                        {balance.usdc.approved < fastTrack ? "Approve" : "Pay"}{" "}
                        with USDC
                        {pending && (
                          <Spinner extraCss="h-[10px] w-[10px] ml-[5px]" />
                        )}
                      </div>
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  extraCss={`${buttonsOption} flex justify-center items-center border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue`}
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
                  <div className="flex items-center w-full">
                    <FiShoppingCart className="min-w-5 text-lg mr-[5px]" />
                    {fallbackMessage}
                  </div>
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <MediumFont extraCss="my-5 lg:my-2.5">
            Community members will be able to pay for the listing granularly.
          </MediumFont>
          <Button
            extraCss={`${buttonsOption} max-w-fit border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue`}
            onClick={() => {
              if (chain?.id === 137) submit(USDC_MATIC_ADDRESS, 0);
              else submit(USDC_BNB_ADDRESS, 0);
            }}
          >
            <div className="flex items-center w-full">Submit</div>
          </Button>
        </div>
      )}
    </div>
  );
};
