'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

const CommentSection = ({ projectId, comments: initialComments = [] }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Función para añadir un comentario
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!session) {
      alert('Debes iniciar sesión para comentar');
      return;
    }
    
    if (!newComment.trim()) {
      setError('El comentario no puede estar vacío');
      return;
    }
    
    if (newComment.length > 500) {
      setError('El comentario no puede tener más de 500 caracteres');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/projects/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId,
          text: newComment,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al añadir comentario');
      }
      
      // Añadir el nuevo comentario a la lista
      setComments([...comments, data.comment]);
      setNewComment(''); // Limpiar el campo de comentario
      
    } catch (error) {
      console.error('Error al añadir comentario:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white dark:bg-[var(--mongodb-navy)] shadow-md rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 mb-6">
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[var(--mongodb-dark-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Comentarios ({comments.length})
        </h2>
      </div>
      
      {/* Formulario para añadir comentario */}
      {session ? (
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <form onSubmit={handleAddComment} className="flex flex-col">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 mr-3">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[var(--mongodb-dark-green)] flex items-center justify-center text-white text-lg font-medium">
                    {session.user.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--mongodb-dark-green)] dark:bg-[var(--mongodb-navy)] dark:text-white resize-none"
                  rows={3}
                  maxLength={500}
                ></textarea>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {newComment.length}/500 caracteres
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[var(--mongodb-dark-green)] hover:bg-[var(--mongodb-green)] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      'Comentar'
                    )}
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            Inicia sesión para dejar un comentario
          </p>
          <Link
            href="/api/auth/signin"
            className="inline-flex items-center justify-center text-white bg-[var(--mongodb-dark-green)] hover:bg-[var(--mongodb-green)] px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      )}
      
      {/* Lista de comentarios */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={comment._id || index} className="p-6">
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  {comment.author.image ? (
                    <Image
                      src={comment.author.image}
                      alt={comment.author.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-[var(--mongodb-dark-green)] flex items-center justify-center text-white text-lg font-medium">
                      {comment.author.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {comment.author.name}
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {comment.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              No hay comentarios todavía. ¡Sé el primero en comentar!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
