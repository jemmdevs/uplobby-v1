import mongoose from 'mongoose';

// Obtener la URI de MongoDB de las variables de entorno
const MONGODB_URI = process.env.MONGODB_URI;
console.log('MongoDB URI disponible:', !!MONGODB_URI);

// Verificar que la URI de MongoDB esté definida
if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI no está definido en las variables de entorno');
  throw new Error('Por favor define la variable de entorno MONGODB_URI');
}

// Opciones de conexión para MongoDB
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Declaramos la variable cached en el ámbito global para Next.js
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDB() {
  try {
    // Si ya tenemos una conexión, la devolvemos
    if (cached.conn) {
      console.log('Usando conexión a MongoDB existente');
      return cached.conn;
    }

    // Si no hay una promesa de conexión en curso, creamos una nueva
    if (!cached.promise) {
      console.log('Iniciando nueva conexión a MongoDB...');
      
      // Configuración de la conexión
      const opts = {
        bufferCommands: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };

      // Intentar conectar a MongoDB
      cached.promise = mongoose.connect(MONGODB_URI, opts)
        .then((mongoose) => {
          console.log('Conexión a MongoDB establecida correctamente');
          return mongoose;
        })
        .catch((error) => {
          console.error('Error al conectar a MongoDB:', error);
          cached.promise = null;
          throw error;
        });
    } else {
      console.log('Usando promesa de conexión existente');
    }

    // Esperamos a que se resuelva la promesa
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Error en connectToDB:', error);
    cached.promise = null;
    throw error;
  }
}

// Para mantener compatibilidad con código existente
export const connectToDatabase = connectToDB;

// Evento para manejar errores de conexión
mongoose.connection.on('error', (err) => {
  console.error('Error en la conexión de MongoDB:', err);
});

// Evento para cuando la conexión se establece
mongoose.connection.once('open', () => {
  console.log('MongoDB conectado correctamente');
});
