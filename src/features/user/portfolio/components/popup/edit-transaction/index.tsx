import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Collapse,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
// import {useAlert} from "react-alert";
import React from "react";
import { BiTimeFive } from "react-icons/bi";
import DatePicker from "react-widgets/DatePicker";
import { useAccount } from "wagmi";
import { TextLandingMedium } from "../../../../../../components/fonts";
import { Asset } from "../../../../../../interfaces/assets";
import { HistoryData } from "../../../../../../interfaces/pages/asset";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { pushData } from "../../../../../../lib/mixpanel";
import { createSupabaseDOClient } from "../../../../../../lib/supabase";
import { GET } from "../../../../../../utils/fetch";
import {
  getClosest,
  getFormattedAmount,
} from "../../../../../../utils/formaters";
import { PortfolioV2Context } from "../../../context-manager";
import { useWebSocketResp } from "../../../hooks";
import { BuySettings } from "../../../models";
import { buttonMarketPriceStyle, inputTimeStyle } from "../../../style";
import { convertInMillis } from "../../../utils";
import { ButtonSlider } from "../../ui/button-slider";

export const EditTransactionPopup = () => {
  const {
    setShowEditTransaction,
    setIsLoading,
    tokenTsx,
    userPortfolio,
    showEditTransaction,
  } = useContext(PortfolioV2Context);
  const { address } = useAccount();
  const router = useRouter();
  // const alert = useAlert();
  const hoursRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);
  const [showNote, setShowNote] = useState(false);
  const [activePrice, setActivePrice] = useState("Market Price");
  const [date, setDate] = useState(new Date().getTime());
  const [transferType, setTransferType] = useState("Transfer In");
  const [typeSelected, setTypeSelected] = useState("Buy");
  const switcherOptions = ["Buy", "Sell", "Transfer"];
  const { boxBg1, borders, boxBg6, text80, boxBg3, bordersActive, hover } =
    useColors();
  const switcherPriceOptions = [
    "Market Price",
    "Custom Price",
    tokenTsx?.ico_price ? "Ico Price" : "",
  ];
  const refreshPortfolio = useWebSocketResp();

  const initialToken = tokenTsx || {
    name: "Bitcoin",
    symbol: "BTC",
    id: 100001656,
    image:
      "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png?1547033579",
  };

  const [settings, setSettings] = useState<BuySettings>({
    state: "Buy",
    quantity: null,
    price: 0,
    total_spent: 0,
    token: initialToken,
    date: new Date(),
    fee: "",
    note: "",
  });
  const [historicalData, setHistoricalData] = useState<
    [number, number][] | null
  >(null);

  const portfolioId = router.asPath.split("/")[3]
    ? router.asPath.split("/")[3].split("?")[0]
    : userPortfolio[0]?.id;

  const getPriceFromActivePriceOption = (type) => {
    if (type === "Market Price") {
      setSettings((prev) => ({ ...prev, price: tokenTsx?.price }));
      setSettings((prev) => ({
        ...prev,
        total_spent: tokenTsx.price * parseFloat(prev.quantity),
      }));
    }
    if (type === "Custom Price") {
      setSettings((prev) => ({ ...prev, price: 0 }));
      setSettings((prev) => ({
        ...prev,
        total_spent: 0 * parseFloat(prev.quantity),
      }));
    }
    if (type === "Ico Price") {
      setSettings((prev) => ({ ...prev, price: tokenTsx?.ico_price }));
      setSettings((prev) => ({
        ...prev,
        total_spent: tokenTsx.ico_price * parseFloat(prev.quantity),
      }));
    }
  };

  const loadHistory = async (freshToken: Partial<Asset>) => {
    setHistoricalData(null);
    const supabase = createSupabaseDOClient();
    const queries = [
      supabase
        .from<Asset>("assets")
        .select("price_history")
        .match({ id: freshToken.id })
        .single(),
      supabase
        .from<HistoryData>("history")
        .select("price_history")
        .match({ asset: freshToken.id })
        .single(),
    ];

    const [{ data: asset }, { data: history }] = (await Promise.all(
      queries
    )) as unknown as [{ data: Asset | null }, { data: HistoryData | null }];
    setHistoricalData(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (history?.price_history || []).concat(asset?.price_history?.price || [])
    );
  };
  console.log(showEditTransaction);
  const submitTransaction = () => {
    pushData("ADD-TRANSACTION-CONFIRM");
    const timestamp =
      date + convertInMillis(hoursRef.current.value, minutesRef.current.value);

    if (settings.quantity) {
      GET("/portfolio/edittx", {
        account: address,
        asset: tokenTsx.id,
        tx_id: String(showEditTransaction.id),
        amount: String(parseFloat(settings.quantity) * 10 ** 18),
        value_usd:
          getClosest(historicalData, timestamp) * parseFloat(settings.quantity),
        type: String(switcherOptions.indexOf(typeSelected)),
        timestamp: String(showEditTransaction.timestamp),
        fee: String(settings.fee),
        portfolio_id: portfolioId,
        out: transferType === "Transfer Out",
      }).then(() => {
        setTimeout(() => {
          setIsLoading(true);
          if (address) refreshPortfolio();
        }, 1000);
      });
    }

    setShowEditTransaction(null);
    // if (!settings.quantity) alert.error("You must enter a quantity");
  };
  useEffect(() => {
    loadHistory(initialToken as any);
  }, []);

  useEffect(() => {
    setSettings((prev) => ({
      ...prev,
      price: tokenTsx?.price,
      token: tokenTsx,
    }));
    loadHistory(tokenTsx);
  }, [tokenTsx]);

  return (
    <Modal
      isOpen={!!showEditTransaction}
      onClose={() => setShowEditTransaction(null)}
    >
      <ModalOverlay />
      <ModalContent
        bg={boxBg1}
        borderRadius="16px"
        border={borders}
        p={["15px", "15px", "20px"]}
        boxShadow="none"
        w={["90vw", "100%"]}
        maxW="380px"
      >
        <ModalHeader p="0px" mb="15px">
          <TextLandingMedium color={text80}>Edit Transaction</TextLandingMedium>
        </ModalHeader>
        <ModalCloseButton color={text80} />
        <ModalBody p="0px">
          <ButtonSlider
            switcherOptions={switcherOptions}
            typeSelected={typeSelected}
            setTypeSelected={setTypeSelected}
          />
          {typeSelected === "Transfer" ? (
            <Flex direction="column" w="100%">
              <Text fontSize="14px" fontWeight="400" color={text80} mb="10px">
                Transfer
              </Text>
              <Menu matchWidth>
                <MenuButton
                  bg={boxBg6}
                  borderRadius="8px"
                  h="35px"
                  w="100%"
                  border={borders}
                  _hover={{ bg: hover, border: bordersActive }}
                  as={Button}
                  fontSize={["12px", "12px", "13px", "14px"]}
                  color={text80}
                  fontWeight="400"
                >
                  <Flex
                    align="center"
                    w="100%"
                    px="10px"
                    justify="space-between"
                  >
                    {transferType}
                    <Icon
                      as={ChevronDownIcon}
                      color={text80}
                      fontSize={["16px", "16px", "18px", "20px"]}
                    />
                  </Flex>
                </MenuButton>
                <MenuList
                  bg={boxBg3}
                  border={borders}
                  borderRadius="8px"
                  color={text80}
                  py="0px"
                  boxShadow="1px 2px 13px 3px rgba(0,0,0,0.1)"
                >
                  <MenuItem
                    bg={boxBg3}
                    fontSize={["12px", "12px", "13px", "14px"]}
                    _hover={{ bg: hover }}
                    transition="all 200ms ease-in-out"
                    borderRadius="8px 8px 0px 0px"
                    onClick={() => setTransferType("Transfer In")}
                  >
                    Transfer In
                  </MenuItem>
                  <MenuItem
                    bg={boxBg3}
                    borderRadius="0px 0px 8px 8px"
                    _hover={{ bg: hover }}
                    transition="all 200ms ease-in-out"
                    fontSize={["12px", "12px", "13px", "14px"]}
                    onClick={() => setTransferType("Transfer Out")}
                  >
                    Transfer Out
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          ) : null}

          <Text
            mt="15px"
            fontSize="14px"
            fontWeight="400"
            color={text80}
            mb="10px"
          >
            Amount
          </Text>
          <InputGroup>
            <Input
              bg="box_bg.10"
              borderRadius="8px"
              h="35px"
              type="number"
              lang="en"
              value={settings.quantity}
              placeholder="0.00"
              onChange={(e) => {
                setSettings((prev) => ({
                  ...prev,
                  quantity: e.target.value,
                }));
                setSettings((prev) => ({
                  ...prev,
                  total_spent:
                    parseFloat(e.target.value) * parseFloat(prev.quantity),
                }));
              }}
            />
            <InputRightElement color={text80} h="100%" pr="10px" pl="10px">
              {tokenTsx.symbol}
            </InputRightElement>
          </InputGroup>

          <>
            <Text
              fontSize="14px"
              fontWeight="400"
              color={text80}
              mt="15px"
              mb="10px"
            >
              Price
            </Text>
            <InputGroup>
              <Input
                bg="box_bg.10"
                borderRadius="8px"
                h="35px"
                type="number"
                value={getFormattedAmount(settings.price)}
                placeholder={JSON.stringify(getFormattedAmount(settings.price))}
                isReadOnly={activePrice !== "Custom Price"}
                onChange={(e) => {
                  setSettings((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value),
                  }));
                  setSettings((prev) => ({
                    ...prev,
                    total_spent:
                      parseFloat(e.target.value) * parseFloat(prev.quantity),
                  }));
                }}
              />
              <InputRightElement color={text80} h="100%" pr="10px" pl="10px">
                {tokenTsx.symbol}
              </InputRightElement>
            </InputGroup>
            {switcherPriceOptions
              .filter((entry) => entry)
              .map((name) => {
                const isActive = activePrice === name;
                return (
                  <Button
                    onClick={() => {
                      setActivePrice(name);
                      getPriceFromActivePriceOption(name);
                    }}
                    sx={buttonMarketPriceStyle}
                    opacity={isActive ? 1 : 0.5}
                  >
                    {name}
                  </Button>
                );
              })}
          </>

          <Text
            fontSize="14px"
            fontWeight="400"
            color={text80}
            mt="15px"
            mb="10px"
          >
            Date & Time
          </Text>
          <Flex align="center">
            <Flex w="auto" mr="10px">
              <DatePicker
                onChange={(pickedDate) => {
                  const finalDate =
                    pickedDate.getTime() > new Date().getTime()
                      ? new Date()
                      : pickedDate;
                  const dateToMillis = finalDate.getTime();
                  setDate(dateToMillis);
                }}
                value={new Date(date)}
              />
            </Flex>

            <Flex
              bg="box_bg.10"
              borderRadius="8px"
              h="35px"
              align="center"
              w="fit-content"
              pr="10px"
            >
              <Input
                {...inputTimeStyle}
                ref={hoursRef}
                min="0"
                max="23"
                maxLength={23}
                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                  const target = e.target as HTMLInputElement;
                  if (parseInt(target.value, 10) > 23) {
                    target.value = "23";
                  }
                }}
              />
              <Text>:</Text>
              <Input
                {...inputTimeStyle}
                ref={minutesRef}
                step="1"
                min="0"
                max="59"
                maxLength={59}
                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                  const target = e.target as HTMLInputElement;
                  if (parseInt(target.value, 10) > 59) {
                    target.value = "59";
                  }
                }}
              />
              <Icon as={BiTimeFive} fontSize="16px" color="text.70" />
            </Flex>
          </Flex>
          <Text
            fontSize="14px"
            fontWeight="400"
            color={text80}
            mt="15px"
            mb="10px"
          >
            Total
          </Text>
          <InputGroup>
            <Input
              bg="box_bg.10"
              borderRadius="8px"
              h="35px"
              type="number"
              value={settings.price * parseFloat(settings.quantity)}
              isReadOnly
            />
            <InputRightElement color={text80} h="100%" pr="10px" pl="10px">
              USD
            </InputRightElement>
          </InputGroup>
          <Collapse startingHeight={0} in={showNote}>
            <Flex>
              <Flex direction="column" w="80%" mr="10px">
                <Text
                  fontSize="14px"
                  fontWeight="400"
                  color={text80}
                  mt="15px"
                  mb="10px"
                >
                  Note
                </Text>
                <Input
                  bg="box_bg.10"
                  placeholder="Type a note"
                  borderRadius="8px"
                  h="35px"
                  onChange={(e) => {
                    setSettings((prev) => ({ ...prev, note: e.target.value }));
                  }}
                />
              </Flex>
              <Flex direction="column" w="70px">
                <Text
                  fontSize="14px"
                  fontWeight="400"
                  color={text80}
                  mt="15px"
                  mb="10px"
                >
                  Fee
                </Text>
                <InputGroup>
                  <Input
                    bg="box_bg.10"
                    borderRadius="8px"
                    h="35px"
                    pr="25px"
                    placeholder="0.5"
                    type="number"
                    onChange={(e) => {
                      setSettings((prev) => ({
                        ...prev,
                        fee: e.target.value,
                      }));
                    }}
                  />
                  <InputRightElement
                    color={text80}
                    h="100%"
                    pr="10px"
                    pl="10px"
                  >
                    %
                  </InputRightElement>
                </InputGroup>
              </Flex>
            </Flex>
          </Collapse>
          <Flex direction="column">
            <Button
              mt="20px"
              variant="outlined"
              borderRadius="8px"
              fontSize={["12px", "12px", "13px", "14px"]}
              fontWeight="400"
              color={text80}
              border={borders}
              _hover={{ border: "1px solid var(--chakra-colors-borders-1)" }}
              onClick={() => setShowNote(!showNote)}
            >
              {showNote ? "Hide Fee and Note" : "Fee, Note"}
            </Button>
            <Button
              mt="10px"
              borderRadius="8px"
              variant="outlined"
              fontSize={["12px", "12px", "13px", "14px"]}
              fontWeight="400"
              color={text80}
              onClick={() => submitTransaction()}
              isDisabled={!historicalData}
            >
              Add Transaction
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
