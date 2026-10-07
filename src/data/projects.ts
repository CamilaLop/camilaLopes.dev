export type ProjectStatus = 'live' | 'in-progress' | 'internal';

export type PortfolioProject = {
  id: string;
  title: string;
  category: string;
  status: ProjectStatus;
  url?: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  stack: string[];
  summary: string;
  responsibilities: string[];
};

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'igor-guia',
    title: 'Igor Guia',
    category: 'Landing page turística',
    status: 'live',
    url: 'https://igorguia.com.br',
    image: '/assets/projects/igor-guia.webp',
    imageWidth: 1500,
    imageHeight: 799,
    stack: ['HTML', 'CSS', 'JavaScript avançado', 'UI/UX'],
    summary: 'Landing page para guia turístico da Região dos Lagos, com foco em apresentação visual, navegação objetiva e conversão para escolha de passeios.',
    responsibilities: ['Estrutura front-end', 'Layout responsivo', 'Interações em JavaScript', 'Organização visual das seções']
  },
  {
    id: 'lue-brand',
    title: 'Luê Brand',
    category: 'Sistema web para marca artesanal',
    status: 'live',
    url: 'https://camilalop.github.io/Lue-System-v2/menu.html',
    image: '/assets/projects/lue-brand.webp',
    imageWidth: 1500,
    imageHeight: 820,
    stack: ['HTML', 'CSS', 'JavaScript', 'Supabase', 'PostgreSQL'],
    summary: 'Site e sistema para marca independente de roupas artesanais e ecológicas, com controle de estoque, vendas e dashboard integrados a banco online.',
    responsibilities: ['Identidade visual da interface', 'Controle de estoque', 'Fluxo de vendas', 'Integração com Supabase e PostgreSQL']
  },
  {
    id: 'sales-dashboard',
    title: 'Dashboard Analítico',
    category: 'Dashboard de gestão',
    status: 'live',
    url: 'https://interactive-sales-dashboard-two.vercel.app/login',
    image: '/assets/projects/sales-dashboard.webp',
    imageWidth: 1500,
    imageHeight: 821,
    stack: ['React', 'Supabase', 'PostgreSQL', 'Autenticação', 'Data visualization'],
    summary: 'Dashboard para análise de vendas, compras, fornecedores e estoque, com autenticação de login e banco de dados ativo no Supabase.',
    responsibilities: ['Arquitetura front-end em React', 'Autenticação', 'Dashboards analíticos', 'Integração com banco de dados']
  },
  {
    id: 'Sale-ecommerce',
    title: 'Salê E-commerce',
    category: 'E-commerce full stack',
    status: 'in-progress',
    url: 'https://velas-sale.vercel.app/',
    image: '/assets/projects/shopflow.webp',
    imageWidth: 1500,
    imageHeight: 937,
    stack: ['React', 'Prisma', 'PostgreSQL', 'Autenticação'],
    summary: 'E-commerce criado como projeto de aprendizado full stack, com loja, carrinho, login, autenticação e persistência de dados.',
    responsibilities: ['Interface da loja', 'Fluxo de carrinho', 'Modelagem com Prisma', 'Autenticação e banco PostgreSQL']
  },
  {
    id: 'bruna-dantas',
    title: 'Bruna Dantas Advocacia',
    category: 'Landing page institucional',
    status: 'live',
    url: 'https://bruna-dantas.vercel.app/',
    image: '/assets/projects/bruna-dantas.webp',
    imageWidth: 1500,
    imageHeight: 818,
    stack: ['Identidade visual', 'UI Design', 'Landing Page', 'SEO'],
    summary: 'Landing page autoral para advogada, com criação de identidade visual completa e integração da linguagem da marca à experiência digital.',
    responsibilities: ['Identidade visual', 'Direção visual', 'Construção da landing page', 'Estrutura institucional']
  },
  {
    id: 'lazuli',
    title: 'Lazuli Espaço Psicoterapêutico',
    category: 'Homepage com agendamento',
    status: 'in-progress',
    url: 'https://clinic-lazuli-ky7f.vercel.app/',
    image: '/assets/projects/lazuli.webp',
    imageWidth: 1500,
    imageHeight: 937,
    stack: ['Identidade visual', 'UI/UX', 'Agenda', 'Google Calendar'],
    summary: 'Homepage para consultório de psicoterapia, com identidade visual autoral e proposta de integração de agenda profissional ao Google Calendar.',
    responsibilities: ['Identidade visual', 'Interface institucional', 'Fluxo de marcação', 'Planejamento de integração com calendários']
  },
  {
    id: 'python-call-crud',
    title: 'Registro de Chamados',
    category: 'Aplicação Python interna',
    status: 'internal',
    image: '/assets/projects/python-crud.webp',
    imageWidth: 1189,
    imageHeight: 1393,
    stack: ['Python', 'CRUD', 'Persistência de dados', 'Automação'],
    summary: 'Programa em Python para loja, criado para registrar, consultar, editar e armazenar chamados de clientes e ações de atendimento.',
    responsibilities: ['Modelagem do fluxo CRUD', 'Organização de dados', 'Interface operacional simples', 'Automação de registros']
  },
  {
    id: 'orbis-clinic',
    title: 'Orbis Clinic',
    category: 'SaaS para clínicas',
    status: 'in-progress',
    image: '/assets/projects/orbis-clinic.webp',
    imageWidth: 1448,
    imageHeight: 1086,
    stack: ['Next.js', 'PostgreSQL', 'WhatsApp Business', 'SaaS', 'Automação'],
    summary: 'SaaS em desenvolvimento para automatizar serviços de secretaria em clínicas e consultórios, com atendimento digital 24h e fluxos humanizados.',
    responsibilities: ['Concepção do produto', 'Identidade visual', 'UX do dashboard', 'Arquitetura com Next.js e PostgreSQL', 'Planejamento de integração WhatsApp Business']
  }
];
