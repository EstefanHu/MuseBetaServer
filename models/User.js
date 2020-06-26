const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const encryptEmailToken = require('./../utils/encryptEmailToken.js');

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid email.']
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  type: {
    type: String,
    enum: ['free', 'prime', 'deluxe'],
    default: 'free'
  },
  credibility: {
    type: Number,
    default: 0
  },
  bio: {
    type: String,
    maxlength: 280,
  },
  awards: [String], // TODO: User Test
  links: [String],
  titles: [{
    name: String,
    organization: {
      type: mongoose.Schema.ObjectId,
      enum: ['Page', 'Chapter'],
    },
  }],
  library: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Story'
  }],
  organizations: [
    {
      type: mongoose.Schema.ObjectId,
      enum: ['Page', 'Chapter', 'Book'],
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  googleId: {
    type: String
  },
  facebookId: {
    type: String
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordTokenExpires: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// userSchema.virtual('authorName').get(function () {
//   return this.firstName + ' ' + this.lastName;
// })

// https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, +process.env.SALT_WORK_FACTOR || 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // Garentee JWT is valid
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = encryptEmailToken(resetToken);
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordTokenExpires = Date.now() + 600 * 60 * 1000; // 1 hour

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);