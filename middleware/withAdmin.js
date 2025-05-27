import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';

// Middleware para verificar si el usuario es administrador
export function withAdmin(handler) {
  return async function(request, ...args) {
    try {
      // Obtener la sesión del usuario
      const session = await getServerSession(authOptions);
      
      if (!session) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
      }
      
      await connectToDB();
      
      // Buscar el usuario en la base de datos para verificar su rol
      const user = await User.findOne({ email: session.user.email });
      
      if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Acceso denegado. Se requieren permisos de administrador.' }, { status: 403 });
      }
      
      // Si el usuario es administrador, continuar con el handler original
      return handler(request, ...args);
    } catch (error) {
      console.error('Error en middleware de administrador:', error);
      return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
  };
}
