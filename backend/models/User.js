const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your first name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please enter email"],
    validate: {
      validator: function (v) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    },
  },
  confirmPassword: {
    type: String,
    required: function() {
      return !this.googleId;
    },
  },
  timestamp: { type: Date, default: Date.now },
});

userSchema.index({ name: 'text', email: 'text' });
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 5);
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
