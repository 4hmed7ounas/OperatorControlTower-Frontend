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
    <div className="space-y-8 animate-in fade-in duration-250">
      {/* Title Header with Add Button */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200/70">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Fleet Management
          </h1>
          <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider mt-1">
            Monitor diagnostics, allocate vehicles, and manage service targets
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm border border-emerald-700 transition-all cursor-pointer"
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
              className={`p-5 bg-white border border-zinc-200/80 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ${
                needsMaintenance && vehicle.status !== "maintenance"
                  ? "ring-1 ring-rose-500/35 border-rose-300"
                  : ""
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded border border-zinc-200/50">
                    {vehicle.type}
                  </span>
                  <h3 className="font-bold text-zinc-950 text-sm tracking-tight">{vehicle.name}</h3>
                </div>
                
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    vehicle.status === "available"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : vehicle.status === "in_use"
                      ? "bg-sky-50 text-sky-700 border-sky-105"
                      : "bg-amber-50 text-amber-700 border-amber-105"
                  }`}
                >
                  {vehicle.status}
                </span>
              </div>

              {/* Vehicle Stats */}
              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{vehicle.location}</span>
                </div>

                {/* Usage Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3 h-3 text-zinc-400" />
                      Runtime Hours
                    </span>
                    <span className="text-zinc-700 font-semibold">
                      {vehicle.totalUsageHours}h / {vehicle.maintenanceDueHours}h
                    </span>
                  </div>
                  <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden border border-zinc-200/30">
                    <div
                      className={`h-full transition-all duration-300 ${
                        needsMaintenance
                          ? "bg-rose-500"
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
                    className="p-2 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors inline-flex cursor-pointer"
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
                          className="w-16 px-1.5 py-1 text-xs border border-zinc-200 rounded focus:outline-none focus:border-zinc-400 text-zinc-800"
                        />
                        <button
                          onClick={() => handleCompleteMaintSubmit(vehicle._id)}
                          className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 cursor-pointer"
                        >
                          Reset
                        </button>
                        <button
                          onClick={() => setCompletingMaintId(null)}
                          className="px-2.5 py-1 text-[10px] font-bold text-zinc-600 bg-zinc-50 hover:bg-zinc-100 rounded border border-zinc-200 cursor-pointer"
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
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-100/50 transition-colors cursor-pointer"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Resolve Repair
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => onScheduleMaintenance(vehicle._id)}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                        needsMaintenance
                          ? "text-rose-700 bg-rose-50 border-rose-100 hover:bg-rose-100"
                          : "text-zinc-750 bg-white border-zinc-200 hover:bg-zinc-50 hover:border-zinc-350"
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
          <div className="col-span-full text-center py-16 text-zinc-400 font-semibold bg-white border border-zinc-200 rounded-xl">
            No fleet vehicles found. Seed database to begin.
          </div>
        )}
      </div>

      {/* Vehicle Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/35 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                Register New Vehicle
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-zinc-600 p-1 hover:bg-zinc-50 rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 font-semibold text-xs text-zinc-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Name / Identifier
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tesla Model Y (EV-202)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-250 rounded-lg focus:outline-none focus:border-zinc-400 text-zinc-850 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-250 rounded-lg bg-white focus:outline-none focus:border-zinc-400 text-zinc-850 font-medium"
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
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Current Usage (Hours)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={totalUsageHours}
                    onChange={(e) => setTotalUsageHours(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-zinc-250 rounded-lg focus:outline-none focus:border-zinc-400 text-zinc-850 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Maintenance Target (Hours)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={maintenanceDueHours}
                    onChange={(e) => setMaintenanceDueHours(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-zinc-250 rounded-lg focus:outline-none focus:border-zinc-400 text-zinc-850 font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                  depot Hub Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. San Francisco Hub, Depot 2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-250 rounded-lg focus:outline-none focus:border-zinc-400 text-zinc-850 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-zinc-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-white hover:bg-zinc-50 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg border border-emerald-700 cursor-pointer shadow-sm"
                >
                  Register Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
