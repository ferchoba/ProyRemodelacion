import { db } from '@/lib/db';

const debug = Boolean(process.env.DEBUG_DB);

export async function getAllProyectos() {
  try {
    const proyectos = await db.proyecto.findMany({
      where: { activo: true },
      orderBy: { fecha_finalizacion: 'desc' },
      select: {
        id: true,
        slug: true,
        titulo: true,
        descripcion_md: true,
        imagen_portada_url: true,
        galeria_urls: true,
        servicio_id: true,
        fecha_finalizacion: true,
        activo: true,
        created_at: true,
        updated_at: true,
        servicio: {
          select: {
            titulo: true,
            slug: true,
          },
        },
      },
    });

    const mapped = proyectos.map((proyecto) => ({
      ...proyecto,
      galeria_urls: JSON.parse(proyecto.galeria_urls || '[]') as string[],
    }));

    if (debug) console.log('[getAllProyectos] count:', mapped.length);

    return mapped;
  } catch (error: any) {
    console.error('[getAllProyectos] Error:', error?.message || error);
    return [];
  }
}

export async function getProyectosByServicio(tipoServicioSlug?: string) {
  try {
    const proyectos = await db.proyecto.findMany({
      where: {
        activo: true,
        ...(tipoServicioSlug && { servicio: { slug: tipoServicioSlug } }),
      },
      orderBy: { fecha_finalizacion: 'desc' },
      select: {
        id: true,
        slug: true,
        titulo: true,
        descripcion_md: true,
        imagen_portada_url: true,
        galeria_urls: true,
        servicio_id: true,
        fecha_finalizacion: true,
        activo: true,
        created_at: true,
        updated_at: true,
        servicio: {
          select: {
            titulo: true,
            slug: true,
          },
        },
      },
    });

    const mapped = proyectos.map((proyecto) => ({
      ...proyecto,
      galeria_urls: JSON.parse(proyecto.galeria_urls || '[]') as string[],
    }));

    return mapped;
  } catch (error: any) {
    console.error('[getProyectosByServicio] Error:', error?.message || error);
    return [];
  }
}

export async function getProyectoBySlug(slug: string) {
  try {
    const proyecto = await db.proyecto.findFirst({
      where: { slug, activo: true },
      select: {
        id: true,
        slug: true,
        titulo: true,
        descripcion_md: true,
        imagen_portada_url: true,
        galeria_urls: true,
        servicio_id: true,
        fecha_finalizacion: true,
        activo: true,
        created_at: true,
        updated_at: true,
        servicio: {
          select: { titulo: true, slug: true },
        },
      },
    });

    if (!proyecto) {
      if (debug) console.log('[getProyectoBySlug] Not found for', slug);
      return null;
    }

    return {
      ...proyecto,
      galeria_urls: JSON.parse(proyecto.galeria_urls || '[]') as string[],
    };
  } catch (error: any) {
    console.error(`[getProyectoBySlug] Error for slug ${slug}:`, error?.message || error);
    return null;
  }
}

export async function getTiposServicioConProyectos() {
  try {
    const servicios = await db.servicio.findMany({
      where: {
        activo: true,
        proyectos: {
          some: { activo: true },
        },
      },
      select: {
        slug: true,
        titulo: true,
        _count: {
          select: {
            proyectos: { where: { activo: true } },
          },
        },
      },
      orderBy: { orden: 'asc' },
    });

    return servicios;
  } catch (error: any) {
    console.error('[getTiposServicioConProyectos] Error:', error?.message || error);
    return [];
  }
}

export async function getProyectosForSitemap() {
  try {
    const proyectos = await db.proyecto.findMany({
      where: { activo: true },
      select: { slug: true, updated_at: true },
    });

    return proyectos;
  } catch (error: any) {
    console.error('[getProyectosForSitemap] Error:', error?.message || error);
    return [];
  }
}
