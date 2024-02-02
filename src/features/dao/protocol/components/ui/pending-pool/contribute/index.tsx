import React, { useCallback, useEffect, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { SiConvertio } from "react-icons/si";
import { erc20ABI, useAccount, useNetwork } from "wagmi";
import { readContract, waitForTransaction, writeContract } from "wagmi/actions";
import { Button } from "../../../../../../../components/button";
import { MediumFont, SmallFont } from "../../../../../../../components/fonts";
import { Input } from "../../../../../../../components/input";
import { Menu } from "../../../../../../../components/menu";
import {
  PROTOCOL_ADDRESS,
  PROTOCOL_BNB_ADDRESS,
  USDC_BNB_ADDRESS,
  USDC_MATIC_ADDRESS,
  USDT_BNB_ADDRESS,
  USDT_MATIC_ADDRESS,
} from "../../../../../../../constants";
import { createSupabaseDOClient } from "../../../../../../../lib/supabase";
import { triggerAlert } from "../../../../../../../lib/toastify";
import { allowanceAbi, balanceOfAbi } from "../../../../../../../utils/abi";
import {
  listingAbi,
  listingAxelarAbi,
} from "../../../../../../misc/listing-form/constant";
import { BoxContainer } from "../../../../../common/components/box-container";
import { TokenDivs, TokenToBuyWith } from "../../../../models";
import { getPricing } from "../../../../utils";

interface ContributeProps {
  token: TokenDivs;
}

type tokenToBuyWithProps = {
  name: string;
  logo: string;
  symbol: string;
  decimals: number;
  contracts: string[];
  blockchains: string[];
};

export const Contribute = ({ token }: ContributeProps) => {
  const text80 = "#8C8C8C";
  const [tokenToBuyWith, setTokenToBuyWith] = useState<tokenToBuyWithProps>(
    {} as tokenToBuyWithProps
  );
  const [amount, setAmount] = useState(0);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [contributeAmount, setContributeAmount] = useState(
    getPricing(token?.coeff)
  );
  const [balance, setBalance] = useState({
    usdt: {
      owned: 0,
      approved: 0,
    },
    usdc: {
      owned: 0,
      approved: 0,
    },
  });
  const [buyWith, setBuyWith] = useState({
    usdt: {} as TokenToBuyWith,
    usdc: {} as TokenToBuyWith,
  });

  const getBalance = useCallback(async () => {
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
  };

  const contributeToListing = async (stable) => {
    let newAddress = "";
    if (chain?.id === 137) {
      if (stable === "USDT") newAddress = USDT_MATIC_ADDRESS;
      if (stable === "USDC") newAddress = USDC_MATIC_ADDRESS;
    }
    if (chain?.id === 56) {
      if (stable === "USDT") newAddress = USDT_BNB_ADDRESS;
      if (stable === "USDC") newAddress = USDC_BNB_ADDRESS;
    }
    const decimal: any = await readContract({
      address: newAddress as `0x${string}`,
      abi: erc20ABI as never,
      functionName: "decimals" as never,
    });

    if (chain?.id === 137) {
      try {
        await writeContract({
          address: PROTOCOL_ADDRESS as never,
          abi: listingAbi as never,
          functionName: "topUpToken" as never,
          args: [token.voteId, newAddress, amount] as never,
        });
        triggerAlert("Success", "The vote has been taken in account");
      } catch (e) {
        // console.log(e);
      }
    }
    if (chain?.id === 56) {
      try {
        await writeContract({
          address: PROTOCOL_BNB_ADDRESS as never,
          abi: listingAxelarAbi as never,
          functionName: "topUpTokenAxelar" as never,
          args: [token.id, newAddress, amount] as never,
          value: BigInt(0.01 * 10 ** decimal) as never,
        });
        triggerAlert("Success", "The vote has been taken in account");
      } catch (e) {
        // console.log(e);
      }
    }
  };

  // tokenId, address paymentTokenAddress, uint256 paymentAmount
  useEffect(() => {
    const supabase = createSupabaseDOClient();
    supabase
      .from("assets")
      .select("name,contracts,symbol,logo,decimals,blockchains")
      .eq("symbol", "USDT")
      .then(({ data }) => {
        if (data) setBuyWith((prev) => ({ ...prev, usdt: data[0] }));
      });
    supabase
      .from("assets")
      .select("name,contracts,symbol,logo,decimals,blockchains")
      .eq("symbol", "USDC")
      .then(({ data }) => {
        if (data) setBuyWith((prev) => ({ ...prev, usdc: data[0] }));
      });
  }, []);

  useEffect(() => {
    if (buyWith)
      setTokenToBuyWith(buyWith.usdc as unknown as tokenToBuyWithProps);
  }, [buyWith]);

  const labelStyles = {
    color: text80,
    borderRadius: "8px",
    py: "2px",
    mt: "-50px",
    ml: "-6",
    w: "12",
    zIndex: 1,
  };

  return (
    <BoxContainer extraCss="mb-5 relative transition-all duration-200 py-[15px] md:py-2.5 px-5 lg:px-[15px] md:px-2.5 rounded-2xl sm:rounded-0">
      <div className="flex items-center pb-5 lg:pb-[15px] md:pb-2.5 border-b border-light-border-primary dark:border-dark-border-primary">
        <SiConvertio className="text-blue dark:text-blue" />
        <MediumFont extraCss="ml-2.5">Distribution</MediumFont>
      </div>
      {/* REPLACE SLIDER */}
      {/* <div className="flex w-full mt-[50px] pb-[60px]">
        <Slider
          aria-label="slider-ex-1"
          defaultValue={contributeAmount || 0}
          max={500}
          isReadOnly
          value={contributeAmount}
        >
          <SliderMark value={30} {...labelStyles} position="relative">
            30$
            <div className="flex h-2 absolute bottom-[-29px] left-5 bg-light-font-40 dark:bg-dark-font-40 z-[1] w-1" />
            <SmallFont extraCss="absolute bottom-[-80px] left-[-12.5px] text-center z-[1]">
              Required
              <br />
              (Standard)
            </SmallFont>
          </SliderMark>
          <SliderMark
            textAlign="center"
            value={100}
            {...labelStyles}
            position="relative"
          >
            100$
            <div className="flex h-2 absolute bottom-[-29px] left-5 bg-light-font-40 dark:bg-dark-font-40 z-[1] w-1" />
            <SmallFont extraCss="absolute bottom-[-80px] left-[-7.5px] text-center z-[1]">
              Fast Listing
            </SmallFont>
          </SliderMark>
          <SliderMark
            value={500}
            {...labelStyles}
            ml="-40px"
            position="relative"
          >
            500$
            <div className="flex h-2 absolute bottom-[-29px] left-[30px] bg-light-font-40 dark:bg-dark-font-40 z-[1] w-1" />
            <SmallFont extraCss="absolute bottom-[-80px] left-[-7.5px] text-center z-[1]">
              Ultra Fast
            </SmallFont>
          </SliderMark>

          <SliderMark
            value={contributeAmount}
            textAlign="center"
            bg={hover}
            {...labelStyles}
            px="6px"
            w="fit-content"
            ml={contributeAmount < 10 ? "-10px" : "-6"}
          >
            {contributeAmount}$
          </SliderMark>
          <SliderTrack bg={hover} h="8px" borderRadius="15px">
            <SliderFilledTrack bg="darkblue" />
          </SliderTrack>
          <SliderThumb
            bg="darkblue"
            border="2px solid var(--chakra-colors-blue)"
          />
        </Slider>
      </div> */}
      <SmallFont extraCss="mt-[15px] text-light-font-100 dark:text-dark-font-100 font-normal">
        Enter an amount
      </SmallFont>
      <div className="mt-2.5 flex">
        <Input
          extraCss="w-[200px]"
          placeholder="10"
          onChange={(e) => {
            setAmount(parseInt(e.target.value, 10));
            if (parseInt(e.target.value, 10) < 500)
              setContributeAmount(
                getPricing(token?.coeff) + parseInt(e.target.value, 10)
              );
          }}
        />
        <Menu
          titleCss="border border-light-border-primary dark:border-dark-border-primary px-3 w-fit rounded-md ml-2.5 transition-all duration-200
          border border-light-border-primary dark:border-dark-border-primary hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover 
          bg-light-bg-terciary dark:bg-dark-bg-terciary"
          title={
            <div className="flex items-center">
              {tokenToBuyWith?.symbol || "Select"}
              <BiChevronDown className="ml-1.5 text-base" />
            </div>
          }
        >
          {Object.keys(buyWith).map((key) => {
            return (
              <div
                key={key}
                className="flex items-center w-full bg-light-bg-terciary dark:bg-dark-bg-terciary transition-all duration-200 text-light-font-100 dark:text-dark-font-100"
                onClick={() => setTokenToBuyWith(buyWith[key])}
              >
                <img
                  className="w-5 h-5 rounded-full mr-2.5"
                  src={buyWith[key]?.logo || "/empty/unknown.png"}
                  alt={buyWith[key]?.symbol || "unknown"}
                />
                {buyWith[key].symbol}
              </div>
            );
          })}
        </Menu>
      </div>
      <Button
        extraCss="mt-5 h-[35px] md:h-[30px] border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue"
        onClick={() => {
          if (tokenToBuyWith.symbol === "USDC") {
            if (balance.usdc.approved < amount) approve("USDC");
            else contributeToListing(tokenToBuyWith.symbol);
          } else if (tokenToBuyWith.symbol === "USDT") {
            if (balance.usdt.approved < amount) approve("USDT");
            else contributeToListing(tokenToBuyWith.symbol);
          }
        }}
      >
        {balance.usdc.approved < amount ? "Approve" : "Contribute"}
      </Button>
    </BoxContainer>
  );
};
