import mongoose from 'mongoose';

const bannerSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['image', 'video'],
  },
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
});

const settingsSchema = mongoose.Schema(
  {
    banners: [bannerSchema],
    music: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
