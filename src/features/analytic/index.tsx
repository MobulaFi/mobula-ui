"use client";

import Editor, { useMonaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { Button } from "../../components/button";
import { PreviewOptions } from "./components/popup/preview-options";
import { SelectorPopup } from "./components/popup/selector";
import { getFakeData } from "./constants";
import { useAnalytics } from "./context-manager";

export const Analytic = () => {
  const [activeLanguage, setActiveLanguage] = useState("sql");
  const [userType, setUserType] = useState("");
  const { views, setSelectedOption, setViews, setIsOpen, isOpen } =
    useAnalytics();
  const { resolvedTheme } = useTheme();
  const [isHovering, setIsHovering] = useState(0);
  const monaco = useMonaco();

  const fakeData = getFakeData();

  useEffect(() => {
    if (monaco && resolvedTheme) {
      const isDark = resolvedTheme === "dark";
      monaco.editor.defineTheme("onedark", {
        base: isDark ? "vs-dark" : "vs",
        inherit: true,
        rules: [
          {
            token: "comment",
            foreground: "#5d7988",
            fontStyle: "italic",
          },
          { token: "constant", foreground: "#e06c75" },
        ],
        colors: {
          "editor.background": resolvedTheme === "dark" ? "#171B2B" : "#F7F7F7",
        },
      });
      monaco.editor.setTheme("onedark");
    }
  }, [monaco, userType]);

  function handleEditorChange(value, event) {
    setUserType(value);
  }

  const changeLanguage = (language: string) => {
    setActiveLanguage(language);
  };

  const [completionProvider, setCompletionProvider] = useState(null);
  const [editorInstance, setEditorInstance] = useState(null);

  useEffect(() => {
    if (editorInstance && monaco) {
      const provider = monaco.languages.registerCompletionItemProvider(
        "javascript",
        {
          provideCompletionItems: function (model, position) {
            const suggestions = [];
            const value = userType;
            const isLastCharacterDot = value.endsWith(".");

            if (isLastCharacterDot) {
              suggestions.push({
                label: "Ceci est un test",
                kind: monaco.languages.CompletionItemKind.Property,
                insertText: "select @@version",
              } as never);
            }
            return { suggestions };
          },
        }
      );
      setCompletionProvider(provider as never);

      return () => {
        if (completionProvider) {
          (completionProvider as any).dispose();
        }
      };
    }
  }, [editorInstance, userType]);

  const removeView = () => {
    const newViews = views.filter((view, i) => i !== isHovering - 1);
    setViews(newViews);
  };
  const editView = (view) => {
    setSelectedOption(view);
    setViews(views.filter((v) => v !== view));
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10 max-w-[1200px] mx-auto">
      <h1 className="text-4xl">Analytics</h1>
      <div>
        <p className="text-center mt-5">
          Here's an AI-powered Python editor using Codeium.
        </p>
        <div className="flex items-center justify-center mt-5">
          <button
            className="px-2.5 mx-1.5 py-1 rounded bg-dark-font-40"
            onClick={() => changeLanguage("javascript")}
          >
            JavaScript
          </button>
          <button
            className="px-2.5 mx-1.5 py-1 rounded bg-dark-font-40"
            onClick={() => changeLanguage("python")}
          >
            Python
          </button>
          <button
            className="px-2.5 mx-1.5 py-1 rounded bg-dark-font-40"
            onClick={() => changeLanguage("sql")}
          >
            SQL
          </button>
        </div>
        <div className="hidden w-[800px] mt-5 p-2.5 rounded-lg bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary">
          <Editor
            height="500px"
            defaultLanguage="javascript"
            defaultValue="// some comment"
            onMount={(editor, monaco) => {
              setEditorInstance(editor);
            }}
            options={{
              minimap: {
                enabled: false,
              },
              fontSize: 14,
              cursorStyle: "block",
              wordWrap: "on",
            }}
            onChange={handleEditorChange}
          />
        </div>
      </div>
      <div className="flex flex-wrap w-full mt-10 justify-between">
        {views?.map((view, i) => (
          <div
            className={` bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border
             border-light-border-primary dark:border-dark-border-primary p-5 mb-2.5 relative`}
            style={{ width: `calc(${view.width} - 5px)` }}
            onMouseEnter={() => setIsHovering(i + 1)}
            onMouseLeave={() => setIsHovering(0)}
          >
            <Button
              extraCss={`rounded-full absolute top-2.5 right-2.5 text-base transition-all duration-300 ease-in-out ${
                isHovering === i + 1 ? "opacity-100" : "opacity-0"
              }`}
              onClick={removeView}
            >
              <BiTrash />
            </Button>
            <Button
              extraCss={`rounded-full absolute top-2.5 right-[50px] text-base transition-all duration-300 ease-in-out ${
                isHovering === i + 1 ? "opacity-100" : "opacity-0"
              }`}
              onClick={() => editView(view)}
            >
              <FiEdit />
            </Button>
            <PreviewOptions selectedOption={view} isPreview={false} />
          </div>
        ))}
      </div>
      <Button extraCss="my-10" onClick={() => setIsOpen(true)}>
        Open
      </Button>
      <SelectorPopup />
    </div>
  );
};
