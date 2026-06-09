"use client";

import React from "react";
import { Cpu, User, CheckCircle, XCircle } from "lucide-react";

interface ActionLogsViewProps {
  logs: any[];
}

/**
 * Translates developer database parameters into simple dispatcher action descriptions.
 */
function renderLogDetails(actionType: string, payload: any) {
  if (!payload || Object.keys(payload).length === 0) {
    return <span className="text-zinc-500 font-medium">No parameters recorded.</span>;
  }

  switch (actionType) {
    case "scheduleMaintenance":
      return (
        <span className="font-semibold text-zinc-850">
          Scheduled shop repairs for vehicle <strong className="text-zinc-900 font-bold">"{payload.vehicleName || "Unit"}"</strong>.
        </span>
      );

    case "completeMaintenance":
      return (
        <span className="font-semibold text-zinc-850">
          Completed maintenance. Diagnostic usage counters reset to <strong className="text-zinc-900 font-bold">{payload.totalUsageHoursReset || 0}h</strong>.
        </span>
      );

    case "markBookingAsLate":
      return (
        <span className="font-semibold text-zinc-850">
          Flagged rental for <strong className="text-zinc-900 font-bold">"{payload.customerName}"</strong> as LATE.
        </span>
      );

    case "reassignVehicle":
      return (
        <span className="font-semibold text-zinc-850 leading-relaxed block">
          Reallocated rental for <strong className="text-zinc-900 font-bold">"{payload.customerName}"</strong> from unit <strong className="text-zinc-900">{payload.oldVehicleName}</strong> to available unit <strong className="text-zinc-900">{payload.newVehicleName}</strong>.
        </span>
      );

    case "systemSeed":
      return (
        <span className="font-semibold text-zinc-500 italic">
          System sandbox initialized with {payload.vehiclesCount} vehicles and {payload.bookingsCount} bookings.
        </span>
      );

    default:
      // Fallback for custom actions: list key-values in clean readable style
      return (
        <div className="space-y-0.5">
          {Object.entries(payload).map(([key, val]) => (
            <div key={key} className="flex gap-2 text-[10px]">
              <span className="text-zinc-400 uppercase font-bold">{key}:</span>
              <span className="text-zinc-700 font-medium">{String(val)}</span>
            </div>
          ))}
        </div>
      );
  }
}

/**
 * Translates generic system actions to dispatcher-friendly headers.
 */
function getActionLabel(actionType: string) {
  switch (actionType) {
    case "scheduleMaintenance":
      return "Schedule Repair";
    case "completeMaintenance":
      return "Resolve Repair";
    case "markBookingAsLate":
      return "Flag Late Rental";
    case "reassignVehicle":
      return "Reallocate Vehicle";
    case "systemSeed":
      return "System Reset";
    default:
      return actionType;
  }
}

export default function ActionLogsView({ logs }: ActionLogsViewProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-250">
      <div className="pb-4 border-b border-zinc-200/70">
        <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
          Activity History
        </h1>
        <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider mt-1">
          Recent operational commands logged in the control tower
        </p>
      </div>

      <div className="bg-white border border-zinc-200/80 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-50/10">
                <th className="px-5 py-3 font-semibold">Triggered By</th>
                <th className="px-5 py-3 font-semibold">Action</th>
                <th className="px-5 py-3 font-semibold">Details</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {logs.map((log) => {
                const isAi = log.triggeredBy === "ai";
                return (
                  <tr key={log._id} className="hover:bg-zinc-50/20 transition-all duration-150">
                    <td className="px-5 py-4 font-bold text-zinc-900">
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
                    <td className="px-5 py-4 font-bold text-zinc-800">
                      {getActionLabel(log.actionType)}
                    </td>
                    <td className="px-5 py-4 max-w-sm md:max-w-md">
                      {renderLogDetails(log.actionType, log.payload)}
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
                    No activity recorded.
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
