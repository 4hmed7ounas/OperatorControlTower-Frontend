"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

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
    <aside className="w-80 border-l border-zinc-200 bg-white flex flex-col h-screen sticky top-0">
      {/* Copilot Header */}
      <div className="h-16 px-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/20">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-zinc-950 text-sm tracking-tight block">Ops Copilot</span>
            <span className="text-[10px] text-zinc-400 font-semibold block flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500" />
              Llama 3 Active
            </span>
          </div>
        </div>
      </div>

      {/* Suggestion Pills */}
      <div className="p-3 border-b border-zinc-100 bg-zinc-50/50 flex flex-wrap gap-1.5">
        {suggestionPills.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pill.text)}
            className="px-2 py-1 bg-white border border-zinc-200 rounded-md text-[10px] font-semibold text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 shadow-sm transition-all"
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-170px)]">
        {chatHistory.map((message) => {
          const isCopilot = message.sender === "copilot";
          return (
            <div
              key={message.id}
              className={`flex gap-2.5 ${isCopilot ? "justify-start" : "justify-end"}`}
            >
              {isCopilot && (
                <div className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center text-zinc-600 border border-zinc-200/50 shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div className="max-w-[85%] space-y-2">
                {/* Chat Bubble */}
                <div
                  className={`p-3 rounded-lg text-xs leading-relaxed border ${
                    isCopilot
                      ? "bg-zinc-50 text-zinc-800 border-zinc-150"
                      : "bg-emerald-600 text-white border-emerald-700 shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-line font-medium">
                    {message.text}
                  </div>
                </div>

                {/* Structured Action proposed by AI */}
                {isCopilot && message.type === "action" && message.action && (
                  <div className="border border-zinc-200 rounded-lg bg-white shadow-sm overflow-hidden text-xs">
                    <div className="px-3 py-2 bg-zinc-50 border-b border-zinc-100 font-semibold text-zinc-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                      Suggested Action
                    </div>
                    
                    <div className="p-3 space-y-2 font-medium">
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        Action: <span className="text-zinc-800 font-bold">{message.action}</span>
                      </div>
                      <div className="bg-zinc-50 p-2 rounded text-[10px] font-mono text-zinc-600 overflow-x-auto">
                        {JSON.stringify(message.args, null, 2)}
                      </div>

                      {/* Action States */}
                      {message.actionStatus === "pending" && (
                        <div className="flex gap-1.5 pt-1">
                          <button
                            onClick={() => handleActionRun(message.id, message.action!, message.args)}
                            className="px-2 py-1 bg-emerald-600 border border-emerald-700 text-white rounded text-[10px] font-semibold flex-1 hover:bg-emerald-700 transition-colors"
                          >
                            Run Action
                          </button>
                          <button
                            onClick={() => handleActionExplain(message.action!, message.args)}
                            className="px-2 py-1 bg-zinc-50 border border-zinc-200 text-zinc-700 rounded text-[10px] font-semibold hover:bg-zinc-100 transition-colors"
                          >
                            Explain
                          </button>
                          <button
                            onClick={() => handleActionIgnore(message.id)}
                            className="px-2 py-1 bg-zinc-50 border border-zinc-200 text-zinc-400 rounded text-[10px] font-semibold hover:bg-zinc-100 transition-colors"
                          >
                            Ignore
                          </button>
                        </div>
                      )}

                      {message.actionStatus === "running" && (
                        <div className="text-[10px] text-zinc-500 font-semibold flex items-center gap-1.5 pt-1">
                          <RefreshCw className="w-3 h-3 animate-spin text-zinc-500" />
                          Executing tool service...
                        </div>
                      )}

                      {message.actionStatus === "success" && (
                        <div className="p-2 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] rounded flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{message.actionResult}</span>
                        </div>
                      )}

                      {message.actionStatus === "failed" && (
                        <div className="p-2 bg-rose-50 border border-rose-100 text-rose-800 text-[10px] rounded flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>{message.actionResult}</span>
                        </div>
                      )}

                      {message.actionStatus === "ignored" && (
                        <div className="text-[10px] text-zinc-400 italic">
                          Action proposal dismissed.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {!isCopilot && (
                <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
                  U
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center text-zinc-600 border border-zinc-200/50 shrink-0">
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="max-w-[85%] bg-zinc-50 text-zinc-400 border border-zinc-150 p-3 rounded-lg text-xs italic animate-pulse">
              Copilot is evaluating state...
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
        className="p-3 border-t border-zinc-200 bg-white"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask Copilot..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            className="w-full pl-3 pr-10 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 bg-zinc-50/50 text-zinc-900 placeholder-zinc-400 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-1.5 p-1.5 bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-zinc-200 disabled:text-zinc-400 rounded-md transition-colors"
          >
            <Send className="w-3 h-3" />
          </button>
        </div>
      </form>
    </aside>
  );
}
