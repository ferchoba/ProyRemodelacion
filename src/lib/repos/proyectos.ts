import { db } from '@/lib/db';

export async function getAllProyectos() {
  try {
    const proyectos = await db.proyecto.findMany({
      where: {
        activo: true,
      },
      include: {
        servicio: {
          select: {
            titulo: true,
            slug: true,
          },
        },
      },
      orderBy: {
        fecha_finalizacion: 'desc',
      },
    });

    return proyectos.map(proyecto => ({
      ...proyecto,
      galeria_urls: JSON.parse(proyecto.galeria_urls || '[]') as string[],
    }));
  } catch (error) {
    console.error('Error fetching proyectos:', error);
    return [];
  }
}

export async function getProyectosByServicio(tipoServicioSlug?: string) {
  try {
    const whereClause = {
      activo: true,
      ...(tipoServicioSlug && { tipo_servicio_slug: tipoServicioSlug }),
    };

    const proyectos = await db.proyecto.findMany({
      where: whereClause,
      include: {
        servicio: {
          select: {
            titulo: true,
            slug: true,
          },
        },
      },
      orderBy: {
        fecha_finalizacion: 'desc',
      },
    });

    return proyectos.map(proyecto => ({
      ...proyecto,
      galeria_urls: JSON.parse(proyecto.galeria_urls || '[]') as string[],
    }));
  } catch (error) {
    console.error('Error fetching proyectos by servicio:', error);
    return [];
  }
}

export async function getProyectoBySlug(slug: string) {
  try {
    const proyecto = await db.proyecto.findUnique({
      where: {
        slug,
        activo: true,
      },
      include: {
        servicio: {
          select: {
            titulo: true,
            slug: true,
          },
        },
      },
    });

    if (!proyecto) {
      return null;
    }

    return {
      ...proyecto,
      galeria_urls: JSON.parse(proyecto.galeria_urls || '[]') as string[],
    };
  } catch (error) {
    console.error(`Error fetching proyecto with slug ${slug}:`, error);
    return null;
  }
}

export async function getTiposServicioConProyectos() {
  try {
    const servicios = await db.servicio.findMany({
      where: {
        activo: true,
        proyectos: {
          some: {
            activo: true,
          },
        },
      },
      select: {
        slug: true,
        titulo: true,
        _count: {
          select: {
            proyectos: {
              where: {
                activo: true,
              },
            },
          },
        },
      },
      orderBy: {
        titulo: 'asc',
      },
    });

    return servicios;
  } catch (error) {
    console.error('Error fetching tipos de servicio con proyectos:', error);
    return [];
  }
}

export async function getProyectosForSitemap() {
  try {
    const proyectos = await db.proyecto.findMany({
      where: {
        activo: true,
      },
      select: {
        slug: true,
        updated_at: true,
      },
    });

    return proyectos;
  } catch (error) {
    console.error('Error fetching proyectos for sitemap:', error);
    return [];
  }
}
