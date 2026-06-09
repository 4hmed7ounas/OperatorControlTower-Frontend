"use client";

import React from "react";
import { History, Cpu, User, CheckCircle, XCircle } from "lucide-react";

interface ActionLogsViewProps {
  logs: any[];
}

export default function ActionLogsView({ logs }: ActionLogsViewProps) {
  return (
    <div className="space-y-6">
      <div className="pb-2 border-b border-zinc-200">
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
          Audit Logs
        </h1>
        <p className="text-xs text-zinc-500 font-medium mt-0.5">
          History of all system actions triggered by human operators and the AI Copilot
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-50/20">
                <th className="px-5 py-3 font-medium">Triggered By</th>
                <th className="px-5 py-3 font-medium">Action Type</th>
                <th className="px-5 py-3 font-medium">Parameters / Details</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {logs.map((log) => {
                const isAi = log.triggeredBy === "ai";
                return (
                  <tr key={log._id} className="hover:bg-zinc-50/10">
                    <td className="px-5 py-4 font-semibold text-zinc-950">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          isAi
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-blue-50 text-blue-700 border-blue-100"
                        }`}
                      >
                        {isAi ? (
                          <>
                            <Cpu className="w-3 h-3 text-emerald-600" />
                            AI Copilot
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3 text-blue-600" />
                            Operator
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-zinc-800 font-mono text-[11px]">
                      {log.actionType}
                    </td>
                    <td className="px-5 py-4">
                      <div className="max-w-xs md:max-w-md bg-zinc-50 p-2 rounded text-[10px] font-mono text-zinc-600 overflow-x-auto">
                        {JSON.stringify(log.payload, null, 2)}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          log.status === "success"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                        }`}
                      >
                        {log.status === "success" ? (
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-rose-600" />
                        )}
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-zinc-400 font-medium whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-zinc-400 font-medium">
                    No actions logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
