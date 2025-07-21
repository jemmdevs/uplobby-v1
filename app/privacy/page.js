export const metadata = {
  title: "Política de Privacidad - UpLobby",
  description: "Política de privacidad de UpLobby",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
      
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Última actualización: {new Date().toLocaleDateString('es-ES')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introducción</h2>
          <p className="mb-4">
            En UpLobby, respetamos su privacidad y nos comprometemos a proteger sus datos personales. 
            Esta política de privacidad explica cómo recopilamos, usamos y protegemos su información 
            cuando utiliza nuestro servicio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Información que Recopilamos</h2>
          <p className="mb-4">Recopilamos los siguientes tipos de información:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Información de cuenta:</strong> Nombre de usuario, dirección de correo electrónico y contraseña cifrada</li>
            <li><strong>Información de perfil:</strong> Fotografía de perfil, biografía y otros datos opcionales del perfil</li>
            <li><strong>Contenido:</strong> Proyectos, comentarios e imágenes que publique en la plataforma</li>
            <li><strong>Datos de uso:</strong> Información sobre cómo utiliza nuestros servicios</li>
            <li><strong>Datos técnicos:</strong> Dirección IP, tipo de navegador, páginas visitadas</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Cómo Utilizamos su Información</h2>
          <p className="mb-4">Utilizamos su información para:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Proporcionar y mantener nuestros servicios</li>
            <li>Procesar y mostrar su contenido en la plataforma</li>
            <li>Comunicarnos con usted sobre actualizaciones del servicio</li>
            <li>Mejorar nuestros servicios y desarrollar nuevas funcionalidades</li>
            <li>Proteger contra fraudes y actividades maliciosas</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Compartir Información</h2>
          <p className="mb-4">
            No vendemos ni alquilamos su información personal a terceros. Podemos compartir información en las siguientes circunstancias:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Con su consentimiento explícito</li>
            <li>Para cumplir con obligaciones legales</li>
            <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
            <li>En caso de fusión, adquisición o venta de activos</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Seguridad de los Datos</h2>
          <p className="mb-4">
            Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger 
            su información personal contra acceso no autorizado, alteración, divulgación o destrucción. 
            Esto incluye el cifrado de contraseñas y el uso de conexiones seguras.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Sus Derechos</h2>
          <p className="mb-4">Usted tiene derecho a:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Acceder a sus datos personales</li>
            <li>Rectificar información inexacta</li>
            <li>Solicitar la eliminación de sus datos</li>
            <li>Restringir el procesamiento de sus datos</li>
            <li>Portabilidad de sus datos</li>
            <li>Oponerse al procesamiento</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Cookies y Tecnologías Similares</h2>
          <p className="mb-4">
            Utilizamos cookies y tecnologías similares para mejorar su experiencia en la plataforma. 
            Para más información sobre nuestro uso de cookies, consulte nuestra 
            <a href="/cookies" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
              Política de Cookies
            </a>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Retención de Datos</h2>
          <p className="mb-4">
            Conservamos su información personal durante el tiempo necesario para cumplir con los 
            propósitos descritos en esta política, a menos que la ley requiera o permita un 
            período de retención más prolongado.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Menores de Edad</h2>
          <p className="mb-4">
            Nuestros servicios no están dirigidos a menores de 13 años. No recopilamos 
            intencionalmente información personal de menores de 13 años. Si descubrimos que 
            hemos recopilado información de un menor de 13 años, la eliminaremos inmediatamente.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Cambios en esta Política</h2>
          <p className="mb-4">
            Podemos actualizar esta política de privacidad periódicamente. Le notificaremos 
            cualquier cambio significativo publicando la nueva política en esta página y 
            actualizando la fecha de &quot;última actualización&quot;.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Contacto</h2>
          <p className="mb-4">
            Si tiene preguntas sobre esta política de privacidad o sobre el tratamiento de 
            sus datos personales, puede contactarnos a través de los canales de comunicación 
            disponibles en la plataforma.
          </p>
        </section>
      </div>
    </div>
  );
} 