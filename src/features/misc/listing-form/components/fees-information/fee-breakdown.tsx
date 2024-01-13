import { useRef } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { MediumFont } from "../../../../../components/fonts";
import { ACTIONS } from "../../reducer";
import { inputStyle } from "../../styles";

export const FeeBreakdown = ({ state, dispatch, side }) => {
  const feeRef = useRef<HTMLInputElement>(null);

  const getInfoFromIndex = (index: number) => {
    switch (index) {
      case 0:
        return {
          placeholder: "Liquidity",
          title: "Type of fees",
          type: "text",
        };
      case 1:
        return {
          placeholder: "0.5",
          title: "Fees (%)",
          type: "number",
          width: "100px",
        };
      case 2:
        return {
          placeholder: "Details about the fee",
          title: "Details",
          type: "text",
        };
      default:
        return {
          placeholder: "",
          title: "",
          type: "",
        };
    }
  };

  const handleChange = (e: any, i: number, value: string | number) => {
    dispatch({
      type: ACTIONS.SET_ELEMENT_TOKENOMICS,
      payload: {
        object: "fees",
        name: e.target.name,
        value,
        i,
      },
    });
    if (state.tokenomics.fees[i + 1]?.side === "sell")
      dispatch({
        type: ACTIONS.SET_ELEMENT_TOKENOMICS,
        payload: {
          object: "fees",
          name: e.target.name,
          value,
          i: i + 1,
        },
      });
  };

  function getBorderValue(j: number) {
    if (feeRef.current === null) return false;
    if (j === 1 && parseFloat(feeRef.current.value) > 100) return true;
    return false;
  }

  return state.tokenomics.fees.map(
    (d, i) =>
      d.side === side && (
        <div className="flex flex-col mt-5" key={d}>
          <button
            className="flex items-center justify-center -mb-5 ml-auto text-light-font-100 dark:text-dark-font-100"
            onClick={() => {
              dispatch({
                type: ACTIONS.REMOVE_ELEMENT_TOKENOMICS,
                payload: { object: "fees", i },
              });
              dispatch({
                type: ACTIONS.REMOVE_ELEMENT_TOKENOMICS,
                payload: { object: "fees", i },
              });
            }}
          >
            <AiOutlineClose className="text-xs" />
          </button>
          {Object.keys(d).map((entry, j) => {
            const { placeholder, title, width, type } = getInfoFromIndex(j);
            return (
              <>
                <div className="flex justify-between">
                  <MediumFont extraCss="mb-2.5">{title}</MediumFont>
                </div>
                {j === 2 ? (
                  <textarea
                    className="h-[200px] w-[400px] md:w-full rounded-md bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary"
                    name="details"
                    value={d[entry]}
                    placeholder={placeholder}
                    onChange={(e) => handleChange(e, i, e.target.value)}
                  />
                ) : null}

                {j !== 2 && j !== 3 ? (
                  <>
                    <input
                      className={`${inputStyle} ${
                        getBorderValue(j)
                          ? "mb-0 border border-red dark:border-red"
                          : "mb-5 border border-light-border-primary dark:border-dark-border-primary"
                      } ${width || "w-full"} min-h-[35px]`}
                      name={entry}
                      ref={j === 1 ? feeRef : null}
                      type={type}
                      value={d[entry]}
                      placeholder={placeholder}
                      onChange={(e) => {
                        if (j === 1)
                          handleChange(e, i, parseFloat(e.target.value));
                        else handleChange(e, i, e.target.value);
                      }}
                    />
                    {getBorderValue(j) ? (
                      <p className="text-red dark:text-red mt-[3px] mb-5 text-xs lg:text-[11px] md:text-[10px]">
                        Fees must be between 0 and 100
                      </p>
                    ) : null}
                  </>
                ) : null}
              </>
            );
          })}
        </div>
      )
  );
};
