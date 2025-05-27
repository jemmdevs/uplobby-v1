import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request) {
  try {
    await connectToDatabase();
    
    const { name, email, password } = await request.json();
    
    // Validación básica
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Nombre, correo electrónico y contraseña son obligatorios' },
        { status: 400 }
      );
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'El correo electrónico ya está registrado' },
        { status: 409 }
      );
    }
    
    // Crear nuevo usuario
    const newUser = await User.create({
      name,
      email,
      password, // Se encriptará automáticamente gracias al middleware pre-save
    });
    
    // Eliminar la contraseña de la respuesta
    const user = newUser.toObject();
    delete user.password;
    
    return NextResponse.json(
      { message: 'Usuario registrado con éxito', user },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return NextResponse.json(
      { error: 'Error al registrar usuario' },
      { status: 500 }
    );
  }
}
