import { User } from "../models/user.js";
 
import {sendPasswordResetEmail, sendVerificationEmail, sendWelcomeEmail, sendContactEmail} from '../utils/email.js'
import {createToken, verifyToken} from '../utils/jwt.js'
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";

// user register

export const userRegister = async(req, res)=>{
    try{
        const {name, email, password, } = req.body
        if(!name || !email || !password){
            return res.status(401).json({message: "all filed is required"})
        }
        const UserExist = await User.findOne({name})
        if(UserExist){
         return res.status(401).json({message:"user allredy exist"})
        }
       const verificationToken = createToken(email);
       const user = new User({
         name,
         email,
         password,
         profile: req.file? req.file.path: null,
         verificationToken, // Save the token
       });
       await user.save();

     
        try{
            await sendVerificationEmail(email, verificationToken)
            res.status(201).json({message:"user successfuly verified"})
        }
        catch (error){
            console.error("email verficaion is failed")
            await User.deleteOne({_id: user._id})
            res.status(501).json({message:"email verfication is failed"})
        }

   
    }
    catch (error) {
        console.error("error while registering", error)
    }
}

// user login
export const userLogin = async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name });
  if (!user) {
    return res.status(401).json({ message: "User not found!" });
  }

  if (!user.isVerified) { 
    return res
      .status(401)
      .json({ message: "Please verify your email before logging in." });
  }

  const isValidPassword = await bcrypt.compare(password, user.password)
 if(!isValidPassword){
      return res
        .status(401)
        .json({ message: "Invalid credentiol" });
 }

  const token = createToken(user._id);
  res.status(200).json({ message: "User successfully logged in", token });
};

// userPorfile 

export const AllUserProfile = async(req, res) =>{
    try{ 
        const response = await User.find()
    res.json(response) 
    }
   catch (error){
    console.error("error")
   }
}

// userbyid

export const userById = async (req, res) => {
    try{
     const user = await User.findById(req.user.id)
     res.json(user)
     
    } catch (error){
        console.error("error")
    }
}

export const getUserById = async(req, res) =>{
  try{
    const {id} = req.params
    const user = await User.findById(id)
    res.json(user)
  }
  catch (error){
    console.error("error", error)
  }
}

export const updateProfile = async (req, res) => {
  try {
    const updates = {};

    // Handle text fields
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;

    // Handle file upload
    if (req.file) {
      updates.profile = req.file.path; // Assuming you're using a middleware like Multer
    } else if (req.files && req.files.profile) {
      updates.profile = req.files.profile[0].path; // Support for multiple files
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getVerificationEmail = async (req, res) => {
  const { token } = req.params;
 
  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token." });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    // Send the welcome email after successful email verification
    try {
      await sendWelcomeEmail(user.email, user.name); // Send welcome email
    } catch (emailError) {
      console.error("Welcome email sending failed:", emailError);
    }

    return res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

// Resend Verification Email Endpoint
export const resendVerification = async (req, res)=>{
    try{
 const {email} = req.body

 const user = await User.findOne({email})

 if(!user){
    return res.status(401).json({message: "User Not Found"})

 }
 if(user.isVerified === true){
    return res.status(401).json({message:"User alredy verfide"})
 }

 const verificationToken = createToken(email);
 user.verificationToken = verificationToken
 
 await user.save()
 try{
    await sendVerificationEmail(email, verificationToken)
 }
 catch (error){
    console.error('errro', error)
 }
    }
    catch (error){
        console.error("error", error)

    }
}

// Password Reset Request Endpoint
export const resetPassword = async (req, res)=>{
    try{
        const {email} = req.body
        console.log( "this is email",email)
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({message:"user not found"})
        }


        const resetToken = createToken(email)

        user.resetPasswordToken = resetToken;
        await user.save()

        try{
            await sendPasswordResetEmail(email, resetToken)
        }
        catch (error){
            console.error("error",error)
        }



    }catch (error){
        console.error("error", error)
    }
}

// Password Reset Form (GET Route) 

export const getResetPassword = async (req, res) =>{
    try{
        const {token} = req.params
        const decoded = verifyToken(token)
        const user = await User.findOne({decoded})
         if(!user || user.resetToken !== token){
            return res.status(401).json({message:'invalid token'})
         }
        
    } catch(error){   
    console.log('error', error)
}
}

// Reset Password Endpoint (POST Route)

export const postResetPassword = async (req, res) => {
  try {
    const { token } = req.params; // Extract the token from the URL
    const { password } = req.body; // Extract the new password from the request body

    // Validate password input
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    // Decode the token to get the email
    const decodedEmail = verifyToken(token); // Decoded value is likely the email
    if (!decodedEmail) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  console.log(decodedEmail)
    // Find the user by email
    const user = await User.findOne({email:decodedEmail.id});
    if (!user || user.resetPasswordToken !== token) {
      return res
        .status(401)
        .json({ message: "Invalid token or user not found" });
    }

    // Update the user's password and clear the reset token
    user.password = password; // Assumes password hashing middleware is in place
    user.resetPasswordToken = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful!" });
    console.log("Password reset successful for user:", user.email);
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


 export const contactEmail =  async (req, res) => {
  const { name, email, message } = req.body;

  try {
    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Call the utility function to send the contact email
    const result = await sendContactEmail(email, name, message);

    res.status(200).json({
      message: "Your message has been sent successfully!",
      result,
    });
  } catch (error) {
    console.error("Error sending contact email:", error);
    res.status(500).json({ error: "There was an issue sending your message" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body
    const userId = req.user.id;
 

    // Step 2: Delete the user account
    const user = await User.findByIdAndDelete(userId);

    // Step 3: Check if the user was deleted successfully
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
      return res.status(400).json({ message: "Incorrect password" });
    }
    // Respond back to the client
    res.status(200).json({ message: "User account and related data successfully deleted!" });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ message: "Error deleting account", error });
  }
};

