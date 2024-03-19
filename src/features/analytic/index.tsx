"use client";

import Editor, { useMonaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { MediumFont } from "../../components/fonts";
import ChartAnalytic from "./components/chart";
import { SelectorPopup } from "./components/popup/selector";
import { Table } from "./components/table";
import { getFakeData } from "./constants";
import { useAnalytics } from "./context-manager";

export const Analytic = () => {
  const [activeLanguage, setActiveLanguage] = useState("sql");
  const [userType, setUserType] = useState("");
  const { views } = useAnalytics();
  const { resolvedTheme } = useTheme();
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
             border-light-border-primary dark:border-dark-border-primary p-5 mb-2.5`}
            style={{ width: `calc(${view.width} - 5px)` }}
          >
            <MediumFont extraCss="font-medium mb-5">{view.name}</MediumFont>
            {view.type === "table" ? (
              <Table />
            ) : (
              <ChartAnalytic chartOptions={view} />
            )}
          </div>
        ))}
      </div>
      <SelectorPopup />
    </div>
  );
};
