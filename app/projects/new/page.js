'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ProjectForm from '@/components/ProjectForm';

export default function NewProjectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to sign in if not authenticated
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--mongodb-dark-green)]"></div>
        </div>
      </div>
    );
  }

  // If authenticated, show the form
  if (session) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Añadir Nuevo Proyecto</h1>
        <div className="bg-white dark:bg-[var(--mongodb-navy)] shadow-md rounded-lg p-6">
          <ProjectForm type="Create" />
        </div>
      </div>
    );
  }

  // This should not be visible due to the redirect in useEffect
  return null;
}
