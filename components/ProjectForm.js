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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Project Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--mongodb-dark-green)] focus:ring-[var(--mongodb-dark-green)] dark:bg-[var(--mongodb-navy)] dark:border-gray-700 dark:text-white"
          placeholder="Enter project title"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--mongodb-dark-green)] focus:ring-[var(--mongodb-dark-green)] dark:bg-[var(--mongodb-navy)] dark:border-gray-700 dark:text-white"
          placeholder="Describe your project"
        />
      </div>

      <div>
        <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Project Link
        </label>
        <input
          type="url"
          id="link"
          name="link"
          value={formData.link}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--mongodb-dark-green)] focus:ring-[var(--mongodb-dark-green)] dark:bg-[var(--mongodb-navy)] dark:border-gray-700 dark:text-white"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Project Image
        </label>
        <div className="mt-1 flex items-center space-x-6">
          <div className="flex-shrink-0">
            {preview ? (
              <div className="relative h-24 w-24 rounded-md overflow-hidden">
                <Image
                  src={preview}
                  alt="Project preview"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div className="h-24 w-24 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[var(--mongodb-dark-green)] file:text-white hover:file:bg-[var(--mongodb-green)]"
              required={type === 'Create' && !formData.image}
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary px-4 py-2 rounded-md text-sm mr-4"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary px-4 py-2 rounded-md text-sm flex items-center"
        >
          {submitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            `${type} Project`
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
