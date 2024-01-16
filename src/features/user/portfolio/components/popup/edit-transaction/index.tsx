import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BiTimeFive } from "react-icons/bi";
import { BsCalendar3, BsChevronDown } from "react-icons/bs";
import { useAccount } from "wagmi";
import { Button } from "../../../../../../components/button";
import { Collapse } from "../../../../../../components/collapse";
import { Menu } from "../../../../../../components/menu";
import { Modal } from "../../../../../../components/modal-container";
import { Asset } from "../../../../../../interfaces/assets";
import { HistoryData } from "../../../../../../interfaces/pages/asset";
import { pushData } from "../../../../../../lib/mixpanel";
import { Calendar } from "../../../../../../lib/shadcn/components/ui/calendar";
import { createSupabaseDOClient } from "../../../../../../lib/supabase";
import { triggerAlert } from "../../../../../../lib/toastify";
import { GET } from "../../../../../../utils/fetch";
import {
  getClosest,
  getDate,
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
  const hoursRef = useRef<HTMLInputElement>(null);
  const minutesRef = useRef<HTMLInputElement>(null);
  const [showNote, setShowNote] = useState(false);
  const [activePrice, setActivePrice] = useState("Market Price");
  const [date, setDate] = useState(new Date());
  const [transferType, setTransferType] = useState("Transfer In");
  const [typeSelected, setTypeSelected] = useState("Buy");
  const switcherOptions = ["Buy", "Sell", "Transfer"];

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
      (history?.price_history || []).concat(asset?.price_history?.price || [])
    );
  };
  const submitTransaction = () => {
    pushData("ADD-TRANSACTION-CONFIRM");
    const timestamp =
      date.getTime() +
      convertInMillis(hoursRef.current.value, minutesRef.current.value);

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
    if (!settings.quantity) triggerAlert("Error", "You must enter a quantity");
  };
  useEffect(() => {
    loadHistory(initialToken);
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
      extraCss="max-w-[380px]"
      isOpen={!!showEditTransaction}
      onClose={() => setShowEditTransaction(false)}
      title="Edit Transaction"
    >
      <ButtonSlider
        switcherOptions={switcherOptions}
        typeSelected={typeSelected}
        setTypeSelected={setTypeSelected}
      />
      {typeSelected === "Transfer" ? (
        <div className="flex flex-col w-full">
          <p className="text-sm text-light-font-100 dark:text-dark-font-100 mb-2.5">
            Transfer
          </p>
          <Menu
            title={
              <div className="flex items-center justify-between w-full px-2.5">
                {transferType}
                <BsChevronDown className="text-light-font-100 dark:text-dark-font-100 text-xl lg:text-lg md:text-base" />
              </div>
            }
          >
            <div
              className="bg-light-bg-terciary dark:bg-dark-bg-terciary rounded-t transition-all
                   duration-200 text-sm lg:text-[13px] md:text-xs"
              onClick={() => setTransferType("Transfer In")}
            >
              Transfer In
            </div>
            <div
              className="bg-light-bg-terciary dark:bg-dark-bg-terciary rounded-b transition-all
                   duration-200 text-sm lg:text-[13px] md:text-xs"
              onClick={() => setTransferType("Transfer Out")}
            >
              Transfer Out
            </div>
          </Menu>
        </div>
      ) : null}
      <p className="text-sm text-light-font-100 dark:text-dark-font-100 mb-2.5">
        Amount
      </p>
      <div className="flex items-center bg-light-bg-terciary dark:bg-dark-bg-terciary h-[35px] rounded">
        <input
          className="h-full w-full"
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
        <div className="text-light-font-100 dark:text-dark-font-100 pr-2.5 h-full pl-2.5">
          {tokenTsx.symbol}
        </div>
      </div>
      <>
        <p className="text-sm text-light-font-100 dark:text-dark-font-100 mb-2.5 mt-[15px]">
          Price
        </p>
        <div className="flex items-center bg-light-bg-terciary dark:bg-dark-bg-terciary h-[35px] rounded">
          <input
            className="h-full w-full"
            type="number"
            value={getFormattedAmount(settings.price)}
            placeholder={JSON.stringify(getFormattedAmount(settings.price))}
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
          <div className="text-light-font-100 dark:text-dark-font-100 pr-2.5 h-full pl-2.5">
            {tokenTsx.symbol}
          </div>
        </div>
        {switcherPriceOptions
          .filter((entry) => entry)
          .map((name) => {
            const isActive = activePrice === name;
            return (
              <button
                className={`${buttonMarketPriceStyle} ${
                  isActive ? "opacity-100" : "opacity-50"
                }`}
                key={name}
                onClick={() => {
                  setActivePrice(name);
                  getPriceFromActivePriceOption(name);
                }}
              >
                {name}
              </button>
            );
          })}
      </>

      <p className="text-sm text-light-font-100 dark:text-dark-font-100 mb-2.5 mt-[15px]">
        Date & Time
      </p>
      <div className="flex items-center">
        <div className="flex w-auto mr-2.5">
          <Menu
            title={
              <div
                className="flex mr-2.5 relative  items-center w-full bg-light-bg-terciary rounded-md dark:bg-dark-bg-terciary h-[35px]
                 cursor-pointer max-w-full justify-between"
              >
                <input
                  className="w-full  cursor-pointer bg-light-bg-terciary rounded-md dark:bg-dark-bg-terciary h-full"
                  value={getDate(date.getTime())}
                />
                <BsCalendar3 className="text-light-font-100 dark:text-dark-font-100 text-sm" />
              </div>
            }
          >
            <Calendar
              className="static p-0 border-0 shadow-none"
              selectedDay={date}
              onSelect={setDate}
            />
          </Menu>
        </div>
        <div className="bg-light-bg-terciary dark:bg-dark-bg-terciary rounded-md h-[35px] flex items-center w-fit pr-2.5">
          <input
            className={inputTimeStyle}
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
          <p className="text-sm text-light-font-100 dark:text-dark-font-100">
            :
          </p>
          <input
            className={inputTimeStyle}
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
          <BiTimeFive className="text-base text-light-font-60 dark:text-dark-font-60" />
        </div>
      </div>
      <p className="text-sm text-light-font-100 dark:text-dark-font-100 mb-2.5 mt-[15px]">
        Total
      </p>
      <div className="flex items-center bg-light-bg-terciary dark:bg-dark-bg-terciary h-[35px] rounded">
        <input
          className="h-full w-full"
          type="number"
          value={settings.price * parseFloat(settings.quantity)}
          readOnly
        />
        <div className="text-light-font-100 dark:text-dark-font-100 pr-2.5 h-full pl-2.5">
          USD
        </div>
      </div>
      <Collapse startingHeight={"max-h-[0px]"} isOpen={showNote}>
        <div className="flex">
          <div className="flex flex-col w-[80%] mr-2.5">
            <p className="text-sm text-light-font-100 dark:text-dark-font-100 mb-2.5 mt-[15px]">
              Note
            </p>
            <input
              className=" bg-light-bg-terciary dark:bg-dark-bg-terciary h-[35px] rounded"
              placeholder="Type a note"
              onChange={(e) => {
                setSettings((prev) => ({ ...prev, note: e.target.value }));
              }}
            />
          </div>
          <div className="flex flex-col w-[70px]">
            <p className="text-sm text-light-font-100 dark:text-dark-font-100 mb-2.5 mt-[15px]">
              Fee
            </p>
            <div className="flex items-center bg-light-bg-terciary dark:bg-dark-bg-terciary h-[35px] rounded">
              <input
                className="pr-[25px] w-full h-full"
                placeholder="0.5"
                type="number"
                onChange={(e) => {
                  setSettings((prev) => ({
                    ...prev,
                    fee: e.target.value,
                  }));
                }}
              />
              <div className="text-light-font-100 dark:text-dark-font-100 pr-2.5 h-full pl-2.5">
                %
              </div>
            </div>
          </div>
        </div>
      </Collapse>
      <div className="flex flex-col">
        <Button extraCss="mt-5" onClick={() => setShowNote(!showNote)}>
          {showNote ? "Hide Fee and Note" : "Fee, Note"}
        </Button>
        <Button
          extraCss="mt-2.5 border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue"
          onClick={() => submitTransaction()}
          disabled={!historicalData}
        >
          Add Transaction
        </Button>
      </div>
    </Modal>
  );
};
