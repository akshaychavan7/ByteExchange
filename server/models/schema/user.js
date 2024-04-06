const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    joiningDate: { type: Date, required: true, default: Date.now },
    profilePic: { type: String, required: false },
    userRole: {
      type: String,
      enum: ["moderator", "general"],
      required: true,
      default: "general",
    },
  },
  { collection: "User" }
);

// Middleware to hash the password before saving
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = userSchema;
