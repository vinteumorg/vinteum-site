---
name: Allocz
pseudonymous: true
image: /assets/images/people/illustrations/allocz.webp
illustration: true
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
      EN: btcd
      BR: btcd
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
      EN: btcd
      BR: btcd
    href: /programs/bitcoin-dev-launchpad
    fundedBy: Vinteum
focus:
  - Go
  - Bitcoin Nodes
  - Cryptography
links:
  - label: GitHub
    href: 'https://github.com/allocz'
    icon: github
projects:
  - name: btcd
    href: https://github.com/btcsuite/btcd
    description:
      EN: An alternative full node bitcoin implementation written in Go (golang)
      BR: Implementação de nó Bitcoin em Go.
    contribution:
      EN: "Contributes to btcd performance and reliability, focusing on memory use, storage and cryptographic operations during initial block download, alongside RPC behavior and testing tools."
      BR: "Contribui para o desempenho e a confiabilidade do btcd, com foco no uso de memória, armazenamento e operações criptográficas durante o download inicial de blocos, além do comportamento do RPC e de ferramentas de teste."
  - name: secp256k1 (portable Go)
    href: https://github.com/allocz/secp256k1
    description:
      EN: Portable secp256k1 library with pure-Go and native implementations.
      BR: Biblioteca secp256k1 portátil com implementações em Go puro e nativa.
    contribution:
      EN: Develops a pure-Go fallback with an optional libsecp256k1 backend through CGO and architecture-specific
        optimizations.
      BR: Desenvolve uma alternativa em Go puro com backend opcional de libsecp256k1 via CGO e otimizações
        específicas por arquitetura.
contributions:
  - id: allocz-btcd-crypto-allocations
    title:
      EN: Reduce allocations in btcec cryptographic operations
      BR: Redução de alocações em operações criptográficas do btcec
    date: '2026-06-30'
    source: 'btcsuite/btcd · #2559'
    type: PR
    href: https://github.com/btcsuite/btcd/pull/2559
    description:
      EN: Proposed reducing allocations in public-key and signature parsing and Schnorr verification,
        with reproducible benchmarks using upstream Go and secp256k1 patches. The pull request remains open.
      BR: Propôs reduzir alocações no parsing de chaves públicas e assinaturas e na verificação Schnorr,
        com benchmarks reproduzíveis usando patches do Go e secp256k1. O pull request permanece aberto.
  - id: allocz-btcd-utxo-memory-accounting
    title:
      EN: UTXO-cache memory accounting for Go Swiss maps
      BR: Contabilização de memória do cache de UTXOs para Swiss maps do Go
    date: '2026-10-30'
    source: 'btcsuite/btcd · #2673'
    type: PR
    href: https://github.com/btcsuite/btcd/pull/2673
    description:
      EN: Proposed accounting for Go's changed map layout and allocation overhead in the UTXO cache,
        with tests and initial-block-download measurements. The pull request remains open.
      BR: Propôs considerar o novo layout de maps do Go e os custos de alocação no cache de UTXOs,
        com testes e medições de download inicial de blocos. O pull request permanece aberto.
  - id: github-btcsuite-btcd-2600
    title:
      EN: 'btcd: fix getblock panic triggered by rpc call'
      BR: 'btcd: fix getblock panic triggered by rpc call'
    date: '2026-09-11'
    source: 'btcsuite/btcd · #2600'
    type: PR
    href: 'https://github.com/btcsuite/btcd/pull/2600'
  - id: github-decred-dcrd-3714
    title:
      EN: 'secp256k1: Reduce allocations.'
      BR: 'secp256k1: Reduce allocations.'
    date: '2026-07-06'
    source: 'decred/dcrd · #3714'
    type: PR
    href: 'https://github.com/decred/dcrd/pull/3714'
    description:
      EN: Reduced allocations in modular inversion and public-key parsing in the Go secp256k1 library
        used by btcd. Merged in July 2026.
      BR: Reduziu alocações na inversão modular e no parsing de chaves públicas da biblioteca secp256k1
        em Go usada pelo btcd. Integrado em julho de 2026.
  - id: allocz-btcd-storage-ibd
    title:
      EN: Depth-based spend-journal pruning
      BR: Poda do spend journal por profundidade
    date: '2026-10-05'
    source: 'btcsuite/btcd · #2624'
    type: PR
    href: https://github.com/btcsuite/btcd/pull/2624
    description:
      EN: Proposed retaining only the most recent 288 blocks of spend-journal data to reduce archival-node
        database storage. The pull request is open.
      BR: Propôs manter apenas os 288 blocos mais recentes do spend journal para reduzir o armazenamento
        do banco de nós de arquivo. O pull request está aberto.
  - id: allocz-btcd-skip-prevout-fetch
    title:
      EN: Checkpoint-based UTXO cache-miss experiment
      BR: Experimento com falhas de cache de UTXOs e checkpoints
    type: Research
    source: allocz/btcd · skip_prevout_fetch
    href: https://github.com/allocz/btcd/blob/skip_prevout_fetch/blockchain/utxocache.go
    description:
      EN: Experimental branch avoids disk reads for missing previous outputs under a hardcoded UTXO-set
        checkpoint, inserting dummy cache entries before checking the resulting UTXO-set hash.
      BR: Branch experimental evita leituras em disco para outputs anteriores ausentes sob um checkpoint
        fixo do conjunto de UTXOs, inserindo entradas provisórias no cache antes de verificar o hash resultante.
  - id: github-btcsuite-btcd-2571
    title:
      EN: RPC integration-test harness and debug events
      BR: Ambiente de testes de integração RPC e eventos de depuração
    date: '2026-07-07'
    source: 'btcsuite/btcd · #2571'
    type: PR
    href: https://github.com/btcsuite/btcd/pull/2571
    description:
      EN: Proposed a debug-event stream, restartable harness and teardown that preserves node data. Closed
        without merging.
      BR: Propôs um fluxo de eventos de depuração, reinicialização do ambiente de testes e encerramento
        que preserva os dados do nó. Fechado sem integração.
updatedAt: '2026-11-18'
---
## EN

Allocz contributes to btcd and Go cryptography libraries, focusing on memory use, storage and cryptographic performance during initial block download. His work also covers RPC reliability, testing and experiments with portable secp256k1 implementations.

## PT

Allocz contribui para o btcd e bibliotecas de criptografia em Go, com foco no uso de memória, armazenamento e desempenho criptográfico durante o download inicial de blocos. Seu trabalho também abrange confiabilidade do RPC, testes e experimentos com implementações portáteis de secp256k1.
