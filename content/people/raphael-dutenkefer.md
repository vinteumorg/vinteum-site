---
name: Raphael Dutenkefer
image: /assets/images/people/github/raphael-dutenkefer.jpg
updatedAt: '2026-11-18'
focus:
  - P2P Networking
  - Monitoring
  - Bitcoin Analysis
links:
  - label: GitHub
    href: 'https://github.com/dutenrapha'
    icon: github
  - label: "X"
    href: "https://x.com/dutenrapha"
    icon: "twitter"
programs:
  - program: fellowship
    name: Fellowship
    organization: Vinteum
    role:
      EN: Fellow
      BR: Fellow
    status: current
    work:
      EN: Bitcoin Network Operations Collective
      BR: Bitcoin Network Operations Collective
    start: '2026-10'
projects:
  - name: Bitcoin Network Operations Collective
    href: https://bnoc.xyz/
    description:
      EN: "A decentralized initiative to monitor Bitcoin's peer-to-peer network, investigate attacks and anomalies, and feed measurements back into development. Connects contributors, monitoring infrastructure, datasets and analysis tools."
      BR: "Iniciativa descentralizada para monitorar a rede peer-to-peer do Bitcoin, investigar ataques e anomalias e levar evidências para o desenvolvimento do protocolo. Conecta colaboradores, infraestrutura de observação, conjuntos de dados e ferramentas de análise."
    contribution:
      EN: "Develops network measurement and analysis tools, combining Bitcoin peer discovery with observations of public Electrum servers to study header propagation, network structure and potential shared infrastructure."
      BR: "Desenvolve ferramentas de medição e análise de rede, combinando descoberta de peers Bitcoin com observações de servidores Electrum públicos para estudar propagação de cabeçalhos, estrutura da rede e possíveis infraestruturas compartilhadas."
  - name: Bitcoin Topology Discovery
    href: 'https://github.com/dutenrapha/bitcoin-topology-discovery'
    description:
      EN: A crawler for observing the public Bitcoin peer-to-peer network.
      BR: Crawler para observar a rede pública peer-to-peer do Bitcoin.
    contribution:
      EN: "Develops a Bitcoin P2P measurement pipeline for discovering reachable peers and collecting handshake and address-relay observations for analysis. Its crawl data represents the peers observed, not a complete network topology."
      BR: "Desenvolve um pipeline de medição da rede P2P do Bitcoin para descobrir peers acessíveis e coletar observações de handshakes e retransmissão de endereços para análise. Os dados representam os peers observados, não uma topologia completa da rede."
contributions:
  - id: bitcoin-topology-crawler
    title:
      EN: Bitcoin P2P topology crawler
      BR: Crawler de topologia P2P do Bitcoin
    date: '2026-11-03'
    source: dutenrapha/bitcoin-topology-discovery · ff1cfe0
    type: Tooling
    href: >-
      https://github.com/dutenrapha/bitcoin-topology-discovery/commit/ff1cfe01b0c368b9524dbbcd24ec59137640e642
    description:
      EN: Discovers peers from DNS seeds, records announced IPv4 peers and successful handshakes,
        and produces event logs and validated Parquet exports. Observations provide a partial
        view of the network.
      BR: Descobre peers a partir de seeds DNS, registra peers IPv4 anunciados e handshakes
        bem-sucedidos e produz logs de eventos e exportações validadas para Parquet. As
        observações oferecem uma visão parcial da rede.
discussions:
  - id: bnoc-electrum-header-propagation
    title:
      EN: 'Electrum Server Monitoring: Header Propagation and Shared Infrastructure'
      BR: 'Electrum Server Monitoring: Header Propagation and Shared Infrastructure'
    date: '2026-08-25'
    source: Bitcoin Network Operations Collective
    href: >-
      https://bnoc.xyz/t/electrum-server-monitoring-header-propagation-and-shared-infrastructure/167
    description:
      EN: >-
        Research into block-header propagation timing across public Electrum
        servers.
      BR: >-
        Pesquisa sobre os tempos de propagação de cabeçalhos de blocos entre
        servidores Electrum públicos.
media:
  - id: raphael-data-science-alumni-2026
    title:
      EN: Data science for Bitcoin privacy and network research
      BR: Ciência de dados para privacidade e redes Bitcoin
    source: Vinteum · August 2026
    href: https://www.vinteum.org/blog/bitcoin-dev-launchpad-first-cohort-alumni-outlook
    description:
      EN: Explores data science for Bitcoin privacy and network research.
      BR: Explora ciência de dados para privacidade e pesquisa de redes Bitcoin.
    mediaType: article
---
## EN

Raphael Dutenkefer is a Vinteum fellow building tools to observe the Bitcoin P2P network. His work brings data science to Bitcoin privacy and network research through peer discovery, handshake observation and analysis of public network data.

## PT

Raphael Dutenkefer é fellow da Vinteum e desenvolve ferramentas de observação da rede P2P do Bitcoin. Seu trabalho aproxima ciência de dados, privacidade e pesquisa de redes por meio da descoberta de peers, observação de handshakes e análise de dados públicos.
