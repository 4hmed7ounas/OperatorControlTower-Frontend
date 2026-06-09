"use client";

import React from "react";
import { AlertOctagon, AlertTriangle, Info, CheckCircle2, Play } from "lucide-react";

interface AlertsViewProps {
  alerts: any[];
  onResolveAlert: (id: string) => void;
  onExplainAlert: (alertMessage: string) => void;
  onTriggerRules: () => void;
  isEvaluatingRules: boolean;
}

export default function AlertsView({
  alerts,
  onResolveAlert,
  onExplainAlert,
  onTriggerRules,
  isEvaluatingRules,
}: AlertsViewProps) {
  const openAlerts = alerts.filter((a) => a.status === "open");
  const resolvedAlerts = alerts.filter((a) => a.status === "resolved");

  return (
    <div className="space-y-8 animate-in fade-in duration-250">
      {/* Title Header with Trigger Rules Button */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200/70">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Operational Alerts
          </h1>
          <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider mt-1">
            Resolve fleet bottlenecks, late returns, and urgent diagnostics
          </p>
        </div>
        <button
          onClick={onTriggerRules}
          disabled={isEvaluatingRules}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-zinc-700 bg-white border border-zinc-200 hover:border-zinc-355 rounded-lg shadow-sm hover:bg-zinc-50 disabled:opacity-50 transition-all cursor-pointer"
        >
          <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" />
          {isEvaluatingRules ? "Running Scan..." : "Scan System State"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unresolved Alerts (Col Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="px-1 flex items-center justify-between">
            <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
              Unresolved Alerts ({openAlerts.length})
            </h2>
          </div>

          <div className="space-y-3.5">
            {openAlerts.map((alert) => {
              const Icon =
                alert.severity === "high"
                  ? AlertOctagon
                  : alert.severity === "medium"
                  ? AlertTriangle
                  : Info;
              return (
                <div
                  key={alert._id}
                  className={`p-4 border rounded-xl shadow-[0_1.5px_4px_rgba(0,0,0,0.01)] flex items-start gap-4 transition-all hover:shadow-md ${
                    alert.severity === "high"
                      ? "border-l-4 border-l-rose-500 bg-rose-50/10 border-rose-100/70"
                      : alert.severity === "medium"
                      ? "border-l-4 border-l-amber-500 bg-amber-50/10 border-amber-100/70"
                      : "border-l-4 border-l-indigo-400 bg-indigo-50/10 border-indigo-100/70"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 border ${
                      alert.severity === "high"
                        ? "bg-rose-50 text-rose-600 border-rose-100"
                        : alert.severity === "medium"
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : "bg-indigo-50 text-indigo-600 border-indigo-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 space-y-3 font-semibold text-zinc-700">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                              alert.severity === "high"
                                ? "bg-rose-50 text-rose-700 border-rose-100"
                                : alert.severity === "medium"
                                ? "bg-amber-50 text-amber-700 border-amber-105"
                                : "bg-indigo-50 text-indigo-700 border-indigo-100"
                            }`}
                          >
                            {alert.severity} priority
                          </span>
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                            Type: {alert.type.replace("_", " ")}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-bold">
                          {new Date(alert.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-zinc-950 leading-relaxed">
                        {alert.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => onExplainAlert(alert.message)}
                        className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-md transition-colors cursor-pointer"
                      >
                        Explain with Copilot
                      </button>
                      <button
                        onClick={() => onResolveAlert(alert._id)}
                        className="px-2.5 py-1 text-[10px] font-bold text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-md transition-colors cursor-pointer"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {openAlerts.length === 0 && (
              <div className="text-center py-16 text-zinc-400 font-semibold bg-white border border-zinc-200 rounded-xl shadow-sm">
                No active warnings. Fleet is operating at 100% efficiency.
              </div>
            )}
          </div>
        </div>

        {/* Resolved Alerts Sidebar */}
        <div className="space-y-4">
          <div className="px-1">
            <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Resolved History ({resolvedAlerts.length})
            </h2>
          </div>

          <div className="p-4 bg-zinc-50/50 border border-zinc-200/80 rounded-xl space-y-3.5 max-h-[520px] overflow-y-auto shadow-inner">
            {resolvedAlerts.map((alert) => (
              <div
                key={alert._id}
                className="p-3.5 bg-white border border-zinc-200/50 rounded-lg space-y-1.5 opacity-70 hover:opacity-100 transition-opacity"
              >
                <div className="flex items-center justify-between text-[9px] text-zinc-400 font-bold uppercase tracking-wider">
                  <span>{alert.type}</span>
                  <span>
                    {new Date(alert.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-zinc-500 line-through decoration-zinc-300 leading-normal">
                  {alert.message}
                </p>
              </div>
            ))}
            {resolvedAlerts.length === 0 && (
              <div className="text-center py-8 text-zinc-400 text-xs font-semibold">
                No alerts resolved in this session.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
