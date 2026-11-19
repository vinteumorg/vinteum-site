---
name: Vinicius Cestari
image: /assets/images/people/illustrations/vinicius-cestari.png
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
      EN: Bitcoin Core
      BR: Bitcoin Core
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
      EN: Bitcoin Core
      BR: Bitcoin Core
    href: /programs/bitcoin-dev-launchpad
    fundedBy: Vinteum
focus:
  - Bitcoin Core
  - IPC
  - Testing
links:
  - label: GitHub
    href: 'https://github.com/viniciusCestarii'
    icon: github
  - label: X
    href: 'https://x.com/VCestarii'
    icon: twitter
  - label: Website
    href: 'https://viniciuscestari.dev/'
    icon: website
projects:
  - name: libsecp256k1
    href: 'https://github.com/bitcoin-core/secp256k1'
    description:
      EN: Optimized C library for EC operations on curve secp256k1
      BR: Biblioteca C otimizada para operações na curva secp256k1.
    contribution:
      EN: "Contributed to Silent Payments test maintainability in libsecp256k1 by consolidating shared setup and reusable test helpers."
      BR: "Contribuiu para a manutenção dos testes de Silent Payments na libsecp256k1, consolidando a preparação compartilhada e helpers reutilizáveis de teste."
  - name: libmultiprocess
    href: 'https://github.com/bitcoin-core/libmultiprocess'
    description:
      EN: >-
        C++ library and code generator making it easy to call functions and
        reference objects in different processes
      BR: >-
        Biblioteca C++ para chamadas de funções e referências a objetos entre
        processos.
    contribution:
      EN: "Works on reliable interprocess communication in libmultiprocess, covering serialization, child-process lifecycle and diagnostics, generated-code build consistency and regression tests."
      BR: "Trabalha na confiabilidade da comunicação entre processos na libmultiprocess, abrangendo serialização, ciclo de vida e diagnóstico de processos filhos, consistência da compilação do código gerado e testes de regressão."
contributions:
  - id: github-bitcoin-core-secp256k1-1972
    title:
      EN: 'tests: silentpayments: deduplicate setup code'
      BR: 'tests: silentpayments: deduplicate setup code'
    date: '2026-11-12'
    source: 'bitcoin-core/secp256k1 · #1972'
    type: PR
    href: 'https://github.com/bitcoin-core/secp256k1/pull/1972'
    description:
      EN: Consolidates repeated Silent Payments test setup into reusable helpers.
      BR: Consolida a preparação repetida dos testes de Silent Payments em helpers reutilizáveis.
  - id: github-bitcoin-core-libmultiprocess-324
    title:
      EN: 'proxy: Name threads spawned by the event loop'
      BR: 'proxy: Name threads spawned by the event loop'
    date: '2026-08-11'
    source: 'bitcoin-core/libmultiprocess · #324'
    type: PR
    href: 'https://github.com/bitcoin-core/libmultiprocess/pull/324'
    description:
      EN: Makes event-loop worker and cleanup threads distinguishable in process tools and
        logs.
      BR: Permite distinguir workers e threads de limpeza do event loop nas ferramentas
        de processos e nos logs.
  - id: github-2140-dev-bitcoin-42
    title:
      EN: 'ipc: add NodeRpc interface for LND'
      BR: 'ipc: add NodeRpc interface for LND'
    source: '2140-dev/bitcoin · #42'
    type: PR
    href: https://github.com/2140-dev/bitcoin/pull/42
    description:
      EN: Proposed a NodeRpc IPC interface for the methods LND needs. Closed without merge; feedback
        led to a separate generic-interface design discussion.
      BR: Propôs uma interface IPC NodeRpc para os métodos necessários ao LND. Encerrado sem integração;
        o feedback levou a uma discussão separada sobre uma interface genérica.
writing:
  - id: personal-blog-hunting-live-mutants
    title:
      EN: Teaching an Agent to Hunt Live Mutants in Bitcoin Core
      BR: Teaching an Agent to Hunt Live Mutants in Bitcoin Core
    date: '2026-09-09'
    source: viniciuscestari.dev
    href: 'https://viniciuscestari.dev/posts/hunting-live-mutants'
  - id: personal-blog-bitcoin-core-ipc-on-the-wire
    title:
      EN: Bitcoin Core IPC on the Wire
      BR: Bitcoin Core IPC on the Wire
    date: '2026-08-14'
    source: viniciuscestari.dev
    href: 'https://viniciuscestari.dev/posts/bitcoin-core-ipc-on-the-wire'
discussions:
  - id: github-2140-dev-bitcoin-discussion-48
    title:
      EN: 'How should we shape the IPC schema for #24?'
      BR: 'How should we shape the IPC schema for #24?'
    source: '2140-dev/bitcoin · #48'
    href: https://github.com/2140-dev/bitcoin/discussions/48
    description:
      EN: Opened a design discussion proposing domain-specific Cap’n Proto capabilities and a separate
        bridge for consumer-specific RPC translation. This remains a design sketch.
      BR: Abriu uma discussão de design propondo capabilities Cap’n Proto por domínio e uma ponte separada
        para a tradução de RPCs específica de cada consumidor. Ainda é um esboço de design.
updatedAt: '2026-11-18'
---
## EN

Vinicius Cestari contributes to Bitcoin Core infrastructure, especially interprocess communication and libmultiprocess. His work spans serialization, generated code, error handling and testing, alongside IPC review and experiments with RPC interfaces.

## PT

Vinicius Cestari contribui para a infraestrutura do Bitcoin Core, especialmente comunicação entre processos e libmultiprocess. Seu trabalho abrange serialização, código gerado, tratamento de erros e testes, além de revisão de IPC e experimentos com interfaces RPC.
