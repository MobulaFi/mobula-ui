import { useMonaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useAnalytics } from "../../context-manager";

export const useEditor = () => {
  const monaco = useMonaco();
  const [completionProvider, setCompletionProvider] = useState(null);
  const [editorInstance, setEditorInstance] = useState(null);
  const { setSelectedQuery, selectedQuery } = useAnalytics();
  const { resolvedTheme } = useTheme();

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
          "editor.background": resolvedTheme === "dark" ? "#151929" : "#fcfcfc",
        },
      });
      monaco.editor.setTheme("onedark");
    }
  }, [monaco, resolvedTheme, selectedQuery]);

  function handleEditorChange(value, event) {
    setSelectedQuery((prev) => ({ ...prev, query: value }));
  }

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

  return { editorInstance, handleEditorChange, setEditorInstance };
};
