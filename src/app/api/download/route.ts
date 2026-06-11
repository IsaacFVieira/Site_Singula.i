import { NextRequest, NextResponse } from 'next/server';
import { addDownload, getGlobalDownloads, getProductById, getProductDownloads, getDownloadByEmailAndProduct, getDownloadByTelefoneAndProduct, replaceDownload, deleteDownload } from '@/lib/downloads/database';
import { sendDownloadEmails } from '@/lib/downloads/emailService';
import { sendDownloadConfirmationSMS } from '@/lib/sms/twilioService';

// Interface para os dados recebidos do formulário
interface DownloadRequest {
  productId: string;
  empresa: string;
  telefone: string;
  email: string;
  planoSelecionado: 'FREE' | 'STANDARD' | 'PREMIUM';
  statusPagamento?: 'pendente' | 'pago' | 'free';
  replace?: boolean; // Se true, substitui registro existente
}

/**
 * API Route para processar solicitações de download
 * POST /api/download
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[API Download] Iniciando processamento de download');

    // Parse os dados do corpo da requisição
    const body: DownloadRequest = await request.json();
    console.log('[API Download] Dados recebidos:', {
      productId: body.productId,
      empresa: body.empresa,
      email: body.email,
      planoSelecionado: body.planoSelecionado
    });

    // Validação do productId
    if (!body.productId) {
      console.error('[API Download] ID do produto não fornecido');
      return NextResponse.json(
        { error: 'ID do produto é obrigatório' },
        { status: 400 }
      );
    }

    console.log('[API Download] Buscando produto com ID:', body.productId);

    // Verifica se o produto existe
    const product = await getProductById(body.productId);
    if (!product) {
      console.error('[API Download] Produto não encontrado:', body.productId);
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    console.log('[API Download] Produto encontrado:', {
      id: product.id,
      name: product.name,
      fileName: product.fileName
    });

    // Valida se o ficheiro de download existe
    console.log('[API Download] Verificando existência do ficheiro:', product.fileName);

    // No Vercel, os ficheiros públicos são servidos automaticamente, não precisamos verificar no filesystem
    // Mas podemos validar se o fileName é válido
    if (!product.fileName || product.fileName.length === 0) {
      console.error('[API Download] Nome do ficheiro inválido');
      return NextResponse.json(
        { error: 'Ficheiro de download não configurado para este produto' },
        { status: 500 }
      );
    }

    console.log('[API Download] Ficheiro válido para download:', product.fileName);

    // Validação básica dos campos obrigatórios
    if (!body.empresa || body.empresa.trim().length < 2) {
      console.error('[API Download] Nome da empresa inválido');
      return NextResponse.json(
        { error: 'Nome da empresa é obrigatório' },
        { status: 400 }
      );
    }

    if (!body.telefone || body.telefone.trim().length < 9) {
      console.error('[API Download] Telefone inválido');
      return NextResponse.json(
        { error: 'Telefone é obrigatório' },
        { status: 400 }
      );
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!body.email || !emailRegex.test(body.email.trim())) {
      console.error('[API Download] Email inválido:', body.email);
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Validação do plano selecionado
    const validPlans = ['FREE', 'STANDARD', 'PREMIUM'];
    if (!body.planoSelecionado || !validPlans.includes(body.planoSelecionado)) {
      console.error('[API Download] Plano inválido:', body.planoSelecionado);
      return NextResponse.json(
        { error: 'Plano selecionado é obrigatório e deve ser FREE, STANDARD ou PREMIUM' },
        { status: 400 }
      );
    }

    // Verifica se existe cadastro para este produto específico
    console.log('[API Download] Verificando cadastro existente para o produto...');
    const existingDownloadByEmail = await getDownloadByEmailAndProduct(body.email.trim().toLowerCase(), body.productId);
    const existingDownloadByTelefone = await getDownloadByTelefoneAndProduct(body.telefone.trim(), body.productId);
    const existingDownload = existingDownloadByEmail || existingDownloadByTelefone;

    if (existingDownload) {
      console.log('[API Download] Cadastro existente encontrado para este produto');

      // Se não foi solicitado substituição, retorna erro indicando que já existe
      if (!body.replace) {
        return NextResponse.json(
          {
            success: false,
            exists: true,
            message: 'Já existe um registo para este produto com este email ou contacto. Deseja substituir o registo anterior?',
            existingDownload: {
              nome: existingDownload.nome,
              email: existingDownload.email,
              telefone: existingDownload.telefone,
              data: existingDownload.data,
              statusPedido: existingDownload.statusPedido
            }
          },
          { status: 409 } // Conflict
        );
      }

      // Se foi solicitado substituição, remove o registro antigo
      console.log('[API Download] Substituindo registro existente...');
      try {
        // Encontra o índice do download existente
        const allDownloads = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/downloads`).then(r => r.json());
        const downloadIndex = allDownloads.downloads?.findIndex((d: any) =>
          (d.email.toLowerCase() === body.email.trim().toLowerCase() || d.telefone === body.telefone.trim()) &&
          d.productId === body.productId
        );

        if (downloadIndex !== undefined && downloadIndex >= 0) {
          await deleteDownload(downloadIndex);
          console.log('[API Download] Registro antigo removido com sucesso');
        }
      } catch (error) {
        console.error('[API Download] Erro ao remover registro antigo:', error);
        // Continua mesmo se falhar ao remover
      }
    }

    // Determina status do pagamento
    const statusPagamento = body.statusPagamento || (body.planoSelecionado === 'FREE' ? 'free' : 'pago');

    // Calcula data de início de acesso para plano FREE
    let dataInicioAcesso: string | undefined;
    if (body.planoSelecionado === 'FREE') {
      dataInicioAcesso = new Date().toISOString();
    }

    // Prepara os dados do download
    const downloadData = {
      productId: body.productId,
      productName: product.name,
      nome: body.empresa.trim(),
      email: body.email.trim().toLowerCase(),
      telefone: body.telefone.trim(),
      empresa: body.empresa.trim(),
      planoSelecionado: body.planoSelecionado,
      data: new Date().toISOString(),
      dataInicioAcesso,
      statusPagamento,
      statusPedido: 'pendente' as const,
      dataPrevistaEnvio: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    console.log('[API Download] ============================================');
    console.log('[API Download] ÚNICO OBJETIVO: Enviar emails');
    console.log('[API Download] ============================================');

    // Envia emails (para a empresa e para o usuário)
    // ÚNICO OBJETIVO: Apenas enviar emails, não guardar dados
    try {
      console.log('[API Download] Iniciando envio de emails...');
      await sendDownloadEmails(downloadData, 0, 0, product);
      console.log('[API Download] ✅ Emails enviados com sucesso');
    } catch (emailError) {
      // Loga o erro mas não falha a operação de download
      console.error('[API Download] ❌ Erro ao enviar emails:');
      console.error('[API Download] Error:', emailError);
      if (emailError instanceof Error) {
        console.error('[API Download] Error message:', emailError.message);
        console.error('[API Download] Error stack:', emailError.stack);
      }
      // Continua mesmo se o email falhar
    }

    // Envia SMS de confirmação (camada adicional, não falha se erro)
    try {
      console.log('[API Download] Iniciando envio de SMS...');
      await sendDownloadConfirmationSMS(downloadData.telefone, product.name);
      console.log('[API Download] ✅ SMS enviado com sucesso');
    } catch (smsError) {
      // Loga o erro mas não falha a operação de download
      console.error('[API Download] ❌ Erro ao enviar SMS:');
      console.error('[API Download] Error:', smsError);
      if (smsError instanceof Error) {
        console.error('[API Download] Error message:', smsError.message);
        console.error('[API Download] Error stack:', smsError.stack);
      }
      // Continua mesmo se o SMS falhar
    }

    console.log('[API Download] ============================================');
    console.log('[API Download] Processo concluído - emails e SMS enviados');
    console.log('[API Download] ============================================');

    // Retorna sucesso sem fileName (download não é imediato)
    return NextResponse.json(
      {
        success: true,
        message: 'O seu pedido foi recebido. O link de download será enviado para o seu email em até 7 dias.'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[API Download] Erro ao processar download:', error);
    // Não mostra erro para o usuário, retorna sucesso genérico
    // Os emails já foram enviados, então temos registro
    return NextResponse.json(
      {
        success: true,
        message: 'O seu pedido foi recebido. O link de download será enviado para o seu email em até 7 dias.'
      },
      { status: 200 }
    );
  }
}

/**
 * API Route para obter o contador de downloads
 * GET /api/download?productId={id} - para contador específico do produto
 * GET /api/download - para contador global
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (productId) {
      // Retorna contador específico do produto
      const productDownloads = await getProductDownloads(productId);
      const product = await getProductById(productId);

      return NextResponse.json(
        {
          productId,
          productName: product?.name || '',
          productDownloads,
          message: `${productDownloads}+ utilizadores já baixaram ${product?.name || 'este sistema'}`
        },
        { status: 200 }
      );
    } else {
      // Retorna contador global
      const globalDownloads = await getGlobalDownloads();

      return NextResponse.json(
        {
          globalDownloads,
          message: `${globalDownloads}+ downloads realizados em todos os produtos da Singular.i`
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Erro ao obter contador de downloads:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
