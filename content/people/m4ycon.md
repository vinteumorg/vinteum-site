---
name: m4ycon
image: /assets/images/people/illustrations/m4ycon.png
illustration: true
projectLabel: Peer Observer / BNOC
programs:
  - program: fellowship
    name: Fellowship
    organization: Vinteum
    role:
      EN: Fellow
      BR: Fellow
    status: current
    start: '2026-04'
    cohort: 2
    work:
      EN: Peer Observer / Bitcoin Network Operations Collective
      BR: Peer Observer / Bitcoin Network Operations Collective
    href: /programs/fellowship
  - program: bitcoin-dev-launchpad
    name: Bitcoin Dev Launchpad
    organization: Vinteum
    role:
      EN: Alumnus
      BR: Ex-participante
    status: past
    cohort: 2
    work:
      EN: Peer Observer
      BR: Peer Observer
    href: /programs/bitcoin-dev-launchpad
    fundedBy: Vinteum
focus:
  - P2P Networking
  - Monitoring
  - Metrics
links:
  - label: GitHub
    href: 'https://github.com/m4ycon'
    icon: github
projects:
  - name: peer-observer
    href: https://github.com/peer-observer/peer-observer
    description:
      EN: Tooling to monitor for P2P anomalies and attacks using Bitcoin Core honey pot nodes
      BR: Ferramentas para monitorar anomalias e ataques na rede P2P do Bitcoin.
    contribution:
      EN: Develops log-based network observability and dashboards for studying compact-block relay, measuring reconstruction behavior and investigating anomalies with instrumented Bitcoin nodes.
      BR: Desenvolve observabilidade de rede baseada em logs e dashboards para estudar a retransmissão de blocos compactos, medir a reconstrução e investigar anomalias com nós Bitcoin instrumentados.
  - name: Bitcoin Network Operations Collective
    href: https://bnoc.xyz/
    description:
      EN: "A decentralized initiative to monitor Bitcoin's peer-to-peer network, investigate attacks and anomalies, and feed measurements back into development. Connects contributors, monitoring infrastructure, datasets and analysis tools."
      BR: "Iniciativa descentralizada para monitorar a rede peer-to-peer do Bitcoin, investigar ataques e anomalias e levar evidências para o desenvolvimento do protocolo. Conecta colaboradores, infraestrutura de observação, conjuntos de dados e ferramentas de análise."
    contribution:
      EN: Publishes ongoing P2P measurement research and reproducible investigations, combining retained node logs, compact-block reconstruction analysis and controlled network experiments with public technical discussion.
      BR: Publica pesquisa contínua de medições P2P e investigações reproduzíveis, combinando logs preservados de nós, análise de reconstrução de blocos compactos e experimentos controlados de rede com discussão técnica pública.
contributions:
  - id: github-peer-observer-peer-observer-465
    title:
      EN: Add dashboards for compact block reconstruction metrics
      BR: Add dashboards for compact block reconstruction metrics
    date: '2026-10-20'
    source: 'peer-observer/peer-observer · #465'
    type: PR
    href: 'https://github.com/peer-observer/peer-observer/pull/465'
  - id: github-peer-observer-peer-observer-420
    title:
      EN: Watching compact block reconstructions via log-extractor
      BR: Watching compact block reconstructions via log-extractor
    date: '2026-06-30'
    source: 'peer-observer/peer-observer · #420'
    type: PR
    href: 'https://github.com/peer-observer/peer-observer/pull/420'
    description:
      EN: "Merged compact-block reconstruction monitoring, enabling analysis of when nodes reconstruct blocks immediately and when they must request additional transactions."
      BR: "Monitoramento de reconstrução de blocos compactos integrado, permitindo analisar quando nós reconstroem blocos imediatamente e quando precisam pedir transações adicionais."
  - id: compact-block-prefilling-measurements
    title:
      EN: Measuring a compact-block-prefilling proposal
      BR: Medições de uma proposta de pré-preenchimento de blocos compactos
    source: m4ycon/prefill-compact-blocks-review
    type: Research
    href: https://github.com/m4ycon/prefill-compact-blocks-review
    description:
      EN: 'Published node logs, parsed datasets and analysis notebooks for Bitcoin Core PR #35558, comparing
        useful and redundant prefill and compact-block reconstruction behavior.'
      BR: 'Publicou logs de nós, conjuntos de dados processados e notebooks de análise do PR #35558 do Bitcoin
        Core, comparando pré-preenchimento útil e redundante e o comportamento da reconstrução de blocos
        compactos.'
  - id: cluster-mempool-observer-recorder
    title:
      EN: Cluster Mempool Observer
      BR: Cluster Mempool Observer
    source: m4ycon/cluster-mempool-observer
    type: Tooling
    href: https://github.com/m4ycon/cluster-mempool-observer
    description:
      EN: Develops an experimental Bitcoin Core mempool recorder and analysis tool with a backend API and
        web interface. Data-integrity edge cases remain under investigation.
      BR: Desenvolve uma ferramenta experimental de gravação e análise do mempool do Bitcoin Core, com API
        de backend e interface web. Casos-limite de integridade dos dados seguem sob investigação.
  - id: bnoc-compact-block-warnet-investigation
    title:
      EN: Reproducing compact-block reconstruction degradation in Warnet
      BR: Reprodução da degradação de reconstrução de blocos compactos no Warnet
    source: Bitcoin Network Operations Collective
    type: Research
    date: '2026-11-04'
    href: https://bnoc.xyz/t/compact-block-reconstruction-degradation-between-september-october-2026/198/9
    description:
      EN: Published a controlled network experiment investigating how transaction-chain broadcasts and competing spends affect compact-block reconstruction, with reproducible scenarios and measurements of extra-pool capacity.
      BR: Publicou um experimento controlado de rede que investiga como a transmissão de cadeias de transações e gastos concorrentes afetam a reconstrução de blocos compactos, com cenários reproduzíveis e medições da capacidade do extra pool.
discussions:
  - id: compact-block-degradation
    title:
      EN: >-
        Compact block reconstruction degradation between September - October
        2026
      BR: >-
        Compact block reconstruction degradation between September - October
        2026
    source: Bitcoin Network Operations Collective
    date: '2026-10-22'
    href: >-
      https://bnoc.xyz/t/compact-block-reconstruction-degradation-between-september-october-2026/198
updatedAt: '2026-11-18'
---
## EN

m4ycon works on Bitcoin network observability and research tooling. His contributions to peer-observer track compact-block reconstruction, while his experimental work uses instrumented nodes, retained logs and mempool recording to investigate network behavior.

## PT

m4ycon trabalha em observabilidade da rede Bitcoin e ferramentas de pesquisa. Suas contribuições ao peer-observer acompanham a reconstrução de blocos compactos, enquanto seus experimentos usam nós instrumentados, logs preservados e gravação do mempool para investigar o comportamento da rede.
