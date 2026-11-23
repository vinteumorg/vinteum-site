---
name: Carlos Santos
image: /assets/images/people/illustrations/carlos-santos.png
illustration: true
links:
  - label: GitHub
    href: 'https://github.com/caarloshenriq'
    icon: github
  - label: Blog
    icon: blog
    href: 'https://www.carlossantos.sh/'
  - label: "X"
    href: "https://x.com/caarlosBtc"
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
      EN: Payjoin Dev Kit
      BR: Payjoin Dev Kit
    start: '2026-09'
writing:
  - id: personal-blog-payjoin-bip77-bip78
    title:
      EN: 'BIP 78 & BIP 77: Understanding Payjoin from the Ground Up'
      BR: 'BIP 78 & BIP 77: Understanding Payjoin from the Ground Up'
    date: '2026-05-17'
    source: carlossantos.sh
    href: 'https://www.carlossantos.sh/posts/payjoin-bip77-bip78/'
  - id: personal-blog-payjoin-poc
    title:
      EN: 'Payjoin POC: Implementing no_std on the payjoin ecosystem'
      BR: 'Payjoin POC: Implementing no_std on the payjoin ecosystem'
    date: '2026-03-24'
    source: carlossantos.sh
    href: 'https://www.carlossantos.sh/posts/payjoin-poc/'
focus:
  - Payjoin
  - Fuzzing
  - Rust
updatedAt: '2026-11-18'
contributions:
  - id: github-payjoin-bitcoin_uri-17-review
    title:
      EN: Review of the owned Uri parser for BIP 321
      BR: Revisão do parser de Uri próprio para BIP 321
    date: '2026-11-09'
    source: 'payjoin/bitcoin_uri · #17'
    type: Code Review
    href: 'https://github.com/payjoin/bitcoin_uri/pull/17#pullrequestreview-5830314432'
    description:
      EN: Approved the 0.2 parser that returns an owned URI and treats the body address as optional, after commenting on the implementation.
      BR: Aprovou o parser 0.2 que devolve um URI próprio e trata o endereço no corpo como opcional, depois de comentar a implementação.
  - id: github-payjoin-rust-payjoin-1975
    title:
      EN: Migrate URI parsing to bitcoin_uri 0.2
      BR: Migrate URI parsing to bitcoin_uri 0.2
    date: '2026-10-13'
    source: 'payjoin/rust-payjoin · #1975'
    type: PR
    href: 'https://github.com/payjoin/rust-payjoin/pull/1975'
    description:
      EN: Replaces the local URI parsing with the bitcoin_uri crate. Open for review.
      BR: Substitui o parsing local de URI pelo crate bitcoin_uri. Aberto para revisão.
  - id: github-payjoin-rust-payjoin-2022
    title:
      EN: Add FFI receiver checklists fuzz target
      BR: Add FFI receiver checklists fuzz target
    date: '2026-11-04'
    source: 'payjoin/rust-payjoin · #2022'
    type: PR
    href: 'https://github.com/payjoin/rust-payjoin/pull/2022'
    description:
      EN: Merged in November 2026. Exercises receiver callbacks and checklists with malformed or
        mismatched host responses, covering callback failures, refused saves, and synchronous and
        asynchronous persistence adapters. Replays saved state to check application integration
        beyond core receiver logic.
      BR: Integrado em novembro de 2026. Exercita callbacks e checklists do recebedor com respostas
        malformadas ou incompatíveis da aplicação, cobrindo falhas de callbacks, recusas de gravação
        e adaptadores síncronos e assíncronos de persistência. Reconstrói o estado salvo para verificar
        a integração além da lógica central do recebedor.
  - id: github-payjoin-rust-payjoin-1887
    title:
      EN: Add v2 receiver fuzz target
      BR: Add v2 receiver fuzz target
    date: '2026-10-14'
    source: 'payjoin/rust-payjoin · #1887'
    type: PR
    href: 'https://github.com/payjoin/rust-payjoin/pull/1887'
    description:
      EN: >-
        Reviewed and refined the receiver fuzz harness initially implemented by
        @benalleng, including test correctness and harness invariants. The harness
        encrypts mutated plaintext with HPKE and OHTTP so inputs reach the v2
        receiver state machine rather than stopping at authentication checks.
        Merged in October 2026.
      BR: >-
        Revisou e refinou o harness de fuzzing do recebedor inicialmente implementado
        por @benalleng, incluindo a correção dos testes e invariantes do harness.
        O harness cifra texto mutado com HPKE e OHTTP para que as entradas alcancem
        a máquina de estados do recebedor v2, em vez de parar nas verificações de
        autenticação. Integrado em outubro de 2026.
  - id: github-payjoin-rust-payjoin-1983
    title:
      EN: Reject mailbox payloads that cannot round-trip through the gateway
      BR: Rejeitar mensagens de mailbox que não cabem na resposta do gateway
    date: '2026-10-28'
    source: 'payjoin/rust-payjoin · #1983'
    type: PR
    href: 'https://github.com/payjoin/rust-payjoin/pull/1983'
    description:
      EN: >-
        Limited stored mailbox payloads to what the OHTTP gateway can return,
        rejecting oversized v1 requests and returning an error instead of
        truncating gateway responses. Added boundary tests for successful
        retrieval and oversized-payload rejection. Merged in October 2026.
      BR: >-
        Limitou as mensagens armazenadas na mailbox ao tamanho que o gateway OHTTP
        consegue retornar, rejeitando requisições v1 grandes demais e retornando
        erro em vez de truncar respostas do gateway. Adicionou testes de limite
        para recuperação completa e rejeição de mensagens grandes demais.
        Integrado em outubro de 2026.
  - id: github-payjoin-rust-payjoin-1998-review
    title:
      EN: Review repeated receiver input contributions
      BR: Revisão de contribuições repetidas de inputs do recebedor
    date: '2026-10-20'
    source: 'payjoin/rust-payjoin · #1998 review'
    type: Code Review
    href: 'https://github.com/payjoin/rust-payjoin/pull/1998#pullrequestreview-5587714927'
    description:
      EN: >-
        Reproduced a bug in another contributor's PR where repeated input
        contributions left change missing from the receiver's output. Asked for
        coverage of a second contribution smaller than the first and questioned
        unnecessary test-helper visibility changes. The PR remains open.
      BR: >-
        Reproduziu um bug no PR de outro contribuidor em que contribuições
        repetidas de inputs deixavam de creditar parte do troco ao output do
        recebedor. Pediu cobertura para uma segunda contribuição menor que a
        primeira e questionou mudanças desnecessárias na visibilidade de
        auxiliares de teste. O PR permanece aberto.
  - id: github-payjoin-rust-payjoin-1872
    title:
      EN: Fuzz the v1 Payjoin roundtrip
      BR: Fuzzing do ciclo completo de Payjoin v1
    date: '2026-09-10'
    source: 'payjoin/rust-payjoin · #1872'
    type: PR
    href: 'https://github.com/payjoin/rust-payjoin/pull/1872'
    description:
      EN: >-
        Added a libFuzzer target connecting sender request construction, receiver
        state transitions and sender proposal parsing. A custom mutator preserves
        a seeded PSBT while varying BIP 78 query parameters to reach protocol
        logic beyond PSBT deserialization. Merged in September 2026.
      BR: >-
        Adicionou um alvo de libFuzzer que conecta a construção da requisição pelo
        remetente, as transições de estado do recebedor e a leitura da proposta
        pelo remetente. Um mutador preserva uma PSBT de referência e varia os
        parâmetros de consulta do BIP 78 para alcançar a lógica do protocolo
        além da desserialização da PSBT. Integrado em setembro de 2026.
  - id: github-payjoin-rust-payjoin-1615
    title:
      EN: Explore no_std support for embedded Payjoin integrations
      BR: Pesquisa de suporte no_std para integração de Payjoin em sistemas embarcados
    date: '2026-06-07'
    source: 'payjoin/rust-payjoin · #1615'
    type: Research
    href: 'https://github.com/payjoin/rust-payjoin/pull/1615'
    description:
      EN: >-
        Open proposal separating alloc-based protocol logic from std-dependent
        transport code through Cargo feature gates. Investigates embedded build
        requirements and ARM cross-compilation for hardware-signer integration;
        this work has not been merged upstream.
      BR: >-
        Proposta aberta que separa a lógica do protocolo baseada em alloc do
        transporte dependente de std por meio de features do Cargo. Investiga
        requisitos de compilação embarcada e compilação cruzada para ARM visando
        integração com dispositivos de assinatura; o trabalho ainda não foi
        integrado ao projeto upstream.
projects:
  - name: Payjoin Dev Kit
    href: 'https://github.com/payjoin/rust-payjoin'
    description:
      EN: Supercharged batching to save you fees and preserve your privacy
      BR: >-
        Implementação de Payjoin para pagamentos colaborativos com maior
        privacidade.
    contribution:
      EN: "Contributes to Payjoin protocol testing and implementation reliability through fuzzing, receiver review and gateway validation. Also explores support for embedded integrations through an open no_std proposal."
      BR: "Contribui para os testes do protocolo Payjoin e a confiabilidade da implementação por meio de fuzzing, revisão do recebedor e validação do gateway. Também explora suporte a integrações embarcadas em uma proposta no_std aberta."
---
## EN

Carlos Santos contributes to Payjoin Dev Kit, focusing on fuzz testing of Payjoin v2 and receiver interfaces. His testing work covers the integration between Rust receiver logic and applications using foreign-function bindings, including callbacks and persistence.

## PT

Carlos Santos contribui para o Payjoin Dev Kit, com foco em fuzzing de Payjoin v2 e interfaces de recebedores. Seu trabalho testa a integração entre a lógica do recebedor em Rust e aplicativos que usam bindings para outras linguagens, incluindo callbacks e persistência.
