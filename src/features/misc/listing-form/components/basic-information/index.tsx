import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FiSearch, FiUpload } from "react-icons/fi";
import {
  ExtraLargeFont,
  LargeFont,
  MediumFont,
  SmallFont,
} from "../../../../../components/fonts";
import { API_ENDPOINT } from "../../../../../constants";
import { createSupabaseDOClient } from "../../../../../lib/supabase";
import { ACTIONS } from "../../reducer";
import { inputStyle } from "../../styles";
import { InputTemplate } from "../ui/inputs-template";
import { MultiInputTemplate } from "../ui/multi-input-template";

export const BasicInformation = ({ state, dispatch }) => {
  const isDescriptionError = state.description.length > 300;
  const [categories, setCategories] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const highlight = ["Meme", "Governance"];
  const isMobile =
    (typeof window !== "undefined" ? window.innerWidth : 0) < 768;

  useEffect(() => {
    const supabase = createSupabaseDOClient();
    supabase
      .from("categories")
      .select("name")
      .order("market_cap", { ascending: false })
      .not("name", "eq", "All")
      .then((r) => {
        if (r.data)
          setCategories([
            ...highlight,
            ...r.data
              .filter((e) => !highlight.includes(e.name))
              .map((e) => e.name),
          ]);
      });
  }, []);

  const handleUpload = (e) => {
    const reader = new FileReader();
    reader.addEventListener("load", async () => {
      if (reader.readyState === 2) {
        dispatch({
          type: ACTIONS.SET_LOGO,
          payload: {
            name: "loading",
            value: true,
          },
        });

        const base64Data = String(reader.result);
        const assetName = state.name;

        const apiURL = `${API_ENDPOINT}/asset/upload-logo`;

        try {
          const response = await axios.post(apiURL, {
            body: {
              logoUrl: base64Data,
              name: assetName,
            },
          });

          const logoUrl = response.data.logoUrl;

          dispatch({
            type: ACTIONS.SET_LOGO,
            payload: {
              name: "logo",
              value: logoUrl,
            },
          });
        } catch (error) {
          console.error("Error uploading logo:", error);
        }

        dispatch({
          type: ACTIONS.SET_LOGO,
          payload: {
            name: "loading",
            value: false,
          },
        });
      }
    });

    reader.readAsDataURL(e.target.files[0]);
  };

  const getFilteredCategories = () =>
    categories.filter((category: string) =>
      category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredCategorie = getFilteredCategories();

  return (
    <div className="flex flex-col w-full max-w-[400px] md:max-w-full">
      <div className="flex items-center mb-1">
        <ExtraLargeFont>General Data</ExtraLargeFont>
      </div>
      <InputTemplate
        name="name"
        state={state}
        dispatch={dispatch}
        placeholder="Mobula"
        title="Asset name"
        extraCss="w-[400px] md:w-full"
        action={ACTIONS.SET_INPUT}
      />
      <InputTemplate
        name="symbol"
        dispatch={dispatch}
        state={state}
        placeholder="MOBL"
        title="Asset symbol"
        extraCss="w-[150px]"
        action={ACTIONS.SET_INPUT}
      />{" "}
      <MultiInputTemplate
        dispatch={dispatch}
        state={state}
        name="contracts"
        title="Contracts"
        placeholder="0x5FeF...7d5dd4"
        hasLogo
        template={{
          address: "",
          blockchain: "",
          blockchain_id: 1,
        }}
      />
      <div className="flex flex-col mb-5 mt-5">
        <LargeFont extraCss="mb-1.5">Upload a logo</LargeFont>
        <SmallFont extraCss="mb-1.5">(only png files)</SmallFont>
        <div
          className="flex w-[100px] h-[100px] rounded-full bg-light-bg-terciary dark:bg-dark-bg-terciary 
        relative border border-light-border-primary dark:border-dark-border-primary"
        >
          <div
            className={`flex w-full h-full ${
              state.image.logo ? "opacity-0" : "opacity-100"
            } 
          transition-all duration-200 rounded-full bg-light-bg-terciary dark:bg-dark-bg-terciary 
          items-center absolute justify-center cursor-pointer`}
          >
            {!state.image.loading ? (
              <input
                className="cursor-pointer w-full h-full bg-light-bg-terciary dark:bg-dark-bg-terciary opacity-0 rounded-full text-ellipsis"
                type="file"
                id="file"
                name="file"
                accept="image/png, image/jpg"
                multiple
                onChange={handleUpload}
              />
            ) : null}
            <FiUpload
              className={`text-light-font-100 dark:text-dark-font-100 ml-[-100px] text-[28px] ${
                state.image.logo ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
          {state.image.uploaded_logo || state.image.logo ? (
            <img
              className="object-contain h-full w-full rounded-full"
              alt="Token Logo"
              src={state.image.logo}
            />
          ) : null}
        </div>
      </div>
      <div className="flex flex-col mb-5">
        <div className="flex items-center mb-2.5 justify-between max-w-[400px] md:max-w-full">
          <LargeFont>Type a description</LargeFont>
          <MediumFont
            extraCss={`font-normal ${
              isDescriptionError
                ? "text-red dark:text-red"
                : "text-light-font-60 dark:text-dark-font-60"
            }`}
          >{`${state.description.length}/ 300`}</MediumFont>
        </div>
        <textarea
          className={`h-[200px] w-[400px] md:w-full rounded-md text-light-font-100 dark:text-dark-font-100 bg-light-bg-terciary dark:bg-dark-bg-terciary border ${
            isDescriptionError
              ? "hover:border-red hover:dark:border-red active:border-red active:dark:border-red focus:border-red focus:dark:border-red border-red dark:border-red"
              : "active:border-light-border-primary active:dark:border-dark-border-primary focus:border-light-border-primary focus:dark:border-dark-border-primary hover:border-light-border-primary hover:dark:border-dark-border-primary border-light-border-primary dark:border-dark-border-primary"
          }`}
          placeholder="Type a description for your asset"
          name="description"
          value={state.description}
          onChange={(e) => {
            if (e.target.value.length > 301) return;
            dispatch({
              type: ACTIONS.SET_INPUT,
              payload: { name: e.target.name, value: e.target.value },
            });
          }}
        />
      </div>
      {/* DO NOT DELETE */}
      {/* <Flex direction="column" mb="20px">
        <TextLandingMedium mb="10px">AI Generated</TextLandingMedium>
        <Textarea
          w={["100%", "100%", "400px"]}
          h="200px"
          borderRadius="8px"
          bg={boxBg3}
          name="aiGeneratedDescription"
          isReadOnly
          _hover={{border: isDescriptionError ? "1px solid red" : borders}}
          _active={{border: isDescriptionError ? "1px solid red" : borders}}
          border={isDescriptionError ? "1px solid red" : borders}
          _focus={{
            border: isDescriptionError ? "1px solid red" : borders,
          }}
          onChange={e => {
            if (e.target.value.length > 301) return;
            dispatch({
              type: ACTIONS.SET_INPUT,
              payload: {name: e.target.name, value: e.target.value},
            });
          }}
        />
      </Flex> */}
      <div className="flex flex-col mb-5">
        <LargeFont extraCss="mb-2.5">Select categories</LargeFont>
        <div
          className={`${inputStyle} flex items-center border border-light-border-primary dark:border-dark-border-primary pl-0`}
        >
          <div className="flex items-center justify-center h-full">
            <FiSearch className="text-light-font-100 dark:text-dark-font-100" />
          </div>
          <input
            className="bg-light-bg-terciary dark:bg-dark-bg-terciary h-full w-full "
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap mt-2.5 max-w-[450px] md:max-w-full">
          {[
            ...state.categories,
            ...getFilteredCategories().filter(
              (tag, i) => i < 10 && !state.categories.includes(tag)
            ),
          ].map(
            (categorie) =>
              categorie && (
                <button
                  key={categorie}
                  className={`flex items-center justify-center bg-light-bg-tags dark:bg-dark-bg-tags px-[7.5px] h-[24px] mr-[5px] 
                  mt-[5px] w-fit rounded-md text-sm lg:text-[13px] md:text-xs text-light-font-100
                   dark:text-dark-font-100 pt-0 md:pt0.5 ${
                     state.categories.includes(categorie)
                       ? "opacity-100"
                       : "opacity-50"
                   }`}
                  onClick={() => {
                    if (state.categories.includes(categorie))
                      dispatch({
                        type: ACTIONS.REMOVE_CATEGORIE,
                        payload: categorie,
                      });
                    else
                      dispatch({
                        type: ACTIONS.ADD_CATEGORIES,
                        payload: categorie,
                      });
                  }}
                >
                  {categorie}
                  {state.categories.includes(categorie) ? (
                    <AiOutlineClose className="ml-[5px] text-[10px]" />
                  ) : null}
                </button>
              )
          )}
          {filteredCategorie.length > 10 ? (
            <button
              className={`bg-light-bg-tags dark:bg-dark-bg-tags px-[7.5px] h-[24px]  
            mt-[5px] w-fit rounded-md text-sm lg:text-[13px] md:text-xs text-light-font-100
             dark:text-dark-font-100 `}
              disabled
            >
              {`+${filteredCategorie.length - 10} more`}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
