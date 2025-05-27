import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// PATCH - Editar un comentario
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    await connectToDB();
    
    const { id } = params; // ID del comentario
    const { text } = await request.json();
    
    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'El comentario no puede estar vacío' }, { status: 400 });
    }
    
    // Buscar el proyecto que contiene el comentario
    const project = await Project.findOne({ 'comments._id': id }).populate({
      path: 'comments.author',
      select: 'name image'
    });
    
    if (!project) {
      return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 });
    }
    
    // Encontrar el comentario específico
    const comment = project.comments.find(c => c._id.toString() === id);
    
    if (!comment) {
      return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 });
    }
    
    // Verificar que el usuario es el autor del comentario
    if (comment.author._id.toString() !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado para editar este comentario' }, { status: 403 });
    }
    
    // Actualizar el comentario
    comment.text = text;
    comment.updatedAt = new Date();
    
    await project.save();
    
    return NextResponse.json({ 
      message: 'Comentario actualizado correctamente',
      comment
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error al editar comentario:', error);
    return NextResponse.json({ error: 'Error al editar comentario' }, { status: 500 });
  }
}

// DELETE - Eliminar un comentario
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    await connectToDB();
    
    const { id } = params; // ID del comentario
    
    // Buscar el proyecto que contiene el comentario
    const project = await Project.findOne({ 'comments._id': id });
    
    if (!project) {
      return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 });
    }
    
    // Encontrar el comentario específico
    const comment = project.comments.find(c => c._id.toString() === id);
    
    if (!comment) {
      return NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 });
    }
    
    // Verificar que el usuario es el autor del comentario o el propietario del proyecto
    const isCommentAuthor = comment.author.toString() === session.user.id;
    const isProjectOwner = project.creator.toString() === session.user.id;
    
    if (!isCommentAuthor && !isProjectOwner) {
      return NextResponse.json({ error: 'No autorizado para eliminar este comentario' }, { status: 403 });
    }
    
    // Eliminar el comentario
    project.comments = project.comments.filter(c => c._id.toString() !== id);
    
    await project.save();
    
    return NextResponse.json({ 
      message: 'Comentario eliminado correctamente' 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error al eliminar comentario:', error);
    return NextResponse.json({ error: 'Error al eliminar comentario' }, { status: 500 });
  }
}
