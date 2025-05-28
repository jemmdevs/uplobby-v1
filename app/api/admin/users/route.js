import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';
import Project from '@/models/Project';
import { withAdmin } from '@/middleware/withAdmin';

// GET - Obtener todos los usuarios
async function getUsers(request) {
  try {
    await connectToDB();
    
    // Obtener parámetros de consulta
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    
    // Calcular el salto para la paginación
    const skip = (page - 1) * limit;
    
    // Construir la consulta de búsqueda
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Obtener usuarios con paginación
    const users = await User.find(query)
      .select('-password') // Excluir contraseñas
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Obtener el total de usuarios para la paginación
    const total = await User.countDocuments(query);
    
    return NextResponse.json({
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}

// DELETE - Eliminar un usuario
async function deleteUser(request) {
  try {
    await connectToDB();
    
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }
    
    // Verificar que no sea el usuario administrador
    const user = await User.findById(userId);
    
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    
    if (user.email === 'admin@gmail.com') {
      return NextResponse.json({ error: 'No se puede eliminar la cuenta de administrador principal' }, { status: 403 });
    }
    
    // 1. Eliminar todos los proyectos creados por el usuario
    const deletedProjects = await Project.deleteMany({ creator: userId });
    
    // 2. Eliminar todos los comentarios hechos por el usuario en otros proyectos
    // Buscar proyectos que contienen comentarios del usuario
    const projectsWithUserComments = await Project.find({ 'comments.author': userId });
    
    // Para cada proyecto, filtrar los comentarios del usuario
    for (const project of projectsWithUserComments) {
      project.comments = project.comments.filter(comment => 
        comment.author.toString() !== userId.toString()
      );
      await project.save();
    }
    
    // 3. Eliminar los likes del usuario en proyectos
    await Project.updateMany(
      { likes: userId },
      { $pull: { likes: userId } }
    );
    
    // 4. Finalmente, eliminar el usuario
    await User.findByIdAndDelete(userId);
    
    return NextResponse.json({ 
      message: 'Usuario y todo su contenido eliminado correctamente',
      deletedProjects: deletedProjects.deletedCount
    }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });
  }
}

// PATCH - Actualizar el rol de un usuario
async function updateUserRole(request) {
  try {
    await connectToDB();
    
    const { userId, role } = await request.json();
    
    if (!userId || !role) {
      return NextResponse.json({ error: 'ID de usuario y rol requeridos' }, { status: 400 });
    }
    
    if (!['user', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Rol no válido' }, { status: 400 });
    }
    
    // Actualizar el rol del usuario
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar rol de usuario:', error);
    return NextResponse.json({ error: 'Error al actualizar rol de usuario' }, { status: 500 });
  }
}

// Exportar las funciones con el middleware de administrador
export const GET = withAdmin(getUsers);
export const DELETE = withAdmin(deleteUser);
export const PATCH = withAdmin(updateUserRole);
