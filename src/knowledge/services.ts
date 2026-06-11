export const servicesKnowledge = [
  {
    id: 'web-development',
    name: 'Desenvolvimento de Websites',
    description: 'Criação de websites modernos, responsivos e otimizados para SEO.',
    features: [
      'Design responsivo',
      'Otimização SEO',
      'Performance otimizada',
      'Integração com CMS',
    ],
  },
  {
    id: 'management-systems',
    name: 'Sistemas de Gestão',
    description: 'Sistemas personalizados para gestão de negócios e processos.',
    features: [
      'Dashboards personalizados',
      'Gestão de inventário',
      'Relatórios automáticos',
      'Integração com APIs',
    ],
  },
  {
    id: 'web-applications',
    name: 'Aplicações Web',
    description: 'Aplicações web complexas com funcionalidades avançadas.',
    features: [
      'Autenticação segura',
      'Banco de dados integrado',
      'API RESTful',
      'Escalabilidade',
    ],
  },
  {
    id: 'enterprise-solutions',
    name: 'Soluções Empresariais',
    description: 'Soluções tecnológicas para empresas de todos os tamanhos.',
    features: [
      'Integração ERP',
      'Automação de processos',
      'Análise de dados',
      'Segurança avançada',
    ],
  },
  {
    id: 'custom-systems',
    name: 'Sistemas Personalizados',
    description: 'Desenvolvimento de sistemas sob medida para necessidades específicas.',
    features: [
      'Análise de requisitos',
      'Design personalizado',
      'Desenvolvimento iterativo',
      'Suporte contínuo',
    ],
  },
  {
    id: 'tech-consulting',
    name: 'Consultoria Tecnológica',
    description: 'Aconselhamento em estratégias digitais e implementação tecnológica.',
    features: [
      'Auditoria tecnológica',
      'Planejamento estratégico',
      'Implementação de soluções',
      'Treinamento de equipas',
    ],
  },
] as const;

export type ServiceKnowledge = typeof servicesKnowledge[number];
