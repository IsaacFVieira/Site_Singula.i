import { NextRequest, NextResponse } from 'next/server';
import { getAllDownloads } from '@/lib/downloads/storage';

/**
 * API Route para verificar status de pedido por email
 * GET /api/download/status?email={email}
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Busca todos os downloads
    const allDownloads = getAllDownloads();

    // Filtra downloads pelo email
    const userDownloads = allDownloads.filter(d => d.email === normalizedEmail);

    if (userDownloads.length === 0) {
      return NextResponse.json(
        {
          found: false,
          message: 'Nenhum pedido encontrado para este email'
        },
        { status: 200 }
      );
    }

    // Calcula tempo restante até envio para cada pedido
    const downloadsWithStatus = userDownloads.map(download => {
      const dataPrevista = new Date(download.dataPrevistaEnvio);
      const agora = new Date();
      const tempoRestanteMs = dataPrevista.getTime() - agora.getTime();
      const diasRestantes = Math.max(0, Math.ceil(tempoRestanteMs / (24 * 60 * 60 * 1000)));

      return {
        productId: download.productId,
        productName: download.productName,
        dataPedido: new Date(download.data).toLocaleDateString('pt-PT'),
        horaPedido: new Date(download.data).toLocaleTimeString('pt-PT'),
        statusPedido: download.statusPedido,
        dataPrevistaEnvio: new Date(download.dataPrevistaEnvio).toLocaleDateString('pt-PT'),
        diasRestantes: download.statusPedido === 'pendente' ? diasRestantes : 0,
        dataEnvio: download.dataEnvio ? new Date(download.dataEnvio).toLocaleDateString('pt-PT') : null
      };
    });

    return NextResponse.json(
      {
        found: true,
        email: normalizedEmail,
        totalPedidos: userDownloads.length,
        pedidos: downloadsWithStatus
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[API Status] Erro ao verificar status:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
