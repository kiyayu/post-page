import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,  
      minlength: [3, "Name should be at least 3 characters long"],   
      maxlength: [200, "Name should not be more than 50 characters long"],  
    },
    email: {
      type: String,
      required: true,
      unique: true,  
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],  
    }, 
    password: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }  
);

 
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
     
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

 
export const User = mongoose.model("User", userSchema);
