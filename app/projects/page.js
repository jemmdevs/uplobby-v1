'use client';

import { useState, useEffect } from 'react';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      
      // Remove the deleted project from the state
      setProjects(projects.filter(project => project._id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
      alert(error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects Gallery</h1>
        {session && (
          <Link href="/projects/new" className="btn-primary px-4 py-2 rounded-md text-sm">
            Add New Project
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--mongodb-dark-green)]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-4">No projects found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Be the first to add a project to our gallery!</p>
          {session ? (
            <Link href="/projects/new" className="btn-primary px-4 py-2 rounded-md text-sm">
              Add Your First Project
            </Link>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Please <Link href="/api/auth/signin" className="text-[var(--mongodb-dark-green)] hover:underline">sign in</Link> to add a project.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
