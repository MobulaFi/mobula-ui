import {ChevronDownIcon} from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Icon,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import {useCallback, useEffect, useState} from "react";
import {useAlert} from "react-alert";
import {SiConvertio} from "react-icons/si";
import {erc20ABI, useAccount, useNetwork} from "wagmi";
import {readContract, waitForTransaction, writeContract} from "wagmi/actions";
import {
  PROTOCOL_ADDRESS,
  PROTOCOL_BNB_ADDRESS,
  USDC_BNB_ADDRESS,
  USDC_MATIC_ADDRESS,
  USDT_BNB_ADDRESS,
  USDT_MATIC_ADDRESS,
} from "../../../../../../../../utils/constants";
import {createSupabaseDOClient} from "../../../../../../../../utils/supabase";
import {TextSmall} from "../../../../../../../UI/Text";
import {InfoPopup} from "../../../../../../../common/components/popup-hover";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {
  allowanceAbi,
  balanceOfAbi,
  listingAbi,
  listingAxelarAbi,
} from "../../../../../../Misc/Listing/constant";
import {BoxContainer} from "../../../../../common/components/box-container";
import {TokenDivs, TokenToBuyWith} from "../../../../models";
import {getPricing} from "../../../../utils";

export const Contribute = ({token}: {token: TokenDivs}) => {
  const {borders, text80, text40, bordersActive, hover, boxBg6} = useColors();
  const [tokenToBuyWith, setTokenToBuyWith] = useState({} as any);
  const [amount, setAmount] = useState(0);
  const {address} = useAccount();
  const {chain} = useNetwork();
  const [contributeAmount, setContributeAmount] = useState(
    getPricing(token?.coeff),
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
  const alert = useAlert();
  const [buyWith, setBuyWith] = useState({
    usdt: {} as TokenToBuyWith,
    usdc: {} as TokenToBuyWith,
  });

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
  };

  const contributeToListing = async stable => {
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
        alert.success("The vote has been taken in account");
      } catch (e) {
        console.log(e);
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
        alert.success("The vote has been taken in account");
      } catch (e) {
        console.log(e);
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
      .then(({data}) => {
        if (data) setBuyWith(prev => ({...prev, usdt: data[0]}));
      });
    supabase
      .from("assets")
      .select("name,contracts,symbol,logo,decimals,blockchains")
      .eq("symbol", "USDC")
      .then(({data}) => {
        if (data) setBuyWith(prev => ({...prev, usdc: data[0]}));
      });
  }, []);

  useEffect(() => {
    if (buyWith) setTokenToBuyWith(buyWith.usdc);
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
    <BoxContainer
      mb="20px"
      position="relative"
      transition="all 300ms ease-in-out"
      p={["10px 20px", "10px", "15px", "15px 20px"]}
      borderRadius={["0px", "16px"]}
    >
      <Flex
        align="center"
        pb={["10px", "10px", "15px", "20px"]}
        borderBottom={borders}
      >
        <Icon as={SiConvertio} color="blue" />
        <Text fontSize={["14px", "14px", "16px", "18px"]} ml="10px">
          Contribute to the listing
        </Text>
        <InfoPopup mb="3px" />
      </Flex>
      <Flex w="100%" mt="50px" pb="60px">
        <Slider
          aria-label="slider-ex-1"
          defaultValue={contributeAmount || 0}
          max={500}
          isReadOnly
          value={contributeAmount}
        >
          <SliderMark value={30} {...labelStyles} position="relative">
            30$
            <Flex
              h="8px"
              position="absolute"
              bottom="-29px"
              left="20px"
              bg={text40}
              zIndex="1"
              w="4px"
            />
            <TextSmall
              position="absolute"
              bottom="-80px"
              left="-12.5px"
              textAlign="center"
              zIndex="1"
            >
              Required
              <br />
              (Standard)
            </TextSmall>
          </SliderMark>
          <SliderMark
            textAlign="center"
            value={100}
            {...labelStyles}
            position="relative"
          >
            100$
            <Flex
              h="8px"
              position="absolute"
              bottom="-29px"
              left="20px"
              bg={text40}
              zIndex="1"
              w="4px"
            />
            <TextSmall
              position="absolute"
              bottom="-80px"
              left="-7.5px"
              textAlign="center"
              zIndex="1"
            >
              Fast Listing
            </TextSmall>
          </SliderMark>
          <SliderMark
            value={500}
            {...labelStyles}
            ml="-40px"
            position="relative"
          >
            500$
            <Flex
              h="8px"
              position="absolute"
              bottom="-29px"
              left="30px"
              bg={text40}
              zIndex="1"
              w="4px"
            />
            <TextSmall
              position="absolute"
              bottom="-80px"
              left="-7.5px"
              textAlign="center"
              zIndex="1"
            >
              Ultra Fast
            </TextSmall>
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
      </Flex>
      <TextSmall mt="15px" color={text80} fontWeight="500">
        Enter an amount
      </TextSmall>
      <Flex mt="10px">
        <Input
          h="35px"
          borderRadius="8px"
          w="200px"
          border={borders}
          bg={boxBg6}
          color={text80}
          placeholder="10"
          onChange={e => {
            setAmount(parseInt(e.target.value, 10));
            if (parseInt(e.target.value, 10) < 500)
              setContributeAmount(
                getPricing(token?.coeff) + parseInt(e.target.value, 10),
              );
          }}
        />
        <Menu>
          <MenuButton
            border={borders}
            bg={boxBg6}
            as={Button}
            fontWeight="400"
            w="fit-content"
            px="12px"
            borderRadius="8px"
            ml="10px"
            _hover={{bg: hover, border: bordersActive}}
            transition="all 250ms ease-in-out"
            rightIcon={<ChevronDownIcon />}
          >
            <Flex align="center">
              <Image
                src={tokenToBuyWith?.logo || "/icon/unknown.png"}
                boxSize="20px"
                borderRadius="full"
                mr="10px"
              />
              {tokenToBuyWith?.symbol || "Select"}
            </Flex>
          </MenuButton>
          <MenuList bg={boxBg6} border={borders} borderRadius="8px">
            {Object.keys(buyWith).map(key => (
              <MenuItem
                bg={boxBg6}
                _hover={{bg: hover}}
                transition="all 250ms ease-in-out"
                onClick={() => setTokenToBuyWith(buyWith[key])}
              >
                <Image
                  src={buyWith[key]?.logo || "/icon/unknown.png"}
                  boxSize="20px"
                  borderRadius="full"
                  mr="10px"
                />
                {buyWith[key].symbol}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Flex>
      <Button
        variant="outlined"
        h={["35px", "35px", "40px"]}
        mt="20px"
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
