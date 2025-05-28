import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [false, 'Password is not required for OAuth users'],
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  bio: {
    type: String,
    maxlength: [500, 'La biografía no puede tener más de 500 caracteres'],
  },
  phone: {
    type: String,
    maxlength: [20, 'El número de teléfono no puede tener más de 20 caracteres'],
  },
  github: {
    type: String,
    maxlength: [100, 'El nombre de usuario de GitHub no puede tener más de 100 caracteres'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password along with the new salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Verificar si el modelo ya existe para evitar recompilación
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
