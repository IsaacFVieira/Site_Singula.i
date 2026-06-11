import { companyKnowledge } from '@/knowledge/company';
import { servicesKnowledge } from '@/knowledge/services';
import { projectsKnowledge } from '@/knowledge/projects';
import { faqKnowledge } from '@/knowledge/faq';

export function getKnowledgeBase(): string {
  let knowledge = '';

  // Company Information (concise)
  knowledge += `EMPRESA: ${companyKnowledge.name}. ${companyKnowledge.description}. Missão: ${companyKnowledge.mission}. Local: ${companyKnowledge.contact.location}. Áreas: ${companyKnowledge.areas.join(', ')}. Valores: ${companyKnowledge.values.join(', ')}.\n\n`;

  // Services (concise)
  knowledge += `SERVIÇOS:\n`;
  servicesKnowledge.forEach(service => {
    knowledge += `- ${service.name}: ${service.description}\n`;
  });
  knowledge += `\n`;

  // Projects (concise - only name and description)
  knowledge += `PROJETOS:\n`;
  projectsKnowledge.forEach(project => {
    knowledge += `- ${project.name}: ${project.description}\n`;
  });
  knowledge += `\n`;

  // FAQ (select only top 5)
  knowledge += `FAQ:\n`;
  faqKnowledge.slice(0, 5).forEach(faq => {
    knowledge += `Q: ${faq.question}\nA: ${faq.answer}\n\n`;
  });

  return knowledge;
}
