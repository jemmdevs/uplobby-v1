'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProjectForm from '@/components/ProjectForm';

export default function EditProjectPage({ params }) {
  const { id } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Redirect to sign in if not authenticated
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
      return;
    }
    
    // Fetch project data
    if (status === 'authenticated') {
      const fetchProject = async () => {
        try {
          const response = await fetch(`/api/projects/${id}`);
          
          if (!response.ok) {
            throw new Error('Failed to fetch project');
          }
          
          const data = await response.json();
          
          // Check if the user is the creator of the project
          if (data.creator._id !== session.user.id) {
            router.push('/projects');
            return;
          }
          
          setProject(data);
        } catch (error) {
          console.error('Error fetching project:', error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
      
      fetchProject();
    }
  }, [id, status, session, router]);

  // Show loading state while checking authentication or fetching project
  if (status === 'loading' || loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--mongodb-dark-green)]"></div>
        </div>
      </div>
    );
  }

  // Show error message if there was an error fetching the project
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  // If authenticated and project is loaded, show the form
  if (session && project) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Edit Project</h1>
        <div className="bg-white dark:bg-[var(--mongodb-navy)] shadow-md rounded-lg p-6">
          <ProjectForm type="Edit" project={project} />
        </div>
      </div>
    );
  }

  // This should not be visible due to the redirect in useEffect
  return null;
}
