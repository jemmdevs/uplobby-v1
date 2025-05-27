import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET all projects
export async function GET() {
  try {
    await connectToDatabase();
    
    const projects = await Project.find({}).populate('creator', 'name email image');
    
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST a new project
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    await connectToDatabase();
    
    const { title, description, image, link } = await request.json();
    
    if (!title || !description || !image || !link) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newProject = await Project.create({
      title,
      description,
      image,
      link,
      creator: session.user.id,
    });
    
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
