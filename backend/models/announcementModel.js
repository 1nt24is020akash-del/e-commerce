import mongoose from 'mongoose';

const announcementSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
