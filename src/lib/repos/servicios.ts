import { db } from '@/lib/db';

const debug = Boolean(process.env.DEBUG_DB);

export async function getAllServicios(idioma?: string) {
  try {
    const where = {
      activo: true,
      ...(idioma && { idioma: idioma.toUpperCase() }),
    } as const;

    const servicios = await db.servicio.findMany({
      where,
      orderBy: {
        orden: 'asc',
      },
      select: {
        id: true,
        slug: true,
        titulo: true,
        descripcion_corta: true,
        imagen_principal_url: true,
        etiquetas: true,
        idioma: true,
        orden: true,
        created_at: true,
      },
    });

    const parsed = servicios.map((servicio) => ({
      ...servicio,
      etiquetas: JSON.parse(servicio.etiquetas || '[]') as string[],
    }));

    if (debug) {
      console.log('[getAllServicios] idioma:', idioma, 'count:', parsed.length);
    }

    return parsed;
  } catch (error: any) {
    console.error('[getAllServicios] Error:', error?.message || error);
    return [];
  }
}

export async function getServicioBySlug(slug: string, idioma?: string) {
  try {
    const where = {
      slug,
      activo: true,
      ...(idioma && { idioma: idioma.toUpperCase() }),
    } as const;

    const servicio = await db.servicio.findFirst({ where });

    if (!servicio) {
      if (debug) console.log('[getServicioBySlug] Not found for', { slug, idioma });
      return null;
    }

    return {
      ...servicio,
      etiquetas: JSON.parse(servicio.etiquetas || '[]') as string[],
    };
  } catch (error: any) {
    console.error(`[getServicioBySlug] Error for slug ${slug}:`, error?.message || error);
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
  } catch (error: any) {
    console.error('[getServiciosForSitemap] Error:', error?.message || error);
    return [];
  }
}
