import { Link } from '@/i18n/routing';

export default function ProjectNotFound() {
  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-red-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-platinum mb-4">
              Proyecto no encontrado
            </h1>
            <p className="text-xl text-quick-silver mb-8">
              Lo sentimos, el proyecto que buscas no existe o ha sido movido.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/proyectos"
              className="btn btn-primary"
            >
              Ver todos los proyectos
            </Link>
            <Link
              href="/"
              className="btn btn-secondary"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
