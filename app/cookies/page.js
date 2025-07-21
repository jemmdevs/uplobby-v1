export const metadata = {
  title: "Política de Cookies - UpLobby",
  description: "Política de cookies de UpLobby",
};

export default function CookiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Política de Cookies</h1>
      
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Última actualización: {new Date().toLocaleDateString('es-ES')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. ¿Qué son las Cookies?</h2>
          <p className="mb-4">
            Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando 
            visita un sitio web. Nos ayudan a recordar sus preferencias y a mejorar su experiencia 
            en UpLobby.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Tipos de Cookies que Utilizamos</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">2.1 Cookies Esenciales</h3>
            <p className="mb-4">
              Estas cookies son necesarias para el funcionamiento básico del sitio web:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Cookies de autenticación:</strong> Para mantener su sesión iniciada</li>
              <li><strong>Cookies de seguridad:</strong> Para proteger contra ataques CSRF</li>
              <li><strong>Cookies de navegación:</strong> Para recordar sus preferencias de navegación</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">2.2 Cookies de Funcionalidad</h3>
            <p className="mb-4">
              Estas cookies mejoran la funcionalidad del sitio web:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Preferencias de tema:</strong> Para recordar si prefiere el modo oscuro o claro</li>
              <li><strong>Configuración de idioma:</strong> Para recordar su idioma preferido</li>
              <li><strong>Configuración de visualización:</strong> Para recordar cómo prefiere ver el contenido</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">2.3 Cookies de Rendimiento</h3>
            <p className="mb-4">
              Estas cookies nos ayudan a entender cómo los usuarios interactúan con nuestro sitio:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Cookies analíticas:</strong> Para entender qué páginas son más populares</li>
              <li><strong>Cookies de rendimiento:</strong> Para medir la velocidad de carga de las páginas</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Cookies de Terceros</h2>
          <p className="mb-4">
            Podemos utilizar servicios de terceros que establecen sus propias cookies:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Servicios de autenticación:</strong> Para permitir el inicio de sesión con cuentas externas</li>
            <li><strong>Servicios de análisis:</strong> Para obtener estadísticas sobre el uso del sitio</li>
            <li><strong>CDN y servicios de optimización:</strong> Para mejorar el rendimiento del sitio</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Gestión de Cookies</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">4.1 Control a través del Navegador</h3>
            <p className="mb-4">
              La mayoría de los navegadores le permiten controlar las cookies a través de su configuración. 
              Puede:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Ver qué cookies están almacenadas en su dispositivo</li>
              <li>Eliminar cookies existentes</li>
              <li>Bloquear cookies de sitios específicos</li>
              <li>Configurar su navegador para que le notifique antes de establecer cookies</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">4.2 Instrucciones por Navegador</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios</li>
              <li><strong>Firefox:</strong> Opciones &gt; Privacidad y seguridad &gt; Cookies y datos del sitio</li>
              <li><strong>Safari:</strong> Preferencias &gt; Privacidad &gt; Cookies y datos de sitios web</li>
              <li><strong>Edge:</strong> Configuración &gt; Cookies y permisos de sitio</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Consecuencias de Deshabilitar Cookies</h2>
          <p className="mb-4">
            Si deshabilita las cookies, algunas funcionalidades del sitio pueden no funcionar correctamente:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>No podrá mantener su sesión iniciada</li>
            <li>Sus preferencias de tema y configuración no se recordarán</li>
            <li>Algunas funcionalidades interactivas pueden no estar disponibles</li>
            <li>La experiencia de usuario puede verse afectada</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Duración de las Cookies</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">6.1 Cookies de Sesión</h3>
            <p className="mb-4">
              Estas cookies se eliminan automáticamente cuando cierra su navegador.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">6.2 Cookies Persistentes</h3>
            <p className="mb-4">
              Estas cookies permanecen en su dispositivo durante un período específico o hasta que las elimine manualmente. 
              Los períodos típicos incluyen:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Cookies de autenticación:</strong> 30 días</li>
              <li><strong>Cookies de preferencias:</strong> 1 año</li>
              <li><strong>Cookies analíticas:</strong> 2 años</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Actualizaciones de esta Política</h2>
          <p className="mb-4">
            Podemos actualizar esta política de cookies periódicamente para reflejar cambios en 
            nuestras prácticas o por motivos operativos, legales o reglamentarios. Le recomendamos 
            que revise esta página regularmente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Contacto</h2>
          <p className="mb-4">
            Si tiene preguntas sobre nuestra política de cookies o sobre el uso de cookies en 
            UpLobby, puede contactarnos a través de los canales de comunicación disponibles en 
            la plataforma.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Enlaces Útiles</h2>
          <p className="mb-4">
            Para más información sobre cookies y cómo gestionarlas:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>
              <a href="/privacy" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Política de Privacidad
              </a>
            </li>
            <li>
              <a href="/terms" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                Términos de Servicio
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
} 