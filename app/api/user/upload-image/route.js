import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary con las credenciales
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para convertir un buffer a una cadena base64
function bufferToBase64(buffer, type) {
  return `data:${type};base64,${buffer.toString('base64')}`;
}

// POST - Subir imagen de perfil a Cloudinary
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó ningún archivo' }, { status: 400 });
    }
    
    // Verificar que el archivo es una imagen
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'El archivo debe ser una imagen' }, { status: 400 });
    }
    
    // Convertir el archivo a un ArrayBuffer y luego a base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = bufferToBase64(buffer, file.type);
    
    // Subir la imagen a Cloudinary usando la API
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        base64Image,
        {
          folder: 'uplobby/users',
          resource_type: 'image',
          public_id: `user_${session.user.id}_${Date.now()}`,
        },
        (error, result) => {
          if (error) {
            console.error('Error al subir a Cloudinary:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
    
    // Devolver la URL de la imagen subida
    return NextResponse.json({ 
      imageUrl: result.secure_url 
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 });
  }
}
