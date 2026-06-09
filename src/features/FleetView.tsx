"use client";

import React, { useState } from "react";
import {
  Car,
  Wrench,
  Gauge,
  Plus,
  Trash2,
  X,
  MapPin,
  CheckCircle,
} from "lucide-react";

interface FleetViewProps {
  vehicles: any[];
  onCreateVehicle: (data: any) => void;
  onUpdateVehicle: (id: string, data: any) => void;
  onDeleteVehicle: (id: string) => void;
  onScheduleMaintenance: (id: string) => void;
  onCompleteMaintenance: (id: string, resetHours: number) => void;
}

export default function FleetView({
  vehicles,
  onCreateVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
  onScheduleMaintenance,
  onCompleteMaintenance,
}: FleetViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("EV");
  const [totalUsageHours, setTotalUsageHours] = useState(0);
  const [maintenanceDueHours, setMaintenanceDueHours] = useState(100);
  const [location, setLocation] = useState("San Francisco Hub");

  const [completingMaintId, setCompletingMaintId] = useState<string | null>(null);
  const [resetHoursVal, setResetHoursVal] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type || !location) return;

    onCreateVehicle({
      name,
      type,
      totalUsageHours: Number(totalUsageHours),
      maintenanceDueHours: Number(maintenanceDueHours),
      location,
      status: "available",
    });

    // Reset Form
    setName("");
    setType("EV");
    setTotalUsageHours(0);
    setMaintenanceDueHours(100);
    setLocation("San Francisco Hub");
    setShowModal(false);
  };

  const handleCompleteMaintSubmit = (id: string) => {
    onCompleteMaintenance(id, Number(resetHoursVal));
    setCompletingMaintId(null);
    setResetHoursVal(0);
  };

  return (
    <div className="space-y-6">
      {/* Title Header with Add Button */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
            Fleet Management
          </h1>
          <p className="text-xs text-zinc-500 font-medium mt-0.5">
            Monitor vehicle positions, manage runtime hours, and coordinate repairs
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 border border-emerald-700 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Fleet Vehicle
        </button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => {
          const usagePercent = Math.min(
            Math.round((vehicle.totalUsageHours / vehicle.maintenanceDueHours) * 100),
            100
          );
          const needsMaintenance = vehicle.totalUsageHours >= vehicle.maintenanceDueHours;
          const isCompletingMaint = completingMaintId === vehicle._id;

          return (
            <div
              key={vehicle._id}
              className={`p-5 bg-white border border-zinc-200 rounded-xl shadow-sm flex flex-col justify-between space-y-4 hover:border-zinc-300 transition-all ${
                needsMaintenance && vehicle.status !== "maintenance"
                  ? "ring-1 ring-rose-500/30 border-rose-200"
                  : ""
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded border border-zinc-200/50">
                    {vehicle.type}
                  </span>
                  <h3 className="font-semibold text-zinc-900 text-sm">{vehicle.name}</h3>
                </div>
                
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
              </div>

              {/* Vehicle Stats */}
              <div className="space-y-3.5">
                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{vehicle.location}</span>
                </div>

                {/* Usage Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3 h-3" />
                      Usage Hours
                    </span>
                    <span>
                      {vehicle.totalUsageHours}h / {vehicle.maintenanceDueHours}h
                    </span>
                  </div>
                  <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        needsMaintenance
                          ? "bg-rose-500 animate-pulse"
                          : usagePercent >= 80
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                <div>
                  <button
                    onClick={() => onDeleteVehicle(vehicle._id)}
                    title="Remove Vehicle"
                    className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-flex"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  {vehicle.status === "maintenance" ? (
                    isCompletingMaint ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          placeholder="Hours"
                          value={resetHoursVal}
                          onChange={(e) => setResetHoursVal(Number(e.target.value))}
                          className="w-16 px-1.5 py-1 text-xs border border-zinc-200 rounded"
                        />
                        <button
                          onClick={() => handleCompleteMaintSubmit(vehicle._id)}
                          className="px-2.5 py-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200"
                        >
                          Reset
                        </button>
                        <button
                          onClick={() => setCompletingMaintId(null)}
                          className="px-2.5 py-1 text-[10px] font-semibold text-zinc-600 bg-zinc-50 hover:bg-zinc-100 rounded border border-zinc-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setCompletingMaintId(vehicle._id);
                          setResetHoursVal(0);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 rounded-lg border border-emerald-100 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Complete Maintenance
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => onScheduleMaintenance(vehicle._id)}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                        needsMaintenance
                          ? "text-rose-700 bg-rose-50 border-rose-100 hover:bg-rose-100/60"
                          : "text-zinc-700 bg-white border-zinc-200 hover:bg-zinc-50"
                      }`}
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      Schedule Repair
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {vehicles.length === 0 && (
          <div className="col-span-full text-center py-12 text-zinc-400 font-medium bg-white border border-zinc-200 rounded-xl">
            No fleet vehicles found.
          </div>
        )}
      </div>

      {/* Vehicle Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-950">
                Register New Vehicle
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-zinc-600 p-1 hover:bg-zinc-50 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    Vehicle Identifier / Plate
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Model Y (EV-202)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-zinc-400"
                  >
                    <option value="EV">EV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Van">Van</option>
                    <option value="Truck">Truck</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    Initial Usage (Hours)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={totalUsageHours}
                    onChange={(e) => setTotalUsageHours(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    Maintenance Threshold (Hours)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={maintenanceDueHours}
                    onChange={(e) => setMaintenanceDueHours(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  Current Depot / Hub Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SF Hub, Depot 4"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg border border-emerald-700"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
