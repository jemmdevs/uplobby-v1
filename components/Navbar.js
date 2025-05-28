'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Función para determinar si un enlace está activo
  const isActive = (path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-white dark:bg-[var(--mongodb-navy)] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-[var(--mongodb-dark-green)]">UpLobby</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/" className={`inline-flex items-center px-1 pt-1 border-b-2 ${isActive('/') ? 'border-[var(--mongodb-dark-green)] text-[var(--mongodb-dark-green)] dark:text-[var(--mongodb-green)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-[var(--mongodb-green)] dark:text-gray-300 dark:hover:text-white'} text-sm font-medium`}>
                Inicio
              </Link>
              <Link href="/projects" className={`inline-flex items-center px-1 pt-1 border-b-2 ${isActive('/projects') ? 'border-[var(--mongodb-dark-green)] text-[var(--mongodb-dark-green)] dark:text-[var(--mongodb-green)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-[var(--mongodb-green)] dark:text-gray-300 dark:hover:text-white'} text-sm font-medium`}>
                Proyectos
              </Link>
              {session && (
                <Link href="/projects/new" className={`inline-flex items-center px-1 pt-1 border-b-2 ${isActive('/projects/new') ? 'border-[var(--mongodb-dark-green)] text-[var(--mongodb-dark-green)] dark:text-[var(--mongodb-green)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-[var(--mongodb-green)] dark:text-gray-300 dark:hover:text-white'} text-sm font-medium`}>
                  Añadir Proyecto
                </Link>
              )}
              {session?.user?.role === 'admin' && (
                <Link href="/admin" className={`inline-flex items-center px-1 pt-1 border-b-2 ${isActive('/admin') ? 'border-[var(--mongodb-dark-green)] text-[var(--mongodb-dark-green)] dark:text-[var(--mongodb-green)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-[var(--mongodb-green)] dark:text-gray-300 dark:hover:text-white'} text-sm font-medium`}>
                  Panel Admin
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {session.user.name}
                </span>
                <Link href="/profile" className="relative">
                  {session.user.image ? (
                    <Image
                      className="h-8 w-8 rounded-full border-2 border-transparent hover:border-[var(--mongodb-green)] transition-all"
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-[var(--mongodb-dark-green)] flex items-center justify-center text-white border-2 border-transparent hover:border-[var(--mongodb-green)] transition-all">
                      {session.user.name?.charAt(0) || "U"}
                    </div>
                  )}
                </Link>
                <div className="flex space-x-2">
                  <Link
                    href="/profile"
                    className="btn-secondary px-3 py-1 text-sm rounded-md"
                  >
                    Mi Perfil
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="btn-secondary px-3 py-1 text-sm rounded-md"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/signup"
                  className="btn-secondary px-3 py-1 text-sm rounded-md"
                >
                  Registrarse
                </Link>
                <button
                  onClick={() => signIn()}
                  className="btn-primary px-4 py-2 rounded-md text-sm"
                >
                  Iniciar sesión
                </button>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-[var(--mongodb-forest)] dark:hover:text-white"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/" className={`block pl-3 pr-4 py-2 border-l-4 ${isActive('/') ? 'border-[var(--mongodb-dark-green)] text-[var(--mongodb-dark-green)] bg-gray-50 dark:bg-[var(--mongodb-forest)] dark:text-[var(--mongodb-green)]' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-[var(--mongodb-green)] hover:text-gray-800 dark:text-gray-300 dark:hover:bg-[var(--mongodb-forest)] dark:hover:text-white'} text-base font-medium`}>
              Inicio
            </Link>
            <Link href="/projects" className={`block pl-3 pr-4 py-2 border-l-4 ${isActive('/projects') ? 'border-[var(--mongodb-dark-green)] text-[var(--mongodb-dark-green)] bg-gray-50 dark:bg-[var(--mongodb-forest)] dark:text-[var(--mongodb-green)]' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-[var(--mongodb-green)] hover:text-gray-800 dark:text-gray-300 dark:hover:bg-[var(--mongodb-forest)] dark:hover:text-white'} text-base font-medium`}>
              Proyectos
            </Link>
            {session && (
              <Link href="/projects/new" className={`block pl-3 pr-4 py-2 border-l-4 ${isActive('/projects/new') ? 'border-[var(--mongodb-dark-green)] text-[var(--mongodb-dark-green)] bg-gray-50 dark:bg-[var(--mongodb-forest)] dark:text-[var(--mongodb-green)]' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-[var(--mongodb-green)] hover:text-gray-800 dark:text-gray-300 dark:hover:bg-[var(--mongodb-forest)] dark:hover:text-white'} text-base font-medium`}>
                Añadir Proyecto
              </Link>
            )}
            {session?.user?.role === 'admin' && (
              <Link href="/admin" className={`block pl-3 pr-4 py-2 border-l-4 ${isActive('/admin') ? 'border-[var(--mongodb-dark-green)] text-[var(--mongodb-dark-green)] bg-gray-50 dark:bg-[var(--mongodb-forest)] dark:text-[var(--mongodb-green)]' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-[var(--mongodb-green)] hover:text-gray-800 dark:text-gray-300 dark:hover:bg-[var(--mongodb-forest)] dark:hover:text-white'} text-base font-medium`}>
                Panel Admin
              </Link>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            {session ? (
              <>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    {session.user.image ? (
                      <Image
                        className="h-10 w-10 rounded-full"
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={40}
                        height={40}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-[var(--mongodb-dark-green)] flex items-center justify-center text-white">
                        {session.user.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-white">{session.user.name}</div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{session.user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    href="/profile"
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-[var(--mongodb-forest)]"
                  >
                    Mi Perfil
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-[var(--mongodb-forest)]"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-2 px-4">
                <Link
                  href="/auth/signup"
                  className="btn-secondary w-full py-2 rounded-md text-sm text-center block"
                >
                  Registrarse
                </Link>
                <button
                  onClick={() => signIn()}
                  className="btn-primary w-full py-2 rounded-md text-sm"
                >
                  Iniciar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
