"use client";

import React, { useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";
import Sidebar from "../components/Sidebar";
import CopilotPanel from "../components/CopilotPanel";
import DashboardView from "../features/DashboardView";
import BookingsView from "../features/BookingsView";
import FleetView from "../features/FleetView";
import AlertsView from "../features/AlertsView";
import ActionLogsView from "../features/ActionLogsView";
import { Database, AlertTriangle, Sparkles, RefreshCw } from "lucide-react";

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

export default function Home() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState("dashboard");

  // Core Data States
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [actionLogs, setActionLogs] = useState<any[]>([]);

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEvaluatingRules, setIsEvaluatingRules] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Copilot Chat History
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      id: "welcome",
      sender: "copilot",
      text: "Hello! I am your Fleet Ops Copilot. 🚀\n\nI analyze system alerts, evaluate booking risk metrics, and can help you run automated tools. Ask me what needs attention to see how I work!",
    },
  ]);

  // Fetch all data from Express APIs
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [vData, bData, aData, lData] = await Promise.all([
        api.getVehicles(),
        api.getBookings(),
        api.getAlerts(),
        api.getActionLogs(),
      ]);
      setVehicles(vData);
      setBookings(bData);
      setAlerts(aData);
      setActionLogs(lData);
      setError(null);
    } catch (err: any) {
      console.error("Error loading control tower data:", err);
      setError("Failed to communicate with the Express backend on port 5000. Ensure your backend server is running and MongoDB is active.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Seeding trigger
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      await api.seedDatabase();
      // Evaluate rules immediately after seeding
      await api.evaluateRules();
      await refreshData();
    } catch (err: any) {
      console.error("Failed to seed database:", err);
      alert("Error seeding database: " + err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  // Evaluate Rules Engine manually
  const handleTriggerRules = async () => {
    setIsEvaluatingRules(true);
    try {
      await api.evaluateRules();
      await refreshData();
    } catch (err: any) {
      console.error("Failed to evaluate rules:", err);
      alert("Error scanning state: " + err.message);
    } finally {
      setIsEvaluatingRules(false);
    }
  };

  // Explain alert with AI handler
  const handleExplainAlert = async (alertMessage: string) => {
    // Add user message to history
    const userPrompt = `Explain this alert and suggest corrective options: "${alertMessage}"`;
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: userPrompt,
    };
    
    setChatHistory((prev) => [...prev, userMsg]);
    
    // Simulate thinking loader in Copilot
    const tempCopilotMsgId = Math.random().toString();
    // Use the panel's direct API call by executing the fetch
    try {
      const response = await api.chatCopilot(userPrompt);
      const copilotMsg: Message = {
        id: tempCopilotMsgId,
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
        id: tempCopilotMsgId,
        sender: "copilot",
        text: `Error connecting to Copilot: ${error.message}. Running in fallback mode.`,
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    }
  };

  // Booking handlers
  const handleCreateBooking = async (data: any) => {
    try {
      await api.createBooking(data);
      await api.evaluateRules(); // Run rules checks immediately
      await refreshData();
    } catch (err: any) {
      alert("Failed to create booking: " + err.message);
    }
  };

  const handleUpdateBooking = async (id: string, data: any) => {
    try {
      await api.updateBooking(id, data);
      await api.evaluateRules();
      await refreshData();
    } catch (err: any) {
      alert("Failed to update booking: " + err.message);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel and remove this booking?")) return;
    try {
      await api.deleteBooking(id);
      await api.evaluateRules();
      await refreshData();
    } catch (err: any) {
      alert("Failed to delete booking: " + err.message);
    }
  };

  const handleMarkAsLate = async (id: string) => {
    try {
      await api.markBookingAsLate(id);
      await refreshData();
    } catch (err: any) {
      alert("Error updating booking status: " + err.message);
    }
  };

  const handleReassign = async (bookingId: string, vehicleId: string) => {
    try {
      await api.reassignVehicle(bookingId, vehicleId);
      await refreshData();
    } catch (err: any) {
      alert("Failed to reassign vehicle: " + err.message);
    }
  };

  // Vehicle handlers
  const handleCreateVehicle = async (data: any) => {
    try {
      await api.createVehicle(data);
      await api.evaluateRules();
      await refreshData();
    } catch (err: any) {
      alert("Failed to register vehicle: " + err.message);
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm("Are you sure you want to remove this vehicle from the fleet?")) return;
    try {
      await api.deleteVehicle(id);
      await api.evaluateRules();
      await refreshData();
    } catch (err: any) {
      alert("Failed to delete vehicle: " + err.message);
    }
  };

  const handleScheduleMaintenance = async (id: string) => {
    try {
      await api.scheduleMaintenance(id);
      await refreshData();
    } catch (err: any) {
      alert("Error dispatching vehicle to maintenance: " + err.message);
    }
  };

  const handleCompleteMaintenance = async (id: string, resetHours: number) => {
    try {
      await api.completeMaintenance(id, resetHours);
      await api.evaluateRules();
      await refreshData();
    } catch (err: any) {
      alert("Error completing maintenance: " + err.message);
    }
  };

  // Alert handlers
  const handleResolveAlert = async (id: string) => {
    try {
      await api.resolveAlert(id);
      await refreshData();
    } catch (err: any) {
      alert("Failed to resolve alert: " + err.message);
    }
  };

  // Global component renderer based on selected sidebar tab
  const renderMainContent = () => {
    if (error) {
      return (
        <div className="p-8 bg-rose-50 border border-rose-100 rounded-xl space-y-4 max-w-xl mx-auto mt-12 shadow-sm">
          <div className="flex items-center gap-2 text-rose-800">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <h2 className="font-semibold text-sm">Connection Warning</h2>
          </div>
          <p className="text-xs text-rose-700 leading-relaxed font-medium">
            {error}
          </p>
          <div className="pt-2">
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-rose-600 text-white font-semibold text-xs border border-rose-700 hover:bg-rose-700 rounded-lg shadow-sm"
            >
              Retry Connection
            </button>
          </div>
        </div>
      );
    }

    if (loading && vehicles.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-400 gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-zinc-300" />
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Connecting to control tower...
          </p>
        </div>
      );
    }

    // Seeding Prompt for Empty Database
    if (vehicles.length === 0 && bookings.length === 0) {
      return (
        <div className="p-8 bg-white border border-zinc-200 rounded-xl text-center max-w-lg mx-auto mt-12 space-y-5">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
            <Database className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-sm font-bold text-zinc-950">Empty Database Detected</h2>
            <p className="text-xs text-zinc-500 leading-normal font-medium">
              We found 0 vehicles and bookings. Seed the database with our preset operations sandbox (includes overdue vehicles, active rentals, and high-risk bookings).
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 text-xs font-semibold rounded-lg border border-emerald-700 shadow-sm transition-all"
            >
              {isSeeding ? "Seeding Database..." : "Seed Sandbox Data"}
            </button>
          </div>
        </div>
      );
    }

    switch (currentTab) {
      case "dashboard":
        return (
          <DashboardView
            vehicles={vehicles}
            bookings={bookings}
            alerts={alerts}
            onRefresh={refreshData}
            onExplainAlert={handleExplainAlert}
          />
        );
      case "bookings":
        return (
          <BookingsView
            bookings={bookings}
            vehicles={vehicles}
            onCreateBooking={handleCreateBooking}
            onUpdateBooking={handleUpdateBooking}
            onDeleteBooking={handleDeleteBooking}
            onMarkAsLate={handleMarkAsLate}
            onReassign={handleReassign}
          />
        );
      case "fleet":
        return (
          <FleetView
            vehicles={vehicles}
            onCreateVehicle={handleCreateVehicle}
            onUpdateVehicle={handleCreateVehicle} // Simpler create overlay handles this
            onDeleteVehicle={handleDeleteVehicle}
            onScheduleMaintenance={handleScheduleMaintenance}
            onCompleteMaintenance={handleCompleteMaintenance}
          />
        );
      case "alerts":
        return (
          <AlertsView
            alerts={alerts}
            onResolveAlert={handleResolveAlert}
            onExplainAlert={handleExplainAlert}
            onTriggerRules={handleTriggerRules}
            isEvaluatingRules={isEvaluatingRules}
          />
        );
      case "logs":
        return <ActionLogsView logs={actionLogs} />;
      default:
        return <div>View not found.</div>;
    }
  };

  const openAlertsCount = alerts.filter((a) => a.status === "open").length;

  return (
    <div className="flex w-full min-h-screen bg-gray-200 font-sans text-zinc-900 overflow-x-hidden antialiased">
      {/* Sidebar navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openAlertsCount={openAlertsCount}
      />

      {/* Main View Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        {renderMainContent()}
      </main>

      {/* Persistent AI Copilot Side panel */}
      <CopilotPanel
        onSendMessage={api.chatCopilot}
        onExecuteAction={api.executeAction}
        chatHistory={chatHistory}
        setChatHistory={setChatHistory}
        onGlobalRefresh={refreshData}
      />
    </div>
  );
}
