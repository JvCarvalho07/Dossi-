# Como criar uma nova operação

A v37 já está preparada para copiar a estrutura da Operação Albânia e criar outros dossiês sem mexer no motor principal.

## 1. Copie a pasta base

Copie:

```text
arquivos/operacao-albania/
```

Para algo como:

```text
arquivos/operacao-nova/
```

## 2. Edite o arquivo da operação

Dentro da nova pasta, edite:

```text
arquivos/operacao-nova/data/operation.js
```

Troque:

- `meta.id`
- `meta.code`
- `meta.title`
- `meta.level`
- `pages`
- `transcriptions`
- `pageCaptions`
- `backgrounds`
- `audio`, se quiser volumes diferentes

## 3. Troque as imagens

Coloque as páginas em:

```text
arquivos/operacao-nova/images/
```

E atualize a lista `pages` no `operation.js`.

## 4. Adicione o registro na home

Edite:

```text
data/records.js
```

Adicione um novo item em `records` com `state: "active"` ou `state: "sealed"`.

Para operação aberta:

```js
{
  "id": "nova",
  "code": "OP-2026-NOV-001",
  "title": "Operação Nova",
  "kind": "Dossiê operacional",
  "level": "Delta",
  "status": "Lacrado",
  "state": "active",
  "url": "arquivos/operacao-nova/index.html",
  "operationId": "operacao-nova",
  "viewer": "generic-static",
  "dataFile": "arquivos/operacao-nova/data/operation.js"
}
```

Para registro lacrado, use `state: "sealed"` e preencha `sealedProfile` para a tela de acesso negado ficar única.

## 5. Teste local e online

- Abra `index.html` por duplo clique.
- Teste o novo registro.
- Depois publique no GitHub Pages.

## Observação anti-spoiler

Em projeto estático, não existe segredo real para quem abrir o código. A codificação das camadas ocultas serve para evitar spoiler casual, não para proteger informação contra alguém determinado.
