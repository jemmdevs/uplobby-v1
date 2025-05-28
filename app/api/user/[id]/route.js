import { NextResponse } from 'next/server';
import { connectToDB } from '@/lib/mongodb';
import User from '@/models/User';

// GET - Obtener información de un usuario específico
export async function GET(request, { params }) {
  try {
    const userId = params.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 });
    }
    
    await connectToDB();
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    
    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      bio: user.bio,
      phone: user.phone,
      github: user.github,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return NextResponse.json({ error: 'Error al obtener usuario' }, { status: 500 });
  }
}
