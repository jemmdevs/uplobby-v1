'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNavbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  // Si el usuario no está autenticado, no mostramos la barra de navegación móvil
  if (!session) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[var(--mongodb-navy)] border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="flex justify-around items-center h-16 px-4">
        {/* Botón de inicio */}
        <Link href="/" className="flex flex-col items-center justify-center">
          <div className={`p-2 rounded-full ${pathname === '/' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${pathname === '/' ? 'text-[var(--mongodb-dark-green)]' : 'text-gray-600 dark:text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span className="text-xs mt-1 font-medium text-gray-600 dark:text-gray-400">Inicio</span>
        </Link>

        {/* Botón de proyectos */}
        <Link href="/projects" className="flex flex-col items-center justify-center">
          <div className={`p-2 rounded-full ${pathname.startsWith('/projects') ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${pathname.startsWith('/projects') ? 'text-[var(--mongodb-dark-green)]' : 'text-gray-600 dark:text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <span className="text-xs mt-1 font-medium text-gray-600 dark:text-gray-400">Proyectos</span>
        </Link>

        {/* Botón de nuevo proyecto (con círculo) */}
        <Link href="/projects/new" className="flex flex-col items-center justify-center -mt-5">
          <div className="bg-[var(--mongodb-dark-green)] p-3 rounded-full shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <span className="text-xs mt-1 font-medium text-gray-600 dark:text-gray-400">Crear</span>
        </Link>

        {/* Botón de explorar/buscar */}
        <Link href="/search" className="flex flex-col items-center justify-center">
          <div className={`p-2 rounded-full ${pathname === '/search' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${pathname === '/search' ? 'text-[var(--mongodb-dark-green)]' : 'text-gray-600 dark:text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <span className="text-xs mt-1 font-medium text-gray-600 dark:text-gray-400">Explorar</span>
        </Link>

        {/* Botón de perfil */}
        <Link href="/profile" className="flex flex-col items-center justify-center">
          <div className={`p-2 rounded-full ${pathname === '/profile' ? 'bg-gray-100 dark:bg-gray-800' : ''}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${pathname === '/profile' ? 'text-[var(--mongodb-dark-green)]' : 'text-gray-600 dark:text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-xs mt-1 font-medium text-gray-600 dark:text-gray-400">Perfil</span>
        </Link>
      </div>
    </div>
  );
}
