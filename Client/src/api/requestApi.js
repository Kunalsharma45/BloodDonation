import client from './client';

/**
 * Request API - Handles all blood request operations across dashboards
 */

const requestApi = {
    // ==================== DONOR ENDPOINTS ====================

    /**
     * Get nearby blood requests for a donor
     * Filters by: blood group compatibility, eligibility, distance
     */
    getNearbyRequests: async (params = {}) => {
        const { page = 1, limit = 10, bloodGroup, urgency } = params;
        const response = await client.get('/donor/requests/nearby', {
            params: { page, limit, bloodGroup, urgency }
        });
        return response.data;
    },

    /**
     * Get request details by ID
     */
    getRequestById: async (requestId) => {
        const response = await client.get(`/requests/${requestId}`);
        return response.data;
    },

    /**
     * Express interest in a request (donor)
     */
    expressInterest: async (requestId) => {
        const response = await client.post(`/donor/requests/${requestId}/interest`);
        return response.data;
    },

    /**
     * Withdraw interest from a request (donor)
     */
    withdrawInterest: async (requestId) => {
        const response = await client.delete(`/donor/requests/${requestId}/interest`);
        return response.data;
    },

    // ==================== ORGANIZATION (HOSPITAL) ENDPOINTS ====================

    /**
     * Create a new blood request (Hospital)
     */
    createRequest: async (requestData) => {
        const response = await client.post('/org/requests', requestData);
        return response.data;
    },

    /**
     * Get organization's own requests (Hospital)
     */
    getMyRequests: async (params = {}) => {
        const { page = 1, limit = 10, status, urgency } = params;
        const response = await client.get('/org/requests/mine', {
            params: { page, limit, status, urgency }
        });
        return response.data;
    },

    /**
     * Get matching donors and blood banks for a request
     */
    getRequestMatches: async (requestId) => {
        const response = await client.get(`/org/requests/${requestId}/matches`);
        return response.data;
    },

    /**
     * Assign a donor or blood bank to a request
     */
    assignResponder: async (requestId, assignData) => {
        const response = await client.put(`/org/requests/${requestId}/assign`, assignData);
        return response.data;
    },

    /**
     * Mark request as fulfilled
     */
    fulfillRequest: async (requestId, fulfillmentData) => {
        const response = await client.put(`/org/requests/${requestId}/fulfill`, fulfillmentData);
        return response.data;
    },

    /**
     * Cancel a request
     */
    cancelRequest: async (requestId, reason) => {
        const response = await client.put(`/org/requests/${requestId}/cancel`, { reason });
        return response.data;
    },

    /**
     * Update request details
     */
    updateRequest: async (requestId, updateData) => {
        const response = await client.put(`/org/requests/${requestId}`, updateData);
        return response.data;
    },

    // ==================== ORGANIZATION (BLOOD BANK) ENDPOINTS ====================

    /**
     * Get incoming requests that blood bank can fulfill
     */
    getIncomingRequests: async (params = {}) => {
        const { page = 1, limit = 10, bloodGroup, urgency } = params;
        const response = await client.get('/org/requests/incoming', {
            params: { page, limit, bloodGroup, urgency }
        });
        return response.data;
    },

    /**
     * Reserve inventory units for a request (Blood Bank)
     */
    reserveUnits: async (requestId, reserveData) => {
        const response = await client.post(`/org/requests/${requestId}/reserve`, reserveData);
        return response.data;
    },

    /**
     * Issue reserved units to hospital
     */
    issueUnits: async (requestId, issueData) => {
        const response = await client.post(`/org/requests/${requestId}/issue`, issueData);
        return response.data;
    },

    /**
     * Release reserved units (cancel reservation)
     */
    releaseReservation: async (requestId, unitIds) => {
        const response = await client.delete(`/org/requests/${requestId}/reserve`, {
            data: { unitIds }
        });
        return response.data;
    },

    // ==================== ADMIN ENDPOINTS ====================

    /**
     * Get all requests with filters (Admin)
     */
    getAllRequests: async (params = {}) => {
        const { page = 1, limit = 20, status, urgency, city, organizationId } = params;
        const response = await client.get('/admin/requests', {
            params: { page, limit, status, urgency, city, organizationId }
        });
        return response.data;
    },

    /**
     * Get request statistics and summary (Admin)
     */
    getRequestsSummary: async () => {
        const response = await client.get('/admin/requests/summary');
        return response.data;
    },

    /**
     * Get unfulfilled requests alerts
     */
    getUnfulfilledAlerts: async () => {
        const response = await client.get('/admin/requests/alerts');
        return response.data;
    },

    /**
     * Broadcast notification to compatible donors
     */
    broadcastToDonors: async (requestId, message) => {
        const response = await client.post('/admin/notifications/broadcast', {
            requestId,
            message,
            type: 'URGENT_REQUEST'
        });
        return response.data;
    },

    /**
     * Force assign a request (Admin intervention)
     */
    adminAssignRequest: async (requestId, assignData) => {
        const response = await client.put(`/admin/requests/${requestId}/assign`, assignData);
        return response.data;
    },

    /**
     * Get request analytics and trends
     */
    getRequestAnalytics: async (params = {}) => {
        const { startDate, endDate, groupBy = 'day' } = params;
        const response = await client.get('/admin/requests/analytics', {
            params: { startDate, endDate, groupBy }
        });
        return response.data;
    },

    // ==================== COMMON ENDPOINTS ====================

    /**
     * Get donor's request history
     */
    getDonorRequestHistory: async (params = {}) => {
        const { page = 1, limit = 10 } = params;
        const response = await client.get('/donor/requests/history', {
            params: { page, limit }
        });
        return response.data;
    },

    /**
     * Get organization's request statistics
     */
    getOrgRequestStats: async () => {
        const response = await client.get('/org/requests/stats');
        return response.data;
    },

    /**
     * Get request comments/activity log
     */
    getRequestActivity: async (requestId) => {
        const response = await client.get(`/requests/${requestId}/activity`);
        return response.data;
    },

    /**
     * Add comment to request
     */
    addRequestComment: async (requestId, comment) => {
        const response = await client.post(`/requests/${requestId}/comments`, { comment });
        return response.data;
    }
};

export default requestApi;
