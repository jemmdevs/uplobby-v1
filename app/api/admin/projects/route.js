import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Project from '@/models/Project';
import { withAdmin } from '@/middleware/withAdmin';

// GET - Obtener todos los proyectos (con filtros y paginación)
async function getProjects(request) {
  try {
    await connectToDB();
    
    // Obtener parámetros de consulta
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const userId = url.searchParams.get('userId') || '';
    
    // Calcular el salto para la paginación
    const skip = (page - 1) * limit;
    
    // Construir la consulta de búsqueda
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    if (userId) {
      query.creator = userId;
    }
    
    // Obtener proyectos con paginación
    const projects = await Project.find(query)
      .populate('creator', 'name email image')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Obtener el total de proyectos para la paginación
    const total = await Project.countDocuments(query);
    
    return NextResponse.json({
      projects,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    return NextResponse.json({ error: 'Error al obtener proyectos' }, { status: 500 });
  }
}

// DELETE - Eliminar un proyecto
async function deleteProject(request) {
  try {
    await connectToDB();
    
    const { projectId } = await request.json();
    
    if (!projectId) {
      return NextResponse.json({ error: 'ID de proyecto requerido' }, { status: 400 });
    }
    
    // Verificar que el proyecto exista
    const project = await Project.findById(projectId);
    
    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }
    
    // Eliminar el proyecto
    await Project.findByIdAndDelete(projectId);
    
    return NextResponse.json({ message: 'Proyecto eliminado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    return NextResponse.json({ error: 'Error al eliminar proyecto' }, { status: 500 });
  }
}

// PATCH - Actualizar un proyecto
async function updateProject(request) {
  try {
    await connectToDB();
    
    const { projectId, title, description, image, link } = await request.json();
    
    if (!projectId) {
      return NextResponse.json({ error: 'ID de proyecto requerido' }, { status: 400 });
    }
    
    // Verificar que el proyecto exista
    const project = await Project.findById(projectId);
    
    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }
    
    // Actualizar el proyecto
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { 
        title: title || project.title,
        description: description || project.description,
        image: image || project.image,
        link: link || project.link
      },
      { new: true }
    ).populate('creator', 'name email image');
    
    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    return NextResponse.json({ error: 'Error al actualizar proyecto' }, { status: 500 });
  }
}

// Exportar las funciones con el middleware de administrador
export const GET = withAdmin(getProjects);
export const DELETE = withAdmin(deleteProject);
export const PATCH = withAdmin(updateProject);
