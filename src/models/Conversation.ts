import mongoose, { Schema, Document } from 'mongoose';
import { IConversation } from '../types';

export interface IConversationDocument extends Omit<IConversation, '_id'>, Document {}

const conversationSchema = new Schema<IConversationDocument>(
  {
    participants: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      required: [true, 'Participants are required'],
      validate: {
        validator: function (value: any[]) {
          return value.length === 2;
        },
        message: 'Conversation must have exactly 2 participants',
      },
    },
    lastMessage: {
      type: String,
      default: null,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    lastMessageAt: {
      type: Date,
      default: null,
      index: true,
    },
    unreadCount: {
      type: Schema.Types.Mixed,
      default: {},
      // Structure: { userId: count }
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
conversationSchema.index({ participants: 1 });
conversationSchema.index({ lastMessageAt: -1 });

// Unique compound index to prevent duplicate conversations
conversationSchema.index(
  { participants: 1 },
  {
    unique: true,
    sparse: true,
  }
);

// Compound index for finding conversations by participant
conversationSchema.index({ participants: 1, lastMessageAt: -1 });

const Conversation =
  (mongoose.models.Conversation as mongoose.Model<IConversationDocument>) ||
  mongoose.model<IConversationDocument>('Conversation', conversationSchema);

export default Conversation;
