// Organization type constants (must match backend)
export const ORG_TYPES = {
    HOSPITAL: "HOSPITAL",
    BLOOD_BANK: "BANK",
    BOTH: "BOTH"
};

/**
 * Get permissions for an organization based on type
 * @param {string} orgType - Organization type (HOSPITAL, BANK, BOTH)
 * @returns {object} Permissions object
 */
export const getOrgPermissions = (orgType) => {
    if (!orgType) {
        return {
            canManageInventory: false,
            canCreateRequests: false,
            canViewIncoming: false,
            canManageAppointments: false,
            canCreateCamps: false,
            canViewAnalytics: false
        };
    }

    return {
        canManageInventory: [ORG_TYPES.BLOOD_BANK, ORG_TYPES.BOTH].includes(orgType),
        canCreateRequests: [ORG_TYPES.HOSPITAL, ORG_TYPES.BOTH].includes(orgType),
        canViewIncoming: [ORG_TYPES.BLOOD_BANK, ORG_TYPES.BOTH].includes(orgType),
        canManageAppointments: true, // All orgs
        canCreateCamps: true, // All orgs
        canViewAnalytics: true // All orgs
    };
};

/**
 * Get display name for organization type
 */
export const getOrgTypeLabel = (orgType) => {
    const labels = {
        [ORG_TYPES.HOSPITAL]: "Hospital",
        [ORG_TYPES.BLOOD_BANK]: "Blood Bank",
        [ORG_TYPES.BOTH]: "Hospital + Blood Bank"
    };
    return labels[orgType] || "Organization";
};

/**
 * Get badge color for organization type
 */
export const getOrgTypeBadgeColor = (orgType) => {
    const colors = {
        [ORG_TYPES.HOSPITAL]: "bg-blue-100 text-blue-700",
        [ORG_TYPES.BLOOD_BANK]: "bg-red-100 text-red-700",
        [ORG_TYPES.BOTH]: "bg-purple-100 text-purple-700"
    };
    return colors[orgType] || "bg-gray-100 text-gray-700";
};
