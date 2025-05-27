import { connectToDB } from '@/lib/mongodb';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { projectId } = await request.json();
    
    if (!projectId) {
      return new Response(JSON.stringify({ error: 'ID del proyecto no proporcionado' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await connectToDB();

    const project = await Project.findById(projectId);
    
    if (!project) {
      return new Response(JSON.stringify({ error: 'Proyecto no encontrado' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const userId = session.user.id;
    const userLikedIndex = project.likes.findIndex(id => id.toString() === userId);
    
    // Si el usuario ya dio like, lo quitamos; si no, lo añadimos
    if (userLikedIndex !== -1) {
      project.likes.splice(userLikedIndex, 1);
    } else {
      project.likes.push(userId);
    }
    
    await project.save();
    
    return new Response(JSON.stringify({ 
      success: true, 
      liked: userLikedIndex === -1, // true si se añadió el like, false si se quitó
      likesCount: project.likes.length 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error al procesar like:', error);
    return new Response(JSON.stringify({ error: 'Error al procesar la solicitud' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
