import {
  blockchainsContent,
  blockchainsIdContent,
} from "mobula-lite/lib/chains/constants";
import { useTheme } from "next-themes";
import { useCallback, useContext, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsCheckLg, BsTwitter } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa6";
import { FiCheck, FiCopy, FiExternalLink } from "react-icons/fi";
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
import { buttonsOption } from "../../styles";
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
  const { actualPage, setActualPage, isLaunched, wallet, isListed } =
    useContext(ListingContext);
  const [listingType, setListingType] = useState("standard");
  const [isCopied, setIsCopied] = useState(false);
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

    const getDecimals = (contract: string) =>
      readContract({
        address: contract as `0x${string}`,
        abi: erc20ABI as never,
        functionName: "decimals" as never,
      });

    let balanceUSDT: unknown;
    let balanceUSDC: unknown;
    let approvalUSDT: unknown;
    let approvalUSDC: unknown;
    let decimalsUSDT: unknown;
    let decimalsUSDC: unknown;

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
      await waitForTransaction({hash});
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
      contracts: state.contracts.filter(
        (contract: {address: string}) => contract.address !== ""
      ),
      excludedFromCirculationAddresses:
        state.excludedFromCirculationAddresses.filter(
          (newAddress: {address: any}) => newAddress && newAddress.address
        ),
      tokenomics: {
        ...state.tokenomics,
        sales: state.tokenomics.sales.filter(
          (sale: {name: string}) => sale.name !== ""
        ),
        vestingSchedule: state.tokenomics.vestingSchedule
          .filter((vesting: any[]) => vesting[0])
          .map(cleanVesting),
        fees: state.tokenomics.fees
          .filter((fee: {name: string}) => fee.name !== "")
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
        resolve(event.target?.result as ArrayBuffer);
      fileReader.readAsArrayBuffer(JSONFile);
    });

    const fileReader = new FileReader();
    fileReader.readAsBinaryString(JSONFile);

    const hash = await new Promise((resolve) => {
      ipfs.files.add(
        Buffer.from(bufferFile),
        (err: any, file: {hash: unknown}[]) => {
          resolve(file[0].hash);
        }
      );
    });

    const getDecimals = (contract: string) =>
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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset icon after 2 seconds
    } catch (err) {
      console.error("Failed to copy:", err);
    }
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
    <div className="flex flex-col w-[800px] md:w-full">
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
          <div className="flex w-full flex-col">
            <div className="flex justify-between mt-5">
              <div className="border border-light-border-primary dark:border-dark-border-primary rounded p-4 w-[500px]">
                <MediumFont>Standard Listing</MediumFont>
                <SmallFont extraCss="text-center mt-2">
                  <div className="flex items-center mb-[5px]">
                    <SmallFont>🚀 Express Listing Request</SmallFont>
                    <AiOutlineClose className="text-red dark:text-red ml-[7.5px]" />
                  </div>
                  <div className="flex items-center">
                    <BsTwitter className="ml-[3px] mr-[9px] text-twitter dark:text-twitter" />
                    <SmallFont>An exclusive Tweet from @MobulaFI</SmallFont>
                    <AiOutlineClose className="text-red dark:text-red ml-[7.5px]" />
                  </div>
                </SmallFont>
                <SmallFont extraCss="text-center mt-4">
                  Price: $150 (stablecoin only)
                </SmallFont>
              </div>
              <div className="border border-light-border-primary dark:border-dark-border-primary rounded p-4 w-[500px]">
                <MediumFont>Express Listing</MediumFont>
                <SmallFont extraCss="text-center mt-2">
                  <div className="flex items-center mb-[5px]">
                    <SmallFont>🚀 Express Listing Request</SmallFont>
                    <BsCheckLg className="text-blue dark:text-blue ml-[7.5px]" />
                  </div>
                  <div className="flex items-center">
                    <BsTwitter className="ml-[3px] mr-[9px] text-twitter dark:text-twitter" />
                    <SmallFont>An exclusive Tweet from @MobulaFI</SmallFont>
                    <BsCheckLg className="text-blue dark:text-blue ml-[7.5px]" />
                  </div>
                </SmallFont>
                <SmallFont extraCss="text-center mt-4">
                  Price: $300 (stablecoin only)
                </SmallFont>
              </div>
            </div>
            <SmallFont extraCss="mt-6">
              Send $150 for Standard Listing or $300 for Express Listing to the
              following Ethereum address:
              <div className="font-bold mt-5 flex items-center">
                {wallet}
                <button
                  onClick={() => copyToClipboard(`${wallet}`)}
                  className="ml-2 flex items-center"
                >
                  {isCopied ? <FiCheck size="1em" /> : <FiCopy size="1em" />}
                </button>
              </div>
            </SmallFont>
          </div>
          <div className="flex flex-row md:flex-col my-5 flex-wrap">
            <div className="flex mt-2.5 md:ml-0">
              <Button
                extraCss={`${buttonsOption} flex justify-center items-center border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue`}
              >
                {isListed ? "Successfully Listed" : "Waiting..."}
              </Button>
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
