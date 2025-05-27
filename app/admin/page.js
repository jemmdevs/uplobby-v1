'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    comments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Obtener estadísticas de usuarios
        const usersResponse = await fetch('/api/admin/users');
        const usersData = await usersResponse.json();
        
        // Obtener estadísticas de proyectos
        const projectsResponse = await fetch('/api/admin/projects');
        const projectsData = await projectsResponse.json();
        
        // Obtener estadísticas de comentarios
        const commentsResponse = await fetch('/api/admin/comments');
        const commentsData = await commentsResponse.json();
        
        setStats({
          users: usersData.pagination.total || 0,
          projects: projectsData.pagination.total || 0,
          comments: commentsData.pagination.total || 0
        });
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        setError('Error al cargar las estadísticas. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Panel de Administración</h1>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900/30 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--mongodb-dark-green)]"></div>
        </div>
      ) : (
        <>
          {/* Tarjetas de estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-[var(--mongodb-dark-green)] rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Total de Usuarios
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {stats.users}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href="/admin/users"
                    className="font-medium text-[var(--mongodb-dark-green)] hover:text-[var(--mongodb-green)] transition-colors"
                  >
                    Ver todos los usuarios
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-[var(--mongodb-dark-green)] rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Total de Proyectos
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {stats.projects}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href="/admin/projects"
                    className="font-medium text-[var(--mongodb-dark-green)] hover:text-[var(--mongodb-green)] transition-colors"
                  >
                    Ver todos los proyectos
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-[var(--mongodb-dark-green)] rounded-md p-3">
                    <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Total de Comentarios
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900 dark:text-white">
                          {stats.comments}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-5 py-3">
                <div className="text-sm">
                  <Link
                    href="/admin/comments"
                    className="font-medium text-[var(--mongodb-dark-green)] hover:text-[var(--mongodb-green)] transition-colors"
                  >
                    Ver todos los comentarios
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Información adicional */}
          <div className="bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Bienvenido al Panel de Administración</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Desde aquí puedes gestionar todos los aspectos de la plataforma UpLobby. Utiliza el menú lateral para navegar entre las diferentes secciones.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Gestión de Usuarios</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Administra usuarios, cambia roles y elimina cuentas si es necesario.
                </p>
                <Link
                  href="/admin/users"
                  className="text-sm font-medium text-[var(--mongodb-dark-green)] hover:text-[var(--mongodb-green)] transition-colors"
                >
                  Ir a Usuarios →
                </Link>
              </div>
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-2">Gestión de Proyectos</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Revisa, edita o elimina proyectos publicados en la plataforma.
                </p>
                <Link
                  href="/admin/projects"
                  className="text-sm font-medium text-[var(--mongodb-dark-green)] hover:text-[var(--mongodb-green)] transition-colors"
                >
                  Ir a Proyectos →
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
