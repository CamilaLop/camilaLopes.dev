export type Locale = 'pt' | 'en' | 'es';

export const translations = {
  pt: {
    lang: 'pt-BR', pageTitle: 'Camila Lopes — Front-end & UI/UX',
    nav: ['Projetos', 'Gallery', 'Serviços', 'Sobre', 'Contato'],
    menu: 'Menu', close: 'Fechar', skip: 'Ir para o conteúdo', based: 'Rio de Janeiro, Brasil',
    loading: 'Carregando portfólio',
    motion: { enable: 'Ativar animações', reduce: 'Reduzir movimento' },
    hero: {
      role: 'Desenvolvedora Front-end & UI/UX', edition: 'Portfólio / 2026',
      lead: 'Interfaces com intenção. Experiências digitais com identidade.',
      work: 'Conheça meu trabalho', contact: 'Vamos conversar', scroll: 'Continue explorando',
      end: 'Entre o visual e o funcional.', endSmall: 'Design, código e atenção aos detalhes.',
      photo: 'Paisagem em preto e branco do Rio de Janeiro', caption: 'Um olhar a partir do Rio.'
    },
    projects: {
      label: 'Trabalho selecionado', title: 'PROJETOS', note: 'Ideias que ganham forma.',
      lead: 'Uma seleção de interfaces que desenvolvi — da direção visual à experiência de uso.',
      view: 'Abrir projeto', details: 'Sobre o projeto', next: 'Explore também os outros projetos',
      responsibility: 'Minha participação', stack: 'Tecnologias & ferramentas', count: 'Projeto em destaque',
      scroll: 'Scroll para explorar', continue: 'Continue explorando',
      status: { live: 'Em produção', 'in-progress': 'Em desenvolvimento', internal: 'Projeto interno' }
    },
    services: {
      label: 'O que faço', title: ['O QUE', 'FAÇO'],
      lead: 'Do primeiro esboço à interface que funciona. Visual, interação e desenvolvimento no mesmo processo.', hint: 'Explore cada área',
      items: [
        { name: 'Front-end', meta: 'React / Next.js / TypeScript', text: 'Interfaces responsivas com componentes organizados, interações cuidadosas e integração com APIs.' },
        { name: 'Landing pages', meta: 'Apresentação / Conversão', text: 'Sites institucionais e páginas de venda com hierarquia clara, identidade visual e navegação objetiva.' },
        { name: 'Sistemas web', meta: 'Supabase / PostgreSQL / Prisma', text: 'Dashboards e fluxos de gestão conectados a dados, com autenticação e atenção à experiência de quem usa.' },
        { name: 'UI & marca', meta: 'Identidade / Experiência / Movimento', text: 'Direção visual para projetos digitais: tipografia, composição, interface e movimento em uma linguagem consistente.' }
      ]
    },
    gallery: { label: 'Outras criações', title: 'GALLERY', lead: 'Diferentes contextos. O mesmo cuidado.', small: 'E-commerce, identidade visual, interfaces institucionais e produtos em desenvolvimento.', inspect: 'Explorar projeto', sequence: 'Projetos da Gallery', previous: 'Projeto anterior', next: 'Próximo projeto', scroll: 'Scroll para explorar', swipe: 'Deslize para explorar', continue: 'Explore o que faço', keyboard: 'Use as setas para explorar os projetos da Gallery.' },
    about: {
      label: 'Um pouco sobre mim', title: 'SOBRE MIM',
      lead: 'Sou Camila. Desenvolvedora Front-end, com um olhar atento para a forma e para a experiência.',
      copy1: 'Meu trabalho une React, JavaScript, TypeScript e UI/UX na criação de landing pages, dashboards e sistemas web conectados a dados.',
      copy2: 'Também desenvolvo identidades visuais para projetos digitais, buscando uma experiência consistente entre marca, layout, interação e tecnologia.',
      education: 'Análise e Desenvolvimento de Sistemas', portrait: 'Retrato em preto e branco de Camila Lopes',
      skills: ['Front-end', 'Dados & backend', 'Ferramentas & design'], approach: 'Minha abordagem', manifesto: 'Do conceito à experiência.',
      manifestoSmall: 'Transformar uma ideia em um produto visual, funcional e navegável. Com atenção à identidade, aos detalhes e a quem está do outro lado.'
    },
    contact: {
      label: 'Próximo capítulo', title: ['VAMOS', 'CRIAR.'], status: 'Disponível para projetos selecionados',
      lead: 'Uma ideia, uma marca ou uma experiência para construir?', small: 'Conte um pouco sobre o que você tem em mente.',
      form: ['Nome', 'Email', 'O que vamos construir?', 'Sua ideia'],
      placeholders: ['Seu nome', 'voce@email.com', 'Site, dashboard, sistema web…', 'Contexto, referências e prazo.'],
      submit: 'Preparar email', copy: 'Copiar briefing', copied: 'Briefing copiado. Envie pelo canal combinado.',
      copyFallback: 'Selecione e copie o texto abaixo para compartilhar sua ideia.',
      opening: 'Seu aplicativo de email será aberto com a mensagem preparada.', briefHint: 'Organize sua ideia e compartilhe pelo canal combinado.',
      direct: 'Encontre-me também', resume: 'Currículo', top: 'Voltar ao início', rights: 'Todos os direitos reservados.'
    }
  },
  en: {
    lang: 'en', pageTitle: 'Camila Lopes — Front-end & UI/UX',
    nav: ['Projects', 'Gallery', 'Services', 'About', 'Contact'],
    menu: 'Menu', close: 'Close', skip: 'Skip to content', based: 'Rio de Janeiro, Brazil',
    loading: 'Loading portfolio',
    motion: { enable: 'Enable animations', reduce: 'Reduce motion' },
    hero: {
      role: 'Front-end Developer & UI/UX', edition: 'Portfolio / 2026',
      lead: 'Interfaces with intention. Digital experiences with identity.',
      work: 'Explore my work', contact: 'Let’s talk', scroll: 'Keep exploring',
      end: 'Where visual meets functional.', endSmall: 'Design, code and attention to detail.',
      photo: 'Black and white landscape of Rio de Janeiro', caption: 'A perspective from Rio.'
    },
    projects: {
      label: 'Selected work', title: 'PROJECTS', note: 'Ideas taking shape.',
      lead: 'A selection of interfaces I developed — from visual direction to the user experience.',
      view: 'Open project', details: 'About the project', next: 'Explore the other projects',
      responsibility: 'My contribution', stack: 'Technologies & tools', count: 'Featured project',
      scroll: 'Scroll to explore', continue: 'Keep exploring',
      status: { live: 'Live project', 'in-progress': 'In development', internal: 'Internal project' }
    },
    services: {
      label: 'What I do', title: ['WHAT', 'I DO'],
      lead: 'From the first sketch to a working interface. Visual direction, interaction and development in one process.', hint: 'Explore each area',
      items: [
        { name: 'Front-end', meta: 'React / Next.js / TypeScript', text: 'Responsive interfaces with structured components, thoughtful interactions and API integrations.' },
        { name: 'Landing pages', meta: 'Presentation / Conversion', text: 'Institutional websites and sales pages with clear hierarchy, visual identity and focused navigation.' },
        { name: 'Web systems', meta: 'Supabase / PostgreSQL / Prisma', text: 'Data-connected dashboards and management flows, with authentication and attention to the user experience.' },
        { name: 'UI & brand', meta: 'Identity / Experience / Motion', text: 'Visual direction for digital projects: typography, composition, interface and motion in a consistent language.' }
      ]
    },
    gallery: { label: 'More creations', title: 'GALLERY', lead: 'Different contexts. The same care.', small: 'E-commerce, visual identity, institutional interfaces and products in development.', inspect: 'Explore project', sequence: 'Gallery projects', previous: 'Previous project', next: 'Next project', scroll: 'Scroll to explore', swipe: 'Swipe to explore', continue: 'Explore what I do', keyboard: 'Use the arrow keys to browse Gallery projects.' },
    about: {
      label: 'A little about me', title: 'ABOUT ME', lead: 'I’m Camila. A Front-end Developer with an eye for form and experience.',
      copy1: 'My work combines React, JavaScript, TypeScript and UI/UX to build landing pages, dashboards and data-connected web systems.',
      copy2: 'I also create visual identities for digital projects, aligning brand, layout, interaction and technology into a consistent experience.',
      education: 'Systems Analysis and Development', portrait: 'Black and white portrait of Camila Lopes',
      skills: ['Front-end', 'Data & backend', 'Tools & design'], approach: 'My approach', manifesto: 'From concept to experience.',
      manifestoSmall: 'Turning an idea into a visual, functional and navigable product. With care for identity, the details and the people on the other side.'
    },
    contact: {
      label: 'Next chapter', title: ['LET’S', 'CREATE.'], status: 'Available for selected projects',
      lead: 'An idea, a brand or an experience to build?', small: 'Tell me a little about what you have in mind.',
      form: ['Name', 'Email', 'What are we building?', 'Your idea'],
      placeholders: ['Your name', 'you@email.com', 'Website, dashboard, web system…', 'Context, references and timeline.'],
      submit: 'Prepare email', copy: 'Copy brief', copied: 'Brief copied. Share it through your agreed channel.',
      copyFallback: 'Select and copy the text below to share your idea.', opening: 'Your email app will open with the prepared message.',
      briefHint: 'Prepare your brief and share it through your agreed channel.', direct: 'Find me also on', resume: 'Résumé', top: 'Back to top', rights: 'All rights reserved.'
    }
  },
  es: {
    lang: 'es', pageTitle: 'Camila Lopes — Front-end & UI/UX',
    nav: ['Proyectos', 'Gallery', 'Servicios', 'Sobre mí', 'Contacto'],
    menu: 'Menú', close: 'Cerrar', skip: 'Ir al contenido', based: 'Rio de Janeiro, Brasil',
    loading: 'Cargando portafolio',
    motion: { enable: 'Activar animaciones', reduce: 'Reducir movimiento' },
    hero: {
      role: 'Desarrolladora Front-end & UI/UX', edition: 'Portafolio / 2026',
      lead: 'Interfaces con intención. Experiencias digitales con identidad.',
      work: 'Conoce mi trabajo', contact: 'Hablemos', scroll: 'Sigue explorando',
      end: 'Entre lo visual y lo funcional.', endSmall: 'Diseño, código y atención al detalle.',
      photo: 'Paisaje en blanco y negro de Rio de Janeiro', caption: 'Una mirada desde Rio.'
    },
    projects: {
      label: 'Trabajo seleccionado', title: 'PROYECTOS', note: 'Ideas que toman forma.',
      lead: 'Una selección de interfaces que desarrollé — desde la dirección visual hasta la experiencia de uso.',
      view: 'Abrir proyecto', details: 'Sobre el proyecto', next: 'Explora los otros proyectos',
      responsibility: 'Mi participación', stack: 'Tecnologías y herramientas', count: 'Proyecto destacado',
      scroll: 'Scroll para explorar', continue: 'Sigue explorando',
      status: { live: 'En producción', 'in-progress': 'En desarrollo', internal: 'Proyecto interno' }
    },
    services: {
      label: 'Qué hago', title: ['LO QUE', 'HAGO'],
      lead: 'Del primer boceto a la interfaz que funciona. Dirección visual, interacción y desarrollo en un mismo proceso.', hint: 'Explora cada área',
      items: [
        { name: 'Front-end', meta: 'React / Next.js / TypeScript', text: 'Interfaces adaptables con componentes organizados, interacciones cuidadosas e integración con APIs.' },
        { name: 'Landing pages', meta: 'Presentación / Conversión', text: 'Sitios institucionales y páginas de venta con jerarquía clara, identidad visual y navegación objetiva.' },
        { name: 'Sistemas web', meta: 'Supabase / PostgreSQL / Prisma', text: 'Dashboards y flujos de gestión conectados a datos, con autenticación y atención a la experiencia de uso.' },
        { name: 'UI & marca', meta: 'Identidad / Experiencia / Movimiento', text: 'Dirección visual para proyectos digitales: tipografía, composición, interfaz y movimiento en un lenguaje consistente.' }
      ]
    },
    gallery: { label: 'Otras creaciones', title: 'GALLERY', lead: 'Diferentes contextos. El mismo cuidado.', small: 'E-commerce, identidad visual, interfaces institucionales y productos en desarrollo.', inspect: 'Explorar proyecto', sequence: 'Proyectos de Gallery', previous: 'Proyecto anterior', next: 'Siguiente proyecto', scroll: 'Scroll para explorar', swipe: 'Desliza para explorar', continue: 'Explora lo que hago', keyboard: 'Usa las flechas para explorar los proyectos de Gallery.' },
    about: {
      label: 'Un poco sobre mí', title: 'SOBRE MÍ', lead: 'Soy Camila. Desarrolladora Front-end, con atención a la forma y a la experiencia.',
      copy1: 'Mi trabajo une React, JavaScript, TypeScript y UI/UX para crear landing pages, dashboards y sistemas web conectados a datos.',
      copy2: 'También desarrollo identidades visuales para proyectos digitales, buscando coherencia entre marca, composición, interacción y tecnología.',
      education: 'Análisis y Desarrollo de Sistemas', portrait: 'Retrato en blanco y negro de Camila Lopes',
      skills: ['Front-end', 'Datos y backend', 'Herramientas y diseño'], approach: 'Mi enfoque', manifesto: 'Del concepto a la experiencia.',
      manifestoSmall: 'Transformar una idea en un producto visual, funcional y navegable. Con atención a la identidad, los detalles y las personas del otro lado.'
    },
    contact: {
      label: 'Próximo capítulo', title: ['VAMOS A', 'CREAR.'], status: 'Disponible para proyectos seleccionados',
      lead: '¿Una idea, una marca o una experiencia por construir?', small: 'Cuéntame un poco sobre lo que tienes en mente.',
      form: ['Nombre', 'Email', '¿Qué vamos a construir?', 'Tu idea'],
      placeholders: ['Tu nombre', 'tu@email.com', 'Sitio, dashboard, sistema web…', 'Contexto, referencias y plazo.'],
      submit: 'Preparar email', copy: 'Copiar briefing', copied: 'Briefing copiado. Compártelo por el canal acordado.',
      copyFallback: 'Selecciona y copia el texto de abajo para compartir tu idea.', opening: 'Tu aplicación de email se abrirá con el mensaje preparado.',
      briefHint: 'Prepara tu idea y compártela por el canal acordado.', direct: 'Encuéntrame también', resume: 'Currículum', top: 'Volver al inicio', rights: 'Todos los derechos reservados.'
    }
  }
};
