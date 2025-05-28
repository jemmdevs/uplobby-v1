'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    phone: '',
    github: '',
    image: ''
  });
  
  // Redirigir si no hay sesión
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);
  
  // Cargar datos del perfil y proyectos
  useEffect(() => {
    const fetchProfileData = async () => {
      if (status === 'authenticated') {
        try {
          // Cargar datos del perfil
          const profileResponse = await fetch('/api/user/profile');
          
          if (!profileResponse.ok) {
            throw new Error('Error al cargar el perfil');
          }
          
          const userData = await profileResponse.json();
          
          setProfileData({
            name: userData.name || '',
            email: userData.email || '',
            bio: userData.bio || '',
            phone: userData.phone || '',
            github: userData.github || '',
            image: userData.image || ''
          });
          
          setIsLoading(false);
          
          // Cargar proyectos del usuario
          const projectsResponse = await fetch(`/api/user/${session.user.id}/projects`);
          
          if (!projectsResponse.ok) {
            throw new Error('Error al cargar los proyectos');
          }
          
          const projectsData = await projectsResponse.json();
          setProjects(projectsData);
          setIsLoadingProjects(false);
        } catch (error) {
          console.error('Error al cargar datos:', error);
          setMessage({ type: 'error', text: 'Error al cargar los datos' });
          setIsLoading(false);
          setIsLoadingProjects(false);
        }
      }
    };
    
    fetchProfileData();
  }, [status, session]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileData.name,
          bio: profileData.bio,
          phone: profileData.phone,
          github: profileData.github,
          image: profileData.image
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar el perfil');
      }
      
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      
      // Cerrar el formulario automáticamente después de guardar
      setIsEditing(false);
      
      // Recargar la sesión para que los cambios persistan
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error al guardar perfil:', error);
      setMessage({ type: 'error', text: error.message || 'Error al actualizar el perfil' });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Por favor, selecciona un archivo de imagen válido' });
      return;
    }
    
    setIsUploading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // 1. Subir la imagen a Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResponse = await fetch('/api/user/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      const uploadData = await uploadResponse.json();
      
      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Error al subir la imagen');
      }
      
      const newImageUrl = uploadData.imageUrl;
      
      // 2. Actualizar el perfil con la nueva URL de imagen
      const updateResponse = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...profileData,
          image: newImageUrl
        }),
      });
      
      const updateData = await updateResponse.json();
      
      if (!updateResponse.ok) {
        throw new Error(updateData.error || 'Error al actualizar el perfil');
      }
      
      // 3. Actualizar el estado local
      setProfileData(prev => ({ ...prev, image: newImageUrl }));
      
      // 4. Mostrar mensaje de éxito
      setMessage({ type: 'success', text: 'Imagen de perfil actualizada correctamente. La página se recargará para aplicar los cambios.' });
      
      // 5. Recargar la sesión para que los cambios persistan
      setTimeout(() => {
        // Recargar la página para actualizar la sesión
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      setMessage({ type: 'error', text: error.message || 'Error al subir la imagen' });
    } finally {
      setIsUploading(false);
    }
  };
  
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[var(--mongodb-navy)] pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="animate-pulse flex flex-col space-y-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[var(--mongodb-navy)] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          {/* Cabecera */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Mi Perfil
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Información personal y proyectos
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[var(--mongodb-dark-green)] hover:bg-[var(--mongodb-green)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--mongodb-green)]"
            >
              {isEditing ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar edición
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar perfil
                </>
              )}
            </button>
          </div>
          
          {/* Mensaje de estado */}
          {message.text && (
            <div className={`px-4 py-3 ${message.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'}`}>
              <p>{message.text}</p>
            </div>
          )}
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Foto de perfil */}
                <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-white dark:border-gray-600 shadow-md">
                    {profileData.image ? (
                      <Image
                        src={profileData.image}
                        alt={profileData.name || "Foto de perfil"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-4xl text-gray-400 dark:text-gray-500">
                        {profileData.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-3 flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Foto de perfil
                    </label>
                    <div className="mt-1 flex items-center space-x-3">
                      <label htmlFor="file-upload" className="cursor-pointer bg-white dark:bg-gray-700 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none">
                        <span>Cambiar foto</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleImageUpload}
                          disabled={isUploading}
                        />
                      </label>
                      {isUploading && <span className="text-sm text-gray-500 dark:text-gray-400">Subiendo...</span>}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      JPG, PNG o GIF. Máximo 2MB.
                    </p>
                  </div>
                </div>
                
                {/* Nombre */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={profileData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[var(--mongodb-green)] focus:border-[var(--mongodb-green)]"
                    required
                  />
                </div>
                
                {/* Email (solo lectura) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={profileData.email}
                    readOnly
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    El correo electrónico no se puede cambiar
                  </p>
                </div>
                
                {/* Biografía */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Biografía
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={profileData.bio || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[var(--mongodb-green)] focus:border-[var(--mongodb-green)]"
                    placeholder="Cuéntanos un poco sobre ti..."
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Máximo 500 caracteres
                  </p>
                </div>
                
                {/* Teléfono */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={profileData.phone || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-[var(--mongodb-green)] focus:border-[var(--mongodb-green)]"
                    placeholder="+34 123 456 789"
                  />
                </div>
                
                {/* GitHub */}
                <div>
                  <label htmlFor="github" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Usuario de GitHub
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                      github.com/
                    </span>
                    <input
                      type="text"
                      name="github"
                      id="github"
                      value={profileData.github || ''}
                      onChange={handleChange}
                      className="flex-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-none rounded-r-md focus:ring-[var(--mongodb-green)] focus:border-[var(--mongodb-green)]"
                      placeholder="username"
                    />
                  </div>
                </div>
                
                {/* Botones */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[var(--mongodb-dark-green)] hover:bg-[var(--mongodb-green)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--mongodb-green)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="p-6">
              {/* Banner de perfil */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-4 border-white dark:border-gray-600 shadow-lg">
                  {profileData.image ? (
                    <Image
                      src={profileData.image}
                      alt={profileData.name || "Foto de perfil"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-4xl text-gray-400 dark:text-gray-500">
                      {profileData.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {profileData.name}
                  </h2>
                  
                  <div className="text-gray-600 dark:text-gray-300 mb-4">
                    {profileData.email}
                  </div>
                  
                  {profileData.bio && (
                    <div className="mb-4 max-w-2xl">
                      <p className="text-gray-700 dark:text-gray-300">{profileData.bio}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                    {profileData.github && (
                      <a 
                        href={`https://github.com/${profileData.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-[var(--mongodb-dark-green)] dark:hover:text-[var(--mongodb-green)]"
                      >
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        <span>{profileData.github}</span>
                      </a>
                    )}
                    
                    {profileData.phone && (
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{profileData.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[var(--mongodb-dark-green)] hover:bg-[var(--mongodb-green)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--mongodb-green)]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Editar perfil
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Sección de proyectos del usuario */}
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 px-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Mis Proyectos
            </h2>
            
            {isLoadingProjects ? (
              <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard 
                    key={project._id} 
                    project={project} 
                    compact={true}
                    onDelete={(id) => {
                      // Eliminar proyecto de la lista local después de eliminarlo
                      setProjects(prev => prev.filter(p => p._id !== id));
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Aún no has publicado ningún proyecto.
                </p>
                <Link 
                  href="/projects/new"
                  className="inline-block bg-[var(--mongodb-dark-green)] text-white px-4 py-2 rounded-md hover:bg-[var(--mongodb-green)] transition-colors"
                >
                  Crear mi primer proyecto
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
