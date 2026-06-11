import { NextRequest, NextResponse } from 'next/server';
import { sendDownloadConfirmationSMS } from '@/lib/sms/twilioService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phoneNumber, productName } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'phoneNumber é obrigatório' },
        { status: 400 }
      );
    }

    const product = productName || 'Produto Teste';

    console.log('[TEST SMS] ============================================');
    console.log('[TEST SMS] Iniciando teste de envio de SMS...');
    console.log('[TEST SMS] Telefone:', phoneNumber);
    console.log('[TEST SMS] Produto:', product);
    console.log('[TEST SMS] ============================================');

    const result = await sendDownloadConfirmationSMS(phoneNumber, product);

    console.log('[TEST SMS] ============================================');
    console.log('[TEST SMS] Resultado do envio:', result);
    console.log('[TEST SMS] ============================================');

    return NextResponse.json(
      {
        success: result,
        message: result ? 'SMS enviado com sucesso' : 'Falha ao enviar SMS',
        phoneNumber,
        product
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[TEST SMS] Erro ao testar SMS:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
