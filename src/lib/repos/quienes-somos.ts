import { db } from '@/lib/db';

export async function getQuienesSomosContent() {
  try {
    const content = await db.quienesSomos.findFirst({
      where: {
        activo: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return content;
  } catch (error) {
    console.error('Error fetching Quienes Somos content:', error);
    return null;
  }
}
