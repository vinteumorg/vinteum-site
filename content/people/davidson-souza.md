---
name: Davidson Souza
image: /assets/images/people/illustrations/davidson-souza.png
illustration: true
location:
  EN: Brazil
  BR: Brasil
programs:
  - program: grants
    name: Grants
    organization: Vinteum
    role:
      EN: Grantee
      BR: Grantee
    status: current
    work:
      EN: Floresta
      BR: Floresta
    href: /programs/grants
  - program: "summer-of-bitcoin"
    name: "Summer of Bitcoin"
    organization: "Summer of Bitcoin"
    role: {"EN": "Alumnus", "BR": "Ex-participante"}
    status: "past"
    cohort: 2022
    href: "https://www.summerofbitcoin.org/program-details/2022/r/recPLKAWw1UFZb7Sl"
    work: {"EN": "Rust Utreexo library", "BR": "Biblioteca Utreexo em Rust"}
focus:
  - Utreexo
  - Bitcoin Nodes
  - Rust
  - P2P Networking
links:
  - label: GitHub
    href: 'https://github.com/Davidson-Souza'
    icon: github
  - label: X
    href: 'https://x.com/Erik17192799'
    icon: twitter
  - label: Nostr
    href: >-
      https://primal.net/p/nprofile1qqswpna42jwnea7mfcnnd78phjz0vfyx4aayz22ase7x5vf5tyzz22qjdj9cx
    icon: nostr
  - label: Blog
    href: 'https://blog.dlsouza.lol'
    icon: blog
projects:
  - name: Floresta
    href: 'https://github.com/getfloresta/Floresta'
    description:
      EN: 'A resource-efficient Bitcoin node written in Rust, powered by Utreexo.'
      BR: >-
        Um nó Bitcoin em Rust que usa Utreexo para reduzir os recursos
        necessários à validação.
    contribution:
      EN: Creator; node architecture, wallet integration and synchronization. Reviews work across
        Floresta and rustreexo, strengthens security and testing, and introduced a public roadmap.
        Combines manual analysis, automated tests and monitoring to investigate defects, simplify
        the codebase and remove synchronization bottlenecks.
      BR: Criador; arquitetura do nó, integração com carteiras e sincronização. Revisa contribuições
        em Floresta e rustreexo, fortalece segurança e testes e criou um roadmap público. Combina
        análise manual, testes automatizados e monitoramento para investigar defeitos, simplificar
        o código e remover gargalos de sincronização.
    current: true
  - name: Rustreexo
    href: 'https://github.com/mit-dci/rustreexo'
    description:
      EN: A Rust implementation of the Utreexo accumulator.
      BR: Implementação do acumulador Utreexo em Rust.
    contribution:
      EN: 'Accumulator implementation, proof handling and implicit deletions.'
      BR: 'Implementação do acumulador, tratamento de provas e deleções implícitas.'
    current: true
  - name: Castor
    href: 'https://github.com/getfloresta/castor'
    description:
      EN: Bridge infrastructure that generates and serves Utreexo proofs.
      BR: Infraestrutura de bridge para gerar e servir provas Utreexo.
    contribution:
      EN: Parallel forest construction and BIP324 peer-to-peer transport.
      BR: Construção paralela da floresta e transporte P2P com BIP324.
    current: true
contributions:
  - id: utreexo-bips
    title:
      EN: 'Utreexo protocol specifications: BIPs 181, 182 and 183'
      BR: 'Especificações do protocolo Utreexo: BIPs 181, 182 e 183'
    source: utreexo/biptreexo · Draft
    type: Protocol Specification
    featured: true
    href: 'https://github.com/utreexo/biptreexo'
    description:
      EN: >-
        Co-authored with Tadge Dryja and Calvin Kim. The three drafts specify
        the Utreexo accumulator, transaction and block validation, and peer
        services.
      BR: >-
        Coautoria com Tadge Dryja e Calvin Kim. Os três drafts especificam o
        acumulador Utreexo, a validação de transações e blocos e os serviços
        entre peers.
  - id: castor-27
    title:
      EN: Parallel forest building for efficient sync
      BR: Parallel forest building for efficient sync
    source: 'getfloresta/castor · #27'
    href: 'https://github.com/getfloresta/castor/pull/27'
    date: '2026-10-19'
    description:
      EN: >-
        Uses spent-output hints and implicit deletions to build the Utreexo
        forest concurrently. Merged October 2026.
      BR: >-
        Usa informações sobre outputs gastos e deleções implícitas para
        construir a floresta Utreexo em paralelo. Integrado em outubro de 2026.
    type: PR
  - id: castor-26
    title:
      EN: BIP324 transport and peer protections
      BR: BIP324 transport and peer protections
    source: 'getfloresta/castor · #26'
    href: 'https://github.com/getfloresta/castor/pull/26'
    date: '2026-10-09'
    description:
      EN: >-
        Introduces encrypted P2Pv2 transport, connection limits and per-peer
        rate limits.
      BR: >-
        Introduz transporte criptografado P2Pv2, limites de conexão e limites de
        requisições por peer.
    type: PR
  - id: floresta-1252
    title:
      EN: Fuzz testing for Floresta transport
      BR: Fuzz testing for Floresta transport
    source: 'getfloresta/Floresta · #1252'
    href: 'https://github.com/getfloresta/Floresta/pull/1252'
    date: '2026-10-06'
    description:
      EN: >-
        Exercises the network transport with fuzzer-generated inputs, including
        malformed messages.
      BR: >-
        Testa o transporte de rede com entradas geradas por fuzzing, incluindo
        mensagens malformadas.
    type: PR
  - id: rustreexo-81
    title:
      EN: Implicit deletions and a leaner Stump API
      BR: Implicit deletions and a leaner Stump API
    source: 'mit-dci/rustreexo · #81'
    href: 'https://github.com/mit-dci/rustreexo/pull/81'
    date: '2026-08-07'
    description:
      EN: >-
        Separates proof-update data from accumulator modification and enables
        additions that account for already-spent outputs.
      BR: >-
        Separa os dados de atualização de provas da modificação do acumulador e
        permite adições que consideram outputs já gastos.
    type: PR
  - id: floresta-ffi-11
    title:
      EN: Android builds and Maven packaging for Floresta
      BR: Android builds and Maven packaging for Floresta
    source: 'getfloresta/floresta-ffi · #11'
    href: 'https://github.com/getfloresta/floresta-ffi/pull/11'
    date: '2026-07-02'
    description:
      EN: >-
        Integrates native library and binding builds with Gradle, simplifying
        Floresta integration in Android applications.
      BR: >-
        Integra a compilação da biblioteca e dos bindings ao Gradle, facilitando
        o uso do Floresta em aplicativos Android.
    type: PR
  - id: davidson-souza-sync-designs
    title:
      EN: Testing and review of SwiftSync accumulator building
      BR: Testes e revisão da construção do acumulador com SwiftSync
    date: '2026-10-15'
    source: 'getfloresta/Floresta · #1115'
    type: Code Review
    href: https://github.com/getfloresta/Floresta/pull/1115#pullrequestreview-5537204929
    description:
      EN: Reviewed JoseSK999’s assume-valid SwiftSync implementation and reported completing mainnet initial
        block download on several machines. The implementation was merged in October 2026.
      BR: Revisou a implementação assume-valid de SwiftSync de JoseSK999 e relatou concluir o download
        inicial da mainnet em várias máquinas. A implementação foi integrada em outubro de 2026.
  - id: davidson-souza-compact-filter-rescans
    title:
      EN: FiltersMan for compact-filter downloads and rescans
      BR: FiltersMan para download de filtros compactos e buscas históricas
    date: '2026-09-17'
    source: 'getfloresta/Floresta · #1338'
    type: PR
    href: https://github.com/getfloresta/Floresta/pull/1338
    description:
      EN: Proposed a service that stores filter headers, fetches and verifies filters on demand and pages
        rescan results to bound memory use. The pull request remains open and marked work in progress.
      BR: Propôs um serviço que armazena cabeçalhos de filtros, busca e verifica filtros sob demanda e
        pagina resultados de buscas históricas para limitar o uso de memória. O pull request segue aberto
        e marcado como trabalho em andamento.
discussions:
  - id: implicit-deletions
    title:
      EN: Implicit Deletions and Improvements in Utreexo IBD
      BR: Implicit Deletions and Improvements in Utreexo IBD
    source: Delving Bitcoin
    href: >-
      https://delvingbitcoin.org/t/implicit-deletions-and-improvements-in-utreexo-ibd/2881
    date: 2026-09
  - id: pow-fraud-proofs
    title:
      EN: PoW fraud proofs and Light clients
      BR: PoW fraud proofs and Light clients
    source: Delving Bitcoin
    href: 'https://delvingbitcoin.org/t/pow-fraud-proofs-and-light-clients/139'
    date: 2023-10
  - id: announcing-libforesta
    title:
      EN: Announcing Libforesta
      BR: Announcing Libforesta
    source: Bitcoin-dev Mailing List
    href: >-
      https://gnusha.org/pi/bitcoindev/IA1P223MB04501EFD534B3A53708740E1CA05A@IA1P223MB0450.NAMP223.PROD.OUTLOOK.COM/
    date: '2023-07-31'
writing:
  - id: testnet4
    title:
      EN: What's going on with testnet4?
      BR: What's going on with testnet4?
    source: Davidson blog
    href: 'https://blog.dlsouza.lol/bitcoin/testnet/2024/12/02/testnet4.html'
    date: '2024-12-02'
  - id: partial-proofs
    title:
      EN: An algorithm to allow clients to request only parts of a proof
      BR: An algorithm to allow clients to request only parts of a proof
    source: Davidson blog
    href: 'https://blog.dlsouza.lol/2024/10/24/storing_proofs.html'
    date: '2024-10-24'
  - id: floresta-update
    title:
      EN: 'Floresta Update: Simplifying Bitcoin Node Integration for Wallets'
      BR: 'Floresta Update: Simplifying Bitcoin Node Integration for Wallets'
    source: Vinteum Blog
    href: >-
      https://www.vinteum.org/blog/floresta-update-simplifying-bitcoin-node-integration-for-wallets
    date: '2024-08-20'
  - id: node-workflow
    title:
      EN: Reworking floresta's node workflow
      BR: Reworking floresta's node workflow
    source: Davidson blog
    href: 'https://blog.dlsouza.lol/2023/09/28/new-floresta-wire.html'
    date: '2023-09-28'
  - id: pow-security
    title:
      EN: PoW Fraud Proofs and improving Light Clients' Security
      BR: PoW Fraud Proofs and improving Light Clients' Security
    source: Davidson blog
    href: 'https://blog.dlsouza.lol/2023/09/28/pow-fraud-proof.html'
    date: '2023-09-28'
  - id: rustreexo
    title:
      EN: Rustreexo
      BR: Rustreexo
    source: Davidson blog
    href: 'https://blog.dlsouza.lol/bitcoin/utreexo/2023/07/07/rustreexo.html'
    date: '2023-07-07'
  - id: libfloresta
    title:
      EN: Libfloresta
      BR: Libfloresta
    source: Davidson blog
    href: 'https://blog.dlsouza.lol/2023/07/07/libfloresta.html'
    date: '2023-07-07'
  - id: introducing-floresta
    title:
      EN: 'Introducing Floresta, a Utreexo-powered Electrum Server implementation'
      BR: 'Introducing Floresta, a Utreexo-powered Electrum Server implementation'
    source: Vinteum Blog
    href: >-
      https://www.vinteum.org/blog/introducing-floresta-a-utreexo-powered-electrum-server-implementation
    date: '2023-03-28'
media:
  - id: optech-podcast-2026-09-22
    title:
      EN: 'Bitcoin Optech Newsletter #423 Recap Podcast'
      BR: 'Bitcoin Optech Newsletter #423 Recap Podcast'
    date: '2026-09-22'
    source: Bitcoin Optech
    badge: '#423'
    href: 'https://bitcoinops.org/en/podcast/2026/09/22/'
    description:
      EN: Guest on the recap of newsletter #423, discussing improvements to Utreexo initial block download.
      BR: Convidado no recap da newsletter #423, sobre melhorias na sincronização inicial do Utreexo.
  - id: optech-podcast-2025-07-22
    title:
      EN: 'Bitcoin Optech Newsletter #363 Recap Podcast'
      BR: 'Bitcoin Optech Newsletter #363 Recap Podcast'
    date: '2025-07-22'
    source: Bitcoin Optech
    badge: '#363'
    href: 'https://bitcoinops.org/en/podcast/2025/07/22/'
    description:
      EN: Guest on the recap of newsletter #363, explaining Floresta and Utreexo on the v0.8.0 release.
      BR: Convidado no recap da newsletter #363, explicando Floresta e Utreexo no lançamento da v0.8.0.
  - id: ready-for-merge
    title:
      EN: Utreexo Updates w/Calvin Kim and Davidson Souza
      BR: Utreexo Updates w/Calvin Kim and Davidson Souza
    source: Ready for Merge Podcast
    href: 'https://www.youtube.com/watch?v=TXQioJdjgAQ'
    mediaType: video
    thumbnail: /assets/images/people/media/davidson-ready-for-merge.jpg
  - id: stephan-livera
    title:
      EN: 'Floresta: Making Bitcoin Node Verification Accessible'
      BR: 'Floresta: Making Bitcoin Node Verification Accessible'
    source: Stephan Livera Podcast
    href: 'https://www.youtube.com/watch?v=1cMhk80tpeo'
    mediaType: video
    thumbnail: /assets/images/people/media/davidson-stephan-livera.jpg
  - id: bitcoin-plus-plus
    title:
      EN: 'Integrating Lightning and Utreexo, a study case'
      BR: 'Integrating Lightning and Utreexo, a study case'
    source: Bitcoin Plus Plus Berlin 2025
    href: 'https://www.youtube.com/watch?v=_TXtJ1vyqy0'
    mediaType: video
    thumbnail: /assets/images/people/media/davidson-btcplusplus.jpg
  - id: bitcoinheiros
    title:
      EN: Entendendo UTREEXO e Floresta
      BR: Entendendo UTREEXO e Floresta
    source: Bitcoinheiros
    href: 'https://www.youtube.com/watch?v=mNIe8X1wJko'
    mediaType: video
    thumbnail: /assets/images/people/media/davidson-bitcoinheiros.jpg
  - id: portal-do-bitcoin
    title:
      EN: O brasileiro que é pago só para trabalhar com o código do Bitcoin
      BR: O brasileiro que é pago só para trabalhar com o código do Bitcoin
    source: Portal do Bitcoin
    href: >-
      https://portaldobitcoin.uol.com.br/o-brasileiro-que-e-pago-so-para-trabalhar-com-o-codigo-do-bitcoin/
    date: '2023-08-20'
    mediaType: article
    thumbnail: /assets/images/people/grantees/davidsonsouza.jpg
updatedAt: '2026-11-18'
---
## EN

Davidson Souza is a Vinteum grantee and the creator of Floresta, a Bitcoin node written in Rust that uses Utreexo to reduce storage requirements. His work focuses on node synchronization and wallet integration, making independent verification more accessible.

## PT

Davidson Souza é grantee da Vinteum e criador do Floresta, um nó Bitcoin em Rust que usa Utreexo para reduzir os requisitos de armazenamento. Seu trabalho foca na sincronização de nós e na integração com carteiras para tornar a verificação independente mais acessível.
