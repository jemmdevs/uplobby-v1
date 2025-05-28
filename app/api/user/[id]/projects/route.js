import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Project from '@/models/Project';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET - Obtener proyectos de un usuario específico
export async function GET(request, { params }) {
  try {
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }
    
    await connectToDB();
    
    // Verificar que el usuario existe
    const userExists = await User.findById(userId);
    
    if (!userExists) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    
    // Obtener la sesión actual (si existe)
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;
    
    // Buscar todos los proyectos del usuario
    const projects = await Project.find({ creator: userId })
      .sort({ createdAt: -1 }) // Ordenar por fecha de creación (más recientes primero)
      .populate('creator', 'name email image')
      .lean();
    
    // Añadir información sobre si el usuario actual ha dado like a cada proyecto
    const projectsWithLikeInfo = projects.map(project => ({
      ...project,
      userLiked: currentUserId ? project.likes.some(like => like.toString() === currentUserId) : false,
    }));
    
    return NextResponse.json(projectsWithLikeInfo);
  } catch (error) {
    console.error('Error al obtener proyectos del usuario:', error);
    return NextResponse.json({ error: 'Error al obtener proyectos del usuario' }, { status: 500 });
  }
}
