import React, { useRef, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Unlink,
  Undo,
  Redo,
  RemoveFormatting,
  Eye,
  Code2,
} from "lucide-react";

const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Write detailed content here...",
  minHeight = "220px",
  label,
  required = false,
}) => {
  const editorRef = useRef(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState(value);

  useEffect(() => {
    if (editorRef.current && !isHtmlMode) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
    setHtmlContent(value || "");
  }, [value, isHtmlMode]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setHtmlContent(html);
      if (onChange) onChange(html);
    }
  };

  const handleHtmlChange = (e) => {
    const val = e.target.value;
    setHtmlContent(val);
    if (onChange) onChange(val);
  };

  const executeCommand = (command, val = null) => {
    if (isHtmlMode) return;
    if (!editorRef.current) return;

    editorRef.current.focus();

    if (command === "insertUnorderedList" || command === "insertOrderedList") {
      const isBlank = !editorRef.current.innerText.trim() && !editorRef.current.innerHTML.includes("<img");
      if (isBlank) {
        const tag = command === "insertUnorderedList" ? "ul" : "ol";
        editorRef.current.innerHTML = `<${tag}><li><br></li></${tag}>`;
        const li = editorRef.current.querySelector("li");
        if (li) {
          const range = document.createRange();
          const sel = window.getSelection();
          range.setStart(li, 0);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
        handleInput();
        return;
      }
    }

    document.execCommand(command, false, val);
    handleInput();
  };

  const handleInsertLink = (e) => {
    e.preventDefault();
    if (isHtmlMode) return;
    const url = prompt("Enter link URL (e.g. https://...):", "https://");
    if (url && url !== "https://") {
      executeCommand("createLink", url);
    }
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsHtmlMode(!isHtmlMode);
            }}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 cursor-pointer"
          >
            {isHtmlMode ? (
              <>
                <Eye size={12} />
                <span>Visual Editor</span>
              </>
            ) : (
              <>
                <Code2 size={12} />
                <span>HTML View</span>
              </>
            )}
          </button>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50/70 p-2 text-slate-600">
          <button
            type="button"
            disabled={isHtmlMode}
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand("bold");
            }}
            className="rounded-lg p-1.5 hover:bg-slate-200/70 disabled:opacity-30 cursor-pointer transition-colors"
            title="Bold"
          >
            <Bold size={15} />
          </button>
          <button
            type="button"
            disabled={isHtmlMode}
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand("italic");
            }}
            className="rounded-lg p-1.5 hover:bg-slate-200/70 disabled:opacity-30 cursor-pointer transition-colors"
            title="Italic"
          >
            <Italic size={15} />
          </button>
          <button
            type="button"
            disabled={isHtmlMode}
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand("underline");
            }}
            className="rounded-lg p-1.5 hover:bg-slate-200/70 disabled:opacity-30 cursor-pointer transition-colors"
            title="Underline"
          >
            <Underline size={15} />
          </button>
          <button
            type="button"
            disabled={isHtmlMode}
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand("strikeThrough");
            }}
            className="rounded-lg p-1.5 hover:bg-slate-200/70 disabled:opacity-30 cursor-pointer transition-colors"
            title="Strikethrough"
          >
            <Strikethrough size={15} />
          </button>

          <span className="h-4 w-px bg-slate-200 mx-1" />

          <button
            type="button"
            disabled={isHtmlMode}
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand("formatBlock", "<h1>");
            }}
            className="rounded-lg p-1.5 hover:bg-slate-200/70 disabled:opacity-30 cursor-pointer transition-colors"
            title="Heading 1"
          >
            <Heading1 size={15} />
          </button>
          <button
            type="button"
            disabled={isHtmlMode}
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand("formatBlock", "<h2>");
            }}
            className="rounded-lg p-1.5 hover:bg-slate-200/70 disabled:opacity-30 cursor-pointer transition-colors"
            title="Heading 2"
          >
            <Heading2 size={15} />
          </button>
          <button
            type="button"
            disabled={isHtmlMode}
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand("formatBlock", "<h3>");
            }}
            className="rounded-lg p-1.5 hover:bg-slate-200/70 disabled:opacity-30 cursor-pointer transition-colors"
            title="Heading 3"
          >
            <Heading3 size={15} />
          </button>

          <span className="h-4 w-px bg-slate-200 mx-1" />

          <button
            type="button"
            disabled={isHtmlMode}
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand("insertUnorderedList");
            }}
            className="rounded-lg p-1.5 hover:bg-slate-200/70 active:bg-blue-100 disabled:opacity-30 cursor-pointer transition-colors"
            title="Bullet List"
          >
            <List size={15} />
          </button>
          <button
            type="button"
            disabled={isHtmlMode}
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand("insertOrderedList");
            }}
            className="rounded-lg p-1.5 hover:bg-slate-200/70 active:bg-blue-100 disabled:opacity-30 cursor-pointer transition-colors"
            title="Numbered List"
          >
            <ListOrdered size={15} />
          </button>
          <button
            type="button"
            disabled={isHtmlMode}
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand("formatBlock", "<blockquote>");
            }}
            className="rounded-lg p-1.5 hover:bg-slate-200/70 disabled:opacity-30 cursor-pointer transition-colors"
            title="Blockquote"
          >
            <Quote size={15} />
          </button>
          <button
            type="button"
            disabled={isHtmlMode}
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand("formatBlock", "<pre>");
            }}
            className="rounded-lg p-1.5 hover:bg-slate-200/70 disabled:opacity-30 cursor-pointer transition-colors"
            title="Code Block"
          >
            <Code size={15} />
          </button>

          <span className="h-4 w-px bg-slate-200 mx-1" />

          <button
            type="button"
            disabled={isHtmlMode}
            onMouseDown={handleInsertLink}
            className="rounded-lg p-1.5 hover:bg-slate-200/70 disabled:opacity-30 cursor-pointer transition-colors"
            title="Insert Link"
          >
            <LinkIcon size={15} />
          </button>
          <button
            type="button"
            disabled={isHtmlMode}
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand("unlink");
            }}
            className="rounded-lg p-1.5 hover:bg-slate-200/70 disabled:opacity-30 cursor-pointer transition-colors"
            title="Remove Link"
          >
            <Unlink size={15} />
          </button>
          <button
            type="button"
            disabled={isHtmlMode}
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand("removeFormat");
            }}
            className="rounded-lg p-1.5 hover:bg-slate-200/70 disabled:opacity-30 cursor-pointer transition-colors"
            title="Clear Formatting"
          >
            <RemoveFormatting size={15} />
          </button>

          <span className="h-4 w-px bg-slate-200 mx-1" />

          <button
            type="button"
            disabled={isHtmlMode}
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand("undo");
            }}
            className="rounded-lg p-1.5 hover:bg-slate-200/70 disabled:opacity-30 cursor-pointer transition-colors"
            title="Undo"
          >
            <Undo size={15} />
          </button>
          <button
            type="button"
            disabled={isHtmlMode}
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand("redo");
            }}
            className="rounded-lg p-1.5 hover:bg-slate-200/70 disabled:opacity-30 cursor-pointer transition-colors"
            title="Redo"
          >
            <Redo size={15} />
          </button>
        </div>

        {isHtmlMode ? (
          <textarea
            value={htmlContent}
            onChange={handleHtmlChange}
            style={{ minHeight }}
            className="w-full p-4 font-mono text-xs text-slate-100 focus:outline-none resize-y bg-slate-900"
            placeholder="Edit HTML directly..."
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            style={{ minHeight }}
            data-placeholder={placeholder}
            className="rich-editor-content w-full p-4 text-sm text-slate-800 focus:outline-none overflow-y-auto empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
          />
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
