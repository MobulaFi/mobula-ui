import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Collapse,
  Flex,
  Icon,
  Img,
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
  getRightPrecision,
} from "../../../../../../utils/formaters";
import { PortfolioV2Context } from "../../../context-manager";
import { useWebSocketResp } from "../../../hooks";
import { BuySettings } from "../../../models";
import { buttonMarketPriceStyle, inputTimeStyle } from "../../../style";
import { convertInMillis } from "../../../utils";
import { ButtonSlider } from "../../ui/button-slider";

export const AddTransactionPopup = () => {
  const {
    showAddTransaction,
    setShowAddTransaction,
    tokenTsx,
    activePortfolio,
  } = useContext(PortfolioV2Context);
  const inputRef = useRef<HTMLInputElement>(null);
  const { address } = useAccount();
  const router = useRouter();
  // const alert = useAlert();
  const hoursRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);
  const [showNote, setShowNote] = useState(false);
  const [activePrice, setActivePrice] = useState("Market Price");
  const [date, setDate] = useState(new Date().getTime());
  const [typeSelected, setTypeSelected] = useState("Buy");
  const switcherOptions = ["Buy", "Sell", "Transfer"];
  const { boxBg3, boxBg6, borders, text40, text80, hover } = useColors();
  const [isUSDInput, setIsUSDInput] = useState(false);
  const switcherPriceOptions = [
    "Market Price",
    "Custom Price",
    tokenTsx?.ico_price ? "Ico Price" : "",
  ];

  const initialToken = tokenTsx || {
    name: "Bitcoin",
    symbol: "BTC",
    id: 100001656,
    image:
      "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png?1547033579",
  };

  const [settings, setSettings] = useState<BuySettings>({
    state: "Buy",
    quantity: "",
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
  const refreshPortfolio = useWebSocketResp();

  const portfolioId = router.asPath.split("/")[3]
    ? router.asPath.split("/")[3].split("?")[0]
    : activePortfolio?.id;

  const getPriceFromActivePriceOption = (type) => {
    if (type === "Market Price") {
      setSettings((prev) => ({ ...prev, price: tokenTsx?.price }));
      setSettings((prev) => ({
        ...prev,
        total_spent: tokenTsx?.price
          ? tokenTsx.price * parseFloat(prev.quantity)
          : null,
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
        total_spent: tokenTsx?.ico_price
          ? tokenTsx.ico_price * parseFloat(prev.quantity)
          : null,
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
      (history?.price_history || []).concat(asset?.price_history?.price || [])
    );
  };

  const submitTransaction = () => {
    pushData("Transaction Added", {
      crypto_name: tokenTsx.name,
      rypto_ticker: tokenTsx.symbol,
      crypto_amount: settings.quantity,
    });

    const timestamp =
      date + convertInMillis(hoursRef.current.value, minutesRef.current.value);
    if (parseFloat(settings.quantity)) {
      GET("/portfolio/addtx", {
        account: address,
        asset: String(settings.token?.id),
        amount: String(
          parseFloat(
            String(
              isUSDInput
                ? parseFloat(settings.quantity) /
                    getClosest(historicalData || [], timestamp)
                : settings.quantity
            )
          ) *
            10 ** 18
        ),
        value_usd: isUSDInput
          ? settings.quantity
          : getClosest(historicalData || [], timestamp) *
            parseFloat(settings.quantity),
        type: String(switcherOptions.indexOf(settings.state)),
        timestamp: String(timestamp),
        fee: String(settings.fee),
        portfolio_id: portfolioId,
        out: typeSelected === "Sell" || typeSelected === "Transfer Out",
      }).then(() => {
        setTimeout(() => {
          refreshPortfolio();
        }, 1000);
      });
    }
    setShowAddTransaction(false);
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
      isOpen={showAddTransaction}
      onClose={() => setShowAddTransaction(false)}
    >
      <ModalOverlay />
      <ModalContent
        bg={boxBg3}
        borderRadius="16px"
        border={borders}
        p={["15px", "15px", "20px"]}
        boxShadow="none"
        w={["90vw", "100%"]}
        maxW="380px"
      >
        <ModalHeader p="0px" mb="15px">
          <Flex align="center">
            <Img
              src={tokenTsx?.image || tokenTsx?.logo}
              boxSize="30px"
              borderRadius="full"
              mr="7.5px"
            />
            <TextLandingMedium color={text80} mr="7.5px">
              {tokenTsx?.name}
            </TextLandingMedium>
            <TextLandingMedium color={text40}>
              {tokenTsx?.symbol}
            </TextLandingMedium>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color={text80} />
        <ModalBody p="0px">
          <ButtonSlider
            switcherOptions={switcherOptions}
            typeSelected={typeSelected}
            setTypeSelected={setTypeSelected}
            callback={(type) =>
              setSettings((prev) => ({ ...prev, state: type }))
            }
          />
          <Text fontSize="14px" fontWeight="400" color={text80} mb="10px">
            Amount
          </Text>
          <InputGroup>
            <Input
              bg={boxBg6}
              _placeholder={{ color: text80 }}
              borderRadius="8px"
              h="35px"
              type="number"
              lang="en"
              placeholder="0.00"
              ref={inputRef}
              onChange={(e) => {
                if (
                  !Number.isNaN(parseFloat(e.target.value)) ||
                  e.target.value === ""
                ) {
                  console.log("coucou", e.target.value);
                  setSettings((prev) => ({
                    ...prev,
                    quantity: e.target.value,
                  }));
                  setSettings((prev) => ({
                    ...prev,
                    total_spent:
                      parseFloat(e.target.value) * parseFloat(prev.quantity),
                  }));
                }
              }}
              value={
                typeof window !== "undefined" &&
                inputRef.current === document?.activeElement
                  ? settings.quantity
                  : getRightPrecision(settings.quantity)
              }
            />
            <InputRightElement color={text80} h="100%" pr="10px" pl="10px">
              <Text mr="10px">{isUSDInput ? "$" : tokenTsx?.symbol}</Text>
              <Button
                h="70%"
                variant="outlined_grey"
                onClick={() => {
                  setIsUSDInput(!isUSDInput);
                }}
              >
                Switch to {!isUSDInput ? "$" : tokenTsx?.symbol}
              </Button>
            </InputRightElement>
          </InputGroup>
          {typeSelected === "Transfer" ? (
            <>
              <Text
                fontSize="14px"
                fontWeight="400"
                color={text80}
                mt="15px"
                mb="10px"
              >
                Transfer
              </Text>
              <Menu matchWidth>
                <MenuButton
                  w="100%"
                  bg={boxBg6}
                  borderRadius="8px"
                  h="35px"
                  px="10px"
                  textAlign="start"
                  color={text80}
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                >
                  <Text
                    mr="7px"
                    fontSize="14px"
                    color={text80}
                    fontWeight="400"
                  >
                    {settings.transfer
                      ? settings.transfer
                      : "Select transfer type"}
                  </Text>
                </MenuButton>
                <MenuList
                  fontSize="14px"
                  color={text80}
                  fontWeight="400"
                  bg={boxBg3}
                  borderRadius="8px"
                  border={borders}
                  boxShadow="none"
                >
                  <MenuItem
                    bg={boxBg3}
                    borderRadius="8px"
                    _hover={{ color: text40 }}
                    transition="all 250ms ease-in-out"
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        transfer: "Transfer In",
                      }))
                    }
                  >
                    Transfer In
                  </MenuItem>
                  <MenuItem
                    bg="box_bg.1"
                    borderRadius="8px"
                    _hover={{ color: text40 }}
                    transition="all 250ms ease-in-out"
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        transfer: "Transfer Out",
                      }))
                    }
                  >
                    Transfer Out
                  </MenuItem>
                </MenuList>
              </Menu>
            </>
          ) : (
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
                  bg={boxBg6}
                  borderRadius="8px"
                  h="35px"
                  color={text80}
                  _placeholder={{ color: text80 }}
                  type="number"
                  value={getFormattedAmount(settings.price)}
                  placeholder={JSON.stringify(
                    getFormattedAmount(settings.price)
                  )}
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
                  <Text>$</Text>
                </InputRightElement>
              </InputGroup>
              {false &&
                switcherPriceOptions
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
                        bg={boxBg6}
                        _hover={{ bg: hover }}
                        color={text80}
                        opacity={isActive ? 1 : 0.5}
                      >
                        {name}
                      </Button>
                    );
                  })}
            </>
          )}
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
              bg={boxBg6}
              borderRadius="8px"
              h="35px"
              align="center"
              w="fit-content"
              pr="10px"
            >
              <Input
                {...inputTimeStyle}
                ref={hoursRef}
                _placeholder={{ color: text80 }}
                min="0"
                max="23"
                onInput={(e) => {
                  if (parseInt((e.target as HTMLInputElement).value, 10) > 23) {
                    (e.target as HTMLInputElement).value = "23";
                  }
                }}
                maxLength={2}
              />

              <Text color={text80}>:</Text>
              <Input
                {...inputTimeStyle}
                ref={minutesRef}
                step="1"
                min="0"
                _placeholder={{ color: text80 }}
                max="59"
                onInput={(e) => {
                  if (parseInt((e.target as HTMLInputElement).value, 10) > 59) {
                    (e.target as HTMLInputElement).value = "59";
                  }
                }}
                maxLength={2}
              />
              <Icon as={BiTimeFive} fontSize="16px" color={text80} />
            </Flex>
          </Flex>
          {typeSelected === "Transfer" ? null : (
            <>
              {" "}
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
                  bg={boxBg6}
                  borderRadius="8px"
                  h="35px"
                  _placeholder={{ color: text80 }}
                  color={text80}
                  value={(() => {
                    const timestamp =
                      date +
                      convertInMillis(
                        hoursRef.current?.value,
                        minutesRef.current?.value
                      );
                    return getFormattedAmount(
                      isUSDInput
                        ? parseFloat(settings.quantity) /
                            getClosest(historicalData || [], timestamp)
                        : getClosest(historicalData || [], timestamp) *
                            parseFloat(settings.quantity),
                      0,
                      {
                        minifyBigNumbers: false,
                        minifyZeros: false,
                      }
                    );
                  })()}
                  isReadOnly
                />
                <InputRightElement color={text80} h="100%" pr="10px" pl="10px">
                  <Text>{!isUSDInput ? "$" : tokenTsx.symbol}</Text>
                </InputRightElement>
              </InputGroup>
            </>
          )}
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
                  bg={boxBg6}
                  _placeholder={{ color: text80 }}
                  color={text80}
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
                    bg={boxBg6}
                    borderRadius="8px"
                    h="35px"
                    pr="25px"
                    placeholder="0.5"
                    _placeholder={{ color: text80 }}
                    type="number"
                    color={text80}
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
