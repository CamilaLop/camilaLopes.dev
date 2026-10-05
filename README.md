# Etapa 11 — Vídeos nos projetos

Luê Brand e Dashboard Analítico agora usam as gravações enviadas como fundo dos respectivos projetos. A composição, os textos, a camada de contraste, a navegação e a animação de troca entre projetos continuam com o mesmo layout.

Os dois vídeos foram convertidos para MP4/H.264, em 1920×994, a 30 fps e sem áudio. As gravações completas foram mantidas: cerca de 82 segundos para Luê Brand e 69 segundos para o dashboard. Os arquivos para a web têm aproximadamente 8,2 MB e 3,5 MB, respectivamente.

## Abrir o projeto

Extraia este ZIP em uma pasta nova. Dentro de `portfolio-new-main`, execute:

```bash
npm ci
npm run dev -- --force
```

Abra http://127.0.0.1:5173. Requer Node.js 22.12 ou posterior. A pasta `dist` já contém esta versão compilada; `npm run build` gera uma nova compilação.

## Reprodução

O vídeo começa sem áudio quando seu projeto está visível. Ao trocar de projeto ou sair da seção, a reprodução para. O botão no canto superior direito permite pausar e continuar cada vídeo de forma independente, com clique, toque, Enter ou Espaço. A pausa escolhida é mantida ao sair do projeto e voltar.

Na preferência por movimento reduzido, os projetos exibem suas imagens estáticas originais. As imagens dos detalhes dos projetos também permanecem iguais. O vídeo compartilhado entre o hero e Igor Guia continua com seu próprio controle de reprodução.

## Vídeos e arquivos desta alteração

- `public/assets/projects/lue-brand.mp4`: gravação de tela do sistema Luê Brand.
- `public/assets/projects/sales-dashboard.mp4`: gravação do dashboard interativo de vendas e estoque.
- `src/data/projectMedia.ts`: associação dos vídeos e imagens de espera aos dois projetos.
- `src/components/Projects.tsx`: reprodução do projeto visível e controles individuais de pausa.

Para substituir um vídeo futuramente, troque o arquivo MP4 correspondente em `public/assets/projects/` e execute `npm run build`. As imagens usadas antes do vídeo carregar estão definidas em `src/data/projectMedia.ts`.

Todos os outros arquivos em `src`, os estilos, a configuração e os assets existentes em `public` permanecem iguais aos da etapa 10. A Gallery 3D, o semicírculo dos serviços, o hover escuro, a abertura suave dos serviços e a entrada de About me continuam na versão entregue.

## Prévia e verificação

`PREVIEW/projetos-com-videos.mp4` mostra os dois projetos com seus vídeos, a troca entre eles e os controles de pausa. As capturas desta etapa ficam em `PREVIEW`. A prévia e o README da etapa 10 foram guardados em `PREVIEW/etapas-anteriores/etapa-10/`.

A compilação TypeScript/Vite foi concluída. Em 1440×900 e 390×844, foram conferidos o vídeo correto de cada projeto, a reprodução, a pausa e a retomada, o teclado ou toque, a pausa dos projetos fora de exibição, a manutenção da pausa ao voltar e a saída para a Gallery. Os controles também foram conferidos nos três idiomas e as imagens estáticas foram verificadas com movimento reduzido.

A verificação automatizada WCAG 2 A/AA e 2.1 AA pelo axe não apontou violações na seção Projects no desktop. Não houve erros de página nem falhas de carregamento nos cenários verificados. Os resultados, os dados dos vídeos e a comparação dos arquivos com a etapa 10 estão em `PREVIEW/verificacao.json`.
