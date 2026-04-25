import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: false,
      default: 'General Query',
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Pending',
      enum: ['Pending', 'In Progress', 'Resolved'],
    },
  },
  {
    timestamps: true,
  }
);

const Support = mongoose.model('Support', supportSchema);

export default Support;
