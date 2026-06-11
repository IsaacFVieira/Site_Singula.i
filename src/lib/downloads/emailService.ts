import nodemailer from 'nodemailer';

// Interface para os dados do download
interface DownloadData {
  productId: string;
  productName: string;
  nome: string;
  email: string;
  telefone: string;
  empresa?: string;
  planoSelecionado: 'FREE' | 'STANDARD' | 'PREMIUM';
  data: string;
  dataInicioAcesso?: string;
  statusPagamento: 'pendente' | 'pago' | 'free';
}

// Interface para informações do produto
interface Product {
  id: string;
  name: string;
  slug: string;
  fileName: string;
  downloads: number;
}

/**
 * Configuração do transporter Nodemailer com Brevo SMTP
 * Usa variáveis de ambiente para as credenciais
 */
const createTransporter = () => {
  console.log('[EMAIL] ============================================');
  console.log('[EMAIL] Verificando configuração SMTP Brevo...');
  console.log('[EMAIL] ============================================');

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM_EMAIL;
  const fromName = process.env.SMTP_FROM_NAME;

  console.log('[EMAIL] SMTP_HOST:', smtpHost);
  console.log('[EMAIL] SMTP_PORT:', smtpPort);
  console.log('[EMAIL] SMTP_USER:', smtpUser);
  console.log('[EMAIL] SMTP_PASS length:', smtpPass?.length || 0);
  console.log('[EMAIL] SMTP_FROM_EMAIL:', fromEmail);
  console.log('[EMAIL] SMTP_FROM_NAME:', fromName);
  console.log('[EMAIL] ============================================');

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !fromEmail) {
    console.error('[EMAIL] ❌ Configuração SMTP incompleta. Emails não serão enviados.');
    console.error('[EMAIL] SMTP_HOST existe:', !!smtpHost);
    console.error('[EMAIL] SMTP_PORT existe:', !!smtpPort);
    console.error('[EMAIL] SMTP_USER existe:', !!smtpUser);
    console.error('[EMAIL] SMTP_PASS existe:', !!smtpPass);
    console.error('[EMAIL] SMTP_FROM_EMAIL existe:', !!fromEmail);
    return null;
  }

  try {
    const port = parseInt(smtpPort);
    console.log('[EMAIL] Criando transporter com configuração:');
    console.log('[EMAIL]   - Host:', smtpHost);
    console.log('[EMAIL]   - Port:', port);
    console.log('[EMAIL]   - Secure: false (TLS)');
    console.log('[EMAIL]   - User:', smtpUser);

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: port,
      secure: false, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass
      },
      tls: {
        rejectUnauthorized: false // Aceitar certificados autoassinados se necessário
      }
    });

    console.log('[EMAIL] ✅ Transporter Nodemailer criado com sucesso');
    console.log('[EMAIL] ============================================');
    return { transporter, fromEmail, fromName };
  } catch (error) {
    console.error('[EMAIL] ❌ Erro ao criar transporter Nodemailer:', error);
    console.error('[EMAIL] ============================================');
    return null;
  }
};

/**
 * Envia email de notificação para a empresa (administrativo)
 * @param downloadData Dados do download
 * @param globalDownloads Total global de downloads
 * @param productDownloads Downloads do produto específico
 * @param product Informações do produto
 */
async function sendCompanyEmail(downloadData: DownloadData, globalDownloads: number, productDownloads: number, product: Product) {
  console.log('[EMAIL] ============================================');
  console.log('[EMAIL] Iniciando envio de email administrativo...');
  console.log('[EMAIL] ============================================');
  console.log('[EMAIL] Dados do download:', JSON.stringify(downloadData, null, 2));

  const config = createTransporter();

  if (!config) {
    console.error('[EMAIL] ❌ Email não enviado: configuração SMTP não disponível');
    console.error('[EMAIL] ============================================');
    return;
  }

  const { transporter, fromEmail, fromName } = config;
  const adminEmail = process.env.ADMIN_EMAIL || 'singular.i.ao@gmail.com';

  console.log('[EMAIL] Email de origem:', fromEmail);
  console.log('[EMAIL] Email de destino:', adminEmail);
  console.log('[EMAIL] From Name:', fromName);

  const formattedDate = new Date(downloadData.data).toLocaleString('pt-AO', {
    timeZone: 'Africa/Luanda',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1F2937; margin: 0; padding: 0; background-color: #F3F4F6; }
        .container { max-width: 650px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .header h1 { margin: 0 0 8px 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
        .header p { margin: 0; font-size: 14px; opacity: 0.9; font-weight: 400; letter-spacing: 0.5px; }
        .content { background: #ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .section-title { color: #0F172A; font-size: 18px; font-weight: 600; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #E2E8F0; }
        .data-row { display: flex; padding: 12px 0; border-bottom: 1px solid #F1F5F9; }
        .data-row:last-child { border-bottom: none; }
        .data-label { font-weight: 600; color: #475569; min-width: 140px; font-size: 14px; }
        .data-value { color: #1F2937; font-size: 14px; }
        .highlight { background: #F8FAFC; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #E2E8F0; }
        .highlight h3 { margin: 0 0 12px 0; color: #0F172A; font-size: 16px; font-weight: 600; }
        .highlight p { margin: 0; color: #6B7280; font-size: 14px; }
        .badge { display: inline-block; background: #0F172A; color: white; padding: 6px 14px; border-radius: 6px; font-size: 13px; font-weight: 600; margin-right: 8px; margin-bottom: 8px; }
        .footer { text-align: center; margin-top: 30px; color: #6B7280; font-size: 13px; padding-top: 20px; border-top: 2px solid #E2E8F0; }
        .footer p { margin: 8px 0; }
        .divider { height: 1px; background: #E2E8F0; margin: 24px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SINGULAR.i</h1>
          <p>Soluções Tecnológicas e Desenvolvimento de Software</p>
        </div>
        <div class="content">
          <h2 class="section-title">Novo Pedido de Download Recebido</h2>

          <p style="margin-bottom: 24px; color: #6B7280; font-size: 14px;">
            Foi realizado um novo pedido no site da SINGULAR.i
          </p>

          <h3 class="section-title">Dados do Cliente</h3>

          <div class="data-row">
            <span class="data-label">Nome:</span>
            <span class="data-value">${downloadData.nome}</span>
          </div>
          <div class="data-row">
            <span class="data-label">Email:</span>
            <span class="data-value">${downloadData.email}</span>
          </div>
          <div class="data-row">
            <span class="data-label">Telefone:</span>
            <span class="data-value">${downloadData.telefone}</span>
          </div>
          <div class="data-row">
            <span class="data-label">Empresa:</span>
            <span class="data-value">${downloadData.empresa || 'Não informado'}</span>
          </div>

          <h3 class="section-title">Detalhes do Pedido</h3>

          <div style="margin-bottom: 16px;">
            <span class="badge">${downloadData.planoSelecionado}</span>
            <span class="badge">${product.name}</span>
          </div>

          <div class="highlight">
            <h3>Estatísticas</h3>
            <p>Downloads do produto: ${productDownloads}+</p>
            <p>Downloads globais: ${globalDownloads}+</p>
          </div>

          <h3 class="section-title">Data e Hora do Pedido</h3>
          <p style="color: #6B7280; font-size: 14px;">${formattedDate}</p>

          <div class="divider"></div>

          <p style="color: #6B7280; font-size: 13px;">
            Este email foi gerado automaticamente pelo sistema de downloads da SINGULAR.i.
            O link de download será enviado ao cliente em até 7 dias úteis.
          </p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} SINGULAR.i. Todos os direitos reservados.</p>
          <p>Huambo, Angola</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    console.log('[EMAIL] Preparando envio de email administrativo...');
    console.log('[EMAIL] From:', `"${fromName}" <${fromEmail}>`);
    console.log('[EMAIL] To:', adminEmail);
    console.log('[EMAIL] Subject:', 'Novo Pedido de Download - SINGULAR.i');

    const result = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: adminEmail,
      subject: 'Novo Pedido de Download - SINGULAR.i',
      html: htmlContent
    });

    console.log('[EMAIL] ✅ Email administrativo enviado com sucesso!');
    console.log('[EMAIL] Message ID:', result.messageId);
    console.log('[EMAIL] Response:', result);
    console.log('[EMAIL] ============================================');
  } catch (error) {
    console.error('[EMAIL] ❌ Erro ao enviar email administrativo:');
    console.error('[EMAIL] Error:', error);
    if (error instanceof Error) {
      console.error('[EMAIL] Error message:', error.message);
      console.error('[EMAIL] Error stack:', error.stack);
    }
    console.error('[EMAIL] ============================================');
    // Não throw error para não falhar o download
  }
}

/**
 * Envia email de confirmação para o utilizador
 * @param downloadData Dados do download
 * @param product Informações do produto
 */
async function sendUserEmail(downloadData: DownloadData, product: Product) {
  console.log('[EMAIL] ============================================');
  console.log('[EMAIL] Iniciando envio de email de confirmação para o utilizador...');
  console.log('[EMAIL] ============================================');
  console.log('[EMAIL] Email do utilizador:', downloadData.email);
  console.log('[EMAIL] Nome do utilizador:', downloadData.nome);

  const config = createTransporter();

  if (!config) {
    console.error('[EMAIL] ❌ Email não enviado: configuração SMTP não disponível');
    console.error('[EMAIL] ============================================');
    return;
  }

  const { transporter, fromEmail, fromName } = config;

  console.log('[EMAIL] Email de origem:', fromEmail);
  console.log('[EMAIL] Email de destino:', downloadData.email);
  console.log('[EMAIL] From Name:', fromName);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1F2937; margin: 0; padding: 0; background-color: #F3F4F6; }
        .container { max-width: 650px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .header h1 { margin: 0 0 8px 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px; }
        .header p { margin: 0; font-size: 14px; opacity: 0.9; font-weight: 400; letter-spacing: 0.5px; }
        .content { background: #ffffff; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .greeting { font-size: 18px; color: #0F172A; margin-bottom: 16px; font-weight: 500; }
        .main-title { font-size: 24px; color: #0F172A; margin-bottom: 20px; font-weight: 600; }
        .info-box { background: #F8FAFC; padding: 24px; border-radius: 8px; margin: 24px 0; border: 1px solid #E2E8F0; }
        .info-box h3 { margin: 0 0 16px 0; color: #0F172A; font-size: 16px; font-weight: 600; }
        .info-item { display: flex; margin-bottom: 12px; }
        .info-item:last-child { margin-bottom: 0; }
        .info-label { font-weight: 600; color: #475569; min-width: 120px; font-size: 14px; }
        .info-value { color: #1F2937; font-size: 14px; }
        .timeline { margin: 24px 0; }
        .timeline-item { display: flex; margin-bottom: 16px; }
        .timeline-item:last-child { margin-bottom: 0; }
        .timeline-number { width: 32px; height: 32px; background: #0F172A; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; margin-right: 12px; flex-shrink: 0; }
        .timeline-content { flex: 1; padding-top: 4px; }
        .timeline-title { font-weight: 600; color: #0F172A; font-size: 14px; margin-bottom: 2px; }
        .timeline-desc { color: #6B7280; font-size: 13px; }
        .footer { text-align: center; margin-top: 30px; color: #6B7280; font-size: 13px; padding-top: 20px; border-top: 2px solid #E2E8F0; }
        .footer p { margin: 8px 0; }
        .footer a { color: #0F172A; text-decoration: none; font-weight: 500; }
        .footer a:hover { text-decoration: underline; }
        .divider { height: 1px; background: #E2E8F0; margin: 24px 0; }
        .signature { margin-top: 24px; }
        .signature p { margin: 4px 0; color: #475569; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>SINGULAR.i</h1>
          <p>Soluções Tecnológicas e Desenvolvimento de Software</p>
        </div>
        <div class="content">
          <p class="greeting">Olá ${downloadData.nome},</p>

          <h2 class="main-title">Pedido Recebido com Sucesso</h2>

          <p>Agradecemos o seu interesse nas soluções da SINGULAR.i.</p>

          <p>Confirmamos a receção do seu pedido de download. A nossa equipa irá proceder à análise da solicitação e disponibilizar o respetivo link de acesso através deste endereço de email.</p>

          <div class="info-box">
            <h3>Detalhes do Pedido</h3>
            <div class="info-item">
              <span class="info-label">Produto solicitado:</span>
              <span class="info-value">${product.name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Prazo estimado:</span>
              <span class="info-value">Até 7 dias úteis</span>
            </div>
            <div class="info-item">
              <span class="info-label">Estado atual:</span>
              <span class="info-value">Aguardando Processamento</span>
            </div>
          </div>

          <h3 style="color: #0F172A; font-size: 16px; font-weight: 600; margin: 24px 0 16px 0;">Próximos Passos</h3>

          <div class="timeline">
            <div class="timeline-item">
              <div class="timeline-number">1</div>
              <div class="timeline-content">
                <div class="timeline-title">Pedido recebido</div>
                <div class="timeline-desc">A sua solicitação foi registrada no nosso sistema</div>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-number">2</div>
              <div class="timeline-content">
                <div class="timeline-title">Validação pela equipa</div>
                <div class="timeline-desc">A nossa equipa irá analisar e validar o seu pedido</div>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-number">3</div>
              <div class="timeline-content">
                <div class="timeline-title">Envio do link de download</div>
                <div class="timeline-desc">Receberá o link de acesso por email</div>
              </div>
            </div>
          </div>

          <p>Caso necessite de assistência adicional, poderá responder diretamente a este email.</p>

          <p>Agradecemos a confiança depositada na SINGULAR.i.</p>

          <div class="signature">
            <p>Com os melhores cumprimentos,</p>
            <p><strong>Equipa SINGULAR.i</strong></p>
          </div>

          <div class="divider"></div>

          <div class="footer">
            <p><strong>SINGULAR.i</strong></p>
            <p>Empresa Angolana de Desenvolvimento de Software e Soluções Digitais</p>
            <p style="margin-top: 16px;">
              <a href="mailto:singular.i.ao@gmail.com">singular.i.ao@gmail.com</a>
            </p>
            <p>
              <a href="https://singular-i.vercel.app">https://singular-i.vercel.app</a>
            </p>
            <p style="margin-top: 16px; color: #9CA3AF; font-size: 12px;">
              © 2026 SINGULAR.i. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    console.log('[EMAIL] Preparando envio de email de confirmação...');
    console.log('[EMAIL] From:', `"${fromName}" <${fromEmail}>`);
    console.log('[EMAIL] To:', downloadData.email);
    console.log('[EMAIL] Subject:', 'Recebemos o seu pedido - Singular.i');

    const result = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: downloadData.email,
      subject: 'Recebemos o seu pedido - Singular.i',
      html: htmlContent
    });

    console.log('[EMAIL] ✅ Email de confirmação enviado com sucesso!');
    console.log('[EMAIL] Message ID:', result.messageId);
    console.log('[EMAIL] Response:', result);
    console.log('[EMAIL] ============================================');
  } catch (error) {
    console.error('[EMAIL] ❌ Erro ao enviar email de confirmação:');
    console.error('[EMAIL] Error:', error);
    if (error instanceof Error) {
      console.error('[EMAIL] Error message:', error.message);
      console.error('[EMAIL] Error stack:', error.stack);
    }
    console.error('[EMAIL] ============================================');
    // Não throw error para não falhar o download
  }
}

/**
 * Envia ambos os emails (administrativo e utilizador)
 * @param downloadData Dados do download
 * @param globalDownloads Total global de downloads
 * @param productDownloads Downloads do produto específico
 * @param product Informações do produto
 */
export async function sendDownloadEmails(downloadData: DownloadData, globalDownloads: number, productDownloads: number, product: Product) {
  console.log('[EMAIL] ============================================');
  console.log('[EMAIL] PRIORIDADE ABSOLUTA: Iniciando envio de ambos os emails...');
  console.log('[EMAIL] Global downloads:', globalDownloads);
  console.log('[EMAIL] Product downloads:', productDownloads);
  console.log('[EMAIL] Product name:', product.name);
  console.log('[EMAIL] User email:', downloadData.email);
  console.log('[EMAIL] User name:', downloadData.nome);
  console.log('[EMAIL] ============================================');

  // Verifica configuração SMTP antes de tentar enviar
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM_EMAIL;

  console.log('[EMAIL] Verificando configuração SMTP...');
  console.log('[EMAIL] SMTP_HOST:', smtpHost ? '✅ Configurado' : '❌ Não configurado');
  console.log('[EMAIL] SMTP_PORT:', smtpPort ? '✅ Configurado' : '❌ Não configurado');
  console.log('[EMAIL] SMTP_USER:', smtpUser ? '✅ Configurado' : '❌ Não configurado');
  console.log('[EMAIL] SMTP_PASS:', smtpPass ? '✅ Configurado' : '❌ Não configurado');
  console.log('[EMAIL] SMTP_FROM_EMAIL:', fromEmail ? '✅ Configurado' : '❌ Não configurado');

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !fromEmail) {
    console.error('[EMAIL] ❌ Configuração SMTP incompleta. Emails não serão enviados.');
    console.error('[EMAIL] ============================================');
    // Não throw error para não falhar o processo
    return;
  }

  try {
    // Envia email administrativo para a empresa
    console.log('[EMAIL] Enviando email administrativo...');
    await sendCompanyEmail(downloadData, globalDownloads, productDownloads, product);

    // Envia email de confirmação para o utilizador
    console.log('[EMAIL] Enviando email de confirmação para utilizador...');
    await sendUserEmail(downloadData, product);

    console.log('[EMAIL] ✅ Todos os emails enviados com sucesso');
    console.log('[EMAIL] ============================================');
  } catch (error) {
    console.error('[EMAIL] ❌ Erro ao enviar emails:', error);
    console.error('[EMAIL] ============================================');
    // Não throw error para não falhar o download
    // Mesmo se emails falharem, o processo continua
  }
}
