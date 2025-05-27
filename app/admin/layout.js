'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (status === 'loading') return;

      if (!session) {
        router.push('/auth/signin?callbackUrl=/admin');
        return;
      }

      try {
        // Verificar si el usuario tiene permisos de administrador
        const response = await fetch('/api/admin/users');
        
        if (response.ok) {
          setIsAdmin(true);
        } else {
          // Si no tiene permisos, redirigir a la página principal
          router.push('/');
        }
      } catch (error) {
        console.error('Error al verificar permisos de administrador:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [session, status, router]);

  // Si está cargando o no es administrador, mostrar pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[var(--mongodb-navy)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--mongodb-dark-green)] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si no es administrador, no mostrar nada (ya se redirigirá)
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[var(--mongodb-navy)]">
      {/* Sidebar para pantallas grandes */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
          <div className="h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-5">
              <div className="h-10 w-10 rounded-full bg-[var(--mongodb-dark-green)] flex items-center justify-center text-white text-lg font-bold mr-3">
                A
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">UpLobby Admin</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              <Link 
                href="/admin" 
                className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
              <Link 
                href="/admin/users" 
                className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Usuarios
              </Link>
              <Link 
                href="/admin/projects" 
                className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Proyectos
              </Link>
              <Link 
                href="/admin/comments" 
                className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Comentarios
              </Link>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="flex-shrink-0 group block">
              <div className="flex items-center">
                <div>
                  {session?.user?.image ? (
                    <Image
                      className="inline-block h-10 w-10 rounded-full"
                      src={session.user.image}
                      alt={session.user.name || ""}
                      width={40}
                      height={40}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-[var(--mongodb-dark-green)] flex items-center justify-center text-white text-lg font-medium">
                      {session?.user?.name?.charAt(0) || "A"}
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-base font-medium text-gray-700 dark:text-white">
                    {session?.user?.name || "Administrador"}
                  </p>
                  <Link
                    href="/"
                    className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[var(--mongodb-dark-green)]"
                  >
                    Volver al sitio
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Barra superior para móviles */}
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--mongodb-dark-green)]"
          >
            <span className="sr-only">Abrir menú</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">UpLobby Admin</h1>
          </div>
        </div>
        
        {/* Menú móvil */}
        {menuOpen && (
          <div className="fixed inset-0 flex z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMenuOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-900">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span className="sr-only">Cerrar menú</span>
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <div className="h-10 w-10 rounded-full bg-[var(--mongodb-dark-green)] flex items-center justify-center text-white text-lg font-bold mr-3">
                    A
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">UpLobby Admin</h1>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  <Link 
                    href="/admin" 
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Dashboard
                  </Link>
                  <Link 
                    href="/admin/users" 
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Usuarios
                  </Link>
                  <Link 
                    href="/admin/projects" 
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Proyectos
                  </Link>
                  <Link 
                    href="/admin/comments" 
                    className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setMenuOpen(false)}
                  >
                    <svg className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Comentarios
                  </Link>
                </nav>
              </div>
              <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-gray-800 p-4">
                <div className="flex-shrink-0 group block">
                  <div className="flex items-center">
                    <div>
                      {session?.user?.image ? (
                        <Image
                          className="inline-block h-10 w-10 rounded-full"
                          src={session.user.image}
                          alt={session.user.name || ""}
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-[var(--mongodb-dark-green)] flex items-center justify-center text-white text-lg font-medium">
                          {session?.user?.name?.charAt(0) || "A"}
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-base font-medium text-gray-700 dark:text-white">
                        {session?.user?.name || "Administrador"}
                      </p>
                      <Link
                        href="/"
                        className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[var(--mongodb-dark-green)]"
                        onClick={() => setMenuOpen(false)}
                      >
                        Volver al sitio
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 w-14"></div>
          </div>
        )}
        
        {/* Contenido principal */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
