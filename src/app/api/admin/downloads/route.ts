import { NextRequest, NextResponse } from 'next/server';
import { readDownloadsData, getAllProducts, getProductsByRanking, deleteDownload, deleteAllDownloads } from '@/lib/downloads/database';

/**
 * API Route para obter dados de downloads para o painel administrativo
 * GET /api/admin/downloads
 * 
 * Esta rota deve ser protegida por autenticação em produção
 * Por enquanto, está aberta para fins de demonstração
 */
export async function GET(request: NextRequest) {
  try {
    // Verifica autenticação básica via header (opcional para demonstração)
    const authHeader = request.headers.get('authorization');

    // Em produção, implemente autenticação adequada (JWT, session, etc.)
    // Por enquanto, permite acesso para demonstração
    // if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
    //   return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    // }

    // Lê todos os dados de downloads
    const data = await readDownloadsData();

    // Formata os dados para resposta
    const formattedDownloads = data.downloads.map(download => ({
      ...download,
      dataFormatada: new Date(download.data).toLocaleString('pt-AO', {
        timeZone: 'Africa/Luanda',
        dateStyle: 'full',
        timeStyle: 'short'
      })
    }));

    // Obtém produtos ordenados por ranking
    const rankedProducts = await getProductsByRanking();

    return NextResponse.json(
      {
        globalDownloads: data.globalDownloads,
        products: data.products,
        rankedProducts,
        downloads: formattedDownloads.reverse() // Mais recentes primeiro
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao obter dados de downloads:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

/**
 * API Route para apagar um registo de download específico
 * DELETE /api/admin/downloads?index={index}
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const index = searchParams.get('index');
    const deleteAll = searchParams.get('deleteAll');

    if (deleteAll === 'true') {
      // Apaga todos os registos
      const updatedData = deleteAllDownloads();
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Todos os registos foram apagados com sucesso',
          data: updatedData
        },
        { status: 200 }
      );
    }

    if (index === null) {
      return NextResponse.json(
        { error: 'Índice não fornecido' },
        { status: 400 }
      );
    }

    const downloadIndex = parseInt(index, 10);
    
    if (isNaN(downloadIndex)) {
      return NextResponse.json(
        { error: 'Índice inválido' },
        { status: 400 }
      );
    }

    // Apaga o registo específico
    const updatedData = deleteDownload(downloadIndex);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Registo apagado com sucesso',
        data: updatedData
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao apagar download:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
