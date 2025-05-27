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

    const { projectId, text } = await request.json();
    
    if (!projectId || !text) {
      return new Response(JSON.stringify({ error: 'ID del proyecto o texto del comentario no proporcionado' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (text.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'El comentario no puede estar vacío' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (text.length > 500) {
      return new Response(JSON.stringify({ error: 'El comentario no puede tener más de 500 caracteres' }), { 
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

    // Crear nuevo comentario
    const newComment = {
      text,
      author: session.user.id,
      createdAt: new Date()
    };
    
    // Añadir el comentario al proyecto
    project.comments.push(newComment);
    await project.save();
    
    // Obtener el comentario con los datos del autor
    const populatedProject = await Project.findById(projectId)
      .populate({
        path: 'comments.author',
        select: 'name image'
      });
    
    const addedComment = populatedProject.comments[populatedProject.comments.length - 1];
    
    return new Response(JSON.stringify({ 
      success: true, 
      comment: addedComment
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error al añadir comentario:', error);
    return new Response(JSON.stringify({ error: 'Error al procesar la solicitud' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Endpoint para obtener los comentarios de un proyecto
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');
    
    if (!projectId) {
      return new Response(JSON.stringify({ error: 'ID del proyecto no proporcionado' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await connectToDB();

    const project = await Project.findById(projectId)
      .populate({
        path: 'comments.author',
        select: 'name image'
      });
    
    if (!project) {
      return new Response(JSON.stringify({ error: 'Proyecto no encontrado' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      success: true, 
      comments: project.comments
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    return new Response(JSON.stringify({ error: 'Error al procesar la solicitud' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
