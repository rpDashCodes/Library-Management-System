import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // E.g., 'bookID'
    value: { type: Number, default: 0 }, // Initial counter value
});

export default new mongoose.model('Counter',counterSchema,'counter');