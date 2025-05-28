import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('query');
    
    if (!query) {
      return NextResponse.json({ projects: [] });
    }
    
    await connectToDB();
    
    // Buscar proyectos que coincidan con el término de búsqueda
    const projects = await Project.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    })
    .select('_id title image')
    .populate('creator', 'name')
    .limit(5); // Limitar a 5 resultados para evitar sobrecarga
    
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error al buscar proyectos:', error);
    return NextResponse.json({ error: 'Error al buscar proyectos' }, { status: 500 });
  }
}
