import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request) {
  try {
    // Verificar autenticación (opcional para pruebas iniciales)
    const session = await getServerSession(authOptions);
    
    if (!session) {
      console.log('No hay sesión de usuario');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    console.log('Procesando solicitud de carga de imagen');
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      console.log('No se encontró ningún archivo en la solicitud');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    console.log('Archivo recibido:', file.name, file.type, file.size);
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Convert buffer to base64
    const base64String = buffer.toString('base64');
    const base64File = `data:${file.type};base64,${base64String}`;
    
    console.log('Configuración de Cloudinary:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'no configurado',
      api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'no configurado'
    });
    
    // Upload to Cloudinary
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          base64File,
          {
            folder: 'uplobby_projects',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              console.error('Error de Cloudinary:', error);
              reject(error);
            } else {
              console.log('Imagen subida exitosamente a Cloudinary');
              resolve(result);
            }
          }
        );
      });
      
      console.log('Respuesta de Cloudinary:', { url: result.secure_url, public_id: result.public_id });
      
      return NextResponse.json({ 
        url: result.secure_url,
        public_id: result.public_id 
      }, { status: 200 });
    } catch (cloudinaryError) {
      console.error('Error específico de Cloudinary:', cloudinaryError);
      return NextResponse.json({ 
        error: 'Error al subir a Cloudinary', 
        details: cloudinaryError.message || 'Sin detalles adicionales'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error general al procesar la carga de imagen:', error);
    return NextResponse.json({ 
      error: 'Failed to upload image', 
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
