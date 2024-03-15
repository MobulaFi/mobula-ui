"use client";

import Editor, { useMonaco } from "@monaco-editor/react";
import React, { useEffect, useState } from "react";
import { default as ChartAnalytic } from "./components/chart";
import { fakeData } from "./constants";

export const Analytic = () => {
  const [activeLanguage, setActiveLanguage] = useState("sql");
  const [userType, setUserType] = useState("");
  const monaco = useMonaco();

  function handleEditorChange(value, event) {
    console.log("here is the current model value:", value);
    setUserType(value);

    // monaco.languages.registerCompletionItemProvider("javascript", {
    //   provideCompletionItems: function (model, position) {
    //     const regex = /\w+\.$/;
    //     const lastChar = value[value.length - 1];
    //     const match = lastChar === "/" || lastChar === ".";

    //     console.log("splitTextsplitText=", match, lastChar);
    //     if (match) {
    //       // Renvoyez les suggestions de complétion appropriées pour JavaScript
    //       return {
    //         suggestions: [
    //           {
    //             label: "function1",
    //             kind: monaco.languages.CompletionItemKind.Function,
    //             insertText: "function1",
    //           },
    //           {
    //             label: "function2",
    //             kind: monaco.languages.CompletionItemKind.Function,
    //             insertText: "function2",
    //           },
    //           // Ajoutez d'autres suggestions de complétion ici
    //         ],
    //       };
    //     }
    //     // Si le dernier caractère n'est pas un ".", renvoyez null
    //     return null;
    //   },
    // });
  }

  useEffect(() => {
    if (monaco) {
      console.log("here is the monaco instance:", monaco);
    }
  }, [monaco, userType]);
  useEffect(() => {}, [monaco]);

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
                label: "select version 23342",
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

  const html = `<html>
    <body>
      <h1>Contact Us</h1>
      <form>
        <label>Name:</label>
        <input id="name" type="text" />
        <label>Email:</label>
        <input id="email" type="text" />
      </form>
    </body>
  </html>`;

  return (
    <div className="flex flex-col items-center justify-center mt-10">
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
        <div className="flex w-[800px] mt-5">
          <Editor
            height="500px"
            defaultLanguage="javascript"
            defaultValue="// some comment"
            onMount={(editor, monaco) => {
              setEditorInstance(editor);
            }}
            onChange={handleEditorChange}
          />
        </div>
      </div>
      <div className="max-w-[800px] w-full mx-auto mt-10">
        <ChartAnalytic
          chartOptions={{
            data: fakeData,
            type: "line",
            name: "Profit",
            colors: {
              up: "#00C087",
              down: "#FF3B30",
            },
          }}
        />
        <div className="my-5 h-[20px]" />
        <ChartAnalytic
          chartOptions={{
            data: fakeData,
            type: "area-large",
            name: "Profit",
          }}
        />
        <div className="my-5 h-[20px]" />
        <ChartAnalytic
          chartOptions={{
            data: fakeData,
            type: "bar",
            name: "Profit",
            colors: {
              up: "orange",
              down: "orange",
            },
          }}
        />
        <div className="my-5 h-[20px]" />
        <ChartAnalytic
          chartOptions={{
            data: [
              ["Testing", 40],
              ["Testing 2", 60],
              ["Testing 3", 20],
              ["Testing 4", 80],
            ],
            type: "pie",
            name: "Profit",
          }}
        />
      </div>
    </div>
  );
};
