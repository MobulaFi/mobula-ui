import { CheckIcon } from "@chakra-ui/icons";
import { Spinner, useClipboard } from "@chakra-ui/react";
import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
// import {useAlert} from "react-alert";
import { BsCheckLg, BsTelegram } from "react-icons/bs";
import { FiCopy, FiExternalLink } from "react-icons/fi";
import { Button } from "../../components/button";
import { LargeFont, SmallFont } from "../../components/fonts";
import { NextChakraLink } from "../../components/link";
import { ModalContainer } from "../../components/modal-container";
import { UserContext } from "../../contexts/user";
import { createSupabaseDOClient } from "../../lib/supabase";
import { GET } from "../../utils/fetch";

interface PopupTelegramProps {
  showPopup: boolean;
  setShowPopup: Dispatch<SetStateAction<boolean>>;
  contentOnly?: boolean;
  hideTitle?: boolean;
}

export const PopupTelegram = ({
  showPopup,
  setShowPopup,
  contentOnly = false,
  hideTitle = false,
}: PopupTelegramProps) => {
  //   const alert = useAlert();
  const { user, setUser } = useContext(UserContext);
  const [code, setCode] = useState(0);
  const [telegram, setTelegram] = useState(user?.telegram || "");
  const [authentified, setAuthentified] = useState(false);
  const [error, setError] = useState("");
  const { onCopy, setValue, hasCopied } = useClipboard("");
  const boxStyle =
    "flex items-center justify-center bg-light-bg-secondary dark:bg-dark-bg-secondary w-[42px] md:w-[35px] rounded text-lg text-light-font-100 dark:text-dark-font-100 mr-[7.5px] md:mr-[5px]";
  const steps = [
    {
      description:
        "Write down your Telegram @Username (create a username if you don't have one). Make sure to spell it correctly!",
      btn: "Submit",
      nbr: 1,
    },

    {
      description:
        "Send the following code to LINK on Telegram or simply click the link below",
      btn: "Open Link",
      nbr: 2,
      link: "@MobulaBot",
    },
    {
      description: "Success! Telegram connected.",
      btn: "Dismiss",
      icon: CheckIcon,
      nbr: 3,
    },
  ];
  const [activeStep, setActiveStep] = useState(steps[0]);

  const handleTelegramChange = () => {
    if (user && telegram !== user?.telegram) {
      const delay = setTimeout(async () => {
        GET("/user/telegramauth", { telegram, account: user?.address })
          .then((r) => r.json())
          .then((r) => {
            if (!r.error) {
              setCode(r.code);
              setValue(r.code);
            } else {
              //   alert.error(r.error);
              setError(r.error);
            }
          });
        let success = false;
        while (!success) {
          try {
            const supabase = createSupabaseDOClient();
            // eslint-disable-next-line no-await-in-loop
            const { data } = await supabase
              .from("users")
              .select("telegram")
              .match({ id: user?.id });
            if (data) {
              success =
                data[0].telegram ===
                telegram?.toLowerCase().split("@").join("");
            }
            // eslint-disable-next-line no-promise-executor-return
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (e) {
            console.log(e);
          }
        }
        // alert.success("Successfully registered your Telegram account.");
        setAuthentified(true);
        setUser(
          (userBuffer) =>
            ({
              ...userBuffer,
              telegram: telegram?.toLowerCase().split("@").join(""),
            } as any)
        );
      }, 1000);

      return () => {
        clearTimeout(delay);
      };
    }
    return null;
  };

  useEffect(() => {
    if (authentified) {
      setActiveStep(steps[2]);
      setTimeout(() => {
        setShowPopup(false);
      }, 1000);
    }
  });

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  const renderContent = () => (
    <>
      {hideTitle ? null : (
        <div className="flex items-center">
          <div className="w-fit h-fit bg-dark-font-100 rounded-full">
            <BsTelegram className="text-telegram text-xl" />
          </div>
          <LargeFont extraCss="ml-2.5 text-normal">
            Connect your telegram
          </LargeFont>
        </div>
      )}
      {error && <SmallFont className="text-red mt-2.5">{error}</SmallFont>}
      {activeStep.nbr === 2 ? (
        <SmallFont extraCss="mt-2.5">
          {activeStep.description.split("LINK")[0]}
          <NextChakraLink href="https://t.me/mobulabot" target="_blank">
            <span className="text-blue">{activeStep.link}</span>
          </NextChakraLink>
          <span className="text-blue" />
          {activeStep.description.split("LINK")[1]}
        </SmallFont>
      ) : (
        <div className="flex items-center mt-2.5">
          {activeStep.nbr === 2 ? (
            <BsCheckLg className="text-green mr-2.5" />
          ) : null}
          <SmallFont>{activeStep.description}</SmallFont>
        </div>
      )}
      <div className="flex flex-col w-full mt-5">
        {activeStep.nbr === 1 ? (
          <input
            className="w-full h-[30px] border border-light-border-primary dark:border-dark-border-primary rounded-md px-2.5 text-light-font-100 dark:text-dark-font-100"
            placeholder="@Username"
            onChange={(e) => setTelegram(e.target.value)}
          />
        ) : null}
        {activeStep.nbr === 2 ? (
          <div className="mb-5 flex items-center">
            {Array.from({ length: 6 }).map((entry, i) =>
              code !== 0 ? (
                <div className={boxStyle}>{String(code)[i]}</div>
              ) : (
                <div className={boxStyle}>
                  <Spinner
                    thickness="3px"
                    speed="0.65s"
                    emptyColor={"grey"}
                    color="blue"
                  />
                </div>
              )
            )}
            <button onClick={onCopy}>
              {hasCopied ? (
                <BsCheckLg className="text-green text-lg md:text-sm ml-2.5" />
              ) : (
                <FiCopy className="text-light-font-40 dark:text-dark-font-40 text-lg md:text-sm ml-2.5" />
              )}
            </button>
          </div>
        ) : null}
        <Button
          extraCss="h-[30px] w-fit px-3 text-normal text-light-font-100 dark:text-dark-font-100 text-sm md:text-xs"
          onClick={() => {
            if (activeStep.nbr === 1) {
              handleTelegramChange();
              setActiveStep(steps[1]);
            }
            if (activeStep.nbr === 2) {
              openInNewTab(`https://t.me/mobulabot?start=${String(code)}`);
            }
          }}
        >
          {activeStep.btn}
          {activeStep.nbr === 2 ? (
            <FiExternalLink className="text-light-font-40 dark:text-dark-font-40 ml-[5px]" />
          ) : null}
        </Button>
      </div>
    </>
  );

  return !contentOnly ? (
    <ModalContainer
      title={""}
      extraCss="max-w-[480px]"
      isOpen={showPopup}
      onClose={() => {
        setShowPopup(false);
        setActiveStep(steps[0]);
      }}
    >
      {renderContent()}
    </ModalContainer>
  ) : (
    renderContent()
  );
};
