"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, CheckCircle2, AlertCircle, RefreshCw, HelpCircle } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "copilot";
  text: string;
  type?: "text" | "action";
  action?: string;
  args?: any;
  actionStatus?: "pending" | "running" | "success" | "failed" | "ignored";
  actionResult?: string;
}

interface CopilotPanelProps {
  onSendMessage: (message: string) => Promise<any>;
  onExecuteAction: (actionName: string, args: any) => Promise<any>;
  chatHistory: Message[];
  setChatHistory: React.Dispatch<React.SetStateAction<Message[]>>;
  onGlobalRefresh: () => void;
}

/**
 * A lightweight, dependency-free Markdown renderer to safely convert Copilot
 * response headers, list blocks, and bold inline items to rich JSX elements.
 */
function renderMessageText(text: string, isCopilot: boolean) {
  if (!text) return null;
  if (!isCopilot) {
    return <div className="whitespace-pre-line">{text}</div>;
  }

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let inList = false;

  const parseInlineBold = (lineText: string) => {
    const parts = lineText.split("**");
    return parts.map((part, idx) => {
      if (idx % 2 === 1) {
        return <strong key={idx} className="font-extrabold text-zinc-950">{part}</strong>;
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("### ")) {
      // Flush any pending list
      if (inList) {
        elements.push(
          <ul key={`list-${index}`} className="list-disc pl-4 my-2.5 space-y-1.5">
            {...listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
      const headerText = trimmed.substring(4);
      elements.push(
        <h4 key={`h-${index}`} className="text-xs font-bold text-zinc-900 mt-4 mb-2 uppercase tracking-wider block">
          {parseInlineBold(headerText)}
        </h4>
      );
    } else if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      inList = true;
      const itemText = trimmed.substring(2);
      listItems.push(
        <li key={`li-${index}`} className="text-[12px] text-zinc-700 leading-relaxed font-semibold list-item ml-1">
          {parseInlineBold(itemText)}
        </li>
      );
    } else if (trimmed === "") {
      // Flush pending list on empty line spacing
      if (inList) {
        elements.push(
          <ul key={`list-${index}`} className="list-disc pl-4 my-2.5 space-y-1.5">
            {...listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
      elements.push(<div key={`space-${index}`} className="h-1.5" />);
    } else {
      if (inList) {
        elements.push(
          <ul key={`list-${index}`} className="list-disc pl-4 my-2.5 space-y-1.5">
            {...listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
      elements.push(
        <p key={`p-${index}`} className="text-[12px] leading-relaxed my-1 font-medium text-zinc-700">
          {parseInlineBold(line)}
        </p>
      );
    }
  });

  // Flush any final list items
  if (inList && listItems.length > 0) {
    elements.push(
      <ul key="list-final" className="list-disc pl-4 my-2.5 space-y-1.5">
        {...listItems}
      </ul>
    );
  }

  return <div className="space-y-1">{elements}</div>;
}

export default function CopilotPanel({
  onSendMessage,
  onExecuteAction,
  chatHistory,
  setChatHistory,
  onGlobalRefresh,
}: CopilotPanelProps) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionPills = [
    { text: "What needs attention right now?", label: "🚨 Attention" },
    { text: "Summarize today's operations", label: "📊 Summarize Ops" },
    { text: "Which vehicles are underperforming?", label: "⚠️ Underperforming" },
  ];

  // Scroll to bottom whenever history changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Add user message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text,
    };
    
    setChatHistory((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await onSendMessage(text);
      
      const copilotMsg: Message = {
        id: Math.random().toString(),
        sender: "copilot",
        text: response.text || "",
        type: response.type || "text",
        action: response.action,
        args: response.args,
        actionStatus: response.type === "action" ? "pending" : undefined,
      };

      setChatHistory((prev) => [...prev, copilotMsg]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: Math.random().toString(),
        sender: "copilot",
        text: `Error connecting to Copilot: ${error.message}. Running in fallback mode.`,
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionRun = async (messageId: string, action: string, args: any) => {
    // Set status to running
    setChatHistory((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, actionStatus: "running" } : m))
    );

    try {
      const result = await onExecuteAction(action, args);
      if (result.status === "success") {
        setChatHistory((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  actionStatus: "success",
                  actionResult: result.message || "Executed successfully.",
                }
              : m
          )
        );
        // Refresh all DB states globally
        onGlobalRefresh();
      } else {
        setChatHistory((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  actionStatus: "failed",
                  actionResult: result.error || "Execution failed.",
                }
              : m
          )
        );
      }
    } catch (error: any) {
      setChatHistory((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                actionStatus: "failed",
                actionResult: error.message || "Execution error.",
              }
            : m
        )
      );
    }
  };

  const handleActionExplain = (action: string, args: any) => {
    handleSend(`Explain why you suggested running "${action}" with parameters ${JSON.stringify(args)}`);
  };

  const handleActionIgnore = (messageId: string) => {
    setChatHistory((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, actionStatus: "ignored" } : m))
    );
  };

  return (
    <aside className="w-[360px] border-l border-zinc-200/80 bg-zinc-50/40 flex flex-col h-screen sticky top-0 shadow-[-4px_0_16px_rgba(0,0,0,0.015)] shrink-0">
      {/* Copilot Header */}
      <div className="h-16 px-5 border-b border-zinc-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50 shadow-sm">
            <Bot className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="font-semibold text-zinc-900 text-sm tracking-tight block">Ops Copilot</span>
            <span className="text-[10px] text-zinc-400 font-semibold block flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              Llama 3.3 Active
            </span>
          </div>
        </div>
      </div>

      {/* Suggestion Pills */}
      <div className="p-3.5 border-b border-zinc-100 bg-white flex flex-col gap-2">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
          Suggested Queries
        </span>
        <div className="flex flex-wrap gap-1.5">
          {suggestionPills.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(pill.text)}
              className="px-2.5 py-1.5 bg-zinc-50/60 border border-zinc-200/60 hover:border-emerald-200 hover:bg-emerald-50/10 rounded-lg text-[10px] font-bold text-zinc-600 hover:text-emerald-700 shadow-sm transition-all duration-150"
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-180px)]">
        {chatHistory.map((message) => {
          const isCopilot = message.sender === "copilot";
          return (
            <div
              key={message.id}
              className={`flex gap-2.5 ${isCopilot ? "justify-start" : "justify-end"}`}
            >
              {isCopilot && (
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className="max-w-[85%] space-y-2">
                {/* Chat Bubble */}
                <div
                  className={`p-3.5 rounded-2xl text-[12px] leading-relaxed shadow-sm border ${
                    isCopilot
                      ? "bg-white text-zinc-800 border-zinc-200/70 rounded-tl-none font-medium"
                      : "bg-gradient-to-br from-indigo-600 to-violet-600 text-white border-indigo-700 rounded-tr-none font-semibold"
                  }`}
                >
                  <div>
                    {renderMessageText(message.text, isCopilot)}
                  </div>
                </div>

                {/* Structured Action proposed by AI */}
                {isCopilot && message.type === "action" && message.action && (
                  <div className="border border-zinc-200 rounded-xl bg-white shadow-sm overflow-hidden text-xs border-l-4 border-l-emerald-500 animate-in fade-in duration-200">
                    <div className="px-3.5 py-2.5 bg-zinc-50 border-b border-zinc-100 font-bold text-zinc-900 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                      Suggested Action
                    </div>
                    
                    <div className="p-3.5 space-y-3 font-semibold text-zinc-700">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                          Tool Call:
                        </span>
                        <span className="text-zinc-900 font-bold font-mono bg-zinc-150 px-2 py-0.5 rounded border border-zinc-200">
                          {message.action}
                        </span>
                      </div>
                      
                      <div className="bg-zinc-950 text-zinc-100 p-3 rounded-lg text-[10px] font-mono border border-zinc-800 overflow-x-auto shadow-inner">
                        {JSON.stringify(message.args, null, 2)}
                      </div>

                      {/* Action States */}
                      {message.actionStatus === "pending" && (
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            onClick={() => handleActionRun(message.id, message.action!, message.args)}
                            className="px-3 py-1.5 bg-emerald-600 border border-emerald-700 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex-1 shadow-sm transition-colors cursor-pointer"
                          >
                            Run Action
                          </button>
                          <button
                            onClick={() => handleActionExplain(message.action!, message.args)}
                            className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 text-zinc-700 rounded-lg text-[10px] font-bold hover:bg-zinc-100 transition-colors cursor-pointer"
                          >
                            Explain
                          </button>
                          <button
                            onClick={() => handleActionIgnore(message.id)}
                            className="px-2 py-1.5 text-zinc-400 hover:text-zinc-600 text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            Ignore
                          </button>
                        </div>
                      )}

                      {message.actionStatus === "running" && (
                        <div className="text-[10px] text-zinc-500 font-bold flex items-center gap-1.5 pt-1">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-zinc-400" />
                          Executing tool service...
                        </div>
                      )}

                      {message.actionStatus === "success" && (
                        <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] rounded-lg flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{message.actionResult}</span>
                        </div>
                      )}

                      {message.actionStatus === "failed" && (
                        <div className="p-3 bg-rose-50 border border-rose-100 text-rose-800 text-[10px] rounded-lg flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>{message.actionResult}</span>
                        </div>
                      )}

                      {message.actionStatus === "ignored" && (
                        <div className="text-[10px] text-zinc-400 italic font-medium">
                          Action proposal dismissed.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {!isCopilot && (
                <div className="w-7 h-7 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold border border-zinc-800 shadow-sm shrink-0">
                  U
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-2.5 justify-start animate-pulse">
            <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <Bot className="w-4 h-4 animate-spin text-emerald-500" />
            </div>
            <div className="max-w-[85%] bg-white border border-zinc-200/80 p-3.5 rounded-2xl rounded-tl-none text-[11px] leading-relaxed text-zinc-400 italic font-semibold shadow-sm flex items-center gap-2">
              Copilot is evaluating Control Tower...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputValue);
        }}
        className="p-4 border-t border-zinc-200 bg-white"
      >
        <div className="relative flex items-center bg-zinc-50 border border-zinc-200 rounded-xl focus-within:border-zinc-300 focus-within:ring-1 focus-within:ring-zinc-200 transition-all shadow-sm">
          <input
            type="text"
            placeholder="Ask Copilot..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-transparent focus:outline-none text-zinc-900 placeholder-zinc-400 disabled:opacity-50 font-medium"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-1.5 p-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-200 text-white disabled:text-zinc-400 rounded-lg transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </aside>
  );
}
