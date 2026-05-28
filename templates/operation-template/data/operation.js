// Template de dados de operação.
// Renomeie/copiei para arquivos/sua-operacao/data/operation.js.
window.OrdoActiveOperationData = {
  meta: {
    id: 'sua-operacao',
    code: 'OP-2026-XXX-001',
    title: 'Operação Sem Nome',
    level: 'Delta',
    status: 'Lacrado',
    version: 'v37',
    engine: 'ordo-static-dossier-viewer',
    viewer: 'generic-local-operation'
  },
  audio: {
    click: { src: 'audio/ui-click.mp3', volume: 0.48 },
    page: { src: 'audio/page-turn.mp3', volume: 0.34 },
    uvSwitch: { src: 'audio/uv-switch.mp3', volume: 0.42 },
    uvHum: { src: 'audio/uv-hum.mp3', volume: 0.10, loop: true },
    ambient: { src: 'audio/ambient-base.mp3', volume: 0.30, loop: true },
    authSuccess: { src: 'audio/auth-success.mp3', volume: 0.38 },
    error: { src: 'audio/ui-error.mp3', volume: 0.34 }
  },
  loader: {
    title: 'Indexação do dossiê',
    subtitle: 'Preparando pacote visual em alta resolução',
    steps: ['validando lacre operacional', 'indexando páginas do dossiê', 'liberando consulta local'],
    minimumMs: 1200
  },
  backgrounds: ['mesa.webp'],
  pages: [
    ['01-capa.webp', 'Capa']
  ],
  transcriptions: [
    ['Capa', 'Transcrição/resumo da página.']
  ],
  pageCaptions: [
    { k: 'Dossiê lacrado', t: 'Capa operacional', m: 'Inspeção recomendada' }
  ],
  hiddenLayers: {}
};
