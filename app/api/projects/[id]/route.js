import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET a single project
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    await connectToDB();
    
    const { id } = params;
    const project = await Project.findById(id)
      .populate('creator', 'name email image')
      .populate({
        path: 'comments.author',
        select: 'name image'
      });
    
    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }
    
    // Convertir a objeto para poder añadir propiedades
    const projectObj = project.toObject();
    
    // Añadir campo userLiked si hay sesión
    if (session) {
      projectObj.userLiked = project.likes.some(
        (likeId) => likeId.toString() === session.user.id
      );
    } else {
      projectObj.userLiked = false;
    }
    
    return NextResponse.json(projectObj, { status: 200 });
  } catch (error) {
    console.error('Error al obtener proyecto:', error);
    return NextResponse.json({ error: 'Error al obtener proyecto' }, { status: 500 });
  }
}

// DELETE a project
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    await connectToDB();
    
    const { id } = params;
    const project = await Project.findById(id);
    
    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }
    
    // Verificar si el usuario es el creador del proyecto
    if (project.creator.toString() !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    await Project.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Proyecto eliminado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    return NextResponse.json({ error: 'Error al eliminar proyecto' }, { status: 500 });
  }
}

// UPDATE a project
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    await connectToDB();
    
    const { id } = params;
    const { title, description, image, link } = await request.json();
    
    const project = await Project.findById(id);
    
    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }
    
    // Verificar si el usuario es el creador del proyecto
    if (project.creator.toString() !== session.user.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }
    
    // Actualizar el proyecto manteniendo los likes y comentarios
    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { title, description, image, link },
      { new: true, runValidators: true }
    ).populate('creator', 'name email image');
    
    // Convertir a objeto para poder añadir propiedades
    const projectObj = updatedProject.toObject();
    
    // Añadir campo userLiked
    projectObj.userLiked = updatedProject.likes.some(
      (likeId) => likeId.toString() === session.user.id
    );
    
    return NextResponse.json(projectObj, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    return NextResponse.json({ error: 'Error al actualizar proyecto' }, { status: 500 });
  }
}
