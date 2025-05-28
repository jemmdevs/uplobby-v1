'use client';

import { useState, useEffect, useRef } from 'react';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('projects'); // 'projects' o 'users'
  const [sortBy, setSortBy] = useState('date'); // 'date' o 'likes'
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProjects: 0,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);

  // Manejar clics fuera del área de búsqueda para cerrar los resultados
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Implementar debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // Esperar 300ms después de que el usuario deje de escribir
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Realizar búsqueda en tiempo real cuando cambia la consulta
  useEffect(() => {
    const searchInRealTime = async () => {
      if (debouncedSearchQuery.length < 2) {
        setSearchResults([]);
        setShowSearchResults(false);
        return;
      }
      
      setSearchLoading(true);
      
      try {
        if (searchType === 'users') {
          // Búsqueda de usuarios
          const response = await fetch(`/api/search/users?query=${encodeURIComponent(debouncedSearchQuery)}`);
          if (response.ok) {
            const data = await response.json();
            setSearchResults(data.users);
            setShowSearchResults(true);
          }
        } else {
          // Búsqueda de proyectos
          const response = await fetch(`/api/search/projects?query=${encodeURIComponent(debouncedSearchQuery)}`);
          if (response.ok) {
            const data = await response.json();
            setSearchResults(data.projects);
            setShowSearchResults(true);
          }
        }
      } catch (error) {
        console.error('Error en búsqueda en tiempo real:', error);
      } finally {
        setSearchLoading(false);
      }
    };
    
    if (searchType === 'users') {
      // Solo realizar búsqueda en tiempo real para usuarios
      searchInRealTime();
    } else {
      // Para proyectos, solo mostrar resultados si el usuario hace clic en buscar
      setShowSearchResults(false);
    }
  }, [debouncedSearchQuery, searchType]);
  
  const fetchProjects = async (page = 1) => {
    try {
      setLoading(true);
      
      // Construir URL con parámetros de búsqueda y ordenación
      let url = `/api/projects?page=${page}&limit=${pagination.limit}`;
      
      if (debouncedSearchQuery && searchType === 'projects') {
        url += `&search=${encodeURIComponent(debouncedSearchQuery)}`;
      }
      
      if (sortBy) {
        url += `&sortBy=${sortBy}`;
      }
      
      const response = await fetch(url);
      
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
  
  // Función para manejar cambios en la ordenación
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };
  
  // Función para manejar cambios en la búsqueda
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Función para cambiar el tipo de búsqueda
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchResults([]);
    setShowSearchResults(false);
  };
  
  // Función para manejar clic en un resultado de búsqueda de usuario
  const handleUserClick = (userId) => {
    window.location.href = `/user/${userId}`;
  };
  
  // Función para manejar clic en un resultado de búsqueda de proyecto
  const handleProjectClick = (projectId) => {
    window.location.href = `/projects/${projectId}`;
  };
  
  // Función para manejar la búsqueda al presionar Enter
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchType === 'projects') {
      // Para proyectos, realizar búsqueda y actualizar la lista principal
      fetchProjects(1);
      setShowSearchResults(false);
    }
  };
  
  // Efecto para cargar proyectos cuando cambian los parámetros de búsqueda o ordenación
  useEffect(() => {
    fetchProjects(1); // Volver a la primera página al cambiar búsqueda u ordenación
  }, [debouncedSearchQuery, sortBy]);
  
  // Cargar proyectos al inicio
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
        
        {/* Barra de búsqueda */}
        <div className="bg-white dark:bg-[var(--mongodb-navy)] rounded-xl shadow-md p-4 mb-6 border border-gray-100 dark:border-gray-800">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Selector de tipo de búsqueda */}
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => handleSearchTypeChange('projects')}
                className={`px-3 py-2 rounded-l-md border ${searchType === 'projects' ? 'bg-[var(--mongodb-dark-green)] text-white border-[var(--mongodb-dark-green)]' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                Proyectos
              </button>
              <button
                type="button"
                onClick={() => handleSearchTypeChange('users')}
                className={`px-3 py-2 rounded-r-md border ${searchType === 'users' ? 'bg-[var(--mongodb-dark-green)] text-white border-[var(--mongodb-dark-green)]' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                Usuarios
              </button>
            </div>
            
            {/* Barra de búsqueda */}
            <div className="relative flex-1" ref={searchRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={searchType === 'users' ? "Buscar usuarios por nombre..." : "Buscar proyectos..."}
                value={searchQuery}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-[var(--mongodb-green)] focus:border-[var(--mongodb-green)] text-gray-900 dark:text-white text-sm transition duration-150 ease-in-out"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              
              {/* Resultados de búsqueda en tiempo real */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                  {searchLoading ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex justify-center items-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-[var(--mongodb-green)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Buscando...</span>
                      </div>
                    </div>
                  ) : searchType === 'users' ? (
                    // Resultados de búsqueda de usuarios
                    <ul className="py-1">
                      {searchResults.map((user) => (
                        <li key={user._id} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                          <div 
                            className="px-4 py-2 flex items-center space-x-3"
                            onClick={() => handleUserClick(user._id)}
                          >
                            <div className="flex-shrink-0">
                              <img 
                                src={user.image || '/default-avatar.png'} 
                                alt={user.name} 
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {user.name}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    // Resultados de búsqueda de proyectos
                    <ul className="py-1">
                      {searchResults.map((project) => (
                        <li key={project._id} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                          <div 
                            className="px-4 py-2 flex items-center space-x-3"
                            onClick={() => handleProjectClick(project._id)}
                          >
                            <div className="flex-shrink-0">
                              <img 
                                src={project.image || '/placeholder.png'} 
                                alt={project.title} 
                                className="h-10 w-10 rounded-md object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {project.title}
                              </p>
                              {project.creator && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  por {project.creator.name}
                                </p>
                              )}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            
            {/* Botón de búsqueda para proyectos */}
            {searchType === 'projects' && (
              <button
                type="submit"
                className="px-4 py-2 bg-[var(--mongodb-dark-green)] text-white rounded-md hover:bg-[var(--mongodb-green)] transition-colors shadow-sm"
              >
                Buscar
              </button>
            )}
          </form>
        </div>
        
        {/* Controles de ordenación */}
        <div className="flex justify-end mb-4">
          <div className="bg-white dark:bg-[var(--mongodb-navy)] rounded-xl shadow-md p-2 border border-gray-100 dark:border-gray-800 inline-flex items-center">
            <span className="text-sm text-gray-700 dark:text-gray-300 mr-2 font-medium">Ordenar por:</span>
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => handleSortChange('date')}
                className={`px-3 py-1.5 rounded-l-md border text-sm ${sortBy === 'date' ? 'bg-[var(--mongodb-dark-green)] text-white border-[var(--mongodb-dark-green)]' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                Recientes
              </button>
              <button
                type="button"
                onClick={() => handleSortChange('likes')}
                className={`px-3 py-1.5 rounded-r-md border text-sm ${sortBy === 'likes' ? 'bg-[var(--mongodb-dark-green)] text-white border-[var(--mongodb-dark-green)]' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                Populares
              </button>
            </div>
          </div>
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
                {searchQuery ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                )}
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {searchQuery ? "No se encontraron resultados" : "No hay proyectos todavía"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {searchQuery ? 
                `No se encontraron proyectos o usuarios que coincidan con "${searchQuery}". Intenta con otra búsqueda.` :
                (session ? 
                  "¡Parece que nadie ha compartido proyectos todavía! Sé el primero en mostrar tu trabajo a la comunidad." :
                  "¡Únete a nuestra comunidad para descubrir proyectos increíbles o compartir los tuyos!")
              }
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="inline-flex items-center justify-center text-white bg-[var(--mongodb-dark-green)] hover:bg-[var(--mongodb-green)] px-6 py-3 rounded-full text-base font-medium transition-colors shadow-sm mb-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpiar búsqueda
              </button>
            )}
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
