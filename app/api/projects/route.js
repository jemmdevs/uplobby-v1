import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Project from '@/models/Project';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET all projects
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const searchQuery = url.searchParams.get('search');
    const sortBy = url.searchParams.get('sortBy') || 'date'; // 'date' o 'likes'
    
    // Parámetros de paginación
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    await connectToDB();
    
    let query = {};
    
    // Si se proporciona userId, filtrar proyectos por creador
    if (userId) {
      query.creator = userId;
    }
    
    // Si hay un término de búsqueda, agregar filtro de búsqueda
    if (searchQuery) {
      // Buscar en título o descripción del proyecto
      const projectSearch = {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } }
        ]
      };
      
      // Buscar también por nombre de usuario creador
      const userIds = await User.find(
        { name: { $regex: searchQuery, $options: 'i' } },
        { _id: 1 }
      ).lean();
      
      if (userIds.length > 0) {
        const creatorIds = userIds.map(user => user._id);
        query.$or = [
          projectSearch.$or[0],
          projectSearch.$or[1],
          { creator: { $in: creatorIds } }
        ];
      } else {
        query = { ...query, ...projectSearch };
      }
    }
    
    // Obtener el total de proyectos para la paginación
    const totalProjects = await Project.countDocuments(query);
    
    // Configurar la ordenación
    let sortOptions = {};
    if (sortBy === 'likes') {
      // Ordenar por número de likes (más populares primero)
      sortOptions = { 'likes.length': -1, createdAt: -1 };
    } else {
      // Ordenar por fecha de creación (más recientes primero)
      sortOptions = { createdAt: -1 };
    }
    
    // Obtener los proyectos para la página actual
    const projects = await Project.find(query)
      .populate('creator', 'name email image')
      .populate({
        path: 'comments.author',
        select: 'name image'
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);
    
    // Si hay sesión, añadir campo userLiked a cada proyecto
    const projectsWithUserLiked = projects.map(project => {
      const projectObj = project.toObject();
      if (session) {
        projectObj.userLiked = project.likes.some(
          (likeId) => likeId.toString() === session.user.id
        );
      } else {
        projectObj.userLiked = false;
      }
      return projectObj;
    });
    
    // Calcular información de paginación
    const totalPages = Math.ceil(totalProjects / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return NextResponse.json({
      projects: projectsWithUserLiked,
      pagination: {
        totalProjects,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage,
        hasPrevPage
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    return NextResponse.json({ error: 'Error al obtener proyectos' }, { status: 500 });
  }
}

// POST a new project
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    await connectToDB();
    
    const { title, description, image, link } = await request.json();
    
    if (!title || !description || !image || !link) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }
    
    const newProject = await Project.create({
      title,
      description,
      image,
      link,
      creator: session.user.id,
      likes: [],      // Inicializar con array vacío de likes
      comments: []    // Inicializar con array vacío de comentarios
    });
    
    // Obtener el proyecto con los datos del creador
    const populatedProject = await Project.findById(newProject._id)
      .populate('creator', 'name email image');
    
    return NextResponse.json(populatedProject, { status: 201 });
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    return NextResponse.json({ error: 'Error al crear proyecto' }, { status: 500 });
  }
}
