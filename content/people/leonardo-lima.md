---
name: Leonardo Lima
image: /assets/images/people/illustrations/leonardo-lima.webp
illustration: true
programs:
  - program: grants
    name: Grants
    organization: Vinteum
    role:
      EN: Grantee
      BR: Grantee
    status: past
    start: '2023-12'
    end: '2026-08'
    work:
      EN: Bitcoin Dev Kit
      BR: Bitcoin Dev Kit
    href: /programs/grants
    description:
      EN: "Became a BDK maintainer in April 2025, following earlier BDK and Fedimint work through Summer of Bitcoin."
      BR: "Tornou-se mantenedor do BDK em abril de 2025, após trabalho no BDK e no Fedimint pelo Summer of Bitcoin."
  - program: "summer-of-bitcoin"
    name: "Summer of Bitcoin"
    organization: "Summer of Bitcoin"
    role: {"EN": "Alumnus", "BR": "Ex-participante"}
    status: "past"
    cohort: 2022
    href: "https://www.summerofbitcoin.org/program-details/2022/r/recPLKAWw1UFZb7Sl"
    work: {"EN": "BDK: real-time block events and mempool.space integration", "BR": "BDK: eventos de blocos em tempo real e integração com mempool.space"}
  - program: "summer-of-bitcoin"
    name: "Summer of Bitcoin"
    organization: "Summer of Bitcoin"
    role: {"EN": "Alumnus", "BR": "Ex-participante"}
    status: "past"
    cohort: 2023
    href: "https://www.summerofbitcoin.org/program-details/2023/r/reckGTBbHuT6Amdhk"
    work: {"EN": "Fedimint", "BR": "Fedimint"}
focus:
  - Wallets
  - Rust
  - Bitcoin Dev Kit
links:
  - label: GitHub
    href: 'https://github.com/oleonardolima'
    icon: github
  - label: X
    href: 'https://x.com/_oleonardolima'
    icon: twitter
  - label: Nostr
    href: >-
      https://primal.net/p/npub1ez8efu9rjxu64g0lalty2ffmr2tgkzjz92rkafyfyz5463wr8ars8zls5t
    icon: nostr
projects:
  - name: Bitcoin Dev Kit
    href: https://github.com/bitcoindevkit/bdk
    description:
      EN: A modern, lightweight, descriptor-based wallet library written in Rust!
      BR: Biblioteca Rust para construir carteiras Bitcoin baseadas em descriptors.
    contribution:
      EN: "Maintains BDK’s Rust wallet infrastructure, working on transaction-graph correctness, canonical chain views and the separation of chain-data access from wallet logic. Wallet fuzzing remains proposed, and his signer-separation proposal was closed without merging."
      BR: "Mantém a infraestrutura de carteiras do BDK em Rust, trabalhando na correção de grafos de transações, nas visões canônicas da cadeia e na separação entre acesso a dados da cadeia e lógica de carteiras. O fuzzing de carteiras segue como proposta, e sua proposta de separar signers foi fechada sem integração."
contributions:
  - id: github-bitcoindevkit-bdk-2038
    title:
      EN: >-
        refactor(chain,core)!: replace CanonicalIter with sans-IO CanonicalTask
        + ChainQuery trait
      BR: >-
        refactor(chain,core)!: replace CanonicalIter with sans-IO CanonicalTask
        + ChainQuery trait
    date: '2026-06-15'
    source: 'bitcoindevkit/bdk · #2038'
    type: PR
    href: 'https://github.com/bitcoindevkit/bdk/pull/2038'
    description:
      EN: "Merged canonicalization refactor separating computation from I/O through a generic ChainQuery interface, allowing chain-data sources to vary without coupling them to canonicalization logic."
      BR: "Refatoração integrada da canonicalização que separa processamento e I/O por uma interface genérica ChainQuery, permitindo variar fontes de dados da cadeia sem acoplá-las à lógica de canonicalização."
  - id: github-bitcoindevkit-bdk-2027
    title:
      EN: 'feat(chain): add new list_ordered_canonical_txs method'
      BR: 'feat(chain): add new list_ordered_canonical_txs method'
    date: '2025-11-24'
    source: 'bitcoindevkit/bdk · #2027'
    type: PR
    href: 'https://github.com/bitcoindevkit/bdk/pull/2027'
  - id: bdk-structure-aware-fuzzing-signing
    title:
      EN: Structure-aware wallet fuzzing proposal
      BR: Proposta de fuzzing estruturado de carteiras
    source: 'bitcoindevkit/bdk_wallet · #271'
    type: PR
    href: https://github.com/bitcoindevkit/bdk_wallet/pull/271
    description:
      EN: Open pull request introducing LibFuzzer targets and structured generators for wallet updates,
        transaction creation, signing and persistence.
      BR: Pull request aberto que introduz alvos LibFuzzer e geradores estruturados para atualizações de
        carteira, criação de transações, assinatura e persistência.
  - id: bdk-wallet-signer-separation
    title:
      EN: Proposal to separate signers from Wallet
      BR: Proposta de separação dos signers de Wallet
    source: 'bitcoindevkit/bdk_wallet · #235'
    type: PR
    href: https://github.com/bitcoindevkit/bdk_wallet/pull/235
    description:
      EN: Proposed removing Wallet signer APIs in favor of rust-bitcoin’s Psbt::sign and a GetKey implementation.
        Closed without merging.
      BR: Propôs remover as APIs de assinatura de Wallet em favor de Psbt::sign do rust-bitcoin e de uma
        implementação de GetKey. Fechado sem integração.
updatedAt: '2026-11-18'
affiliations:
  - organization: Btrust
    role: { EN: Grantee, BR: Grantee }
    status: current
    start: '2026-09'
media:
  - id: bdk-maintainer-announcement
    title:
      EN: Leonardo Lima named BDK maintainer
      BR: Leonardo Lima se torna mantenedor do BDK
    source: Vinteum
    href: 'https://www.vinteum.org/blog/leonardo-lima-named-bdk-maintainer-and-renews-his-vinteum-grant'
    date: '2025-04'
    mediaType: article
---
## EN

Leonardo Lima is a Bitcoin Dev Kit maintainer working on wallet correctness and architecture in Rust. His contributions include transaction graphs, canonicalization and transaction ordering, alongside fuzz testing, code review and contributor guidance.

## PT

Leonardo Lima é mantenedor do Bitcoin Dev Kit e trabalha em correção e arquitetura de carteiras em Rust. Suas contribuições incluem grafos de transações, canonicalização e ordenação de transações, além de fuzzing, revisão de código e orientação a contribuidores.
