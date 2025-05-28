import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('query');
    
    if (!query) {
      return NextResponse.json({ users: [] });
    }
    
    await connectToDB();
    
    // Buscar usuarios que coincidan con el término de búsqueda
    const users = await User.find({
      name: { $regex: query, $options: 'i' }
    })
    .select('_id name image')
    .limit(5); // Limitar a 5 resultados para evitar sobrecarga
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error al buscar usuarios:', error);
    return NextResponse.json({ error: 'Error al buscar usuarios' }, { status: 500 });
  }
}
