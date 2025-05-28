'use client';

import { useState, useEffect } from 'react';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProjects: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchProjects = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects?page=${page}&limit=${pagination.limit}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar los proyectos');
      }
      
      const data = await response.json();
      setProjects(data.projects);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar de página
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchProjects(newPage);
    }
  };
  
  useEffect(() => {
    fetchProjects(1);
  }, []);

  const handleDeleteProject = async (projectId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar el proyecto');
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
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex justify-between items-center py-4 border-b border-gray-200 dark:border-gray-700 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-[var(--mongodb-dark-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Proyectos
          </h1>
          {session && (
            <Link 
              href="/projects/new" 
              className="flex items-center text-white bg-[var(--mongodb-dark-green)] hover:bg-[var(--mongodb-green)] px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nuevo Proyecto
            </Link>
          )}
        </div>
        
        {session && (
          <div className="bg-white dark:bg-[var(--mongodb-navy)] rounded-xl shadow-md p-4 mb-6 flex items-center space-x-4 border border-gray-100 dark:border-gray-800">
            <div className="flex-shrink-0">
              {session.user.image ? (
                <Image 
                  src={session.user.image} 
                  alt={session.user.name} 
                  width={40} 
                  height={40} 
                  className="rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-[var(--mongodb-dark-green)] flex items-center justify-center text-white text-lg font-medium shadow-sm">
                  {session.user.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <Link 
              href="/projects/new"
              className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full py-2 px-4 text-gray-500 dark:text-gray-400 text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              ¿Qué proyecto quieres compartir hoy, {session.user.name?.split(' ')[0]}?
            </Link>
          </div>
        )}
      </div>

      {loading ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-[var(--mongodb-navy)] shadow-md rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 p-6 mb-6">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[var(--mongodb-navy)] shadow-md rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 mb-6">
            <div className="animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 w-full"></div>
              <div className="p-4 space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[var(--mongodb-navy)] shadow-md rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 mb-6">
            <div className="animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 w-full"></div>
              <div className="p-4 space-y-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-[var(--mongodb-navy)] shadow-md rounded-xl overflow-hidden border border-red-100 dark:border-red-900/30 p-6 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Ha ocurrido un error</h3>
                <p className="mt-2 text-red-700 dark:text-red-400">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 inline-flex items-center text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Intentar de nuevo
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-[var(--mongodb-navy)] shadow-md rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">No hay proyectos todavía</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {session ? 
                "¡Parece que nadie ha compartido proyectos todavía! Sé el primero en mostrar tu trabajo a la comunidad." :
                "¡Únete a nuestra comunidad para descubrir proyectos increíbles o compartir los tuyos!"}
            </p>
            {session ? (
              <Link 
                href="/projects/new" 
                className="inline-flex items-center justify-center text-white bg-[var(--mongodb-dark-green)] hover:bg-[var(--mongodb-green)] px-6 py-3 rounded-full text-base font-medium transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Compartir Mi Primer Proyecto
              </Link>
            ) : (
              <Link 
                href="/api/auth/signin" 
                className="inline-flex items-center justify-center text-white bg-[var(--mongodb-dark-green)] hover:bg-[var(--mongodb-green)] px-6 py-3 rounded-full text-base font-medium transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Iniciar Sesión para Continuar
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          {projects.map((project) => (
            <ProjectCard 
              key={project._id} 
              project={project} 
              onDelete={handleDeleteProject}
            />
          ))}
          
          {/* Controles de paginación */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={!pagination.hasPrevPage}
                className={`px-3 py-1 rounded-md ${!pagination.hasPrevPage ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                aria-label="Primera página"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className={`px-3 py-1 rounded-md ${!pagination.hasPrevPage ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                aria-label="Página anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">{pagination.currentPage}</span> de <span className="font-medium">{pagination.totalPages}</span>
              </div>
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className={`px-3 py-1 rounded-md ${!pagination.hasNextPage ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                aria-label="Página siguiente"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={!pagination.hasNextPage}
                className={`px-3 py-1 rounded-md ${!pagination.hasNextPage ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}`}
                aria-label="Última página"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Información de resultados */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            Mostrando {projects.length} de {pagination.totalProjects} proyectos
          </div>
        </div>
      )}
    </div>
  );
}
