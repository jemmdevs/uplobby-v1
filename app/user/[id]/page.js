'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';

const UserProfilePage = () => {
  const params = useParams();
  const userId = params.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  
  // Cargar datos del usuario y sus proyectos
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener datos del usuario
        const userResponse = await fetch(`/api/user/${userId}`);
        
        if (!userResponse.ok) {
          throw new Error('Error al cargar el perfil del usuario');
        }
        
        const userData = await userResponse.json();
        setUser(userData);
        
        // Obtener proyectos del usuario
        const projectsResponse = await fetch(`/api/user/${userId}/projects`);
        
        if (!projectsResponse.ok) {
          throw new Error('Error al cargar los proyectos del usuario');
        }
        
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        setError(error.message);
        setIsLoading(false);
      }
    };
    
    if (userId) {
      fetchUserData();
    }
  }, [userId]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[var(--mongodb-navy)] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[var(--mongodb-navy)] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">Error</h2>
            <p className="text-gray-700 dark:text-gray-300">
              {error || 'No se pudo encontrar el usuario solicitado'}
            </p>
            <Link 
              href="/projects"
              className="mt-4 inline-block bg-[var(--mongodb-dark-green)] text-white px-4 py-2 rounded-md hover:bg-[var(--mongodb-green)] transition-colors"
            >
              Volver a Proyectos
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[var(--mongodb-navy)] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Perfil del usuario */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start">
              <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-600 shadow-lg">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "Foto de perfil"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-4xl text-gray-400 dark:text-gray-500">
                      {user.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.name}
                </h1>
                
                {user.bio && (
                  <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
                  </div>
                )}
                
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4">
                  {user.github && (
                    <a 
                      href={`https://github.com/${user.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-600 dark:text-gray-400 hover:text-[var(--mongodb-dark-green)] dark:hover:text-[var(--mongodb-green)]"
                    >
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                      <span>{user.github}</span>
                    </a>
                  )}
                  
                  {user.phone && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Proyectos del usuario */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Proyectos de {user.name}
          </h2>
          
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard 
                  key={project._id} 
                  project={project}
                  onDelete={null} // No permitimos eliminar desde aquí
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Este usuario aún no ha publicado ningún proyecto.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
