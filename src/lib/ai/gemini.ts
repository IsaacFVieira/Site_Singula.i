import { GoogleGenerativeAI } from '@google/generative-ai';
import { systemPrompt } from './systemPrompt';
import { getKnowledgeBase } from './knowledgeBase';

// Initialize Gemini AI (server-side only)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

// Send message to Gemini (server-side only)
export async function sendMessageToGemini(
  message: string,
  history: ChatMessage[] = [],
  language: 'pt' | 'en' = 'pt'
): Promise<string> {
  // Validate API key server-side
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing');
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: systemPrompt 
    });
    
    // Get knowledge base
    const knowledgeBase = getKnowledgeBase();
    
    // Build user message with knowledge base context
    const userMessageWithContext = `
CONTEXTO DA SINGULA.I:
${knowledgeBase}

PERGUNTA DO UTILIZADOR:
${message}`;
    
    // Start chat with empty history
    const chat = model.startChat({
      history: [],
    });
    
    // Send the user message with knowledge base context
    const result = await chat.sendMessage(userMessageWithContext);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    // Fallback response if API fails
    if (language === 'pt') {
      return 'Desculpe, ocorreu um erro ao processar a sua mensagem. Por favor, tente novamente mais tarde.';
    }
    return 'Sorry, there was an error processing your message. Please try again later.';
  }
}

// Check if message is within SINGULAR.i domain (frontend guard)
export function isWithinDomain(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  
  const domainKeywords = [
    'singula.i', 'singula', 'singulai',
    'empresa', 'company',
    'serviço', 'serviços', 'service', 'services',
    'projeto', 'projetos', 'project', 'projects',
    'doctor-plus', 'jafadh',
    'contacto', 'contact', 'contato',
    'desenvolvimento', 'development',
    'software',
    'tecnologia', 'technology',
    'angola', 'huambo',
    'missão', 'mission',
    'valores', 'values'
  ];
  
  // Check if message contains any domain keywords
  const hasDomainKeyword = domainKeywords.some(keyword => 
    lowerMessage.includes(keyword)
  );
  
  // Also allow very short messages (greetings, etc.)
  const isShortMessage = message.trim().length < 20;
  
  return hasDomainKeyword || isShortMessage;
}
