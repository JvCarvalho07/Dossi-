# Changelog v36

## Experiência

- Registros lacrados ganharam diagnóstico próprio: motivo do lacre, risco, integridade, última tentativa de acesso e fragmentos recuperados.
- A tela de acesso negado agora usa informações específicas de cada registro lacrado.
- O visualizador ganhou carregamento cinematográfico após a biometria concedida.
- O carregamento usa progresso real das imagens e fundos preparados para navegação.

## Estrutura

- A Operação Albânia agora usa `arquivos/operacao-albania/data/operation.js` como arquivo genérico da operação ativa.
- O visualizador lê `window.OrdoActiveOperationData`, o que facilita reutilizar a mesma base para novas operações.
- `data/records.js` passou a guardar metadados de expansão, como `operationId`, `viewer` e `dataFile`.

## Anti-spoiler

- Camadas ocultas foram codificadas no arquivo de dados para reduzir spoilers casuais ao abrir o código-fonte.
- Documentação pública foi ajustada para evitar listar conteúdo oculto.

## Compatibilidade

- Continua funcionando por duplo clique em `index.html`.
- Continua funcionando no GitHub Pages.
- As imagens do dossiê foram mantidas em alta qualidade.
