import mongoose from 'mongoose';

const ProfileUpdateRequestSchema = new mongoose.Schema({
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requestedChanges: {
        organizationName: String,
        Name: String,
        Email: String,
        PhoneNumber: String,
        City: String,
        licenseNo: String,
        State: String,
        Country: String
    },
    currentValues: {
        organizationName: String,
        Name: String,
        Email: String,
        PhoneNumber: String,
        City: String,
        licenseNo: String,
        State: String,
        Country: String
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewedAt: Date,
    rejectionReason: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for faster queries
ProfileUpdateRequestSchema.index({ organizationId: 1, status: 1 });

const ProfileUpdateRequest = mongoose.model('ProfileUpdateRequest', ProfileUpdateRequestSchema);

export default ProfileUpdateRequest;
