# Arquivo Central Ordo — v37

Projeto estático em HTML, CSS e JavaScript puro para consulta diegética do Arquivo Central e do dossiê **Operação Albânia**.

Funciona de dois jeitos:

1. Abrindo `index.html` direto no computador, por duplo clique.
2. Publicando no GitHub Pages.

Não precisa de servidor local para testar.

## Como testar localmente

Abra diretamente:

```text
index.html
```

Os dados ficam em arquivos `.js` para continuar funcionando via `file://`. Isso evita o bloqueio que alguns navegadores fazem quando um JSON puro é carregado por duplo clique.

## Como publicar no GitHub Pages

1. Suba todos os arquivos para a raiz do repositório.
2. Mantenha o `index.html` na raiz, junto de `.nojekyll`.
3. Ative em `Settings > Pages > Deploy from a branch`.
4. Escolha a branch principal e a pasta `/root`.

## Estrutura principal

```text
index.html                              home / Arquivo Central
verificacao-biometrica.html             biometria negada para registros lacrados
.nojekyll                               evita processamento Jekyll no GitHub Pages

data/records.js                         fonte única dos registros da home
css/home.css                            estilos da home
css/auth-denied.css                     estilos da biometria negada
js/records-store.js                     leitura/consulta dos registros centralizados
js/home.js                              lógica da home
js/auth-denied.js                       lógica da biometria negada
assets/                                 logos, digitais, selo e thumbnail

arquivos/operacao-albania/index.html    visualizador do dossiê
arquivos/operacao-albania/data/operation.js
arquivos/operacao-albania/css/viewer.css
arquivos/operacao-albania/js/viewer.js
arquivos/operacao-albania/images/       páginas do dossiê em alta qualidade
arquivos/operacao-albania/audio/        efeitos e ambiente normalizados
arquivos/operacao-albania/backgrounds/  fundos alternativos

docs/CRIAR_NOVA_OPERACAO.md             guia para expandir o projeto
docs/CHANGELOG_V36.md                   histórico da versão 36
docs/CHANGELOG_V37.md                   resumo das mudanças da versão 37
templates/operation-template/            base limpa para novas operações
```

## O que mudou na v37

- Foi adicionado um **Protocolo Mestre** secreto para o narrador: `Ctrl + Shift + O`.
- O dossiê agora salva sessão local: última página, zoom, fundo, modo UV, autenticação temporária, logs e achados UV.
- A luz UV cataloga fragmentos encontrados pelo jogador e mantém uma lista de achados.
- O visualizador registra logs técnicos dinâmicos, com opção de copiar ou limpar.
- A última página ganhou fechamento cinematográfico com contagem de fragmentos UV descobertos.

## O que mudou na v36

- Registros lacrados agora mostram diagnóstico próprio de lacre, motivo de bloqueio, integridade, última tentativa e fragmentos recuperados.
- O dossiê ganhou carregamento cinematográfico pós-biometria com progresso baseado no carregamento real de imagens e fundos.
- A operação agora usa um arquivo genérico `data/operation.js`, facilitando duplicar a estrutura para novas operações.
- Camadas ocultas do dossiê foram codificadas no arquivo de dados para reduzir spoilers casuais ao abrir o código-fonte.

## Manutenção

- Para criar, remover ou editar registros da home, edite `data/records.js`.
- Para editar páginas, transcrições, legendas, fundos, volumes e camadas periciais da Operação Albânia, edite `arquivos/operacao-albania/data/operation.js`.
- As 10 páginas da Operação Albânia foram mantidas em alta qualidade.
- O preload completo acontece depois da autenticação, como parte da experiência cinematográfica.
- A autenticação é apenas uma simulação visual para mesa/RPG, não um controle real de acesso.

## Checklist antes de enviar aos players

- Abrir `index.html` localmente.
- Entrar em Operação Albânia.
- Passar pela biometria concedida.
- Ver o carregamento cinematográfico finalizar.
- Navegar pelas 10 páginas.
- Testar zoom, arraste, modo UV e áudio após o primeiro clique.
- Testar o painel mestre com `Ctrl + Shift + O`.
- Testar se os achados UV aparecem no painel **Achados UV**.
- Testar se a sessão local volta para a última página após atualizar a página.
- Testar registros lacrados diferentes.
- Testar pelo link do GitHub Pages em celular e desktop.
## V38 — Previews dos registros lacrados

A home agora mostra imagens específicas no painel de preview da direita:

- `ARG-?????-III`: credencial de autorização pendente;
- `OP-?????-III`: capa da Operação Velada;
- demais lacrados: capa padrão de Registro Velado.

As imagens ficam em `assets/previews/` e são referenciadas pelo índice único `data/records.js`.

