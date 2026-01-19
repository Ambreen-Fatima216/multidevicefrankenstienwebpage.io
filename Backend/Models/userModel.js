import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // Corresponds to id="signup-name"
    name: {
        type: String,
        required: [true, "Full name is required to join the Archive"],
        trim: true
    },
    // Corresponds to id="signup-email" and id="login-email"
    email: {
        type: String,
        required: [true, "Email address is required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    // Corresponds to id="signup-password" and id="login-password"
    password: {
        type: String,
        required: [true, "Password is required for Lab access"],
        minlength: 6 // Optional security
    },
    // Useful for tracking when they joined "The Archive"
    joinedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("User", userSchema);