# Changelog v37 — sessão e controle narrativo

## Principais mudanças

- Adicionado **Protocolo Mestre** secreto para o narrador, aberto com `Ctrl + Shift + O`.
- Adicionada persistência local da sessão por operação:
  - última página aberta;
  - zoom;
  - fundo escolhido;
  - preset UV;
  - autenticação temporária restaurável;
  - achados UV;
  - logs técnicos.
- Adicionado painel **Achados UV**.
- Adicionado painel **Logs técnicos**.
- A luz UV agora cataloga fragmentos quando o jogador aproxima o feixe de uma anotação oculta.
- A tela final do dossiê mostra o progresso de fragmentos UV descobertos.
- O painel mestre permite:
  - liberar o dossiê sem passar pela biometria;
  - alternar UV;
  - ir para capa/final;
  - abrir página direta;
  - catalogar achados da página atual;
  - resetar a sessão local.

## Compatibilidade

- Continua funcionando por duplo clique no `index.html`.
- Continua funcionando no GitHub Pages.
- Não exige servidor local, build, dependências ou backend.

## Observação de segurança

O painel mestre e a codificação anti-spoiler são recursos de conveniência e ambientação. Como o projeto é estático e publicado no GitHub Pages, nada disso deve ser tratado como segurança real.
