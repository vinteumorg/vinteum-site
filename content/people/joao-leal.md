---
name: João Leal
image: /assets/images/people/illustrations/joao-leal.png
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
      EN: Floresta
      BR: Floresta
    href: /programs/fellowship

  - program: bitcoin-dev-launchpad
    name: Bitcoin Dev Launchpad
    organization: Vinteum
    role:
      EN: Alumnus
      BR: Ex-participante
    status: past
    cohort: 1
    work:
      EN: Floresta
      BR: Floresta
    href: /programs/bitcoin-dev-launchpad
    fundedBy: OpenSats
  - program: "summer-of-bitcoin"
    name: "Summer of Bitcoin"
    organization: "Summer of Bitcoin"
    role: {"EN": "Alumnus", "BR": "Ex-participante"}
    status: "past"
    cohort: 2024
    href: "https://www.summerofbitcoin.org/program-details/2024/r/rectcEvzVdwHh7gwb"
    work: {"EN": "Floresta: migration from async-std to Tokio", "BR": "Floresta: migração de async-std para Tokio"}
focus:
  - Rust
  - Bitcoin Nodes
  - Mobile
links:
  - label: GitHub
    href: 'https://github.com/jaoleal'
    icon: github
  - label: "X"
    href: "https://x.com/jaoleall"
    icon: "twitter"
projects:
  - name: Floresta
    href: https://github.com/getfloresta/Floresta
    description:
      EN: Lightweight Bitcoin node software using Utreexo, with embeddable Rust libraries.
      BR: Software de nó Bitcoin leve com Utreexo e bibliotecas Rust integráveis em outras aplicações.
    contribution:
      EN: Develops consensus validation, Bitcoin Core-compatible RPC interfaces and wallet descriptor tooling, alongside build infrastructure and tests. Descriptor work includes proposals still under review.
      BR: Desenvolve validação de consenso, interfaces RPC compatíveis com Bitcoin Core e ferramentas de descritores de carteira, além de infraestrutura de compilação e testes. O trabalho com descritores inclui propostas ainda em revisão.
  - name: rust-bitcoinkernel
    href: https://github.com/sedited/rust-bitcoinkernel
    description:
      EN: Rust bindings for the Bitcoin Core validation library.
      BR: Bindings Rust para a biblioteca de validação do Bitcoin Core.
    contribution:
      EN: Contributes portable build support for Rust BitcoinKernel bindings, enabling Android integration with cross-compilation tooling and CI coverage.
      BR: Contribui para a portabilidade da compilação dos bindings Rust de BitcoinKernel, viabilizando integração com Android por meio de compilação cruzada e cobertura em CI.
contributions:
  - id: github-sedited-rust-bitcoinkernel-158
    title:
      EN: 'Feat: Android support'
      BR: 'Feat: Android support'
    date: '2026-07-22'
    source: 'sedited/rust-bitcoinkernel · #158'
    type: PR
    href: https://github.com/sedited/rust-bitcoinkernel/pull/158
  - id: github-rust-bitcoin-rust-bitcoin-6502
    title:
      EN: Add default_rpc_port method to NetworkExt trait
      BR: Add default_rpc_port method to NetworkExt trait
    date: '2026-07-09'
    source: 'rust-bitcoin/rust-bitcoin · #6502'
    type: PR
    href: https://github.com/rust-bitcoin/rust-bitcoin/pull/6502
  - id: github-getfloresta-Floresta-165
    title:
      EN: Implement transaction consensus rules in Floresta
      BR: Implementar regras de consenso de transações no Floresta
    date: '2024-07-10'
    source: 'getfloresta/Floresta · #165'
    type: PR
    href: https://github.com/getfloresta/Floresta/pull/165
    description:
      EN: Merged transaction-validation work covering missing consensus checks, based on Bitcoin Core validation
        and discussion with the project maintainer.
      BR: Implementou verificações de consenso ausentes na validação de transações, com base no Bitcoin
        Core e em discussão com o mantenedor; PR integrado.
  - id: github-getfloresta-Floresta-590
    title:
      EN: Make Floresta getblock compatible with Bitcoin Core
      BR: Compatibilizar getblock do Floresta com Bitcoin Core
    date: '2025-07-28'
    source: 'getfloresta/Floresta · #590'
    type: PR
    href: https://github.com/getfloresta/Floresta/pull/590
    description:
      EN: Proposed getblock response refactoring and verbosity level 2 for Bitcoin Core API compatibility. This pull request was closed without merging.
      BR: Propôs a reestruturação das respostas de getblock e o nível de verbosidade 2 para compatibilidade com a API do Bitcoin Core. Este pull request foi fechado sem integração.
updatedAt: '2026-11-18'
affiliations:
  - organization: OpenSats
    role: { EN: Grantee, BR: Grantee }
    status: current
    start: '2026-09'
    href: 'https://opensats.org/blog/fourteenth-wave-of-bitcoin-grants'
---
## EN

João Leal contributes to Bitcoin node software in Rust, with work on Floresta, rust-bitcoinkernel and rust-bitcoin. His contributions include consensus validation, RPC compatibility and Android support for BitcoinKernel bindings.

## PT

João Leal contribui para software de nós Bitcoin em Rust, com trabalho no Floresta, rust-bitcoinkernel e rust-bitcoin. Suas contribuições incluem validação de consenso, compatibilidade RPC e suporte a Android nos bindings de BitcoinKernel.
