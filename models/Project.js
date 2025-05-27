import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  image: {
    type: String,
    required: [true, 'Please provide an image'],
  },
  link: {
    type: String,
    required: [true, 'Please provide a link to the project'],
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Verificar si el modelo ya existe para evitar recompilación
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;
