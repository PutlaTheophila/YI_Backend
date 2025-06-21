const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true, // assuming phone number is unique identifier
  },
  isVerified: {
    type: Boolean,
    default: false, // for OTP verification status
  },
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  profilePhotoUrl: {
    type: String, // URL or path to uploaded photo
  },
  industry: {
    type: [String],
    required: true,
    enum: [
      'Technology',
      'Healthcare',
      'Finance',
      'Education',
      'Real Estate',
      'Manufacturing',
      'Retail & Trade',
      'F&B / Hospitality',
      'Media & Marketing',
      'Other',
    ],
  },
  yiRole: {
    type: String,
    enum: ['Member', 'EC', 'Chair'],
    default: 'Member',
  },
  yiTeam: {
    type: String,
    enum: ['J9 Power', 'Piramal Fires', 'Zoff Strikers', 'OBCL Riders', 'NA','not-specified'],
    default: 'not-specified',
  },
  interestAreas: {
    type: [String],
    required: true,
    enum: [
      'Travel', 'Music', 'Fitness', 'Sports', 'Reading',
      'Food & Cooking', 'Photography', 'Art & Design', 'Fashion',
      'Tech & Gadgets', 'Yoga & Wellness', 'Golf', 'Trekking', 'Writing',
      'Startups & Innovation', 'Volunteering', 'Film & Theatre',
      'Dancing', 'Public Speaking', 'Investing',
    ],
  },
  yiMytri: {
    type: String,
    enum: ['Membership', 'Yuva', 'Thalir', 'Rural Initiative', 'NA','not-specified'],
    default: 'not-specified',
  },
  yiProjects: {
    type: String,
    enum: ['Masoom', 'Road safety', 'Climate Action', 'Accessibility', 'Health', 'NA','not-specified'],
    default: 'not-specified',
  },
  yiInitiatives: {
    type: String,
    enum: ['Learning', 'Entrepreneurship', 'Innovation', 'NA','not-specified'],
    default: 'not-specified',
  },
  events: {
    rsvps: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      }
    ],
    attended: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      }
    ]
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
