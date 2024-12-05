import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+@.+\..+/ },
    googleId: { type: String, required: false},
    role: { type: String, enum: ['Admin', 'Visitor'], default: 'Visitor' },
    password: {type: String, required: false},
    phone: { type: String, match: /^[0-9\-()+\s]*$/ },
    registeredAt: { type: Date, default: Date.now },
    lastVisit: { type: Date },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;