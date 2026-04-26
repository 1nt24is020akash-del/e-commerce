import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest subscriptions if needed
  },
  subscription: {
    type: Object,
    required: true
  }
}, { timestamps: true });

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;
