"use client";

import React from "react";
import { History, Cpu, User, CheckCircle, XCircle } from "lucide-react";

interface ActionLogsViewProps {
  logs: any[];
}

export default function ActionLogsView({ logs }: ActionLogsViewProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-250">
      <div className="pb-4 border-b border-zinc-200/70">
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          Audit Logs
        </h1>
        <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider mt-1">
          Traceability log of all operations executed by human dispatchers and the AI Copilot
        </p>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-50/10">
                <th className="px-5 py-3 font-semibold">Triggered By</th>
                <th className="px-5 py-3 font-semibold">Action Type</th>
                <th className="px-5 py-3 font-semibold">Parameters / Payload</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {logs.map((log) => {
                const isAi = log.triggeredBy === "ai";
                return (
                  <tr key={log._id} className="hover:bg-zinc-50/20 transition-all duration-150">
                    <td className="px-5 py-4 font-bold text-zinc-950">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          isAi
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100/50"
                            : "bg-indigo-50 text-indigo-700 border-indigo-100/50"
                        }`}
                      >
                        {isAi ? (
                          <>
                            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                            AI Copilot
                          </>
                        ) : (
                          <>
                            <User className="w-3.5 h-3.5 text-indigo-600" />
                            Operator
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-zinc-800 font-mono text-[11px]">
                      {log.actionType}
                    </td>
                    <td className="px-5 py-4">
                      <div className="max-w-xs md:max-w-md bg-zinc-950 text-zinc-100 p-2.5 rounded-lg text-[10px] font-mono border border-zinc-850 overflow-x-auto shadow-inner">
                        {JSON.stringify(log.payload, null, 2)}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          log.status === "success"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100/50"
                            : "bg-rose-50 text-rose-700 border-rose-100/50"
                        }`}
                      >
                        {log.status === "success" ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        {log.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right text-zinc-400 font-bold whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-zinc-400 font-semibold bg-white">
                    No actions logged in database.
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
