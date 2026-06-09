"use client";

import React, { useState } from "react";
import {
  Calendar,
  User,
  Car,
  AlertOctagon,
  ArrowRightLeft,
  Plus,
  Trash2,
  X,
} from "lucide-react";

interface BookingsViewProps {
  bookings: any[];
  vehicles: any[];
  onCreateBooking: (data: any) => void;
  onUpdateBooking: (id: string, data: any) => void;
  onDeleteBooking: (id: string) => void;
  onMarkAsLate: (id: string) => void;
  onReassign: (bookingId: string, vehicleId: string) => void;
}

export default function BookingsView({
  bookings,
  vehicles,
  onCreateBooking,
  onUpdateBooking,
  onDeleteBooking,
  onMarkAsLate,
  onReassign,
}: BookingsViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reassigningId, setReassigningId] = useState<string | null>(null);
  const [newVehicleId, setNewVehicleId] = useState("");

  const availableVehicles = vehicles.filter((v) => v.status === "available");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !vehicleId || !startTime || !endTime) return;
    
    onCreateBooking({
      customerName,
      vehicleId,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });

    // Reset Form
    setCustomerName("");
    setVehicleId("");
    setStartTime("");
    setEndTime("");
    setShowModal(false);
  };

  const handleReassignSubmit = (bookingId: string) => {
    if (!newVehicleId) return;
    onReassign(bookingId, newVehicleId);
    setReassigningId(null);
    setNewVehicleId("");
  };

  return (
    <div className="space-y-6">
      {/* Title Header with Add Button */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
            Bookings Control
          </h1>
          <p className="text-xs text-zinc-500 font-medium mt-0.5">
            Manage rentals, evaluate customer risks, and assign vehicles
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 border border-emerald-700 hover:bg-emerald-700 rounded-lg shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Create New Booking
        </button>
      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-50/20">
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Assigned Vehicle</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Schedule (Start / End)</th>
                <th className="px-5 py-3 font-medium text-center">Risk Score</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {bookings.map((booking) => {
                const isReassigning = reassigningId === booking._id;
                return (
                  <tr key={booking._id} className="hover:bg-zinc-50/10">
                    <td className="px-5 py-4 font-semibold text-zinc-950">
                      {booking.customerName}
                    </td>
                    <td className="px-5 py-4 text-zinc-700">
                      {isReassigning ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={newVehicleId}
                            onChange={(e) => setNewVehicleId(e.target.value)}
                            className="px-2 py-1 bg-white border border-zinc-200 rounded text-xs text-zinc-800"
                          >
                            <option value="">Select Vehicle...</option>
                            {availableVehicles.map((v) => (
                              <option key={v._id} value={v._id}>
                                {v.name} ({v.type})
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleReassignSubmit(booking._id)}
                            className="px-2 py-1 bg-emerald-500 text-white rounded text-[10px] font-medium"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => setReassigningId(null)}
                            className="px-2 py-1 bg-zinc-100 text-zinc-700 rounded text-[10px] font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span>
                            {booking.vehicleId ? booking.vehicleId.name : "None"}
                          </span>
                          {booking.status !== "completed" && (
                            <button
                              onClick={() => {
                                setReassigningId(booking._id);
                                setNewVehicleId("");
                              }}
                              title="Reassign Vehicle"
                              className="p-1 text-zinc-400 hover:text-zinc-900 rounded transition-colors"
                            >
                              <ArrowRightLeft className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
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
                    <td className="px-5 py-4 text-zinc-500 space-y-0.5">
                      <div className="flex items-center gap-1 text-zinc-700">
                        <span className="font-medium">Out:</span>
                        <span>{new Date(booking.startTime).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-zinc-400">In:</span>
                        <span>{new Date(booking.endTime).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center font-medium">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-12 bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              booking.riskScore >= 70
                                ? "bg-rose-500"
                                : booking.riskScore >= 40
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${booking.riskScore}%` }}
                          />
                        </div>
                        <span
                          className={`font-semibold ${
                            booking.riskScore >= 70
                              ? "text-rose-600"
                              : booking.riskScore >= 40
                              ? "text-amber-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {booking.riskScore}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right space-x-1">
                      {booking.status === "confirmed" && (
                        <button
                          onClick={() => onUpdateBooking(booking._id, { status: "ongoing" })}
                          className="px-2.5 py-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100/60 rounded-md transition-colors"
                        >
                          Dispatch
                        </button>
                      )}
                      {booking.status === "ongoing" && (
                        <button
                          onClick={() => onUpdateBooking(booking._id, { status: "completed" })}
                          className="px-2.5 py-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100/60 rounded-md transition-colors"
                        >
                          Return Vehicle
                        </button>
                      )}
                      {booking.status !== "completed" && booking.status !== "late" && (
                        <button
                          onClick={() => onMarkAsLate(booking._id)}
                          title="Flag as Late"
                          className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors inline-flex"
                        >
                          <AlertOctagon className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteBooking(booking._id)}
                        title="Delete Booking"
                        className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors inline-flex"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-zinc-400 font-medium">
                    No active bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-zinc-950">
                New Booking Dispatch
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-zinc-600 p-1 hover:bg-zinc-50 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  Customer / Business Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corporation"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  Assign Fleet Vehicle (Available)
                </label>
                <select
                  required
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg bg-white focus:outline-none focus:border-zinc-400"
                >
                  <option value="">Select vehicle...</option>
                  {availableVehicles.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.name} ({v.type})
                    </option>
                  ))}
                  {availableVehicles.length === 0 && (
                    <option disabled>No available vehicles. Send one back first.</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    Pick-up Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    Drop-off Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-zinc-200 rounded-lg focus:outline-none focus:border-zinc-400"
                  />
                </div>
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
                  Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
