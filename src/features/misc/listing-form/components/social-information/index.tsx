import React, { useContext, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsShieldFillCheck } from "react-icons/bs";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdVisibility } from "react-icons/md";
import {
  ExtraLargeFont,
  LargeFont,
  MediumFont,
} from "../../../../../components/fonts";
import { links } from "../../constant";
import { ListingContext } from "../../context-manager";
import { ACTIONS } from "../../reducer";
import { addButtonStyle, inputStyle } from "../../styles";
import { getIconFromMemberTitle } from "../../utils";
import { InputTemplate } from "../ui/inputs-template";

export const SocialInformation = ({ dispatch, state }) => {
  const [inputs, setInputs] = useState([{ id: 1 }]);
  const [inputsKyc, setInputsKyc] = useState([{ id: 1 }]);
  const [inputsTeam, setInputsTeam] = useState([{ id: 1 }]);
  const { actualPage, setActualPage } = useContext(ListingContext);

  const addInput = (type) => {
    if (type === "kyc") {
      setInputsKyc([
        ...inputsKyc,
        { id: inputsKyc[inputsKyc.length - 1].id + 1 },
      ]);
      dispatch({
        type: ACTIONS.ADD_TO_ARRAY,
        payload: {
          name: "kycs",
          value: "",
        },
      });
    }
    if (type === "team")
      setInputsTeam([
        ...inputsTeam,
        { id: inputsTeam[inputsTeam.length - 1].id + 1 },
      ]);
    if (type === "audit") {
      setInputs([...inputs, { id: inputs[inputs.length - 1].id + 1 }]);
      dispatch({
        type: ACTIONS.ADD_TO_ARRAY,
        payload: {
          name: "audits",
          value: "",
        },
      });
    }
  };

  const removeInput = (id, i, name) => {
    if (name !== "team") {
      dispatch({
        type: ACTIONS.REMOVE_FROM_ARRAY,
        payload: {
          name,
          i,
        },
      });
      if (name === "kyc")
        setInputsKyc(inputsKyc.filter((input) => input.id !== id));
      if (name === "audits")
        setInputs(inputs.filter((input) => input.id !== id));
    } else {
      setInputsTeam(inputsTeam.filter((input) => input.id !== id));
      dispatch({
        type: ACTIONS.REMOVE_ELEMENT,
        payload: {
          name,
          i,
        },
      });
    }
  };

  const handleChange = (e: { target: { name: any; value: any } }) => {
    dispatch({
      type: ACTIONS.SET_INPUT_LINKS,
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const deleteButtonStyle =
    "flex items-center justify-center w-[40px] h-[35px] ml-2.5 rounded-md text-sm lg:text-[13px] md:text-xs mt-2.5 bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary text-light-font-100 dark:text-dark-font-100";

  return (
    <div className="flex flex-col mb-5">
      <div className="flex items-center">
        <button
          className="text-light-font-100 dark:text-dark-font-100 hidden md:flex items-center"
          onClick={() => setActualPage(actualPage - 1)}
        >
          <FaArrowLeftLong className="mr-[5px] text-light-font-100 dark:text-dark-font-100" />
        </button>
        <ExtraLargeFont>Social Information</ExtraLargeFont>
      </div>
      {links?.map((link) => (
        <InputTemplate
          name={link.name}
          dispatch={dispatch}
          state={state}
          isLink={true}
          title={link.title}
          action={ACTIONS.SET_INPUT_LINKS}
          icon={link.icon}
          placeholder={link.placeholder}
          isWebsite
          extraCss="w-[400px] md:w-full"
          key={link.name}
        />
      ))}
      <div className="flex flex-col w-[400px] md:w-full">
        <div className="flex flex-col mt-5">
          <div className="flex items-center">
            <BsShieldFillCheck className="text-light-font-100 dark:text-dark-font-100 mr-[7.5px] text-xl lg:text-lg md:text-base" />
            <LargeFont>Audit</LargeFont>
          </div>
          {inputs?.map((input, i) => (
            <div className="flex" key={input.id}>
              <input
                className={`${inputStyle} border border-light-border-primary dark:border-dark-border-primary mt-2.5 w-full`}
                name="audit"
                key={input.id}
                value={state?.links?.audit}
                placeholder="www.certik.com/audit"
                onChange={(e) => handleChange(e)}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col mt-5">
          <div className="flex items-center">
            <MdVisibility className="text-light-font-100 dark:text-dark-font-100 mr-[7.5px] text-xl lg:text-lg md:text-base" />
            <LargeFont>KYC</LargeFont>
          </div>
          {inputsKyc?.map?.((input, i) => (
            <div className="flex" key={input.id}>
              <input
                className={`${inputStyle} border border-light-border-primary dark:border-dark-border-primary mt-2.5 w-full`}
                name="kyc"
                key={input.id}
                value={state?.links?.kyc}
                placeholder="www.certik.com/kyc"
                onChange={(e) => handleChange(e)}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col mt-[30px] pt-5 border-t border-light-border-primary dark:border-dark-border-primary">
          <LargeFont>Team member(s)</LargeFont>
          {state?.team?.map?.((member, i) => (
            <div
              className={`${i !== 0 ? "mt-[50px]" : ""} w-full flex flex-col`}
              key={member.name + i}
            >
              <button
                className="flex items-center justify-center text-light-font-100 dark:text-dark-font-100 w-fit ml-auto"
                onClick={() =>
                  dispatch({
                    type: ACTIONS.REMOVE_ELEMENT,
                    payload: { i, object: "team" },
                  })
                }
              >
                <AiOutlineClose className="text-xs" />
              </button>
              {Object.keys(member).map((key) => (
                <>
                  <div className="flex items-center mb-2.5">
                    {getIconFromMemberTitle(key)}
                    <MediumFont>
                      {key.slice(0, 1)[0].toUpperCase() +
                        key.slice(1, key.length)}
                    </MediumFont>{" "}
                  </div>
                  <input
                    className={`${inputStyle} border border-light-border-primary dark:border-dark-border-primary mb-5`}
                    key={key}
                    value={member[key]}
                    placeholder={`${
                      key.slice(0, 1).toLocaleUpperCase() + key.slice(1)
                    } of team member`}
                    onChange={(e) =>
                      dispatch({
                        type: ACTIONS.SET_ELEMENT,
                        payload: {
                          i,
                          name: key,
                          value: e.target.value,
                          object: "team",
                        },
                      })
                    }
                  />
                </>
              ))}
            </div>
          ))}
          <button
            className={`${addButtonStyle} w-[170px] `}
            onClick={() => {
              addInput("team");
              dispatch({
                type: ACTIONS.ADD_ELEMENT,
                payload: {
                  object: "team",
                  template: {
                    role: "",
                    name: "",
                    telegram: "",
                    twitter: "",
                    linkedin: "",
                  },
                },
              });
            }}
          >
            + Add team member
          </button>
        </div>
      </div>
    </div>
  );
};
