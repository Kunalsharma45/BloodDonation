import client from "./client";

/**
 * Admin API endpoints
 */
export const adminApi = {
    /**
     * Get global dashboard summary
     */
    getSummary: async () => {
        const res = await client.get("/api/admin/summary");
        return res.data;
    },

    /**
     * Get pending verification counts
     */
    getPendingCounts: async () => {
        const res = await client.get("/api/admin/pending-counts");
        return res.data;
    },

    /**
     * Get donors list with filters
     * @param {object} params - { status, page, limit, search }
     */
    getDonors: async (params = {}) => {
        const res = await client.get("/api/admin/donors", { params });
        return res.data;
    },

    /**
     * Approve donor
     */
    approveDonor: async (id) => {
        const res = await client.put(`/api/admin/donors/${id}/approve`);
        return res.data;
    },

    /**
     * Reject donor
     */
    rejectDonor: async (id, reason) => {
        const res = await client.put(`/api/admin/donors/${id}/reject`, { reason });
        return res.data;
    },

    /**
     * Get organizations list with filters
     * @param {object} params - { status, page, limit, search }
     */
    getOrgs: async (params = {}) => {
        const res = await client.get("/api/admin/orgs", { params });
        return res.data;
    },

    /**
     * Approve organization
     */
    approveOrg: async (id) => {
        const res = await client.put(`/api/admin/orgs/${id}/approve`);
        return res.data;
    },

    /**
     * Reject organization
     */
    rejectOrg: async (id, reason) => {
        const res = await client.put(`/api/admin/orgs/${id}/reject`, { reason });
        return res.data;
    },

    /**
     * Get users list with filters
     * @param {object} params - { role, status, page, limit, search }
     */
    getUsers: async (params = {}) => {
        const res = await client.get("/api/admin/users", { params });
        return res.data;
    },

    /**
     * Block user
     */
    blockUser: async (id) => {
        const res = await client.put(`/api/admin/users/${id}/block`);
        return res.data;
    },

    /**
     * Unblock user
     */
    unblockUser: async (id) => {
        const res = await client.put(`/api/admin/users/${id}/unblock`);
        return res.data;
    },

    /**
     * Verify user (approve/reject)
     */
    verifyUser: async (id, status, reason = "") => {
        const res = await client.put(`/api/admin/users/${id}/verify`, {
            status,
            reason,
        });
        return res.data;
    },

    /**
     * Get system stats
     */
    getStats: async () => {
        const res = await client.get("/api/admin/stats");
        return res.data;
    },

    /**
     * Get alerts
     * @param {object} params - { severity, status, page, limit }
     */
    getAlerts: async (params = {}) => {
        const res = await client.get("/api/admin/alerts", { params });
        return res.data;
    },

    /**
     * Resolve alert
     */
    resolveAlert: async (id) => {
        const res = await client.put(`/api/admin/alerts/${id}/resolve`);
        return res.data;
    },

    /**
     * Get audit logs
     * @param {object} params - { action, actor, from, to, page, limit }
     */
    getAuditLogs: async (params = {}) => {
        const res = await client.get("/api/admin/audit-logs", { params });
        return res.data;
    },

    /**
     * Broadcast notification
     */
    broadcast: async (data) => {
        const res = await client.post("/api/admin/broadcast", data);
        return res.data;
    },

    /**
     * Get sent notifications
     */
    getSentNotifications: async (params = {}) => {
        const res = await client.get("/api/admin/notifications/sent", { params });
        return res.data;
    },

    /**
     * Get profile update requests
     */
    getProfileUpdates: async () => {
        const res = await client.get("/api/admin/profile-updates");
        return res.data;
    },

    /**
     * Action on profile update (approve/reject)
     */
    actionProfileUpdate: async (id, action, reason = "") => {
        const res = await client.put(`/api/admin/profile-updates/${id}/action`, {
            action,
            reason,
        });
        return res.data;
    },

    /**
     * Get stock summary
     */
    getStock: async () => {
        const res = await client.get("/api/admin/stock");
        return res.data;
    },

    /**
     * Update stock
     */
    updateStock: async (group, change, reason) => {
        const res = await client.put("/api/admin/stock", { group, change, reason });
        return res.data;
    },

    /**
     * Get monthly donations data
     */
    getMonthlyDonations: async () => {
        const res = await client.get("/api/admin/monthly-donations");
        return res.data;
    },

    /**
     * Get donation pipeline (Kanban)
     */
    getDonationPipeline: async () => {
        const res = await client.get("/api/admin/donation-pipeline");
        return res.data;
    },

    /**
     * Get appointments
     */
    getAppointments: async () => {
        const res = await client.get("/api/admin/appointments");
        return res.data;
    },

    /**
     * Create appointment
     */
    createAppointment: async (data) => {
        const res = await client.post("/api/admin/appointments", data);
        return res.data;
    },

    /**
     * Get requests
     */
    getRequests: async () => {
        const res = await client.get("/api/admin/requests");
        return res.data;
    },

    /**
     * Get summary report
     */
    getReportSummary: async (params = {}) => {
        const res = await client.get("/api/admin/reports/summary", { params });
        return res.data;
    },

    /**
     * Get requests report
     */
    getReportRequests: async (params = {}) => {
        const res = await client.get("/api/admin/reports/requests", { params });
        return res.data;
    },

    /**
     * Get inventory report
     */
    getReportInventory: async (params = {}) => {
        const res = await client.get("/api/admin/reports/inventory", { params });
        return res.data;
    },
};

export default adminApi;
