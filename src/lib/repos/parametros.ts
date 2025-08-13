import { db } from '@/lib/db';

export async function getParametro(clave: string): Promise<string | null> {
  try {
    const parametro = await db.parametro.findUnique({
      where: { clave },
    });

    return parametro?.valor || null;
  } catch (error) {
    console.error(`Error fetching parameter ${clave}:`, error);
    return null;
  }
}

export async function getWhatsAppNumber(): Promise<string> {
  const numero = await getParametro('whatsapp_numero');
  return numero || '+573012571215'; // Fallback number
}

export async function getEmailDestino(): Promise<string> {
  const email = await getParametro('correo_destino_formularios');
  return email || 'fercho.ba@gmail.com'; // Fallback email
}

export async function setParametro(clave: string, valor: string, descripcion?: string): Promise<void> {
  try {
    await db.parametro.upsert({
      where: { clave },
      update: { valor, descripcion },
      create: { clave, valor, descripcion },
    });
  } catch (error) {
    console.error(`Error setting parameter ${clave}:`, error);
    throw error;
  }
}
