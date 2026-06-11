import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

/**
 * API Route para teste isolado de envio de email
 * GET /api/test-email
 * 
 * Esta rota envia um email de teste para o ADMIN_EMAIL
 * para validar se o SMTP está configurado corretamente.
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[TEST-EMAIL] ============================================');
    console.log('[TEST-EMAIL] Iniciando teste de envio de email...');
    console.log('[TEST-EMAIL] ============================================');

    // Verificar variáveis de ambiente
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const fromEmail = process.env.SMTP_FROM_EMAIL;
    const fromName = process.env.SMTP_FROM_NAME;
    const adminEmail = process.env.ADMIN_EMAIL;

    console.log('[TEST-EMAIL] SMTP_HOST:', smtpHost);
    console.log('[TEST-EMAIL] SMTP_PORT:', smtpPort);
    console.log('[TEST-EMAIL] SMTP_USER:', smtpUser);
    console.log('[TEST-EMAIL] SMTP_PASS length:', smtpPass?.length || 0);
    console.log('[TEST-EMAIL] SMTP_FROM_EMAIL:', fromEmail);
    console.log('[TEST-EMAIL] SMTP_FROM_NAME:', fromName);
    console.log('[TEST-EMAIL] ADMIN_EMAIL:', adminEmail);
    console.log('[TEST-EMAIL] ============================================');

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !fromEmail || !adminEmail) {
      console.error('[TEST-EMAIL] ❌ Variáveis de ambiente incompletas');
      return NextResponse.json(
        {
          success: false,
          error: 'Variáveis de ambiente incompletas',
          missing: {
            smtpHost: !!smtpHost,
            smtpPort: !!smtpPort,
            smtpUser: !!smtpUser,
            smtpPass: !!smtpPass,
            fromEmail: !!fromEmail,
            adminEmail: !!adminEmail
          }
        },
        { status: 500 }
      );
    }

    // Criar transporter
    console.log('[TEST-EMAIL] Criando transporter...');
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verificar conexão
    console.log('[TEST-EMAIL] Verificando conexão SMTP...');
    await transporter.verify();
    console.log('[TEST-EMAIL] ✅ Conexão SMTP verificada com sucesso');

    // Enviar email de teste
    console.log('[TEST-EMAIL] Enviando email de teste...');
    const testEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1E40AF; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .success { color: #10B981; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Teste de Email SMTP</h1>
          </div>
          <div class="content">
            <p>Este é um email de teste para validar a configuração SMTP da Brevo.</p>
            <p><strong>Configuração:</strong></p>
            <ul>
              <li>Host: ${smtpHost}</li>
              <li>Porta: ${smtpPort}</li>
              <li>From: ${fromEmail}</li>
            </ul>
            <p class="success">✅ O SMTP está configurado corretamente!</p>
            <p>Data do teste: ${new Date().toLocaleString('pt-AO')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: adminEmail,
      subject: '✅ Teste de Email SMTP - SINGULAR.i',
      html: testEmailContent
    });

    console.log('[TEST-EMAIL] ✅ Email de teste enviado com sucesso!');
    console.log('[TEST-EMAIL] Message ID:', result.messageId);
    console.log('[TEST-EMAIL] Response:', result);
    console.log('[TEST-EMAIL] ============================================');

    return NextResponse.json(
      {
        success: true,
        message: 'Email de teste enviado com sucesso',
        messageId: result.messageId,
        to: adminEmail,
        from: fromEmail,
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('[TEST-EMAIL] ❌ Erro ao enviar email de teste:');
    console.error('[TEST-EMAIL] Error:', error);
    if (error instanceof Error) {
      console.error('[TEST-EMAIL] Error message:', error.message);
      console.error('[TEST-EMAIL] Error stack:', error.stack);
    }
    console.error('[TEST-EMAIL] ============================================');

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao enviar email',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
