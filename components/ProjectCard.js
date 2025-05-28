'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const ProjectCard = ({ project, onDelete, compact = false }) => {
  const { data: session } = useSession();
  // Verificar si el creador existe antes de acceder a sus propiedades
  const creatorExists = project.creator && typeof project.creator === 'object';
  const isOwner = session?.user?.id === (creatorExists ? project.creator._id : null);
  const [liked, setLiked] = useState(project.userLiked || false);
  const [likesCount, setLikesCount] = useState(project.likes?.length || 0);
  const [isLiking, setIsLiking] = useState(false);
  const createdAt = new Date(project.createdAt || Date.now()).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  
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
        body: JSON.stringify({ projectId: project._id }),
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

  return (
    <div className={`card bg-white dark:bg-[var(--mongodb-navy)] shadow-md rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 mb-6 transition-all duration-300 hover:shadow-lg ${compact ? 'h-full flex flex-col' : ''}`}>
      {/* Cabecera del post con información del creador */}
      <div className="p-4 flex items-center border-b border-gray-100 dark:border-gray-800">
        <div className="flex-shrink-0">
          {creatorExists ? (
            <Link href={`/profile/${project.creator._id}`} className="block">
              {project.creator.image ? (
                <Image
                  className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800 shadow-sm hover:border-[var(--mongodb-green)] transition-all"
                  src={project.creator.image}
                  alt={project.creator.name}
                  width={40}
                  height={40}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-[var(--mongodb-dark-green)] flex items-center justify-center text-white text-lg font-medium shadow-sm hover:bg-[var(--mongodb-green)] transition-all">
                  {project.creator.name?.charAt(0) || "U"}
                </div>
              )}
            </Link>
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center text-white text-lg font-medium shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          )}
        </div>
        <div className="ml-3 flex-1">
          {creatorExists ? (
            <Link href={`/profile/${project.creator._id}`} className="hover:text-[var(--mongodb-green)] transition-colors">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {project.creator.name}
              </p>
            </Link>
          ) : (
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Usuario eliminado
            </p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {createdAt}
          </p>
        </div>
        {isOwner && (
          <div className="flex space-x-1">
            <Link
              href={`/projects/edit/${project._id}`}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Editar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={() => onDelete(project._id)}
              className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Eliminar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Título del proyecto */}
      <div className="px-4 pt-3 pb-2">
        <Link href={`/projects/${project._id}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-[var(--mongodb-green)] transition-colors">{project.title}</h3>
        </Link>
      </div>
      
      {/* Imagen del proyecto */}
      <Link href={`/projects/${project._id}`} className="block relative aspect-video w-full">
        <Image
          src={project.image}
          alt={project.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="transition-transform duration-500 hover:scale-105"
        />
      </Link>
      
      {/* Descripción y acciones */}
      <div className={`p-4 ${compact ? 'flex-1 flex flex-col' : ''}`}>
        {compact ? (
          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{project.description}</p>
        ) : (
          <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
        )}
        
        {/* Acciones del post */}
        <div className={`flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 ${compact ? 'mt-auto' : ''}`}>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center ${liked ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'} hover:text-red-500 dark:hover:text-red-400 transition-colors`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-1" 
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
              <span className="text-sm">{likesCount}</span>
            </button>
            <Link 
              href={`/projects/${project._id}#comments`}
              className="flex items-center text-gray-500 dark:text-gray-400 hover:text-[var(--mongodb-dark-green)] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm">{project.comments?.length || 0}</span>
            </Link>
          </div>
          
          <Link
            href={`/projects/${project._id}`}
            className="flex items-center text-[var(--mongodb-dark-green)] hover:text-[var(--mongodb-green)] transition-colors"
          >
            <span className="text-sm font-medium">Ver</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
