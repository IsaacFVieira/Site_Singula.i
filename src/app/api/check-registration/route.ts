import { NextRequest, NextResponse } from 'next/server';
import { getDownloadByEmailAndProduct, getDownloadByTelefoneAndProduct, getDownloadsByEmailOrTelefone } from '@/lib/downloads/storage';

/**
 * API Route para verificar se existe cadastro para um produto específico
 * GET /api/check-registration?productId={id}&email={email}&telefone={telefone}
 * 
 * Verifica se existe um registo para o produto específico com base no email ou telefone
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const email = searchParams.get('email');
    const telefone = searchParams.get('telefone');

    console.log('[CHECK-REGISTRATION] Verificando cadastro:', { productId, email, telefone });

    if (!productId) {
      return NextResponse.json(
        { error: 'ID do produto é obrigatório' },
        { status: 400 }
      );
    }

    if (!email && !telefone) {
      return NextResponse.json(
        { error: 'Email ou telefone é obrigatório' },
        { status: 400 }
      );
    }

    let existingDownload = null;

    // Verifica por email
    if (email) {
      existingDownload = getDownloadByEmailAndProduct(email, productId);
    }

    // Se não encontrou por email, verifica por telefone
    if (!existingDownload && telefone) {
      existingDownload = getDownloadByTelefoneAndProduct(telefone, productId);
    }

    console.log('[CHECK-REGISTRATION] Cadastro encontrado:', !!existingDownload);

    if (existingDownload) {
      // Calcula tempo restante
      const dataPrevistaEnvio = new Date(existingDownload.dataPrevistaEnvio);
      const agora = new Date();
      const tempoRestanteMs = dataPrevistaEnvio.getTime() - agora.getTime();
      const tempoRestanteDias = Math.ceil(tempoRestanteMs / (1000 * 60 * 60 * 24));

      return NextResponse.json(
        {
          success: true,
          exists: true,
          download: {
            ...existingDownload,
            tempoRestanteDias: Math.max(0, tempoRestanteDias),
            tempoRestanteMs: Math.max(0, tempoRestanteMs),
            status: tempoRestanteMs <= 0 ? 'pronto' : 'pendente'
          },
          message: 'Já existe um registo para este produto com este email ou contacto'
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        exists: false,
        message: 'Não existe registo para este produto com este email ou contacto'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[CHECK-REGISTRATION] Erro ao verificar cadastro:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
