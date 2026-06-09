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
    <div className="space-y-6">
      {/* Title Header with Trigger Rules Button */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
            Operational Alerts
          </h1>
          <p className="text-xs text-zinc-500 font-medium mt-0.5">
            Resolve warnings, overdue booking notifications, and maintenance logs
          </p>
        </div>
        <button
          onClick={onTriggerRules}
          disabled={isEvaluatingRules}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-lg shadow-sm hover:bg-zinc-50 disabled:opacity-50 transition-colors"
        >
          <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" />
          {isEvaluatingRules ? "Running Scan..." : "Scan System State"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unresolved Alerts (Col Span 2) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="px-1">
            <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              Unresolved Alerts ({openAlerts.length})
            </h2>
          </div>

          <div className="space-y-3">
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
                  className={`p-4 border rounded-xl shadow-sm flex items-start gap-4 transition-all ${
                    alert.severity === "high"
                      ? "bg-rose-50/20 border-rose-100 hover:border-rose-200"
                      : alert.severity === "medium"
                      ? "bg-amber-50/20 border-amber-100 hover:border-amber-200"
                      : "bg-blue-50/10 border-blue-100 hover:border-blue-200"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      alert.severity === "high"
                        ? "bg-rose-50 text-rose-600 border border-rose-100"
                        : alert.severity === "medium"
                        ? "bg-amber-50 text-amber-600 border border-amber-100"
                        : "bg-blue-50 text-blue-600 border border-blue-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                              alert.severity === "high"
                                ? "bg-rose-50 text-rose-700 border-rose-100"
                                : alert.severity === "medium"
                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                : "bg-blue-50 text-blue-700 border-blue-100"
                            }`}
                          >
                            {alert.severity} Severity
                          </span>
                          <span className="text-[10px] font-medium text-zinc-400">
                            Type: {alert.type.replace("_", " ")}
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-medium">
                          {new Date(alert.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-zinc-950 leading-relaxed">
                        {alert.message}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onExplainAlert(alert.message)}
                        className="px-2.5 py-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-md transition-colors"
                      >
                        Explain with Copilot
                      </button>
                      <button
                        onClick={() => onResolveAlert(alert._id)}
                        className="px-2.5 py-1 text-[10px] font-semibold text-zinc-700 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-md transition-colors"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {openAlerts.length === 0 && (
              <div className="text-center py-12 text-zinc-400 font-medium bg-white border border-zinc-200 rounded-xl shadow-sm">
                No active warnings. System is fully operational.
              </div>
            )}
          </div>
        </div>

        {/* Resolved Alerts Sidebar */}
        <div className="space-y-4">
          <div className="px-1">
            <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Resolved History ({resolvedAlerts.length})
            </h2>
          </div>

          <div className="p-4 bg-zinc-50/50 border border-zinc-200 rounded-xl space-y-3 max-h-[480px] overflow-y-auto">
            {resolvedAlerts.map((alert) => (
              <div
                key={alert._id}
                className="p-3 bg-white border border-zinc-200/60 rounded-lg space-y-1 opacity-70"
              >
                <div className="flex items-center justify-between text-[9px] text-zinc-400">
                  <span className="font-semibold uppercase">{alert.type}</span>
                  <span>
                    {new Date(alert.createdAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-zinc-600 line-through decoration-zinc-300">
                  {alert.message}
                </p>
              </div>
            ))}
            {resolvedAlerts.length === 0 && (
              <div className="text-center py-6 text-zinc-400 text-xs">
                No alerts resolved in this session.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
