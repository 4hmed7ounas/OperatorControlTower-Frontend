"use client";

import React from "react";
import {
  TrendingUp,
  AlertOctagon,
  AlertTriangle,
  Car,
  CalendarCheck,
  RefreshCw,
} from "lucide-react";

interface DashboardViewProps {
  vehicles: any[];
  bookings: any[];
  alerts: any[];
  onRefresh: () => void;
  onExplainAlert: (alertMessage: string) => void;
}

export default function DashboardView({
  vehicles,
  bookings,
  alerts,
  onRefresh,
  onExplainAlert,
}: DashboardViewProps) {
  // Compute KPIs
  const activeBookings = bookings.filter(
    (b) => b.status === "ongoing" || b.status === "late"
  ).length;
  
  const activeVehicles = vehicles.filter((v) => v.status === "in_use").length;
  
  const openAlerts = alerts.filter((a) => a.status === "open");
  const openAlertsCount = openAlerts.length;
  const highSeverityAlertsCount = openAlerts.filter(
    (a) => a.severity === "high"
  ).length;

  const lateBookings = bookings.filter((b) => b.status === "late").length;

  return (
    <div className="space-y-8 animate-in fade-in duration-250">
      {/* Title Header with Refresh Button */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200/70">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Ops Control Tower
          </h1>
          <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider mt-1">
            Real-time fleet operations & AI command center
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-zinc-700 bg-white border border-zinc-200 hover:border-zinc-300 rounded-lg shadow-sm hover:bg-zinc-50 transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
          Refresh metrics
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI: Active Bookings */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
              Active Rentals
            </span>
            <span className="text-2xl font-extrabold text-zinc-900 block tracking-tight">
              {activeBookings}
            </span>
            <span className="text-[10px] text-zinc-400 font-semibold block">
              Currently on the road
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/50 shadow-sm">
            <CalendarCheck className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* KPI: Active Vehicles */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
              Vehicles In-Use
            </span>
            <span className="text-2xl font-extrabold text-zinc-900 block tracking-tight">
              {activeVehicles}
            </span>
            <span className="text-[10px] text-zinc-400 font-semibold block">
              Active out of {vehicles.length} total
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100/50 shadow-sm">
            <Car className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* KPI: Open Alerts */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
              Open Alerts
            </span>
            <span className="text-2xl font-extrabold text-zinc-900 block tracking-tight">
              {openAlertsCount}
            </span>
            <span className="text-[10px] text-rose-600 font-semibold block">
              {highSeverityAlertsCount} critical bottlenecks
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/50 shadow-sm">
            <AlertTriangle className="w-4.5 h-4.5" />
          </div>
        </div>

        {/* KPI: Late Bookings */}
        <div className="p-5 bg-white border border-zinc-200/80 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
              Late Statuses
            </span>
            <span className="text-2xl font-extrabold text-zinc-900 block tracking-tight">
              {lateBookings}
            </span>
            <span className="text-[10px] text-zinc-400 font-semibold block">
              Overdue pick-ups & returns
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100/50 shadow-sm">
            <AlertOctagon className="w-4.5 h-4.5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: Operational Tables (Col Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Bookings Summary */}
          <div className="bg-white border border-zinc-200/80 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
              <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                Live Dispatch Log
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200/30">
                {bookings.length} active bookings
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-50/10">
                    <th className="px-5 py-3 font-semibold">Customer</th>
                    <th className="px-5 py-3 font-semibold">Vehicle</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Duration</th>
                    <th className="px-5 py-3 font-semibold text-right">Risk Factor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  {bookings.slice(0, 5).map((booking) => {
                    const durationHours = Math.round(
                      (new Date(booking.endTime).getTime() -
                        new Date(booking.startTime).getTime()) /
                        (1000 * 60 * 60)
                    );
                    return (
                      <tr key={booking._id} className="hover:bg-zinc-50/20 transition-all duration-150">
                        <td className="px-5 py-3.5 font-bold text-zinc-900">
                          {booking.customerName}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-zinc-600">
                          {booking.vehicleId ? booking.vehicleId.name : "Unassigned"}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              booking.status === "completed"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : booking.status === "ongoing"
                                ? "bg-sky-50 text-sky-700 border-sky-100"
                                : booking.status === "late"
                                ? "bg-rose-50 text-rose-700 border-rose-105"
                                : "bg-zinc-100 text-zinc-600 border-zinc-200"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-zinc-500 font-medium">
                          {durationHours}h duration
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              booking.riskScore >= 70
                                ? "text-rose-700 bg-rose-50 border border-rose-100"
                                : booking.riskScore >= 40
                                ? "text-amber-700 bg-amber-50 border border-amber-100"
                                : "text-emerald-700 bg-emerald-50 border border-emerald-100"
                            }`}
                          >
                            {booking.riskScore}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-zinc-400 font-medium">
                        No active dispatch logs found. Seed database to populate.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fleet status overview */}
          <div className="bg-white border border-zinc-200/80 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
              <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                Fleet Diagnostics Tracker
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200/30">
                {vehicles.length} units
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-zinc-50/10">
                    <th className="px-5 py-3 font-semibold">Vehicle</th>
                    <th className="px-5 py-3 font-semibold">Diagnostics</th>
                    <th className="px-5 py-3 font-semibold text-right">Runtime Hours</th>
                    <th className="px-5 py-3 font-semibold text-right">Maintenance Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  {vehicles.slice(0, 5).map((vehicle) => {
                    const isCloseToMaint =
                      vehicle.maintenanceDueHours - vehicle.totalUsageHours <= 10;
                    return (
                      <tr key={vehicle._id} className="hover:bg-zinc-50/20 transition-all duration-150">
                        <td className="px-5 py-3.5 font-bold text-zinc-900">
                          {vehicle.name}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              vehicle.status === "available"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : vehicle.status === "in_use"
                                ? "bg-sky-50 text-sky-700 border-sky-100"
                                : "bg-amber-50 text-amber-700 border-amber-105"
                            }`}
                          >
                            {vehicle.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-bold text-zinc-700">
                          {vehicle.totalUsageHours}h
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                              isCloseToMaint || vehicle.totalUsageHours >= vehicle.maintenanceDueHours
                                ? "text-rose-700 bg-rose-50 border-rose-100"
                                : "text-zinc-600 bg-zinc-50 border-zinc-200/70"
                            }`}
                          >
                            {vehicle.maintenanceDueHours}h
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {vehicles.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-zinc-400 font-medium">
                        No fleet diagnostic records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Section: Ops Alerts feed panel */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200/80 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-full min-h-[420px]">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/30">
              <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                Critical Alerts Feed
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                {openAlerts.length} unresolved
              </span>
            </div>
            
            <div className="p-4 space-y-3.5 flex-1 overflow-y-auto max-h-[500px]">
              {openAlerts.map((alert) => (
                <div
                  key={alert._id}
                  className={`p-4 border rounded-xl flex flex-col justify-between gap-3 shadow-[0_1.5px_4px_rgba(0,0,0,0.01)] transition-all hover:shadow-md ${
                    alert.severity === "high"
                      ? "border-l-4 border-l-rose-500 bg-rose-50/10 border-rose-100/70"
                      : alert.severity === "medium"
                      ? "border-l-4 border-l-amber-500 bg-amber-50/10 border-amber-100/70"
                      : "border-l-4 border-l-indigo-400 bg-indigo-50/10 border-indigo-100/70"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
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
                      <span className="text-[10px] text-zinc-400 font-bold">
                        {new Date(alert.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-zinc-900 leading-relaxed">
                      {alert.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <button
                      onClick={() => onExplainAlert(alert.message)}
                      className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-md transition-colors cursor-pointer"
                    >
                      Explain with Copilot
                    </button>
                  </div>
                </div>
              ))}
              
              {openAlerts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-400 h-full">
                  <span className="text-3xl mb-3">🎉</span>
                  <p className="text-xs font-bold text-zinc-500">
                    All clear! No open operational alerts.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
