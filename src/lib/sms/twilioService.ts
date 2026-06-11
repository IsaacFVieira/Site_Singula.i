import twilio from 'twilio';

/**
 * Normaliza um número de telefone para formato E.164 internacional
 * Suporta múltiplos formatos de entrada e converte automaticamente
 * @param phone Número de telefone a normalizar
 * @returns Número normalizado em formato E.164 (+244XXXXXXXXX)
 * @throws Error se o número não for válido
 */
function normalizePhone(phone: string): string {
  console.log('[SMS] Normalizando número de telefone:', phone);

  // Remove espaços, hífens, parênteses e outros caracteres não numéricos (exceto +)
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Caso a: Número já em formato internacional (+244XXXXXXXXX)
  if (cleaned.startsWith('+')) {
    // Verifica se é válido (apenas + seguido de dígitos)
    const internationalPattern = /^\+\d{10,15}$/;
    if (internationalPattern.test(cleaned)) {
      console.log('[SMS] Número já em formato internacional, mantendo:', cleaned);
      return cleaned;
    }
    throw new Error(`Número internacional inválido: ${phone}`);
  }

  // Caso b: Número com código do país sem "+" (244XXXXXXXXX)
  if (cleaned.startsWith('244') && cleaned.length === 12) {
    const normalized = `+${cleaned}`;
    console.log('[SMS] Número com código do país sem +, adicionando:', normalized);
    return normalized;
  }

  // Caso c: Número local angolano (9 dígitos)
  if (cleaned.length === 9 && /^\d{9}$/.test(cleaned)) {
    const normalized = `+244${cleaned}`;
    console.log('[SMS] Número local angolano, adicionando código do país:', normalized);
    return normalized;
  }

  // Se não corresponder a nenhum formato conhecido, tenta validar como número internacional sem +
  if (/^\d{10,15}$/.test(cleaned)) {
    const normalized = `+${cleaned}`;
    console.log('[SMS] Número internacional sem +, adicionando:', normalized);
    return normalized;
  }

  throw new Error(`Número de telefone inválido: ${phone}. Formatos aceitos: +244XXXXXXXXX, 244XXXXXXXXX, XXXXXXXX (9 dígitos)`);
}

/**
 * Valida se um número de telefone está em formato internacional
 * @param phoneNumber Número de telefone a validar
 * @returns true se válido, false caso contrário
 */
function validateInternationalPhoneNumber(phoneNumber: string): boolean {
  // Remove espaços, hífens e parênteses
  const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');

  // Verifica se começa com + seguido de dígitos
  const internationalPattern = /^\+\d{10,15}$/;

  return internationalPattern.test(cleaned);
}

/**
 * Formata o número de telefone para formato internacional
 * Remove espaços, hífens e parênteses
 * @param phoneNumber Número de telefone a formatar
 * @returns Número formatado
 */
function formatPhoneNumber(phoneNumber: string): string {
  return phoneNumber.replace(/[\s\-\(\)]/g, '');
}

/**
 * Envia SMS via Twilio com fallback automático
 * Primeiro tenta usar Sender ID alfanumérico, se falhar usa número Twilio
 * @param to Número de telefone do destinatário (qualquer formato suportado)
 * @param message Mensagem a enviar
 * @returns true se enviado com sucesso, false caso contrário
 */
export async function sendSMS(to: string, message: string): Promise<boolean> {
  console.log('[SMS] ============================================');
  console.log('[SMS] Iniciando envio de SMS via Twilio...');
  console.log('[SMS] ============================================');

  // Valida configuração Twilio
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
  const senderId = process.env.TWILIO_SENDER_ID || 'SINGULAR';

  console.log('[SMS] Verificando configuração Twilio...');
  console.log('[SMS] TWILIO_ACCOUNT_SID:', accountSid ? '✅ Configurado' : '❌ Não configurado');
  console.log('[SMS] TWILIO_AUTH_TOKEN:', authToken ? '✅ Configurado' : '❌ Não configurado');
  console.log('[SMS] TWILIO_PHONE_NUMBER:', twilioPhoneNumber ? '✅ Configurado' : '❌ Não configurado');
  console.log('[SMS] TWILIO_SENDER_ID:', senderId);

  if (!accountSid || !authToken || !twilioPhoneNumber) {
    console.error('[SMS] ❌ Configuração Twilio incompleta. SMS não será enviado.');
    console.error('[SMS] ============================================');
    return false;
  }

  // Normaliza número de telefone
  console.log('[SMS] Normalizando número de telefone...');
  let normalizedPhone: string;
  try {
    normalizedPhone = normalizePhone(to);
    console.log('[SMS] Número normalizado:', normalizedPhone);
  } catch (normalizationError) {
    console.error('[SMS] ❌ Erro ao normalizar número de telefone:', normalizationError);
    console.error('[SMS] ============================================');
    return false;
  }

  // Inicializa cliente Twilio
  const client = twilio(accountSid, authToken);

  // Tenta primeiro com Sender ID alfanumérico
  console.log('[SMS] Tentando enviar SMS com Sender ID:', senderId);
  try {
    const messageResult = await client.messages.create({
      body: message,
      from: senderId,
      to: normalizedPhone
    });

    console.log('[SMS] ✅ SMS enviado com sucesso via Sender ID');
    console.log('[SMS] Message SID:', messageResult.sid);
    console.log('[SMS] Status:', messageResult.status);
    console.log('[SMS] ============================================');
    return true;
  } catch (senderIdError) {
    console.error('[SMS] ❌ Erro ao enviar SMS com Sender ID:', senderIdError);
    console.error('[SMS] Tentando fallback para número Twilio...');

    // Fallback para número Twilio
    try {
      const messageResult = await client.messages.create({
        body: message,
        from: twilioPhoneNumber,
        to: normalizedPhone
      });

      console.log('[SMS] ✅ SMS enviado com sucesso via número Twilio');
      console.log('[SMS] Message SID:', messageResult.sid);
      console.log('[SMS] Status:', messageResult.status);
      console.log('[SMS] ============================================');
      return true;
    } catch (phoneNumberError) {
      console.error('[SMS] ❌ Erro ao enviar SMS com número Twilio:', phoneNumberError);
      console.error('[SMS] ============================================');
      return false;
    }
  }
}

/**
 * Envia SMS de confirmação de download
 * @param phoneNumber Número de telefone do utilizador
 * @param productName Nome do produto
 * @returns true se enviado com sucesso, false caso contrário
 */
export async function sendDownloadConfirmationSMS(phoneNumber: string, productName: string): Promise<boolean> {
  const message = `SINGULAR.i: Recebemos o seu pedido de download do produto ${productName}. O link será enviado para o seu email em até 7 dias.`;
  
  console.log('[SMS] ============================================');
  console.log('[SMS] Preparando SMS de confirmação de download...');
  console.log('[SMS] Produto:', productName);
  console.log('[SMS] Telefone:', phoneNumber);
  console.log('[SMS] ============================================');

  return await sendSMS(phoneNumber, message);
}
