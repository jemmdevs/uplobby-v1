// Script para crear una cuenta de administrador
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Verificar que la variable de entorno MONGODB_URI esté definida
if (!process.env.MONGODB_URI) {
  console.error('Error: MONGODB_URI no está definido en las variables de entorno');
  process.exit(1);
}

// Definir el esquema de usuario (simplificado para este script)
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  image: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para encriptar la contraseña antes de guardar
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Crear el modelo de usuario
const User = mongoose.model('User', UserSchema);

// Función para crear un administrador
async function createAdmin() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Conexión a MongoDB establecida');
    
    // Verificar si ya existe un usuario con el correo electrónico admin@gmail.com
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    
    if (existingAdmin) {
      console.log('Ya existe un usuario con el correo electrónico admin@gmail.com');
      
      // Actualizar el rol a admin si no lo es
      if (existingAdmin.role !== 'admin') {
        await User.updateOne(
          { email: 'admin@gmail.com' },
          { role: 'admin' }
        );
        console.log('El usuario ha sido actualizado con el rol de administrador');
      } else {
        console.log('El usuario ya tiene el rol de administrador');
      }
    } else {
      // Crear un nuevo usuario administrador
      const admin = new User({
        name: 'Administrador',
        email: 'admin@gmail.com',
        password: '19Septiembre',
        role: 'admin',
        image: 'https://ui-avatars.com/api/?name=Admin&background=01684B&color=fff'
      });
      
      await admin.save();
      console.log('Usuario administrador creado con éxito');
    }
    
    // Desconectar de la base de datos
    await mongoose.disconnect();
    console.log('Desconexión de MongoDB');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Ejecutar la función
createAdmin();
