export const projectsKnowledge = [
  {
    id: 'doctor-plus',
    name: 'Doctor+',
    category: 'Saúde',
    description: 'Sistema de rastreamento de saúde para gestão de informações de pacientes.',
    problem: 'Muitas instituições de saúde ainda utilizam registos físicos, dificultando o acesso rápido a informações médicas.',
    objective: 'Digitalizar e centralizar informações clínicas dos pacientes.',
    features: [
      'Identificação biométrica',
      'Histórico médico',
      'Gestão de alergias',
      'Alertas médicos',
      'Gestão de vacinação',
      'Acesso rápido em emergências',
    ],
    impact: [
      'Redução de erros médicos',
      'Maior eficiência hospitalar',
      'Modernização dos serviços de saúde',
    ],
    technologies: ['Next.js', 'TypeScript', 'SQL Server'],
  },
  {
    id: 'jafadh',
    name: 'JAFADH',
    category: 'Segurança e Verificação Documental',
    description: 'Sistema de verificação de documentação pessoal.',
    problem: 'Fraudes documentais e processos burocráticos lentos.',
    objective: 'Permitir validação segura e rápida de documentos.',
    features: [
      'AES',
      'RSA',
      'Blockchain',
      'MFA',
      'QR Code',
      'OCR',
      'Geolocalização',
      'Alertas de expiração',
    ],
    impact: [
      'Menos fraude',
      'Mais transparência',
      'Verificação mais rápida',
      'Maior autonomia do cidadão',
    ],
    technologies: ['C#', 'WPF', 'SQL Server', 'Blockchain'],
  },
] as const;

export type ProjectKnowledge = typeof projectsKnowledge[number];
