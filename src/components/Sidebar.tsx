"use client";

import React from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Car,
  AlertTriangle,
  History,
  Terminal,
  UserCheck,
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAlertsCount: number;
}

export default function Sidebar({ currentTab, setCurrentTab, openAlertsCount }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "bookings", label: "Bookings", icon: CalendarDays },
    { id: "fleet", label: "Fleet status", icon: Car },
    { id: "alerts", label: "Alerts", icon: AlertTriangle, badge: openAlertsCount },
    { id: "logs", label: "Activity history", icon: History },
  ];

  return (
    <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col justify-between h-screen sticky top-0">
      <div className="flex flex-col flex-1">
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-zinc-200 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            1
          </div>
          <div>
            <span className="font-semibold text-zinc-900 tracking-tight text-base block">1Now Fleet</span>
            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider block">Control Tower</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-zinc-50 text-zinc-900 border border-zinc-200/60"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? "text-emerald-600" : "text-zinc-400 group-hover:text-zinc-900"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 ? (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200/50">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Operator Info (Bottom) */}
      <div className="p-4 border-t border-zinc-200 bg-zinc-50/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-200 flex items-center justify-center border border-zinc-300/40">
            <UserCheck className="w-5 h-5 text-zinc-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-900 truncate">Alex Mercer</p>
            <p className="text-xs text-zinc-500 truncate font-medium">Fleet Operator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
