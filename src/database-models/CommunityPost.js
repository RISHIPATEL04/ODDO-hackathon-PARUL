import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  text: { type: String, required: true },
}, { timestamps: true });

const CommunityPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  tripName: { type: String, required: true },
  destination: { type: String, required: true },
  coverPhoto: { type: String, default: '' },
  description: { type: String, default: '' },
  tags: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [CommentSchema],
}, { timestamps: true });

export default mongoose.models.CommunityPost || mongoose.model('CommunityPost', CommunityPostSchema);

