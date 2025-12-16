import client from "./client";

export const orgApi = {
    // Inventory
    getInventory: async () => {
        const res = await client.get("/api/org/inventory");
        return res.data;
    },
    addInventory: async (data) => {
        const res = await client.post("/api/org/inventory", data);
        return res.data;
    },
    getExpiringInventory: async () => {
        const res = await client.get("/api/org/inventory/expiring");
        return res.data;
    },

    // Requests
    getMyRequests: async () => {
        const res = await client.get("/api/org/requests");
        return res.data;
    },
    createRequest: async (data) => {
        const res = await client.post("/api/org/requests", data);
        return res.data;
    },
    updateRequestStatus: async (id, status) => {
        const res = await client.put(`/api/org/requests/${id}/status`, { status });
        return res.data;
    },
    fulfillRequest: async (id, data) => {
        const res = await client.put(`/api/org/requests/${id}/fulfill`, data);
        return res.data;
    },
    getMatches: async (id) => {
        const res = await client.get(`/api/org/requests/${id}/matches`);
        return res.data;
    },
    assignDonor: async (id, donorId) => {
        const res = await client.post(`/api/org/requests/${id}/assign-donor`, { donorId });
        return res.data;
    },
    getIncomingRequests: async () => {
        const res = await client.get("/api/org/requests/incoming");
        return res.data;
    },

    // Camps
    getCamps: async () => {
        const res = await client.get("/api/org/camps");
        return res.data;
    },
    createCamp: async (data) => {
        const res = await client.post("/api/org/camps", data);
        return res.data;
    },

    // Appointments
    getAppointments: async () => {
        const res = await client.get("/api/org/appointments");
        return res.data;
    },
    completeAppointment: async (id, data) => { // data: { unitsCollected, notes, ... }
        const res = await client.put(`/api/org/appointments/${id}/complete`, data);
        return res.data;
    },

    // Stats
    getStats: async () => {
        const res = await client.get("/api/org/stats");
        return res.data;
    }
};

export default orgApi;
