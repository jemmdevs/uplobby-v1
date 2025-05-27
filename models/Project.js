import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'El comentario no puede estar vacío'],
    maxlength: [500, 'El comentario no puede tener más de 500 caracteres'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor proporciona un título'],
    maxlength: [100, 'El título no puede tener más de 100 caracteres'],
  },
  description: {
    type: String,
    required: [true, 'Por favor proporciona una descripción'],
    maxlength: [1000, 'La descripción no puede tener más de 1000 caracteres'],
  },
  image: {
    type: String,
    required: [true, 'Por favor proporciona una imagen'],
  },
  link: {
    type: String,
    required: [true, 'Por favor proporciona un enlace al proyecto'],
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [CommentSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Verificar si el modelo ya existe para evitar recompilación
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project;
