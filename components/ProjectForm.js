'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ProjectForm = ({ type, project }) => {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: project?.title || '',
    description: project?.description || '',
    image: project?.image || '',
    link: project?.link || '',
  });
  const [preview, setPreview] = useState(project?.image || '');
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreview(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const uploadImage = async () => {
    if (!file) return formData.image;

    try {
      console.log('Preparando para subir imagen:', file.name, file.type, file.size);
      
      const imageFormData = new FormData();
      imageFormData.append('file', file);

      console.log('Enviando solicitud a /api/upload');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: imageFormData,
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Error en la respuesta del servidor:', responseData);
        throw new Error(responseData.details || responseData.error || 'Error al subir la imagen');
      }

      console.log('Imagen subida exitosamente:', responseData);
      return responseData.url;
    } catch (error) {
      console.error('Error detallado al subir imagen:', error);
      alert(`Error al subir la imagen: ${error.message || 'Error desconocido'}`);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Upload image if there's a new file
      const imageUrl = await uploadImage();
      
      // Prepare data for submission
      const dataToSubmit = {
        ...formData,
        image: imageUrl || formData.image,
      };

      // Create or edit project
      const endpoint = type === 'Create' 
        ? '/api/projects' 
        : `/api/projects/${project._id}`;
      
      const method = type === 'Create' ? 'POST' : 'PATCH';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (response.ok) {
        router.push('/projects');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error submitting project:', error);
      alert(error.message || 'Failed to submit project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-[var(--mongodb-navy)] rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-700">Detalles del Proyecto</h2>
        </div>
        
        <div className="col-span-2 md:col-span-1">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Título del Proyecto
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--mongodb-dark-green)] focus:ring-[var(--mongodb-dark-green)] bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white px-4 py-3 transition duration-150 ease-in-out"
            placeholder="Escribe el título de tu proyecto"
          />
        </div>

        <div className="col-span-2 md:col-span-1">
          <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Enlace del Proyecto
          </label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--mongodb-dark-green)] focus:ring-[var(--mongodb-dark-green)] bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white px-4 py-3 transition duration-150 ease-in-out"
            placeholder="https://ejemplo.com"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--mongodb-dark-green)] focus:ring-[var(--mongodb-dark-green)] bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white px-4 py-3 transition duration-150 ease-in-out"
            placeholder="Describe tu proyecto en detalle"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Imagen del Proyecto
          </label>
          <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
            <div className="flex-shrink-0">
              {preview ? (
                <div className="relative h-40 w-40 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={preview}
                    alt="Vista previa del proyecto"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-300 hover:scale-110"
                  />
                </div>
              ) : (
                <div className="h-40 w-40 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-md">
                  <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-col items-center md:items-start">
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
                  Sube una imagen atractiva que represente tu proyecto
                </p>
                <label htmlFor="image" className="cursor-pointer bg-[var(--mongodb-dark-green)] hover:bg-[var(--mongodb-green)] text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out inline-flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"></path>
                  </svg>
                  Seleccionar Imagen
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required={type === 'Create' && !formData.image}
                />
                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Formatos: PNG, JPG, GIF (máx. 5MB)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-150 ease-in-out"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 rounded-md text-sm font-medium text-white bg-[var(--mongodb-dark-green)] hover:bg-[var(--mongodb-green)] transition duration-150 ease-in-out flex items-center justify-center min-w-[120px]"
        >
          {submitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </>
          ) : (
            type === 'Create' ? 'Crear Proyecto' : 'Actualizar Proyecto'
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
