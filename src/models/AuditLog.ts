import mongoose, { Schema, Document } from 'mongoose';
import { IAuditLog, AuditAction } from '../types';

export interface IAuditLogDocument extends IAuditLog, Document {}

const auditLogSchema = new Schema<IAuditLogDocument>(
  {
    action: {
      type: String,
      enum: Object.values(AuditAction),
      required: [true, 'Action is required'],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    targetId: {
      type: String,
      required: [true, 'Target ID is required'],
      index: true,
    },
    targetType: {
      type: String,
      enum: ['user', 'donation', 'reservation', 'message'],
      required: [true, 'Target type is required'],
      index: true,
    },
    changes: {
      before: {
        type: Schema.Types.Mixed,
        default: null,
      },
      after: {
        type: Schema.Types.Mixed,
        default: null,
      },
    },
    ipAddress: {
      type: String,
      default: null,
      match: [
        /^(?:\d{1,3}\.){3}\d{1,3}$|^(?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}$/i,
        'Invalid IP address format',
      ],
    },
    userAgent: {
      type: String,
      default: null,
      maxlength: [500, 'User agent cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: ['success', 'failure'],
      required: [true, 'Status is required'],
      index: true,
    },
    errorMessage: {
      type: String,
      default: null,
      maxlength: [1000, 'Error message cannot exceed 1000 characters'],
    },
    timestamp: {
      type: Date,
      default: () => new Date(),
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Indexes for better query performance
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ targetId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ status: 1 });
auditLogSchema.index({ timestamp: -1 });

// Compound indexes for common queries
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ targetId: 1, targetType: 1 });
auditLogSchema.index({ action: 1, status: 1, timestamp: -1 });

// TTL index for auto-deletion of audit logs after 365 days (optional)
auditLogSchema.index(
  { timestamp: 1 },
  {
    expireAfterSeconds: 31536000,
    name: 'auditLogsTTL',
  }
);

const AuditLog =
  (mongoose.models.AuditLog as mongoose.Model<IAuditLogDocument>) ||
  mongoose.model<IAuditLogDocument>('AuditLog', auditLogSchema);

export default AuditLog;
