'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import CommentSection from '@/components/CommentSection';

export default function ProjectDetailPage({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar el proyecto');
        }
        
        const data = await response.json();
        setProject(data);
        setLiked(data.userLiked || false);
        setLikesCount(data.likes?.length || 0);
      } catch (error) {
        console.error('Error al cargar el proyecto:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProject();
    }
  }, [params.id]);

  // Función para manejar los likes
  const handleLike = async () => {
    if (!session) {
      alert('Debes iniciar sesión para dar like a un proyecto');
      return;
    }
    
    if (isLiking) return; // Evitar múltiples clics rápidos
    
    try {
      setIsLiking(true);
      
      // Optimistic UI update
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
      
      const response = await fetch('/api/projects/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId: params.id }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Revertir cambios si hay error
        setLiked(liked);
        setLikesCount(liked ? likesCount : likesCount - 1);
        throw new Error(data.error || 'Error al procesar like');
      }
      
      // Actualizar estado con la respuesta del servidor
      setLiked(data.liked);
      setLikesCount(data.likesCount);
      
    } catch (error) {
      console.error('Error al dar like:', error);
      alert(error.message);
    } finally {
      setIsLiking(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-[var(--mongodb-navy)] shadow-md rounded-xl overflow-hidden border border-red-100 dark:border-red-900/30 p-6">
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
                onClick={() => router.back()} 
                className="mt-4 inline-flex items-center text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-[var(--mongodb-navy)] shadow-md rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Proyecto no encontrado</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            El proyecto que estás buscando no existe o ha sido eliminado.
          </p>
          <Link 
            href="/projects" 
            className="inline-flex items-center justify-center text-white bg-[var(--mongodb-dark-green)] hover:bg-[var(--mongodb-green)] px-6 py-3 rounded-full text-base font-medium transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver a Proyectos
          </Link>
        </div>
      </div>
    );
  }

  const createdAt = new Date(project.createdAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const isOwner = session?.user?.id === project.creator._id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Navegación y acciones */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.back()} 
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-[var(--mongodb-dark-green)] dark:hover:text-[var(--mongodb-dark-green)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver
          </button>
          
          {project?.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-[var(--mongodb-dark-green)] text-white rounded-md hover:bg-[var(--mongodb-green)] transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Ir a la página web del proyecto
            </a>
          )}
        </div>
        
        {isOwner && (
          <div className="flex space-x-3">
            <Link
              href={`/projects/edit/${project._id}`}
              className="inline-flex items-center text-[var(--mongodb-dark-green)] hover:text-[var(--mongodb-green)] font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Editar
            </Link>
          </div>
        )}
      </div>
      
      {/* Tarjeta del proyecto */}
      <div className="bg-white dark:bg-[var(--mongodb-navy)] shadow-md rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 mb-8">
        {/* Cabecera con información del creador */}
        <div className="p-6 flex items-center border-b border-gray-100 dark:border-gray-800">
          <div className="flex-shrink-0">
            <Link href={`/profile/${project.creator._id}`}>
              {project.creator.image ? (
                <Image
                  className="h-12 w-12 rounded-full border-2 border-white dark:border-gray-800 shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                  src={project.creator.image}
                  alt={project.creator.name}
                  width={48}
                  height={48}
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-[var(--mongodb-dark-green)] flex items-center justify-center text-white text-lg font-medium shadow-sm hover:opacity-90 transition-opacity cursor-pointer">
                  {project.creator.name?.charAt(0) || "U"}
                </div>
              )}
            </Link>
          </div>
          <div className="ml-4 flex-1">
            <Link href={`/profile/${project.creator._id}`} className="hover:text-[var(--mongodb-dark-green)] transition-colors">
              <p className="text-base font-medium text-gray-900 dark:text-white">
                {project.creator.name}
              </p>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Publicado el {createdAt}
            </p>
          </div>
        </div>
        
        {/* Título del proyecto */}
        <div className="px-6 pt-6 pb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
        </div>
        
        {/* Imagen del proyecto */}
        <div className="relative aspect-video w-full">
          <Image
            src={project.image}
            alt={project.title}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            priority
          />
        </div>
        
        {/* Descripción y acciones */}
        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg whitespace-pre-line">{project.description}</p>
          
          {/* Acciones del post */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-6">
              <button 
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center ${liked ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'} hover:text-red-500 dark:hover:text-red-400 transition-colors`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 mr-2" 
                  fill={liked ? 'currentColor' : 'none'} 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={liked ? 1 : 2} 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                  />
                </svg>
                <span className="text-sm font-medium">{likesCount} {likesCount === 1 ? 'Me gusta' : 'Me gusta'}</span>
              </button>
              
              <a
                href="#comments"
                className="flex items-center text-gray-500 dark:text-gray-400 hover:text-[var(--mongodb-dark-green)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="text-sm font-medium">{project.comments?.length || 0} {(project.comments?.length || 0) === 1 ? 'Comentario' : 'Comentarios'}</span>
              </a>
            </div>
            
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-[var(--mongodb-dark-green)] hover:text-[var(--mongodb-green)] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="text-sm font-medium">Ver Proyecto</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Sección de comentarios */}
      <div id="comments">
        <CommentSection projectId={params.id} comments={project.comments || []} />
      </div>
    </div>
  );
}
