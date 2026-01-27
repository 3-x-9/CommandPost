import { useMemo } from "react";

interface CodeHighlighterProps {
    code: string;
    language?: "json" | "text" | "javascript" | "html";
}

export function CodeHighlighter({ code, language = "json" }: CodeHighlighterProps) {

    const highlightedCode = useMemo(() => {
        if (language !== "json") return code;

        try {
            // Very basic JSON highlighting logic
            const json = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
                let cls = 'number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'json-key';
                    } else {
                        cls = 'string';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'boolean';
                } else if (/null/.test(match)) {
                    cls = 'null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            });
        } catch (e) {
            return code;
        }
    }, [code, language]);

    return (
        <pre
            className={`code-highlighter ${language}`}
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
    );
}
