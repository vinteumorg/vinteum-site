---
name: bc1cindy
image: /assets/images/people/fellows/bc1cindy.jpg
programs:
  - program: fellowship
    name: Fellowship
    organization: Vinteum
    role:
      EN: Fellow
      BR: Fellow
    status: current
    start: '2026-05'
    cohort: 2
    work:
      EN: Fungi Protocol
      BR: Fungi Protocol
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
      EN: Payjoin Dev Kit
      BR: Payjoin Dev Kit
    href: /programs/bitcoin-dev-launchpad
    fundedBy: Vinteum
focus:
  - Payjoin
  - Privacy
  - Rust
links:
  - label: GitHub
    href: 'https://github.com/bc1cindy'
    icon: github
  - label: X
    href: 'https://twitter.com/bc1cindy'
    icon: twitter
  - label: YouTube
    href: 'https://www.youtube.com/@CindyBTC'
    icon: youtube
  - label: Website
    href: 'https://linktr.ee/CindyBTC'
    icon: website
projects:
  - name: "Fungi Protocol"
    href: "https://github.com/fungi-protocol/fungi"
    current: true
    description:
      EN: "A protocol suite under development for collaborative Bitcoin transaction construction, aimed at decentralized, privacy-preserving transactions."
      BR: "Uma suíte de protocolos em desenvolvimento para a construção colaborativa de transações Bitcoin, voltada a transações descentralizadas com preservação de privacidade."
    contribution:
      EN: "Cindy develops transport abstractions and Tor support, improves documentation and its CI, and reviews concurrent PSBT construction and metadata scrubbing."
      BR: "Cindy desenvolve abstrações de transporte e suporte ao Tor, aprimora a documentação e sua integração contínua e revisa a construção concorrente de PSBTs e a remoção de metadados."
  - name: lumen-fingerprints
    href: https://github.com/fungi-protocol/lumen-fingerprints
    description:
      EN: Transaction-construction fingerprint survey and reporting tools.
      BR: Ferramentas para levantamento e análise de características da construção de transações.
    contribution:
      EN: Builds a Floresta-backed scanner and reports for script types, ordering, nSequence, sighash,
        fee rounding, amounts and change.
      BR: Desenvolve um scanner baseado no Floresta e relatórios sobre tipos de script, ordenação, nSequence,
        sighash, arredondamento de taxas, valores e troco.
  - name: decluster
    href: https://github.com/bc1cindy/decluster
    description:
      EN: Experimental laboratory for Bitcoin transaction de-anonymization failure modes.
      BR: Laboratório experimental de modos de falha da desanonimização de transações Bitcoin.
    contribution:
      EN: Studies construction fingerprints, amount models and graph structure as separate evidence channels,
        including abstention and cannot-link outcomes; results are model-relative, not proof of ownership.
      BR: Estuda características de construção, modelos de valores e estrutura do grafo como canais de
        evidência separados, incluindo abstenção e resultados cannot-link; os resultados dependem do modelo
        e não provam propriedade.
contributions:
  - id: github-payjoin-rust-payjoin-962
    title:
      EN: Optimize SessionPersister trait for better ownership semantics
      BR: Optimize SessionPersister trait for better ownership semantics
    date: '2025-08-19'
    source: 'payjoin/rust-payjoin · #962'
    type: PR
    href: 'https://github.com/payjoin/rust-payjoin/pull/962'
  - id: github-payjoin-rust-payjoin-945
    title:
      EN: Replace bitcoincore-rpc with custom reqwest client
      BR: Replace bitcoincore-rpc with custom reqwest client
    date: '2025-08-14'
    source: 'payjoin/rust-payjoin · #945'
    type: PR
    href: 'https://github.com/payjoin/rust-payjoin/pull/945'
  - id: bc1cindy-wallet-fingerprints
    title:
      EN: Shuffle change outputs on hardware-wallet and BCH sends
      BR: Embaralhar o troco em envios com hardware wallet e BCH
    date: '2026-07-26'
    source: 'cake-tech/cake_wallet · #3432'
    type: PR
    href: https://github.com/cake-tech/cake_wallet/pull/3432
    description:
      EN: Merged output-order randomization for hardware-wallet BTC/LTC and Bitcoin Cash sends, removing
        deterministic placement of change.
      BR: Integrou a aleatorização da ordem dos outputs em envios BTC/LTC com hardware wallet e Bitcoin
        Cash, removendo a posição determinística do troco.
  - id: github-cake-wallet-3385
    title:
      EN: Anti-fee-sniping locktime for Cake Wallet
      BR: Locktime contra fee sniping no Cake Wallet
    date: '2026-08-19'
    source: 'cake-tech/cake_wallet · #3385'
    type: PR
    href: https://github.com/cake-tech/cake_wallet/pull/3385
    description:
      EN: Merged current-tip locktimes for normal Bitcoin sends and Payjoin PSBT construction, with zero
        used when unsynchronized.
      BR: Integrou locktimes na altura atual para envios Bitcoin e construção de PSBTs Payjoin, usando
        zero quando não sincronizado.
  - id: github-cake-wallet-3408
    title:
      EN: Randomized coin selection and changeless payments
      BR: Seleção de moedas aleatória e pagamentos sem troco
    date: '2026-08-19'
    source: 'cake-tech/cake_wallet · #3408'
    type: PR
    href: https://github.com/cake-tech/cake_wallet/pull/3408
    description:
      EN: Merged branch-and-bound selection for changeless transactions and a securely shuffled single-random-draw
        fallback, including shuffled RBF top-ups and Payjoin candidates.
      BR: Integrou seleção branch-and-bound para transações sem troco e alternativa single-random-draw
        com embaralhamento seguro, incluindo entradas adicionais de RBF e candidatas a Payjoin.
  - id: github-liana-2192
    title:
      EN: Canonical spend and recovery inputs in Liana
      BR: Entradas canônicas de gasto e recuperação no Liana
    date: '2026-07-09'
    source: 'wizardsardine/liana · #2192'
    type: PR
    href: https://github.com/wizardsardine/liana/pull/2192
    description:
      EN: Proposed sorting coin candidates by outpoint and sharing PSBT-input construction between spend
        and recovery paths to reduce divergent fingerprints. Open pull request.
      BR: Propôs ordenar moedas por outpoint e compartilhar a construção de entradas PSBT entre gasto
        e recuperação para reduzir características divergentes. Pull request aberto.
  - id: github-bitcoin-base-21
    title:
      EN: Canonical RBF sequence on every input
      BR: Sequence canônico de RBF em todas as entradas
    date: '2026-07-11'
    source: 'mrtnetwork/bitcoin_base · #21'
    type: PR
    href: https://github.com/mrtnetwork/bitcoin_base/pull/21
    description:
      EN: Merged use of 0xFFFFFFFD on every input in both transaction builders, replacing an unusual value
        that also enabled a relative timelock.
      BR: Integrou o uso de 0xFFFFFFFD em todas as entradas dos dois construtores de transações, substituindo
        um valor incomum que também ativava um timelock relativo.
  - id: github-bullbitcoin-mobile-2431
    title:
      EN: Exclude unconfirmed Payjoin receiver candidates
      BR: Excluir candidatas não confirmadas do recebedor Payjoin
    date: '2026-07-09'
    source: 'SatoshiPortal/bullbitcoin-mobile · #2431'
    type: PR
    href: https://github.com/SatoshiPortal/bullbitcoin-mobile/pull/2431
    description:
      EN: Proposed requiring confirmations for Payjoin receiver inputs, avoiding an observable zero-confirmation
        fingerprint and replacement risk. Open pull request.
      BR: Propôs exigir confirmações para entradas do recebedor Payjoin, evitando uma característica observável
        de zero confirmações e o risco de substituição. Pull request aberto.
  - id: bc1cindy-fungi-psbt-review
    title:
      EN: Review of concurrent-PSBT join traits
      BR: Revisão dos traits de junção de PSBTs concorrentes
    date: '2026-11-10'
    source: 'fungi-protocol/concurrent-psbt · #16'
    type: Code Review
    href: https://github.com/fungi-protocol/concurrent-psbt/pull/16#discussion_r3652556816
    description:
      EN: Flagged a unit-value comparison whose assertion could not fail and explained why warn-only Clippy
        CI missed it. Later approved the join-trait change, which was merged.
      BR: Apontou uma comparação de valores unit cujo assert não podia falhar e explicou por que o Clippy
        em modo de aviso não a detectava no CI. Depois aprovou a mudança nos traits de junção, que foi
        integrada.
  - id: "github-fungi-protocol-fungi-32"
    title:
      EN: "Typed transport channels for Fungi"
      BR: "Canais de transporte tipados no Fungi"
    date: "2026-09-28"
    source: "fungi-protocol/fungi · #32"
    type: "PR"
    href: "https://github.com/fungi-protocol/fungi/pull/32"
    description:
      EN: "Introduced typed send/receive channels and builders with privacy tags and optional peer identity. Merged transport abstraction."
      BR: "Introduziu canais tipados de envio e recebimento e builders com marcadores de privacidade e identidade opcional dos peers. Abstração de transporte integrada."
  - id: "github-fungi-protocol-fungi-149"
    title:
      EN: "Validated onion-service addresses"
      BR: "Validação de endereços de serviços onion"
    date: "2026-11-02"
    source: "fungi-protocol/fungi · #149"
    type: "PR"
    href: "https://github.com/fungi-protocol/fungi/pull/149"
    description:
      EN: "Added onion-address types with v3 version and checksum validation, preserving parse errors for invalid addresses. Merged."
      BR: "Adicionou tipos de endereços onion com validação de versão v3 e checksum, preservando erros de parsing para endereços inválidos. Integrado."
  - id: "github-fungi-protocol-docs-50"
    title:
      EN: "Generate Fungi documentation from a single chapter index"
      BR: "Gerar a documentação do Fungi a partir de um índice único"
    date: "2026-10-19"
    source: "fungi-protocol/docs · #50"
    type: "Documentation"
    href: "https://github.com/fungi-protocol/docs/pull/50"
    description:
      EN: "Reorganized the documentation build around one chapter index and a generator that produces mdBook content while removing frontmatter. Merged."
      BR: "Reorganizou a compilação da documentação com um índice único de capítulos e um gerador que produz conteúdo mdBook sem frontmatter. Integrado."
updatedAt: '2026-11-18'
---
## EN

bc1cindy focuses on Bitcoin on-chain privacy. On Fungi, a protocol suite for collaborative transactions, she builds the Rust P2P transport layer over Tor and contributes to the project book. She also researches privacy metrics that will feed into coin selection optimization.

## PT

bc1cindy se dedica à privacidade on-chain no Bitcoin. No Fungi, um conjunto de protocolos para transações colaborativas, desenvolve em Rust a camada de transporte P2P sobre Tor e contribui com o livro do projeto. Também pesquisa métricas de privacidade que vão entrar na otimização de coin selection.