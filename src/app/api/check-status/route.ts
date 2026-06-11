import { NextRequest, NextResponse } from 'next/server';
import { getDownloadsByEmail, getDownloadsByTelefone, getDownloadsByEmailOrTelefone } from '@/lib/downloads/storage';

/**
 * API Route para verificar status de downloads por email
 * GET /api/check-status?email={email}
 * 
 * Retorna todos os downloads associados ao email fornecido
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const telefone = searchParams.get('telefone');

    console.log('[CHECK-STATUS] Verificando status:', { email, telefone });

    if (!email && !telefone) {
      return NextResponse.json(
        { error: 'Email ou telefone é obrigatório' },
        { status: 400 }
      );
    }

    let downloads: any[] = [];

    if (email && telefone) {
      // Verifica por email ou telefone
      downloads = getDownloadsByEmailOrTelefone(email, telefone);
    } else if (email) {
      // Verifica apenas por email
      downloads = getDownloadsByEmail(email);
    } else if (telefone) {
      // Verifica apenas por telefone
      downloads = getDownloadsByTelefone(telefone);
    }

    // Calcula tempo restante para cada download
    const downloadsWithTimeRemaining = downloads.map(download => {
      const dataPrevistaEnvio = new Date(download.dataPrevistaEnvio);
      const agora = new Date();
      const tempoRestanteMs = dataPrevistaEnvio.getTime() - agora.getTime();
      const tempoRestanteDias = Math.ceil(tempoRestanteMs / (1000 * 60 * 60 * 24));

      return {
        ...download,
        tempoRestanteDias: Math.max(0, tempoRestanteDias),
        tempoRestanteMs: Math.max(0, tempoRestanteMs),
        status: tempoRestanteMs <= 0 ? 'pronto' : 'pendente'
      };
    });

    console.log('[CHECK-STATUS] Downloads encontrados:', downloadsWithTimeRemaining.length);

    return NextResponse.json(
      {
        success: true,
        downloads: downloadsWithTimeRemaining,
        total: downloadsWithTimeRemaining.length,
        message: downloadsWithTimeRemaining.length > 0
          ? `Encontrado(s) ${downloadsWithTimeRemaining.length} pedido(s) de download`
          : 'Nenhum pedido de download encontrado para este email/telefone'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[CHECK-STATUS] Erro ao verificar status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
