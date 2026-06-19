import mongoose, { Schema, Document } from 'mongoose';
import { IReservation, ReservationStatus } from '../types';

export interface IReservationDocument extends Omit<IReservation, '_id'>, Document {}

const reservationSchema = new Schema<IReservationDocument>(
  {
    donationId: {
      type: Schema.Types.ObjectId,
      ref: 'Donation',
      required: [true, 'Donation ID is required'],
      index: true,
    } as any,
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver ID is required'],
      index: true,
    } as any,
    status: {
      type: String,
      enum: Object.values(ReservationStatus),
      default: ReservationStatus.PENDING,
      index: true,
    },
    reservedAt: {
      type: Date,
      default: () => new Date(),
    },
    pickupDate: {
      type: Date,
      default: null,
      validate: {
        validator: function (value: Date | null) {
          if (!value) return true;
          return value > new Date();
        },
        message: 'Pickup date must be in the future',
      },
    },
    pickupTime: {
      type: String,
      default: null,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: null,
    },
    cancelReason: {
      type: String,
      maxlength: [300, 'Cancel reason cannot exceed 300 characters'],
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      default: null,
    },
    feedback: {
      type: String,
      maxlength: [500, 'Feedback cannot exceed 500 characters'],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
reservationSchema.index({ donationId: 1 });
reservationSchema.index({ receiverId: 1 });
reservationSchema.index({ status: 1 });
reservationSchema.index({ createdAt: -1 });

// Compound indexes for common queries
reservationSchema.index({ receiverId: 1, status: 1 });
reservationSchema.index({ donationId: 1, status: 1 });

// Ensure one active reservation per donation
reservationSchema.index(
  { donationId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ['pending', 'confirmed'] },
    },
  }
);

const Reservation =
  (mongoose.models.Reservation as mongoose.Model<IReservationDocument>) ||
  mongoose.model<IReservationDocument>('Reservation', reservationSchema);

export default Reservation;
