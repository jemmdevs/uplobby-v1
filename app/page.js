import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-[var(--mongodb-gray)] dark:from-[var(--mongodb-navy)] dark:to-[var(--mongodb-forest)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Muestra tus Proyectos con <span className="text-[var(--mongodb-dark-green)]">UpLobby</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Una plataforma para que los desarrolladores compartan y descubran proyectos increíbles. Sube tu trabajo, recibe feedback y conéctate con otros creadores.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/projects" className="btn-primary px-6 py-3 rounded-md text-base font-medium inline-flex items-center justify-center">
                  Explorar Proyectos
                </Link>
                <Link href="/projects/new" className="btn-secondary px-6 py-3 rounded-md text-base font-medium inline-flex items-center justify-center">
                  Añadir Proyecto
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative h-64 md:h-96 w-full">
                <Image
                  src="/hero-image.svg"
                  alt="Project Showcase"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-[var(--mongodb-navy)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">¿Por qué usar UpLobby?</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              La plataforma perfecta para mostrar tu trabajo y conectar con otros desarrolladores
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[var(--mongodb-gray)] dark:bg-[var(--mongodb-forest)] p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-[var(--mongodb-dark-green)] rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Muestra tu Trabajo</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sube tus proyectos con imágenes, descripciones y enlaces para que el mundo vea lo que has creado.
              </p>
            </div>

            <div className="bg-[var(--mongodb-gray)] dark:bg-[var(--mongodb-forest)] p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-[var(--mongodb-dark-green)] rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Conéctate con Otros</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Descubre proyectos de otros desarrolladores y construye tu red en la comunidad tecnológica.
              </p>
            </div>

            <div className="bg-[var(--mongodb-gray)] dark:bg-[var(--mongodb-forest)] p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-[var(--mongodb-dark-green)] rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Autenticación Segura</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Inicia sesión de forma segura para gestionar tus proyectos y perfil con facilidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[var(--mongodb-dark-green)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">¿Listo para mostrar tus proyectos?</h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad de desarrolladores y comienza a compartir tu trabajo hoy mismo.
          </p>
          <Link href="/projects/new" className="bg-white text-[var(--mongodb-dark-green)] hover:bg-gray-100 px-8 py-3 rounded-md text-base font-medium inline-flex items-center justify-center transition-colors">
            Comenzar Ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
