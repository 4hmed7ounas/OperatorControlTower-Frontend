"use client";

import React from "react";
import {
  TrendingUp,
  AlertOctagon,
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
    <div className="space-y-6">
      {/* Title Header with Refresh Button */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
            Ops Control Tower
          </h1>
          <p className="text-xs text-zinc-500 font-medium mt-0.5">
            Real-time fleet intelligence and command console
          </p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-700 bg-white border border-zinc-200 rounded-lg shadow-sm hover:bg-zinc-50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Control Tower
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* KPI: Active Bookings */}
        <div className="p-5 bg-white border border-zinc-200 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">
              Active Bookings
            </span>
            <span className="text-2xl font-bold text-zinc-900 block">
              {activeBookings}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium block">
              Currently ongoing or late
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>

        {/* KPI: Active Vehicles */}
        <div className="p-5 bg-white border border-zinc-200 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">
              Vehicles In-Use
            </span>
            <span className="text-2xl font-bold text-zinc-900 block">
              {activeVehicles}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium block">
              Out of {vehicles.length} total vehicles
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Car className="w-5 h-5" />
          </div>
        </div>

        {/* KPI: Open Alerts */}
        <div className="p-5 bg-white border border-zinc-200 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">
              Open Alerts
            </span>
            <span className="text-2xl font-bold text-zinc-900 block">
              {openAlertsCount}
            </span>
            <span className="text-[10px] text-red-500 font-medium block">
              {highSeverityAlertsCount} high severity unresolved
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* KPI: Late Bookings */}
        <div className="p-5 bg-white border border-zinc-200 rounded-xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider block">
              Late Statuses
            </span>
            <span className="text-2xl font-bold text-zinc-900 block">
              {lateBookings}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium block">
              Late pickups & overdue returns
            </span>
          </div>
          <div className="w-12 h-12 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Side: Tables (Bookings + Fleet) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Bookings Table */}
          <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h2 className="text-sm font-semibold text-zinc-900">
                Active & Upcoming Rentals
              </h2>
              <span className="text-xs text-zinc-400 font-medium">
                {bookings.length} total bookings
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-50/20">
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Vehicle</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Duration</th>
                    <th className="px-5 py-3 font-medium text-right">Risk Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 text-xs">
                  {bookings.slice(0, 5).map((booking) => {
                    const durationHours = Math.round(
                      (new Date(booking.endTime).getTime() -
                        new Date(booking.startTime).getTime()) /
                        (1000 * 60 * 60)
                    );
                    return (
                      <tr key={booking._id} className="hover:bg-zinc-50/30">
                        <td className="px-5 py-3.5 font-semibold text-zinc-950">
                          {booking.customerName}
                        </td>
                        <td className="px-5 py-3.5 text-zinc-600">
                          {booking.vehicleId ? booking.vehicleId.name : "Unassigned"}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              booking.status === "completed"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : booking.status === "ongoing"
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : booking.status === "late"
                                ? "bg-rose-50 text-rose-700 border-rose-100"
                                : "bg-zinc-100 text-zinc-700 border-zinc-200"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-zinc-500">
                          {durationHours}h rental
                        </td>
                        <td className="px-5 py-3.5 text-right font-medium">
                          <span
                            className={`px-1.5 py-0.5 rounded ${
                              booking.riskScore >= 70
                                ? "text-rose-600 bg-rose-50"
                                : booking.riskScore >= 40
                                ? "text-amber-600 bg-amber-50"
                                : "text-emerald-600 bg-emerald-50"
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
                      <td colSpan={5} className="text-center py-6 text-zinc-400">
                        No bookings found. Click Seed Database or create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Fleet Table */}
          <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h2 className="text-sm font-semibold text-zinc-900">
                Fleet Status Overview
              </h2>
              <span className="text-xs text-zinc-400 font-medium">
                {vehicles.length} vehicles
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-50/20">
                    <th className="px-5 py-3 font-medium">Vehicle Name</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium text-right">Usage</th>
                    <th className="px-5 py-3 font-medium text-right">Maintenance Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 text-xs">
                  {vehicles.slice(0, 5).map((vehicle) => {
                    const isCloseToMaint =
                      vehicle.maintenanceDueHours - vehicle.totalUsageHours <= 10;
                    return (
                      <tr key={vehicle._id} className="hover:bg-zinc-50/30">
                        <td className="px-5 py-3.5 font-semibold text-zinc-950">
                          {vehicle.name}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              vehicle.status === "available"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : vehicle.status === "in_use"
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : "bg-amber-50 text-amber-700 border-amber-100"
                            }`}
                          >
                            {vehicle.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-medium text-zinc-700">
                          {vehicle.totalUsageHours}h
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span
                            className={`px-1.5 py-0.5 rounded font-medium ${
                              isCloseToMaint || vehicle.totalUsageHours >= vehicle.maintenanceDueHours
                                ? "text-rose-600 bg-rose-50"
                                : "text-zinc-500 bg-zinc-100"
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
                      <td colSpan={4} className="text-center py-6 text-zinc-400">
                        No vehicles found. Click Seed Database to begin.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Alerts Panel */}
        <div className="space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full min-h-[420px]">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h2 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
                Active Alerts Panel
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200">
                {openAlerts.length} open
              </span>
            </div>
            
            <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-[480px]">
              {openAlerts.map((alert) => (
                <div
                  key={alert._id}
                  className={`p-4 border rounded-lg flex flex-col justify-between gap-3 transition-all ${
                    alert.severity === "high"
                      ? "bg-rose-50/30 border-rose-100"
                      : alert.severity === "medium"
                      ? "bg-amber-50/30 border-amber-100"
                      : "bg-blue-50/20 border-blue-100"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                          alert.severity === "high"
                            ? "bg-rose-50 text-rose-700 border-rose-100"
                            : alert.severity === "medium"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-blue-50 text-blue-700 border-blue-100"
                        }`}
                      >
                        {alert.severity} Priority
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium">
                        {new Date(alert.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-zinc-900 leading-normal">
                      {alert.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => onExplainAlert(alert.message)}
                      className="px-2.5 py-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100/60 rounded-md transition-colors"
                    >
                      Explain with Copilot
                    </button>
                  </div>
                </div>
              ))}
              
              {openAlerts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-400 h-full">
                  <span className="text-3xl mb-2">🎉</span>
                  <p className="text-xs font-medium text-zinc-500">
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
