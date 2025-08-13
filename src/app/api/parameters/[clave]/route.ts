import { NextRequest, NextResponse } from 'next/server';
import { getParametro } from '@/lib/repos/parametros';

export async function GET(
  request: NextRequest,
  { params }: { params: { clave: string } }
) {
  try {
    const { clave } = params;
    
    // Only allow specific parameters to be accessed publicly
    const allowedParameters = ['whatsapp_numero'];
    
    if (!allowedParameters.includes(clave)) {
      return NextResponse.json(
        { error: 'Parameter not accessible' },
        { status: 403 }
      );
    }

    const valor = await getParametro(clave);
    
    if (!valor) {
      return NextResponse.json(
        { error: 'Parameter not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      clave,
      valor 
    });
  } catch (error) {
    console.error('Error fetching parameter:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
