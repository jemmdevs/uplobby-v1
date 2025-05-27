import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Project from '@/models/Project';
import { withAdmin } from '@/middleware/withAdmin';

// GET - Obtener todos los comentarios (con filtros y paginación)
async function getComments(request) {
  try {
    await connectToDB();
    
    // Obtener parámetros de consulta
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const projectId = url.searchParams.get('projectId') || '';
    const userId = url.searchParams.get('userId') || '';
    
    // Calcular el salto para la paginación
    const skip = (page - 1) * limit;
    
    // Construir la consulta de búsqueda
    let query = {};
    
    if (projectId) {
      query._id = projectId;
    }
    
    // Obtener proyectos con sus comentarios
    const projects = await Project.find(query)
      .populate('creator', 'name email image')
      .populate({
        path: 'comments.author',
        select: 'name email image'
      })
      .sort({ createdAt: -1 });
    
    // Extraer y filtrar comentarios de todos los proyectos
    let allComments = [];
    
    projects.forEach(project => {
      // Añadir información del proyecto a cada comentario
      const commentsWithProjectInfo = project.comments.map(comment => {
        const commentObj = comment.toObject();
        commentObj.projectId = project._id;
        commentObj.projectTitle = project.title;
        return commentObj;
      });
      
      allComments = [...allComments, ...commentsWithProjectInfo];
    });
    
    // Filtrar comentarios por texto si hay búsqueda
    if (search) {
      allComments = allComments.filter(comment => 
        comment.text.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Filtrar comentarios por usuario si se especifica
    if (userId) {
      allComments = allComments.filter(comment => 
        comment.author._id.toString() === userId
      );
    }
    
    // Ordenar comentarios por fecha (más recientes primero)
    allComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Aplicar paginación
    const total = allComments.length;
    const paginatedComments = allComments.slice(skip, skip + limit);
    
    return NextResponse.json({
      comments: paginatedComments,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener comentarios:', error);
    return NextResponse.json({ error: 'Error al obtener comentarios' }, { status: 500 });
  }
}

// DELETE - Eliminar un comentario
async function deleteComment(request) {
  try {
    await connectToDB();
    
    const { commentId } = await request.json();
    
    if (!commentId) {
      return NextResponse.json({ error: 'ID de comentario requerido' }, { status: 400 });
    }
    
    // Buscar el proyecto que contiene el comentario
    const project = await Project.findOne({ 'comments._id': commentId });
    
    if (!project) {
      return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 });
    }
    
    // Eliminar el comentario
    project.comments = project.comments.filter(comment => comment._id.toString() !== commentId);
    
    await project.save();
    
    return NextResponse.json({ message: 'Comentario eliminado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    return NextResponse.json({ error: 'Error al eliminar comentario' }, { status: 500 });
  }
}

// PATCH - Actualizar un comentario
async function updateComment(request) {
  try {
    await connectToDB();
    
    const { commentId, text } = await request.json();
    
    if (!commentId || !text) {
      return NextResponse.json({ error: 'ID de comentario y texto requeridos' }, { status: 400 });
    }
    
    // Buscar el proyecto que contiene el comentario
    const project = await Project.findOne({ 'comments._id': commentId });
    
    if (!project) {
      return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 });
    }
    
    // Encontrar y actualizar el comentario
    const comment = project.comments.find(c => c._id.toString() === commentId);
    
    if (!comment) {
      return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 });
    }
    
    comment.text = text;
    comment.updatedAt = new Date();
    
    await project.save();
    
    // Obtener el comentario actualizado con información del autor
    await project.populate({
      path: 'comments.author',
      select: 'name email image'
    });
    
    const updatedComment = project.comments.find(c => c._id.toString() === commentId);
    
    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar comentario:', error);
    return NextResponse.json({ error: 'Error al actualizar comentario' }, { status: 500 });
  }
}

// Exportar las funciones con el middleware de administrador
export const GET = withAdmin(getComments);
export const DELETE = withAdmin(deleteComment);
export const PATCH = withAdmin(updateComment);
