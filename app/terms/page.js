export const metadata = {
  title: "Términos de Servicio - UpLobby",
  description: "Términos de servicio de UpLobby",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Términos de Servicio</h1>
      
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Última actualización: {new Date().toLocaleDateString('es-ES')}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Aceptación de los Términos</h2>
          <p className="mb-4">
            Al acceder y utilizar UpLobby, usted acepta estar sujeto a estos términos de servicio 
            y a todas las leyes y regulaciones aplicables, y acepta que es responsable del 
            cumplimiento de cualquier ley local aplicable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Descripción del Servicio</h2>
          <p className="mb-4">
            UpLobby es una plataforma que permite a los usuarios mostrar y compartir sus proyectos. 
            El servicio incluye la capacidad de subir, visualizar y comentar proyectos.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Cuenta de Usuario</h2>
          <p className="mb-4">
            Para utilizar ciertas funciones de UpLobby, debe crear una cuenta. Usted es responsable 
            de mantener la confidencialidad de su cuenta y contraseña, y acepta la responsabilidad 
            de todas las actividades que ocurran bajo su cuenta.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Contenido del Usuario</h2>
          <p className="mb-4">
            Usted conserva todos los derechos sobre el contenido que publique en UpLobby. 
            Sin embargo, al publicar contenido, otorga a UpLobby una licencia mundial, 
            no exclusiva, libre de regalías para usar, mostrar y distribuir dicho contenido 
            en el contexto del servicio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Conducta Prohibida</h2>
          <p className="mb-4">
            Está prohibido usar UpLobby para:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Publicar contenido ilegal, amenazante, abusivo o difamatorio</li>
            <li>Violar los derechos de propiedad intelectual de terceros</li>
            <li>Enviar spam o contenido no solicitado</li>
            <li>Intentar acceder no autorizado a cuentas de otros usuarios</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Limitación de Responsabilidad</h2>
          <p className="mb-4">
            UpLobby se proporciona "tal como está" sin garantías de ningún tipo. 
            En ningún caso UpLobby será responsable de daños directos, indirectos, 
            incidentales, especiales o consecuentes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Modificaciones</h2>
          <p className="mb-4">
            UpLobby se reserva el derecho de modificar estos términos en cualquier momento. 
            Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Contacto</h2>
          <p className="mb-4">
            Si tiene preguntas sobre estos términos de servicio, puede contactarnos a través 
            de los canales de comunicación disponibles en la plataforma.
          </p>
        </section>
      </div>
    </div>
  );
} 