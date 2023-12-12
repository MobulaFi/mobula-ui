"use client";
import { useTheme } from "next-themes";
import { useContext, useState } from "react";
import { AiOutlineClose, AiOutlineDash } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { useConnect } from "wagmi";
import { Button } from "../../components/button";
import { LargeFont, SmallFont } from "../../components/fonts";
import { ModalContainer } from "../../components/modal-container";
import { PopupStateContext, PopupUpdateContext } from "../../contexts/popup";

export const Connect = () => {
  const { setConnect: setIsVisible } = useContext(PopupUpdateContext);
  const { connect: isVisible } = useContext(PopupStateContext);
  const [status, setStatus] = useState("idle");
  const [userMail, setUserMail] = useState("");
  const { resolvedTheme } = useTheme();
  const buttonStyle =
    "h-[35px] w-[90%] mx-auto hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover transition-all duration-200 px-3 bg-light-bg-terciary dark:bg-dark-bg-terciary rounded relative border border-light-border-primary dark:border-dark-border-primary mt-2.5";
  const { connect, connectors, pendingConnector } = useConnect({
    onError: () => {
      setStatus("error");
    },
    onSuccess() {
      setStatus("success");
      setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    },
  });
  const conenctorImage = pendingConnector?.["storage" as never];

  const getTitle = () => {
    switch (status) {
      case "loading":
        return {
          title: "Opening wallet",
          description: "Please confirm the connection in your wallet",
        };
      case "error":
        return {
          title: "Connexion failed",
          description:
            "An error occured while connecting your wallet, please try again",
        };
      case "success":
        return {
          title: "Successfully connected",
          description:
            "Welcome to Mobula, you can now use all the features of the app",
        };
      default:
        return {
          title: "Welcome to Mobula",
          description:
            " Sign in to customize your experience. Mobula does not collect data about users",
        };
    }
  };

  const title = getTitle();

  return (
    <ModalContainer
      isOpen={isVisible}
      onClose={() => {
        setStatus("idle");
        setIsVisible(false);
      }}
      extraCss="max-w-[450px]"
    >
      <div className="flex w-full">
        <div className="w-full flex flex-col p-5 relative">
          <button
            className="absolute right-5 top-5"
            onClick={() => {
              setStatus("idle");
              setIsVisible(false);
            }}
          >
            <AiOutlineClose className="text-lg text-light-font-100 dark:text-dark-font-100" />
          </button>
          <LargeFont extraCss="text-center mb-2.5">{title.title}</LargeFont>
          <SmallFont extraCss="text-center mb-4 max-w-[320px] mx-auto">
            {title.description}
          </SmallFont>
          {status === "idle" ? (
            <>
              <button
                className={buttonStyle}
                onClick={() => {
                  setStatus("loading");
                  connect({ connector: connectors[3] });
                }}
              >
                <div className="flex w-full items-center justify-center">
                  <img
                    src="/logo/coinbase.png"
                    alt="Coinbase Wallet logo"
                    className="w-[22px] h-[22px] mr-1"
                  />
                  <img
                    src="/logo/metamask.png"
                    alt="Metamask logo"
                    className="w-[22px] h-[22px] mr-1"
                  />
                  <p className="text-light-font-100 dark:text-dark-font-100 text-sm md:text-xs mx-auto">
                    Continue with EVM Wallet
                  </p>
                  <img
                    src="/logo/brave.png"
                    alt="Brave Wallet logo"
                    className="w-[22px] h-[22px] mr-1"
                  />
                  <img
                    src="/logo/trustwallet.png"
                    alt="Trust wallet logo"
                    className="w-[22px] h-[22px] ml-1"
                  />
                </div>
              </button>
              <button
                className={buttonStyle}
                onClick={() => connect({ connector: connectors[1] })}
              >
                <div className="flex w-full items-center justify-center">
                  <img
                    src="/logo/cw.png"
                    alt="Wallet Connect logo"
                    className="w-[22px] h-[22px] mr-1"
                  />
                  <p className="text-light-font-100 dark:text-dark-font-100 text-sm md:text-xs">
                    Continue with Wallet Connect
                  </p>
                </div>
              </button>
              <button
                className={`${buttonStyle} opacity-50 cursor-not-allowed`}
                disabled
              >
                <div className="flex w-full items-center justify-center">
                  <img
                    src="/logo/google.png"
                    alt="Google logo"
                    className="w-[22px] h-[22px] mr-1"
                  />
                  <p className="text-light-font-100 dark:text-dark-font-100 text-sm md:text-xs">
                    Continue with Google
                  </p>
                </div>
              </button>
              <div className="flex items-center my-2.5 w-[90%] mx-auto">
                <div className="flex-1 h-[1px] bg-light-border-primary dark:bg-dark-border-primary" />
                <p className="text-light-font-100 dark:text-dark-font-100 text-sm md:text-xs mx-2.5">
                  or
                </p>
                <div className="flex-1 h-[1px] bg-light-border-primary dark:bg-dark-border-primary" />
              </div>
              <div
                className="flex items-center w-[90%] mx-auto h-[40px] bg-light-bg-terciary dark:bg-dark-bg-terciary 
           border border-light-border-primary dark:border-dark-border-primary rounded"
              >
                <input
                  type="text"
                  className="w-full h-full rounded px-2.5 text-light-font-100 dark:text-dark-font-100 text-sm
               border-0 border-none bg-light-bg-terciary dark:bg-dark-bg-terciary"
                  placeholder="Enter your email"
                  onChange={(event) => setUserMail(event.target.value)}
                />
                <button
                  className="h-[35px] w-fit px-2.5 bg-light-bg-hover dark:bg-dark-bg-hover
             rounded border border-light-border-primary dark:border-dark-border-primary mr-0.5 
             cursor-not-allowed opacity-50"
                  disabled
                >
                  <div className="flex w-full items-center justify-center">
                    <p className="text-light-font-100 dark:text-dark-font-100 text-sm md:text-xs">
                      Continue
                    </p>
                  </div>
                </button>
              </div>
            </>
          ) : null}
          {status !== "idle" ? (
            <div className="w-full flex flex-col relative items-center">
              <div className="flex items-center">
                <img
                  src={conenctorImage?.["connect-image"]}
                  className="h-[50px] w-[50px] rounded-full my-4 mr-1"
                  alt="Pending connector logo"
                />
                <AiOutlineDash className="text-light-font-60 dark:text-dark-font-60 text-6xl mx-2.5 my-4" />
                {status === "loading" ? (
                  <img
                    src={
                      resolvedTheme === "dark"
                        ? "/mobula/mobula-logo.svg"
                        : "/mobula/mobula-logo-light.svg"
                    }
                    className="h-[50px] w-[50px] rounded-full my-4"
                  />
                ) : null}
                {status === "success" ? (
                  <BsCheckLg className="text-6xl text-green my-4" />
                ) : null}
                {status === "error" ? (
                  <AiOutlineClose className="text-5xl text-red my-4" />
                ) : null}
              </div>
              {status === "error" ? (
                <Button onClick={() => setStatus("idle")} extraCss="mt-2">
                  Retry
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </ModalContainer>
  );
};
