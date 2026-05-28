// Fonte unica dos registros do Arquivo Central.
// Funciona abrindo index.html direto no computador e tambem no GitHub Pages.
// v38: previews visuais dos arquivos lacrados centralizados nos próprios registros.
window.OrdoRecordsData = {
  "records": [
    {
      "id": "alb",
      "code": "OP-2025-ALB-017",
      "title": "Operação Albânia",
      "kind": "Dossiê inicial",
      "level": "Delta",
      "status": "Lacrado",
      "state": "active",
      "url": "arquivos/operacao-albania/index.html",
      "subtitle": "Primeira triagem para consulta operacional.",
      "lines": [
        "último contato com a equipe foi perdido",
        "consulta completa depende de autenticação local"
      ],
      "strip": [
        {
          "label": "Nível",
          "value": "Delta",
          "tone": ""
        },
        {
          "label": "Status",
          "value": "Lacrado",
          "tone": "alert"
        },
        {
          "label": "Protocolo",
          "value": "Entrada protegida",
          "tone": ""
        }
      ],
      "previewImage": "assets/operacao-albania-thumb-grade.webp",
      "actionLabel": "Entrar no arquivo ›",
      "operationId": "operacao-albania",
      "viewer": "generic-static",
      "dataFile": "arquivos/operacao-albania/data/operation.js",
      "antiSpoiler": "camadas ocultas codificadas no pacote estático"
    },
    {
      "id": "r1",
      "code": "REG-????-III",
      "title": "Registro indisponível",
      "kind": "Registro",
      "level": "Restrito",
      "status": "Bloqueado",
      "state": "sealed",
      "subtitle": "Entrada protegida por autorização superior.",
      "lines": [
        "conteúdo indisponível para esta credencial",
        "autorização superior necessária"
      ],
      "deniedSubtitle": "Entrada protegida por autorização superior.",
      "sealedProfile": {
        "reason": "Acesso exige credencial permanente de campo e dupla autorização de comando.",
        "integrity": "91%",
        "lastAttempt": "03:11:42",
        "risk": "baixo",
        "fragments": [
          "cabeçalho recuperado",
          "conteúdo interno redigido",
          "assinatura de comando ausente"
        ],
        "log": [
          "restrição administrativa confirmada",
          "nenhum fragmento liberado para consulta temporária"
        ]
      },
      "actionLabel": "Consultar bloqueio ›",
      "previewImage": "assets/previews/registro-velado-padrao.webp"
    },
    {
      "id": "r2",
      "code": "OP-?????-III",
      "title": "Operação velada",
      "kind": "Operacional",
      "level": "Ômega",
      "status": "Bloqueado",
      "state": "sealed",
      "subtitle": "Operação não catalogada",
      "lines": [
        "identificação parcial recuperada",
        "metadados corrompidos"
      ],
      "deniedSubtitle": "Dossiê operacional não autorizado para esta credencial.",
      "sealedProfile": {
        "reason": "Operação removida do índice público após divergência entre relatório e baixa operacional.",
        "integrity": "36%",
        "lastAttempt": "00:17:09",
        "risk": "alto",
        "fragments": [
          "metadados incompletos",
          "rota de extração apagada",
          "três assinaturas conflitantes"
        ],
        "log": [
          "camada operacional encontrada",
          "metadados não reconciliados",
          "chave ômega ausente"
        ]
      },
      "actionLabel": "Consultar bloqueio ›",
      "previewImage": "assets/previews/operacao-velada.webp"
    },
    {
      "id": "r3",
      "code": "ARG-?????-III",
      "title": "Autorização pendente",
      "kind": "Autorização",
      "level": "Restrito",
      "status": "Lacrado",
      "state": "sealed",
      "subtitle": "Documento de autorização",
      "lines": [
        "requisição em espera",
        "assinatura de comando ausente"
      ],
      "deniedSubtitle": "Arquivo aguardando validação de comando superior.",
      "sealedProfile": {
        "reason": "Documento aguarda assinatura superior; consulta parcial cria inconsistência de protocolo.",
        "integrity": "74%",
        "lastAttempt": "12:48:33",
        "risk": "médio",
        "fragments": [
          "requisição preservada",
          "carimbo pendente",
          "destinatário oculto"
        ],
        "log": [
          "solicitação localizada",
          "assinatura não vinculada",
          "fila de autorização congelada"
        ]
      },
      "actionLabel": "Consultar bloqueio ›",
      "previewImage": "assets/previews/credencial-arg-pendente.webp"
    },
    {
      "id": "r4",
      "code": "TEC-????-III",
      "title": "Dados técnicos",
      "kind": "Relatório",
      "level": "Sigma",
      "status": "Bloqueado",
      "state": "sealed",
      "subtitle": "Dados de contenção",
      "lines": [
        "pacote técnico oculto",
        "protocolo de campo exigido"
      ],
      "deniedSubtitle": "Dados classificados fora do escopo da credencial temporária.",
      "sealedProfile": {
        "reason": "Dados técnicos podem comprometer procedimentos de contenção ainda ativos.",
        "integrity": "82%",
        "lastAttempt": "21:04:18",
        "risk": "alto",
        "fragments": [
          "tabela técnica presente",
          "parâmetros mascarados",
          "anexo de contenção indisponível"
        ],
        "log": [
          "protocolo sigma exigido",
          "pacote técnico isolado",
          "leitura interrompida por política de contenção"
        ]
      },
      "actionLabel": "Consultar bloqueio ›",
      "previewImage": "assets/previews/registro-velado-padrao.webp"
    },
    {
      "id": "r5",
      "code": "CAS-????-III",
      "title": "Caso arquivado",
      "kind": "Registro arquivado",
      "level": "Restrito",
      "status": "Bloqueado",
      "state": "sealed",
      "subtitle": "Caso histórico",
      "lines": [
        "registro histórico preservado",
        "credencial insuficiente"
      ],
      "deniedSubtitle": "Consulta bloqueada por retenção de arquivo.",
      "sealedProfile": {
        "reason": "Caso arquivado sob retenção histórica; liberação depende de revisão de sobreviventes.",
        "integrity": "68%",
        "lastAttempt": "08:22:51",
        "risk": "médio",
        "fragments": [
          "índice histórico encontrado",
          "relato civil suprimido",
          "anexo fotográfico ausente"
        ],
        "log": [
          "arquivo antigo convertido",
          "consulta temporária bloqueada",
          "retenção de arquivo ativa"
        ]
      },
      "actionLabel": "Consultar bloqueio ›",
      "previewImage": "assets/previews/registro-velado-padrao.webp"
    },
    {
      "id": "r6",
      "code": "MEM-0205-III",
      "title": "Memorando interno",
      "kind": "Memorando",
      "level": "Sigma",
      "status": "Bloqueado",
      "state": "sealed",
      "subtitle": "Comunicação interna",
      "lines": [
        "memorando não liberado",
        "destinatário desconhecido"
      ],
      "deniedSubtitle": "Comunicação interna indisponível para operador temporário.",
      "sealedProfile": {
        "reason": "Memorando interno tem destinatário não confirmado e cadeia de custódia incompleta.",
        "integrity": "57%",
        "lastAttempt": "17:39:06",
        "risk": "médio",
        "fragments": [
          "assunto preservado",
          "corpo do memorando lacrado",
          "remetente validado parcialmente"
        ],
        "log": [
          "rota interna localizada",
          "destinatário não resolvido",
          "assinatura sigma exigida"
        ]
      },
      "actionLabel": "Consultar bloqueio ›",
      "previewImage": "assets/previews/registro-velado-padrao.webp"
    },
    {
      "id": "r7",
      "code": "ANX-████-042",
      "title": "Anexo lacrado",
      "kind": "Anexo",
      "level": "Ômega",
      "status": "Lacrado",
      "state": "sealed",
      "subtitle": "Anexo operacional",
      "lines": [
        "anexo vinculado à operação",
        "liberação futura prevista"
      ],
      "deniedSubtitle": "Anexo criptografado com chave não encontrada.",
      "sealedProfile": {
        "reason": "Anexo vinculado à operação ativa; abertura antes da hora invalida sequência de campo.",
        "integrity": "44%",
        "lastAttempt": "03:17:00",
        "risk": "crítico",
        "fragments": [
          "chave do anexo ausente",
          "checksum instável",
          "índice vinculado à operação ativa"
        ],
        "log": [
          "anexo responde ao índice ativo",
          "chave não encontrada",
          "bloqueio por sequência operacional"
        ]
      },
      "actionLabel": "Consultar bloqueio ›",
      "previewImage": "assets/previews/registro-velado-padrao.webp"
    },
    {
      "id": "r8",
      "code": "LOG-2025-██",
      "title": "Registro corrompido",
      "kind": "Log parcial",
      "level": "Restrito",
      "status": "Corrompido",
      "state": "sealed",
      "subtitle": "Log danificado",
      "lines": [
        "fragmentos recuperados",
        "reconstrução pendente"
      ],
      "deniedSubtitle": "Fragmentos do log estão protegidos por validação superior.",
      "sealedProfile": {
        "reason": "Log reconstruído de setores danificados; leitura direta pode exibir dados falsos como válidos.",
        "integrity": "19%",
        "lastAttempt": "--:--:--",
        "risk": "instável",
        "fragments": [
          "timestamp quebrado",
          "origem duplicada",
          "fim do log irrecuperável"
        ],
        "log": [
          "fragmentos recuperados",
          "ordem temporal inválida",
          "consulta bloqueada para evitar contaminação de evidência"
        ]
      },
      "actionLabel": "Consultar bloqueio ›",
      "previewImage": "assets/previews/registro-velado-padrao.webp"
    }
  ]
};
