const API_BASE = "http://127.0.0.1:5000/api";

async function request(path: string, options: RequestInit = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Bookings
  getBookings: () => request("/bookings"),
  getBooking: (id: string) => request(`/bookings/${id}`),
  createBooking: (data: any) => request("/bookings", { method: "POST", body: JSON.stringify(data) }),
  updateBooking: (id: string, data: any) => request(`/bookings/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteBooking: (id: string) => request(`/bookings/${id}`, { method: "DELETE" }),
  markBookingAsLate: (id: string) => request(`/bookings/${id}/late`, { method: "POST" }),
  reassignVehicle: (bookingId: string, vehicleId: string) =>
    request(`/bookings/${bookingId}/reassign`, { method: "POST", body: JSON.stringify({ vehicleId }) }),

  // Vehicles
  getVehicles: () => request("/vehicles"),
  getVehicle: (id: string) => request(`/vehicles/${id}`),
  createVehicle: (data: any) => request("/vehicles", { method: "POST", body: JSON.stringify(data) }),
  updateVehicle: (id: string, data: any) => request(`/vehicles/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteVehicle: (id: string) => request(`/vehicles/${id}`, { method: "DELETE" }),
  scheduleMaintenance: (id: string) => request(`/vehicles/${id}/maintenance`, { method: "POST" }),
  completeMaintenance: (id: string, totalUsageHoursReset: number = 0) =>
    request(`/vehicles/${id}/maintenance/complete`, {
      method: "POST",
      body: JSON.stringify({ totalUsageHoursReset }),
    }),

  // Alerts
  getAlerts: () => request("/alerts"),
  resolveAlert: (id: string) => request(`/alerts/${id}/resolve`, { method: "POST" }),

  // Copilot AI
  chatCopilot: (message: string) => request("/copilot/chat", { method: "POST", body: JSON.stringify({ message }) }),
  executeAction: (action: string, args: any) =>
    request("/copilot/execute", { method: "POST", body: JSON.stringify({ action, args }) }),

  // System Utilities
  seedDatabase: () => request("/system/seed", { method: "POST" }),
  evaluateRules: () => request("/system/evaluate", { method: "POST" }),
  getActionLogs: () => request("/system/action-logs"),
};
