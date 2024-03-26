"use client";

import Editor, { useMonaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { forwardRef, useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { ReactSortable } from "react-sortablejs";
import { Button } from "../../components/button";
import { PreviewOptions } from "./components/popup/preview-options";
import { SelectorPopup } from "./components/popup/selector";
import { getFakeData } from "./constants";
import { useAnalytics } from "./context-manager";

const CustomComponent = forwardRef<HTMLDivElement, any>((props, ref) => (
  <div
    ref={ref}
    style={{
      display: "flex",
      flexWrap: "wrap",
      width: "100%",
      maxWidth: "1200px",
      justifyContent: "space-between",
    }}
  >
    {props.children}
  </div>
));

export const Analytic = () => {
  const [activeLanguage, setActiveLanguage] = useState("sql");
  const {
    views,
    setSelectedQuery,
    selectedQuery,
    setViews,
    setIsOpen,
    isOpen,
  } = useAnalytics();
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
  }, [monaco, selectedQuery]);

  function handleEditorChange(value, event) {
    setSelectedQuery((prev) => ({ ...prev, query: value }));
  }

  const changeLanguage = (language: string) => {
    setActiveLanguage(language);
  };

  const [completionProvider, setCompletionProvider] = useState(null);
  const [editorInstance, setEditorInstance] = useState(null);

  useEffect(() => {
    if (editorInstance && monaco) {
      const provider = monaco.languages.registerCompletionItemProvider("sql", {
        provideCompletionItems: function (model, position) {
          const suggestions = [];
          const value = selectedQuery.query;
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
      });
      setCompletionProvider(provider as never);

      return () => {
        if (completionProvider) {
          (completionProvider as any).dispose();
        }
      };
    }
  }, [editorInstance, selectedQuery.query]);

  const removeView = () => {
    const newViews = views.filter((view, i) => i !== isHovering - 1);
    setViews(newViews);
  };
  const editView = (view) => {
    setSelectedQuery(view);
    setViews(views.filter((v) => v !== view));
    setIsOpen(true);
  };
  console.log("views", views);

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
            onClick={() => changeLanguage("sql")}
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
        <div className="w-[800px] mt-5 p-2.5 rounded-lg bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary">
          <Editor
            height="500px"
            defaultLanguage="sql"
            defaultValue=""
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

      <ReactSortable
        list={views}
        setList={setViews}
        tag={CustomComponent}
        animation={200}
        delay={0}
      >
        {views?.map((view, i) => {
          console.log(
            "calc(${view.width}% - 5px)",
            `calc(${view.width}% - 5px)`,
            view.width
          );
          return (
            <div
              className={` bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg border
          border-light-border-primary dark:border-dark-border-primary p-5 mb-2.5 relative`}
              style={{ width: `calc(${view.width}% - 5px)` }}
              onMouseEnter={() => setIsHovering(i + 1)}
              onMouseLeave={() => setIsHovering(0)}
              key={view.id}
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
              <PreviewOptions selectedQuery={view} isPreview={false} />
            </div>
          );
        })}
      </ReactSortable>

      <Button extraCss="my-10" onClick={() => setIsOpen(true)}>
        Open
      </Button>
      <SelectorPopup />
    </div>
  );
};
