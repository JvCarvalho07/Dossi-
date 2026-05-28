# Mapa de áudio — Operação Albânia v37

Arquivos usados pelo visualizador em `arquivos/operacao-albania/js/viewer.js`.
A configuração de volume fica centralizada em `arquivos/operacao-albania/data/operation.js`.

- `ui-click.mp3`: cliques de interface.
- `page-turn.mp3`: troca de página.
- `uv-switch.mp3`: ativar/desativar luz UV.
- `uv-hum.mp3`: loop sutil enquanto a luz UV está ativa.
- `ambient-base.mp3`: ambiência de fundo iniciada após interação do usuário.
- `auth-success.mp3`: autenticação concedida.
- `ui-error.mp3`: erro/acesso negado.

Tratamento mantido:
- efeitos normalizados com limite de pico para evitar estouro;
- ambiência reduzida no mix para não cobrir leitura;
- `uv-hum` mantido baixo e contínuo para funcionar como textura;
- volume final controlado no objeto `audio` do arquivo de dados da operação.
