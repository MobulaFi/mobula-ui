import { Button } from "components/button";
import { inputTimeStyle } from "features/user/portfolio/style";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { BiTimeFive } from "react-icons/bi";
import { BsCalendar3 } from "react-icons/bs";
import { useAccount } from "wagmi";
import { Collapse } from "../../../../../../components/collapse";
import { LargeFont } from "../../../../../../components/fonts";
import { Menu } from "../../../../../../components/menu";
import { Modal } from "../../../../../../components/modal-container";
import { Asset } from "../../../../../../interfaces/assets";
import { HistoryData } from "../../../../../../interfaces/pages/asset";
import { pushData } from "../../../../../../lib/mixpanel";
import { Calendar } from "../../../../../../lib/shadcn/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../../lib/shadcn/components/ui/select";
import { createSupabaseDOClient } from "../../../../../../lib/supabase";
import { triggerAlert } from "../../../../../../lib/toastify";
import { GET } from "../../../../../../utils/fetch";
import {
  getClosest,
  getDate,
  getFormattedAmount,
  getRightPrecision,
} from "../../../../../../utils/formaters";
import { PortfolioV2Context } from "../../../context-manager";
import { useWebSocketResp } from "../../../hooks";
import { BuySettings } from "../../../models";
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
  const pathname = usePathname();
  const hoursRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);
  const [showNote, setShowNote] = useState(false);
  const [activePrice, setActivePrice] = useState("Market Price");
  const [date, setDate] = useState<Date>(new Date());
  const [typeSelected, setTypeSelected] = useState("Buy");
  const switcherOptions = ["Buy", "Sell", "Transfer"];
  const [isUSDInput, setIsUSDInput] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
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
    token: initialToken as Asset,
    date: new Date(),
    fee: "",
    note: "",
  });
  const [historicalData, setHistoricalData] = useState<
    [number, number][] | null
  >(null);
  const refreshPortfolio = useWebSocketResp();

  const portfolioId = pathname.split("/")[3]
    ? pathname.split("/")[3].split("?")[0]
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
      (date?.getTime() as number) +
      convertInMillis(hoursRef?.current?.value, minutesRef?.current?.value);
    if (parseFloat(settings.quantity)) {
      GET("/portfolio/addtx", {
        account: address as string,
        asset: String(settings?.token?.id || 0),
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
    if (!settings.quantity) triggerAlert("Error", "You must enter a quantity");
  };
  useEffect(() => {
    loadHistory(initialToken);
  }, []);

  useEffect(() => {
    setSettings(
      (prev) =>
        ({
          ...prev,
          price: tokenTsx?.price,
          token: tokenTsx,
        } as BuySettings)
    );
    loadHistory(tokenTsx);
  }, [tokenTsx]);

  return (
    <Modal
      extraCss="max-w-[405px]"
      isOpen={showAddTransaction}
      onClose={() => setShowAddTransaction(false)}
      title={
        <div className="flex items-center">
          <img
            className="w-[24px] h-[24px] rounded-full mr-[7.5px]"
            src={tokenTsx?.image || tokenTsx?.logo}
            alt={`${tokenTsx?.name} logo`}
          />
          <LargeFont extraCss="mr-[7.5px]">{tokenTsx?.name}</LargeFont>
          <LargeFont extraCss="text-light-font-60 dark:text-dark-font-60">
            {tokenTsx?.symbol}
          </LargeFont>
        </div>
      }
    >
      <ButtonSlider
        switcherOptions={switcherOptions}
        typeSelected={typeSelected}
        setTypeSelected={setTypeSelected}
        callback={(type) => setSettings((prev) => ({ ...prev, state: type }))}
      />
      <p className="text-sm text-light-font-100 dark:text-dark-font-100 mb-2.5">
        Amount
      </p>
      <div className="flex items-center w-full bg-light-bg-terciary rounded-md dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary h-[35px] justify-between pr-0">
        <input
          className="bg-light-bg-terciary h-full dark:bg-dark-bg-terciary border-light-border-primary dark:border-dark-border-primary text-light-font-100 dark:text-dark-font-100 min-w-[0px]"
          type="number"
          lang="en"
          placeholder="0.00"
          ref={inputRef}
          onChange={(e) => {
            if (
              !Number.isNaN(parseFloat(e.target.value)) ||
              e.target.value === ""
            ) {
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
              : (getRightPrecision(settings.quantity) as number)
          }
        />
        <div className="flex items-center text-light-font-100 dark:text-dark-font-100 h-full px-2.5">
          <p className="text-sm mr-2.5">
            {isUSDInput ? "$" : tokenTsx?.symbol}
          </p>
          <Button
            h="70%"
            extraCss="h-[70%] mr-0"
            onClick={() => setIsUSDInput(!isUSDInput)}
          >
            Switch to {!isUSDInput ? "$" : tokenTsx?.symbol}
          </Button>
        </div>
      </div>
      {typeSelected === "Transfer" ? (
        <>
          <p className="text-sm text-light-font-100 dark:text-dark-font-100 mb-2.5 mt-[15px]">
            Transfer
          </p>
          <Select>
            <SelectTrigger className="w-full  border border-light-border-primary dark:border-dark-border-primary h-[35px] text-light-font-100 dark:text-dark-font-100 ">
              <SelectValue
                className="text-light-font-100 dark:text-dark-font-100 h-[35px]"
                placeholder={
                  settings.transfer ? settings.transfer : "Select transfer type"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      transfer: "Transfer In",
                    }))
                  }
                  value="Transfer In"
                >
                  Transfer In
                </SelectItem>
                <SelectItem
                  onClick={() =>
                    setSettings((prev) => ({
                      ...prev,
                      transfer: "Transfer Out",
                    }))
                  }
                  value="Transfer Out"
                >
                  Transfer Out
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </>
      ) : (
        <>
          <p className="text-sm text-light-font-100 dark:text-dark-font-100 mb-2.5 mt-[15px]">
            Price
          </p>
          <div className="flex items-center w-full bg-light-bg-terciary rounded-md dark:bg-dark-bg-terciary h-[35px] justify-between pr-0  border border-light-border-primary dark:border-dark-border-primary">
            <input
              className="bg-light-bg-terciary dark:bg-dark-bg-terciary h-full text-light-font-100 dark:text-dark-font-100 min-w-[0px]"
              type="number"
              lang="en"
              value={getFormattedAmount(settings.price) as string}
              placeholder={getFormattedAmount(settings.price) as string}
              readOnly={activePrice !== "Custom Price"}
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
            <div className="flex items-center text-light-font-100 dark:text-dark-font-100 h-full px-2.5">
              <p className="text-sm">$</p>
            </div>
          </div>
          {/* {false &&
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
                })} */}
        </>
      )}
      <p className="text-sm text-light-font-100 dark:text-dark-font-100 mb-2.5 mt-[15px]">
        Date & Time
      </p>
      <div className="flex items-center ">
        <Menu
          title={
            <div
              className="flex mr-2.5 relative items-center w-full bg-light-bg-terciary rounded-md dark:bg-dark-bg-terciary h-[35px]
                 cursor-pointer max-w-full justify-between border border-light-border-primary dark:border-dark-border-primary"
              onClick={() => setIsCalendarVisible(true)}
            >
              <input
                className="cursor-pointer bg-light-bg-terciary rounded-md dark:bg-dark-bg-terciary h-full text-light-font-100 dark:text-dark-font-100 w-full max-w-full min-w-[0px]"
                value={getDate(date?.getTime() as number)}
              />
              <BsCalendar3 className="text-light-font-100 dark:text-dark-font-100 text-sm mr-2.5" />
            </div>
          }
        >
          <Calendar
            className="static p-0  border border-light-border-primary dark:border-dark-border-primary shadow-none"
            selectedDay={date}
            onSelect={setDate}
          />
        </Menu>
        <div className="flex items-center w-fit bg-light-bg-terciary rounded-md dark:bg-dark-bg-terciary h-[35px] justify-between pr-2.5 border border-light-border-primary dark:border-dark-border-primary ml-2.5">
          <input
            placeholder="00"
            pattern="d*"
            maxLength={2}
            type="text"
            min="0"
            max="23"
            className={`${inputTimeStyle} bg-light-bg-terciary dark:bg-dark-bg-terciary min-w-[0px]`}
            ref={hoursRef}
            onInput={(e) => {
              if (parseInt((e.target as HTMLInputElement).value, 10) > 23) {
                (e.target as HTMLInputElement).value = "23";
              }
            }}
          />
          <p className="text-light-font-100 dark:text-dark-font-100 text-sm">
            :
          </p>
          <input
            className={`${inputTimeStyle} bg-light-bg-terciary dark:bg-dark-bg-terciary min-w-[0px]`}
            placeholder="00"
            pattern="d*"
            maxLength={2}
            type="text"
            ref={minutesRef}
            step="1"
            min="0"
            max="59"
            onInput={(e) => {
              if (parseInt((e.target as HTMLInputElement).value, 10) > 59) {
                (e.target as HTMLInputElement).value = "59";
              }
            }}
          />
          <BiTimeFive className="text-sm text-light-font-100 dark:text-dark-font-100" />
        </div>
      </div>
      {typeSelected === "Transfer" ? null : (
        <>
          <p className="text-sm text-light-font-100 dark:text-dark-font-100 mb-2.5 mt-[15px]">
            Total
          </p>
          <div
            className="flex mr-2.5 relative  items-center w-full bg-light-bg-terciary rounded-md dark:bg-dark-bg-terciary h-[35px]
               cursor-pointer max-w-full justify-between  border border-light-border-primary dark:border-dark-border-primary"
          >
            <input
              className="bg-light-bg-terciary dark:bg-dark-bg-terciary rounded-md text-light-font-100 dark:text-dark-font-100 h-full min-w-[0px]"
              value={(() => {
                const timestamp =
                  (date?.getTime() as number) +
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
                  { shouldNotMinifyBigNumbers: true }
                ) as number;
              })()}
              readOnly
            />
            <div className="w-fit h-full px-2.5 text-light-font-100 dark:text-dark-font-100">
              <p>{!isUSDInput ? "$" : tokenTsx.symbol}</p>
            </div>
          </div>
        </>
      )}
      <Collapse startingHeight={"max-h-[0px]"} isOpen={showNote}>
        <div className="flex">
          <div className="flex flex-col w-[80%] mr-2.5">
            <p className="text-sm text-light-font-100 dark:text-dark-font-100 mt-[15px] mb-2.5">
              Note
            </p>
            <div className="h-[35px] border border-light-border-primary dark:border-dark-border-primary rounded-md">
              <input
                className="bg-light-bg-terciary w-full dark:bg-dark-bg-terciary h-full rounded-md text-light-font-100 dark:text-dark-font-100 min-w-[0px]"
                placeholder="Type a note"
                onChange={(e) => {
                  setSettings((prev) => ({
                    ...prev,
                    note: e.target.value,
                  }));
                }}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-light-font-100 dark:text-dark-font-100 mt-[15px] mb-2.5">
              Fee
            </p>
            <div
              className="flex relative items-center w-full bg-light-bg-terciary rounded-md dark:bg-dark-bg-terciary h-[35px]
               cursor-pointer max-w-full justify-between border border-light-border-primary dark:border-dark-border-primary"
            >
              <input
                className="bg-light-bg-terciary dark:bg-dark-bg-terciary rounded-md text-light-font-100 dark:text-dark-font-100 h-full max-w-[48px] w-full pr-0 min-w-[0px]"
                placeholder="0.5"
                type="number"
                onChange={(e) => {
                  setSettings((prev) => ({
                    ...prev,
                    fee: e.target.value,
                  }));
                }}
              />
              <div className="text-sm text-light-font-100 dark:text-dark-font-100 px-2.5">
                %
              </div>
            </div>
          </div>
        </div>
      </Collapse>
      <div className="flex flex-col">
        <Button
          extraCss="mt-5 w-full h-[40px] md:h-[35px]"
          onClick={() => setShowNote(!showNote)}
        >
          {showNote ? "Hide Fee and Note" : "Fee, Note"}
        </Button>
        <Button
          extraCss="border border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue
             mt-2.5 w-full hover:bg-light-bg-terciary hover:dark:bg-dark-bg-terciary h-[40px] md:h-[35px]"
          onClick={() => submitTransaction()}
          isDisabled={!historicalData}
        >
          Add Transaction
        </Button>
      </div>
    </Modal>
  );
};
