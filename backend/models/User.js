import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'user' },
  userName: { type: String, required: true },
  image: { type: String, required: false },
  firstName: { type: String },
  lastName: { type: String }, // <-- changed to String (was Number)
});

export default mongoose.model('User', userSchema);
