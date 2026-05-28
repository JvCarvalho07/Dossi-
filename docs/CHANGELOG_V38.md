# V38 — Previews visuais dos arquivos lacrados

## Ajuste principal

A home do Arquivo Central agora mostra capas/imagens específicas no painel de preview da direita.

- `ARG-?????-III / Autorização pendente` usa a credencial de autorização pendente.
- `OP-?????-III / Operação velada` usa a capa específica da Operação Velada.
- Demais registros lacrados usam a capa padrão `Registro Velado / Lacrado`.

## Arquivos novos

```text
assets/previews/credencial-arg-pendente.webp
assets/previews/operacao-velada.webp
assets/previews/registro-velado-padrao.webp
```

## Ajustes técnicos

- As imagens foram convertidas para WebP para ficarem leves no GitHub Pages.
- Os previews continuam definidos no índice central `data/records.js`.
- O CSS da home foi ajustado para não deixar capas lacradas quase invisíveis.

