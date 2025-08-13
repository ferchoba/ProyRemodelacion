import { db } from '@/lib/db';

export async function getAllServicios() {
  try {
    const servicios = await db.servicio.findMany({
      where: {
        activo: true,
      },
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        slug: true,
        titulo: true,
        descripcion_corta: true,
        imagen_principal_url: true,
        etiquetas: true,
        created_at: true,
      },
    });

    return servicios.map(servicio => ({
      ...servicio,
      etiquetas: JSON.parse(servicio.etiquetas || '[]') as string[],
    }));
  } catch (error) {
    console.error('Error fetching servicios:', error);
    return [];
  }
}

export async function getServicioBySlug(slug: string) {
  try {
    const servicio = await db.servicio.findUnique({
      where: {
        slug,
        activo: true,
      },
    });

    if (!servicio) {
      return null;
    }

    return {
      ...servicio,
      etiquetas: JSON.parse(servicio.etiquetas || '[]') as string[],
    };
  } catch (error) {
    console.error(`Error fetching servicio with slug ${slug}:`, error);
    return null;
  }
}

export async function getServiciosForSitemap() {
  try {
    const servicios = await db.servicio.findMany({
      where: {
        activo: true,
      },
      select: {
        slug: true,
        updated_at: true,
      },
    });

    return servicios;
  } catch (error) {
    console.error('Error fetching servicios for sitemap:', error);
    return [];
  }
}
