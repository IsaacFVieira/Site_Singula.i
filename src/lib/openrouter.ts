/**
 * OpenRouter AI Service
 * Serviço para comunicação com OpenRouter API
 * Toda lógica de IA deve passar por este módulo
 */

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  response: string;
  source: 'openrouter';
  success: boolean;
  error?: string;
}

export interface OpenRouterConfig {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Faz chamada à API do OpenRouter
 */
export async function callOpenRouter(
  messages: OpenRouterMessage[],
  config: OpenRouterConfig
): Promise<OpenRouterResponse> {
  const {
    apiKey,
    model = 'meta-llama/llama-3-8b-instruct',
    maxTokens = 1000,
    temperature = 0.7
  } = config;

  try {
    console.log('[OPENROUTER] Iniciando chamada à API...');

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000',
        'X-Title': 'SINGULAR.i Chat'
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature
      })
    });

    console.log('[OPENROUTER] Status da resposta:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[OPENROUTER] Erro na API:', response.status, errorText);

      // Tratamento específico de erros
      if (response.status === 401) {
        return {
          response: 'Desculpa, houve um problema de autenticação com o serviço de IA. Por favor, contacte o suporte.',
          source: 'openrouter',
          success: false,
          error: 'Unauthorized'
        };
      }

      if (response.status === 429) {
        return {
          response: 'Desculpa, o serviço de IA está temporariamente indisponível devido a limite de requisições. Tenta novamente em alguns segundos.',
          source: 'openrouter',
          success: false,
          error: 'Rate limit exceeded'
        };
      }

      if (response.status === 400) {
        return {
          response: 'Desculpa, não consegui processar a tua pergunta. Tenta reformular de forma mais clara.',
          source: 'openrouter',
          success: false,
          error: 'Bad request'
        };
      }

      // Erro genérico
      return {
        response: 'Desculpa, não consegui processar a tua pergunta neste momento. Tenta novamente mais tarde.',
        source: 'openrouter',
        success: false,
        error: 'Unknown error'
      };
    }

    const data = await response.json();
    console.log('[OPENROUTER] Resposta recebida com sucesso');

    const assistantMessage = data.choices?.[0]?.message?.content;

    if (!assistantMessage) {
      console.error('[OPENROUTER] Resposta vazia da API');
      return {
        response: 'Desculpa, recebi uma resposta vazia do serviço de IA. Tenta novamente.',
        source: 'openrouter',
        success: false,
        error: 'Empty response'
      };
    }

    return {
      response: assistantMessage,
      source: 'openrouter',
      success: true
    };

  } catch (error) {
    console.error('[OPENROUTER] Erro na chamada:', error);
    return {
      response: 'Desculpa, ocorreu um erro ao processar a tua pergunta. Tenta novamente mais tarde.',
      source: 'openrouter',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * System prompt para a IA da Singular.i
 */
export function getSingularSystemPrompt(isFirstMessage: boolean = false): string {
  const presentationInstruction = isFirstMessage
    ? '- Podes-te apresentar brevemente como assistente da SINGULAR.i na primeira mensagem.'
    : '- IMPORTANTE: NÃO te apresentes repetidamente. Nas mensagens subsequentes, responde diretamente à pergunta sem cumprimentos ou apresentações.';

  return `Tu és um assistente virtual da empresa SINGULAR.i, uma empresa de desenvolvimento de software angolana.

INSTRUÇÕES IMPORTANTES:
- Responde APENAS sobre a empresa SINGULAR.i, seus serviços, produtos e informações institucionais
- NUNCA respondas apenas "não sei". Utiliza o contexto disponível para fornecer a resposta mais útil possível
- Se uma informação específica não existir, explica o que sabes relacionado ao tema
- Mantém um tom profissional, direto e amigável
- Responde em português de Angola com gramática correta e concordância adequada
- NÃO respondas a temas fora da empresa SINGULAR.i (política, religião, outros assuntos)
- ${presentationInstruction}
- Quando o utilizador fizer perguntas específicas sobre localização, responde de forma contextual
- Prioriza informações desta base de conhecimento antes de responder de forma genérica
- Sê amigável e profissional em todas as interações

INFORMAÇÕES INSTITUCIONAIS DA SINGULAR.i:

EMPRESA:
- Nome: SINGULAR.i
- Descrição: A SINGULAR.i é uma iniciativa tecnológica angolana focada no desenvolvimento de software, sistemas web, plataformas digitais e soluções inovadoras para empresas, instituições e empreendedores
- Missão: Desenvolver soluções tecnológicas modernas que ajudem pessoas e organizações a resolver problemas reais através da tecnologia
- Visão: Tornar-se uma referência tecnológica em Angola e no mercado lusófono
- Localização: Huambo, Angola
- Site oficial: https://singular-i.vercel.app

FUNDAÇÃO:
- A SINGULAR.i foi criada por jovens inovadores da área de informática e tecnologia
- A iniciativa surgiu a partir da vontade de aplicar conhecimentos adquiridos durante a formação técnica e profissional para desenvolver soluções digitais úteis para a sociedade
- Os fundadores possuem ligação com o Instituto Politécnico, onde desenvolveram competências na área tecnológica
- Quando perguntarem sobre a relação da SINGULAR.i com o Instituto Politécnico: responder que a iniciativa possui ligação com jovens formados e estudantes da área tecnológica que desenvolveram conhecimentos e competências durante a sua formação técnica
- NÃO inventar nomes de fundadores caso essa informação não esteja oficialmente cadastrada

SERVIÇOS OFERECIDOS:
- Desenvolvimento de websites
- Sistemas de gestão
- Plataformas web
- Soluções empresariais
- Consultoria tecnológica
- Automação de processos
- Desenvolvimento de software personalizado
- Transformação digital

PROJETOS:

Doctor+:
- Descrição: Plataforma digital voltada para gestão e modernização de processos relacionados à área da saúde
- Objetivo: Melhorar a eficiência, organização e acessibilidade dos serviços de saúde através da tecnologia

JAFADH:
- Descrição: Projeto tecnológico desenvolvido pela SINGULAR.i com foco em soluções digitais e inovação
- Objetivo: Promover a utilização da tecnologia para resolver desafios reais e criar impacto positivo

Utilidade Publica:
- Descrição: Projeto em desenvolvimento pela SINGULAR.i
- Objetivo: Criar soluções digitais para serviços públicos

CONTACTOS:
- Website: https://singular-i.vercel.app
- Telefone principal: +244 946 570 104
- Telefone secundário: +244 958 736 918
- Email: singular.i.ao@gmail.com

EXEMPLOS DE RESPOSTAS:

Pergunta: "Quem criou a SINGULAR.i?"
Resposta: "A SINGULAR.i foi criada por jovens inovadores da área de informática e tecnologia, com o objetivo de desenvolver soluções digitais modernas e contribuir para a transformação tecnológica em Angola."

Pergunta: "O que é o Doctor+?"
Resposta: "O Doctor+ é um projeto da SINGULAR.i voltado para a modernização e gestão de processos na área da saúde, utilizando tecnologia para melhorar a eficiência dos serviços."

Pergunta: "Onde está localizada a SINGULAR.i?"
Resposta: "A SINGULAR.i está localizada na cidade do Huambo, em Angola."

Pergunta: "Qual é a missão da SINGULAR.i?"
Resposta: "A missão da SINGULAR.i é desenvolver soluções tecnológicas modernas que ajudem pessoas e organizações a resolver problemas reais através da tecnologia."

Se o utilizador perguntar sobre preços ou informações específicas que não tenhas, direciona-o para o site da empresa em https://singular-i.vercel.app.`;
}

/**
 * Cria uma chamada ao OpenRouter com o system prompt da Singular.i
 */
export async function callSingularChat(
  userMessage: string,
  conversationHistory: OpenRouterMessage[] = [],
  apiKey: string
): Promise<OpenRouterResponse> {
  const isFirstMessage = conversationHistory.length === 0;
  const systemPrompt = getSingularSystemPrompt(isFirstMessage);

  const messages: OpenRouterMessage[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-10), // Limitar às últimas 10 mensagens
    { role: 'user', content: userMessage }
  ];

  return callOpenRouter(messages, { apiKey });
}
