import mongoose, { Schema, Document } from 'mongoose';
import { IDonation, FoodType, DonationStatus } from '../types';

export interface IDonationDocument extends Omit<IDonation, '_id'>, Document {}

const donationSchema = new Schema<IDonationDocument>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    foodType: {
      type: [String],
      enum: Object.values(FoodType),
      required: [true, 'Please provide food type(s)'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide quantity'],
      min: [0.1, 'Quantity must be greater than 0'],
    },
    unit: {
      type: String,
      enum: ['kg', 'pieces', 'liters', 'boxes', 'plates'],
      required: [true, 'Please provide unit'],
    },
    pickupLocation: {
      street: {
        type: String,
        required: [true, 'Please provide street address'],
      },
      city: {
        type: String,
        required: [true, 'Please provide city'],
      },
      state: {
        type: String,
        required: [true, 'Please provide state'],
      },
      zipCode: {
        type: String,
        required: [true, 'Please provide zip code'],
        match: [/^[0-9\-]{3,}$/, 'Please provide a valid zip code'],
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    availableFrom: {
      type: Date,
      required: [true, 'Please provide available from date'],
      default: () => new Date(),
    },
    availableUntil: {
      type: Date,
      required: [true, 'Please provide available until date'],
      validate: {
        validator: function (value: Date) {
          return value > this.availableFrom;
        },
        message: 'availableUntil must be after availableFrom',
      },
    },
    status: {
      type: String,
      enum: Object.values(DonationStatus),
      default: DonationStatus.AVAILABLE,
      index: true,
    },
    donorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Donor ID is required'],
      index: true,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (value: string[]) {
          return value.length <= 5;
        },
        message: 'Cannot upload more than 5 images',
      },
    },
    allergens: {
      type: [String],
      default: [],
    },
    expiryDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
donationSchema.index({ donorId: 1 });
donationSchema.index({ status: 1 });
donationSchema.index({ foodType: 1 });
donationSchema.index({ availableUntil: 1 });
donationSchema.index({ createdAt: -1 });
donationSchema.index({
  'pickupLocation.coordinates': '2dsphere',
});

// Compound indexes for common queries
donationSchema.index({ status: 1, createdAt: -1 });
donationSchema.index({ donorId: 1, status: 1 });

const Donation =
  (mongoose.models.Donation as mongoose.Model<IDonationDocument>) ||
  mongoose.model<IDonationDocument>('Donation', donationSchema);

export default Donation;
