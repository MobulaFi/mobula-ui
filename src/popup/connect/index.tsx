"use client";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FaRegCheckCircle } from "react-icons/fa";
import { useAccount, useConnect } from "wagmi";
import { Button } from "../../components/button";
import { SmallFont } from "../../components/fonts";
import { Modal, ModalTitle } from "../../components/modal-container";
import { Spinner } from "../../components/spinner";
import { PopupStateContext, PopupUpdateContext } from "../../contexts/popup";
import { cn } from "../../lib/shadcn/lib/utils";

export const Connect = () => {
  const { setConnect: setIsVisible } = useContext(PopupUpdateContext);
  const { connect: isVisible } = useContext(PopupStateContext);
  const [status, setStatus] = useState("idle");
  const { address } = useAccount();
  const [userMail, setUserMail] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  const buttonStyle =
    "h-[40px] w-full mx-auto hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover transition-all duration-200 px-3 bg-light-bg-terciary dark:bg-dark-bg-terciary rounded-md relative border border-light-border-primary dark:border-dark-border-primary mt-2.5";
  const { connect, connectors, pendingConnector } = useConnect({
    onError: () => {
      setStatus("error");
    },
    onSuccess() {
      Cookies.set(`user-address`, address, {
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
      });
      setStatus("pre-success");
      if (pathname === "/") router.push("/home");

      setTimeout(() => {
        setIsVisible(false);
      }, 2000);
    },
  });

  // const { signMessage } = useSignMessage({
  //   onError() {
  //     setStatus("error-sign");
  //   },
  //   onSuccess(data) {
  //     Cookies.set(`user-signature-${address}`, data, {
  //       secure: process.env.NODE_ENV !== "development",
  //       sameSite: "strict",
  //     });

  //     localStorage.setItem(`user-signature-${address}`, data);
  //     setTimeout(() => {
  //       setStatus("success");
  //       setIsVisible(false);
  //     }, 2000);
  //   },
  // });

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
      case "error-sign":
        return {
          title: "Signature failed",
          description:
            "An error occured while signing your message, please try again",
        };
      case "pre-success":
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
    <Modal
      isOpen={isVisible}
      onClose={() => {
        setStatus("idle");
        setIsVisible(false);
      }}
      extraCss="max-w-[420px]"
    >
      <div className="flex w-full">
        <div className="w-full flex flex-col relative">
          <ModalTitle extraCss="text-center mb-2.5 font-poppins">
            {title.title}
          </ModalTitle>
          <SmallFont extraCss="text-center mb-4 max-w-[320px] mx-auto text-light-font-60 dark:text-dark-font-60">
            {title.description}
          </SmallFont>
          {status !== "success" &&
          status !== "error" &&
          status !== "pre-success" &&
          status !== "error-sign" ? (
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
                    {status === "loading"
                      ? "Waiting for connection"
                      : "Continue with EVM Wallet"}
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
                className={cn(
                  buttonStyle,
                  ` overflow-hidden ${
                    (status === "loading" || status === "pre-success") &&
                    pendingConnector?.name !== "WalletConnect"
                      ? "w-0 h-0 border-0"
                      : ""
                  } transition-all duration-100`
                )}
                onClick={() => connect({ connector: connectors[1] })}
              >
                <div className="flex w-full items-center justify-center">
                  <img
                    src="/logo/cw.png"
                    alt="Wallet Connect logo"
                    className="w-[22px] h-[22px] mr-1"
                  />
                  <p className="text-light-font-100 dark:text-dark-font-100 text-sm md:text-xs">
                    {status === "loading"
                      ? "Waiting for connection"
                      : "Continue with Wallet Connect"}
                  </p>
                </div>
              </button>
              <button
                className={cn(
                  buttonStyle,
                  `cursor-not-allowed overflow-hidden ${
                    (status === "loading" || status === "pre-success") &&
                    pendingConnector?.name !== "Google"
                      ? "w-0 h-0 border-0"
                      : "opacity-50"
                  } transition-all duration-100`
                )}
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
              {status === "loading" ? (
                <div className="w-full h-fit flex items-center justify-center">
                  <Spinner extraCss="h-[70px] w-[70px] rounded-full mx-auto mb-5 mt-2.5" />
                </div>
              ) : null}

              {status === "idle" ? (
                <>
                  <div className="flex items-center my-2.5 w-[90%] mx-auto">
                    <div className="flex-1 h-[1px] bg-light-border-primary dark:bg-dark-border-primary" />
                    <p className="text-light-font-100 dark:text-dark-font-100 text-sm md:text-xs mx-2.5">
                      or
                    </p>
                    <div className="flex-1 h-[1px] bg-light-border-primary dark:bg-dark-border-primary" />
                  </div>
                  <div
                    className="flex items-center w-full mx-auto h-[40px] bg-light-bg-terciary dark:bg-dark-bg-terciary 
           border border-light-border-primary dark:border-dark-border-primary rounded"
                  >
                    <input
                      type="text"
                      className="w-full h-full rounded-md px-2.5 text-light-font-100 dark:text-dark-font-100 text-sm
               border-0 border-none bg-light-bg-terciary dark:bg-dark-bg-terciary"
                      placeholder="This feature is disabled fo now."
                      disabled
                      onChange={(event) => setUserMail(event.target.value)}
                    />
                    <button
                      className="h-[35px] w-fit px-2.5 bg-light-bg-hover dark:bg-dark-bg-hover
             rounded-md border border-light-border-primary dark:border-dark-border-primary mr-0.5 
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
            </>
          ) : null}
          {status === "pre-success" ? (
            <div className="mb-5 mt-4">
              <FaRegCheckCircle className="text-green dark:text-green text-8xl mx-auto" />
            </div>
          ) : null}
          {status === "error" ? (
            <div className="mb-5 mt-3">
              <AiOutlineCloseCircle className="text-red dark:text-red text-7xl mx-auto" />
              <Button onClick={() => setStatus("idle")} extraCss="mt-4 mx-auto">
                Try again
              </Button>
            </div>
          ) : null}
          {status === "error-sign" ? (
            <div className="mb-5 mt-3">
              <AiOutlineCloseCircle className="text-red dark:text-red text-7xl mx-auto" />
              <Button
                onClick={() => setStatus("pre-success")}
                extraCss="mt-4 mx-auto"
              >
                Try again
              </Button>
            </div>
          ) : null}
          {/* {status === "pre-success" ? (
            <Button
              extraCss="mx-auto h-[40px] rounded-md w-fit px-2.5 text-sm"
              onClick={() =>
                signMessage({
                  message: "Sign the message to confirm your identity.",
                })
              }
            >
              SIGN MESSAGE
            </Button>
          ) : null} */}
        </div>
      </div>
    </Modal>
  );
};
