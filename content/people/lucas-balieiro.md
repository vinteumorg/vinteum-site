---
name: Lucas Balieiro
image: /assets/images/people/illustrations/lucas-balieiro.png
illustration: true
location:
  EN: Brazil
  BR: Brasil
programs:
  - program: fellowship
    name: Fellowship
    organization: Vinteum
    role:
      EN: Fellow
      BR: Fellow
    status: past
    end: '2026-01'
    start: '2025-03'
    cohort: 1
    work:
      EN: Stratum V2
      BR: Stratum V2
    href: /programs/fellowship
    description:
      EN: "Entered through Bitcoin Dev Launchpad and joined a Vinteum fellowship working on solo-mining tooling (PlebLottery and tower-stratum) and the Stratum V2 Reference Implementation, then continued with independent support."
      BR: "Entrou pelo Bitcoin Dev Launchpad e ingressou em uma fellowship da Vinteum para trabalhar em ferramentas de mineração solo (PlebLottery e tower-stratum) e na implementação de referência do Stratum V2, seguindo depois com apoio independente."
  - program: bitcoin-dev-launchpad
    name: Bitcoin Dev Launchpad
    organization: Vinteum
    role:
      EN: Alumnus
      BR: Ex-participante
    status: past
    cohort: 1
    work:
      EN: Stratum V2
      BR: Stratum V2
    href: /programs/bitcoin-dev-launchpad
    fundedBy: OpenSats
focus:
  - Stratum V2
  - Mining
  - Fuzzing
  - Interoperability
links:
  - label: GitHub
    href: 'https://github.com/lucasbalieiro'
    icon: github
  - label: Blog
    href: 'https://lucasbalieiro.dev'
    icon: blog
projects:
  - name: Stratum V2
    href: https://github.com/stratum-mining/stratum
    current: true
    description:
      EN: Rust protocol libraries for the Stratum V2 mining ecosystem.
      BR: Bibliotecas de protocolo em Rust para o ecossistema de mineração Stratum V2.
    contribution:
      EN: Works across the low-level crates on fuzzing, message validation (including F32 serialization), no_std support and specification conformance. Built fuzz targets for SV1, Noise and protocol messages, found parser and arithmetic bugs, and helped split the protocol libraries from the mining applications.
      BR: Trabalha nas crates de baixo nível com fuzzing, validação de mensagens (incluindo serialização de F32), suporte a no_std e conformidade com a especificação. Criou alvos de fuzzing para SV1, Noise e mensagens do protocolo, encontrou bugs de parsing e aritmética e ajudou a separar as bibliotecas de protocolo das aplicações de mineração.
  - name: interoperability-tests-sv2
    href: https://github.com/stratum-mining/interoperability-tests-sv2
    current: true
    description:
      EN: Specification-conformance testing across Stratum V2 implementations.
      BR: Testes de conformidade com a especificação entre implementações Stratum V2.
    contribution:
      EN: Leads the project; shaped the runner/scenario split and coverage catalog, reviewed the bootstrap, and built hostname resolution and protocol scenarios for third-party deployments.
      BR: Lidera o projeto; definiu a separação entre runner e cenários e o catálogo de cobertura, revisou o bootstrap e implementou resolução de hostnames e cenários de protocolo para instalações de terceiros.
  - name: sv2-ui
    href: https://github.com/stratum-mining/sv2-ui
    current: true
    description:
      EN: Setup wizard and monitoring dashboard for Stratum V2 mining.
      BR: Assistente de configuração e dashboard de monitoramento para mineração Stratum V2.
    contribution:
      EN: Maintains the application and led its Umbrel App Store packaging. Hardened authentication, filesystem and log handling after a security audit, and added container auto-start and diagnostics. Works on regtest support and end-to-end test coverage.
      BR: Mantém a aplicação e liderou seu empacotamento para a Umbrel App Store. Reforçou autenticação, manipulação de arquivos e logs após uma auditoria de segurança, e adicionou inicialização automática de contêineres e diagnósticos. Trabalha em suporte a regtest e cobertura de testes ponta a ponta.
  - name: sv2-apps
    href: https://github.com/stratum-mining/sv2-apps
    current: true
    description:
      EN: Stratum V2 pool and miner applications, currently in alpha.
      BR: Aplicações de pool e mineração Stratum V2, atualmente em estágio alfa.
    contribution:
      EN: Implements the pool's solo-mining mode and maintains release and deployment infrastructure, including Docker images, prebuilt binaries, config validation and a CI flow that pairs breaking protocol changes with application pull requests.
      BR: Implementa o modo de mineração solo da pool e mantém a infraestrutura de release e implantação, incluindo imagens Docker, binários pré-compilados, validação de configuração e um fluxo de CI que vincula mudanças incompatíveis de protocolo a pull requests nas aplicações.
contributions:
  - id: stratum-sv1-fuzz-targets
    title:
      EN: SV1 fuzz targets for the translator proxy
      BR: Alvos de fuzzing do SV1 para o translator proxy
    date: '2026-07-08'
    source: 'stratum-mining/stratum · #2220'
    type: PR
    href: 'https://github.com/stratum-mining/stratum/pull/2220'
    description:
      EN: Added wire-level and method-parser fuzz targets for the SV1 crate, the parsing path used by the translator proxy. The targets exposed panics and reachable unwraps that were fixed in follow-up changes.
      BR: Adicionou alvos de fuzzing para o parser de rede e de métodos da crate SV1, caminho usado pelo translator proxy. Os alvos revelaram panics e unwraps alcançáveis, corrigidos em mudanças seguintes.
  - id: stratum-noise-fuzz-target
    title:
      EN: Noise handshake fuzz target
      BR: Alvo de fuzzing do handshake Noise
    date: '2026-03-17'
    source: 'stratum-mining/stratum · #2106'
    type: PR
    href: 'https://github.com/stratum-mining/stratum/pull/2106'
    description:
      EN: Added fuzzing for the Noise handshake and encryption roundtrip. Its first finding was an arithmetic overflow in certificate-validity calculation, fixed in #2104.
      BR: Adicionou fuzzing para o handshake Noise e para o roundtrip de criptografia. Seu primeiro achado foi um overflow aritmético no cálculo de validade de certificados, corrigido em #2104.
  - id: sv2-apps-solo-mining-mode
    title:
      EN: Solo mining mode for the pool
      BR: Modo de mineração solo para a pool
    date: '2026-03-18'
    source: 'stratum-mining/sv2-apps · #321'
    type: PR
    href: 'https://github.com/stratum-mining/sv2-apps/pull/321'
    description:
      EN: Added a solo-mining mode with solo and donation identities derived from `user_identity`, adjusting coinbase output constraints per miner.
      BR: Adicionou um modo de mineração solo com identidades de solo e doação derivadas de `user_identity`, ajustando as restrições de output da coinbase por minerador.
  - id: sv2-ui-authenticated-api
    title:
      EN: Authenticated API and same-origin enforcement
      BR: API autenticada e verificação de mesma origem
    date: '2026-09-11'
    source: 'stratum-mining/sv2-ui · #248'
    type: PR
    href: 'https://github.com/stratum-mining/sv2-ui/pull/248'
    description:
      EN: Introduced authentication for the API and control routes and replaced wildcard CORS with same-origin enforcement, closing the highest-impact findings from the security audit.
      BR: Introduziu autenticação nas rotas de API e controle e substituiu o CORS aberto por verificação de mesma origem, encerrando os achados de maior impacto da auditoria de segurança.
  - id: umbrel-app-store
    title:
      EN: Stratum V2 UI in the Umbrel App Store
      BR: Stratum V2 UI na Umbrel App Store
    date: '2026-06-11'
    source: 'getumbrel/umbrel-apps · #5721'
    type: PR
    href: 'https://github.com/getumbrel/umbrel-apps/pull/5721'
    description:
      EN: Packaged sv2-ui for Umbrel, including a Docker-in-Docker mode for Umbrel OS, and published it in the Umbrel App Store.
      BR: Empacotou o sv2-ui para o Umbrel, incluindo um modo Docker-in-Docker para o Umbrel OS, e publicou o app na Umbrel App Store.
  - id: sv2-apps-docker-release
    title:
      EN: Docker images and compose setup for sv2-apps
      BR: Imagens Docker e configuração compose para o sv2-apps
    date: '2025-11-27'
    source: 'stratum-mining/sv2-apps · #85'
    type: PR
    href: 'https://github.com/stratum-mining/sv2-apps/pull/85'
    description:
      EN: Added multi-platform Docker image builds and a docker-compose setup for the Stratum V2 applications, complementing the prebuilt binary releases.
      BR: Adicionou builds multi-plataforma de imagens Docker e uma configuração docker-compose para as aplicações Stratum V2, complementando as releases com binários pré-compilados.
  - id: sv2-interoperability-hostname-targets
    title:
      EN: Hostname targets and CLI reporting
      BR: Alvos por hostname e relatórios da CLI
    date: '2026-11-13'
    source: 'stratum-mining/interoperability-tests-sv2 · #24'
    type: PR
    href: 'https://github.com/stratum-mining/interoperability-tests-sv2/pull/24'
    description:
      EN: Added hostname and `host:port` parsing to the target configuration, with concurrent DNS resolution and summarized CLI output, so the compliance suite can test remote deployments.
      BR: Adicionou parsing de hostnames e `host:port` à configuração de alvos, com resolução DNS concorrente e saída resumida na CLI, permitindo testar instalações remotas com a suíte de conformidade.
writing:
  - id: naive-stratum-v2-packet-analysis
    title:
      EN: A naive analysis of Stratum V2 network traffic
      BR: A naive analysis of Stratum V2 network traffic
    date: '2026-09-02'
    source: lucasbalieiro.dev
    href: 'https://lucasbalieiro.dev/blog/naive-stratum-v2-packet-analysis/'
    description:
      EN: Packet-level study of a local Stratum V2 solo-mining setup on regtest without decrypting Noise, documenting what message size, direction and timing reveal about handshake, job and share flows, and the limits of those observations.
      BR: Estudo em nível de pacote de uma instalação local de mineração solo Stratum V2 em regtest sem descriptografar o Noise, documentando o que tamanho, direção e timing das mensagens revelam sobre handshake, jobs e shares, e os limites dessas observações.
updatedAt: '2026-11-18'
affiliations:
  - organization: OpenSats
    role: { EN: Grantee, BR: Grantee }
    status: current
    start: '2026-01'
    href: 'https://opensats.org/blog/sixteenth-wave-of-bitcoin-grants'
---
## EN

Lucas Balieiro is an OpenSats grantee working on the Stratum V2 Reference Implementation for Bitcoin mining. He maintains sv2-ui, leads interoperability testing across implementations, and focuses on fuzzing and protocol security.

## PT

Lucas Balieiro é grantee da OpenSats e trabalha na implementação de referência do Stratum V2 para mineração Bitcoin. Mantém o sv2-ui, lidera os testes de interoperabilidade entre implementações e foca em fuzzing e segurança do protocolo.
