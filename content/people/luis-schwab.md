---
name: Luis Schwab
image: /assets/images/people/illustrations/luis-schwab.webp
illustration: true
programs:
  - program: fellowship
    name: Fellowship
    organization: Vinteum
    role:
      EN: Fellow
      BR: Fellow
    status: past
    end: '2025-08'
    start: '2024-12'
    cohort: 1
    work:
      EN: BDK / Floresta
      BR: BDK / Floresta
    href: /programs/fellowship
    description:
      EN: "After Summer of Bitcoin work on BDK and Bitcoin Dev Launchpad, focused his Vinteum fellowship on bdk-floresta. Work on the integration, Floresta and Utreexo continued after the fellowship and remained in progress in August 2026."
      BR: "Após trabalho no BDK pelo Summer of Bitcoin e participação no Bitcoin Dev Launchpad, concentrou sua fellowship da Vinteum no bdk-floresta. O trabalho na integração, no Floresta e no Utreexo continuou após a fellowship e permanecia em andamento em agosto de 2026."
  - program: bitcoin-dev-launchpad
    name: Bitcoin Dev Launchpad
    organization: Vinteum
    role:
      EN: Alumnus
      BR: Ex-participante
    status: past
    cohort: 1
    work:
      EN: BDK / Floresta
      BR: BDK / Floresta
    href: /programs/bitcoin-dev-launchpad
    fundedBy: BDK Foundation
  - program: "summer-of-bitcoin"
    name: "Summer of Bitcoin"
    organization: "Summer of Bitcoin"
    role: {"EN": "Alumnus", "BR": "Ex-participante"}
    status: "past"
    cohort: 2024
    href: "https://www.summerofbitcoin.org/program-details/2024/r/rectcEvzVdwHh7gwb"
    work: {"EN": "BDK support for pruned Bitcoin Core nodes", "BR": "Suporte no BDK a nós Bitcoin Core podados"}
focus:
  - Wallets
  - Rust
  - Bitcoin Nodes
links:
  - label: GitHub
    href: 'https://github.com/luisschwab'
    icon: github
  - label: Blog
    icon: blog
    href: 'https://luisschwab.net/'
  - label: "X"
    href: "https://x.com/luisschwab_"
    icon: "twitter"
projects:
  - name: bdk-floresta
    href: https://github.com/luisschwab/bdk-floresta
    description:
      EN: Floresta-powered chain-source crate for Bitcoin Dev Kit wallets.
      BR: Crate de fonte de dados baseado no Floresta para carteiras Bitcoin Dev Kit.
    contribution:
      EN: Develops an in-progress integration for local wallet synchronization with an embedded validating node, connecting Floresta's node lifecycle, compact filters and wallet updates to BDK applications.
      BR: Desenvolve uma integração em andamento para sincronização local de carteiras com um nó validador integrado, conectando o ciclo de vida do nó Floresta, filtros compactos e atualizações da carteira a aplicações BDK.
  - name: Floresta
    href: https://github.com/getfloresta/Floresta
    description:
      EN: Lightweight Bitcoin node software using Utreexo, with embeddable Rust libraries.
      BR: Software de nó Bitcoin leve com Utreexo e bibliotecas Rust integráveis em outras aplicações.
    contribution:
      EN: Contributes node and wallet integration infrastructure, networking, logging and developer tooling, making Floresta easier to embed, operate and test in downstream applications.
      BR: Contribui para infraestrutura de integração de nós e carteiras, rede, logging e ferramentas de desenvolvimento, facilitando a integração, operação e teste do Floresta em outras aplicações.
  - name: Halfin
    href: https://github.com/luisschwab/halfin
    description:
      EN: Rust runner for Bitcoin nodes and indexers in integration tests.
      BR: Executor de nós e indexadores Bitcoin em Rust para testes de integração.
    contribution:
      EN: Develops and maintains a shared test runner for launching and coordinating different Bitcoin node and indexer implementations, with isolated process data, binary provisioning and cross-platform test tooling.
      BR: Desenvolve e mantém um executor de testes para iniciar e coordenar diferentes implementações de nós e indexadores Bitcoin, com dados de processos isolados, provisionamento de binários e ferramentas de teste multiplataforma.
contributions:
  - id: github-bitcoindevkit-rust-esplora-client-143
    title:
      EN: 'feat: implement missing methods'
      BR: 'feat: implement missing methods'
    date: '2025-12-10'
    source: 'bitcoindevkit/rust-esplora-client · #143'
    type: PR
    href: 'https://github.com/bitcoindevkit/rust-esplora-client/pull/143'
  - id: github-getfloresta-Floresta-523
    title:
      EN: 'feat!: use unique ports for Electrum'
      BR: 'feat!: use unique ports for Electrum'
    date: '2025-07-02'
    source: 'getfloresta/Floresta · #523'
    type: PR
    href: 'https://github.com/getfloresta/Floresta/pull/523'
  - id: bdk-floresta-validating-wallet-client
    title:
      EN: Connecting BDK wallets to Floresta
      BR: Integração de carteiras BDK com Floresta
    source: luisschwab/bdk-floresta
    type: Tooling
    href: https://github.com/luisschwab/bdk-floresta
    description:
      EN: Develops a work-in-progress Floresta-powered BDK chain-source crate for local wallet synchronization
        with an embedded validating node.
      BR: Desenvolve um crate de fonte de dados Floresta para o BDK, ainda em andamento, para sincronização
        local de carteiras com um nó validador integrado.
  - id: brasilia-bitdevs-university-courses
    title:
      EN: Brasília BitDevs seminar reading list
      BR: Lista de leituras do seminário do Brasília BitDevs
    source: ClubeBitcoinUnB/bitdevs.bsb.br/commits/034c95bd155b9fac2292216ef54aec7ea0e67437
    type: Documentation
    href: https://github.com/ClubeBitcoinUnB/bitdevs.bsb.br/commit/034c95bd155b9fac2292216ef54aec7ea0e67437
    description:
      EN: Added wallet-fingerprinting and Payjoin privacy research to the April 2026 Socratic Seminar reading
        list.
      BR: Acrescentou pesquisa sobre identificação de carteiras e privacidade do Payjoin à lista de leituras
        do Seminário Socrático de abril de 2026.
media:
  - id: optech-podcast-2026-04-21
    title:
      EN: 'Bitcoin Optech Newsletter #401 Recap Podcast'
      BR: 'Bitcoin Optech Newsletter #401 Recap Podcast'
    date: '2026-04-21'
    source: Bitcoin Optech
    badge: '#401'
    href: 'https://bitcoinops.org/en/podcast/2026/04/21/'
    description:
      EN: Guest on the recap of newsletter #401, introducing his work on wallet integrations with Utreexo.
      BR: Convidado no recap da newsletter #401, apresentando seu trabalho de integração de carteiras com Utreexo.
  - id: youtube-YU9jZ0zfD5Q
    title:
      EN: 'Floresta | Luis Schwab | bitcoin++ exploits edition | Feb 2026 Florianópolis, Brazil'
      BR: 'Floresta | Luis Schwab | bitcoin++ exploits edition | Feb 2026 Florianópolis, Brazil'
    date: '2026-03-16'
    source: bitcoin++
    href: https://www.youtube.com/watch?v=YU9jZ0zfD5Q
    mediaType: video
    thumbnail: /assets/images/people/media/luis-YU9jZ0zfD5Q.jpg
    description:
      EN: Talk on Floresta at the February 2026 bitcoin++ exploits edition in Florianópolis. Video published by bitcoin++ in March 2026.
      BR: Palestra sobre Floresta na edição bitcoin++ exploits de fevereiro de 2026, em Florianópolis. Vídeo publicado pelo canal bitcoin++ em março de 2026.
updatedAt: '2026-11-18'
affiliations:
  - organization: Human Rights Foundation (Bitcoin Development Fund)
    role: { EN: Grantee, BR: Grantee }
    status: current
    start: '2026-09'
    href: 'https://x.com/gladstein/status/2092304834770923522'
  - organization: Bitcoin Dev Kit Foundation
    role: { EN: Grantee, BR: Grantee }
    status: current
    start: '2025-09'
    href: 'https://bitcoindevkit.org/foundation/grantees/'
---
## EN

Luis Schwab contributes to Bitcoin wallet and node infrastructure in Rust. His work spans BDK clients, Floresta and Utreexo, including Esplora APIs, Electrum server configuration and an in-progress integration connecting BDK wallets to Floresta.

## PT

Luis Schwab contribui para infraestrutura de carteiras e nós Bitcoin em Rust. Seu trabalho abrange clientes do BDK, Floresta e Utreexo, incluindo APIs Esplora, configuração de servidores Electrum e uma integração em andamento entre carteiras BDK e Floresta.
