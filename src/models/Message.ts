import mongoose, { Schema, Document } from 'mongoose';
import { IMessage } from '../types';

export interface IMessageDocument extends Omit<IMessage, '_id'>, Document {}

const messageSchema = new Schema<IMessageDocument>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender ID is required'],
      index: true,
    } as any,
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Receiver ID is required'],
      index: true,
    } as any,
    content: {
      type: String,
      required: [true, 'Message content is required'],
      minlength: [1, 'Message cannot be empty'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    relatedDonationId: {
      type: Schema.Types.ObjectId,
      ref: 'Donation',
      default: null,
      index: true,
    } as any,
    relatedReservationId: {
      type: Schema.Types.ObjectId,
      ref: 'Reservation',
      default: null,
      index: true,
    } as any,
    attachments: {
      type: [String],
      default: [],
      validate: {
        validator: function (value: string[]) {
          return value.length <= 5;
        },
        message: 'Cannot attach more than 5 files',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
messageSchema.index({ senderId: 1 });
messageSchema.index({ receiverId: 1 });
messageSchema.index({ isRead: 1 });
messageSchema.index({ createdAt: -1 });

// Compound indexes for common queries
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ receiverId: 1, isRead: 1 });
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

// TTL index for auto-deletion of old messages (optional - delete after 365 days)
messageSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 31536000,
    name: 'messagesTTL',
  }
);

const Message =
  (mongoose.models.Message as mongoose.Model<IMessageDocument>) ||
  mongoose.model<IMessageDocument>('Message', messageSchema);

export default Message;
