---
name: plebhash
image: /assets/images/people/grantees/plebhash.png
programs:
  - program: grants
    name: Grants
    organization: Vinteum
    role:
      EN: Grantee
      BR: Grantee
    status: past
    end: '2026-08'
    work:
      EN: Stratum V2
      BR: Stratum V2
    href: /programs/grants
focus:
  - Mining
  - Stratum V2
  - Rust
links:
  - label: GitHub
    href: 'https://github.com/plebhash'
    icon: github
  - label: X
    href: 'https://x.com/plebhash'
    icon: twitter
  - label: Website
    href: 'https://plebhash.github.io'
    icon: website
projects:
  - name: Stratum V2 Apps
    href: 'https://github.com/stratum-mining/sv2-apps'
    description:
      EN: Stratum V2 pool and miner applications
      BR: Aplicações Stratum V2 para pools e mineradores.
    contribution:
      EN: "Develops Stratum V2 job-declaration infrastructure, working on reusable server architecture and reliable client–server coordination as mining jobs are validated against changing mempool contents."
      BR: "Desenvolve a infraestrutura de declaração de jobs do Stratum V2, trabalhando em uma arquitetura de servidor reutilizável e na coordenação confiável entre cliente e servidor durante a validação de jobs diante de mudanças na mempool."
  - name: Stratum V2 UniFFI
    href: https://github.com/stratum-mining/sv2-uniffi
    description:
      EN: Python and C++ bindings for the Stratum V2 reference implementation.
      BR: Bindings Python e C++ para a implementação de referência do Stratum V2.
    contribution:
      EN: "Contributes to making Stratum V2’s Rust APIs usable from other languages through C++ bindings, with tests and examples for integration."
      BR: "Contribui para disponibilizar as APIs Rust do Stratum V2 em outras linguagens por meio de bindings C++, com testes e exemplos de integração."
contributions:
  - id: github-stratum-mining-sv2-apps-986
    title:
      EN: >-
        JDC absorbs missing-txs refusals; JDS caps lost-transaction rounds at
        three and logs every answered declaration
      BR: >-
        JDC absorbs missing-txs refusals; JDS caps lost-transaction rounds at
        three and logs every answered declaration
    date: '2026-11-06'
    source: 'stratum-mining/sv2-apps · #986'
    type: PR
    href: 'https://github.com/stratum-mining/sv2-apps/pull/986'
    description:
      EN: Lets the client discard a refused declaration without dropping pool/server connections,
        caps lost-transaction retry rounds at three and logs declaration outcomes.
      BR: Permite que o cliente descarte uma declaração recusada sem derrubar conexões com
        pool e servidor, limita a três as rodadas de novas tentativas para transações perdidas
        e registra os resultados das declarações.
  - id: github-stratum-mining-sv2-apps-977
    title:
      EN: 'fix(jd-server): ask again for transactions the node lost between rounds'
      BR: 'fix(jd-server): ask again for transactions the node lost between rounds'
    date: '2026-11-05'
    source: 'stratum-mining/sv2-apps · #977'
    type: PR
    href: 'https://github.com/stratum-mining/sv2-apps/pull/977'
    description:
      EN: Requests transactions again when they disappear from the node’s mempool between
        validation rounds.
      BR: Solicita novamente transações que desaparecem do mempool do nó entre rodadas de
        validação.
  - id: github-stratum-mining-sv2-apps-299
    title:
      EN: Reusable Job Declarator Server library
      BR: Biblioteca reutilizável do Job Declarator Server
    source: 'stratum-mining/sv2-apps · #299'
    type: PR
    href: https://github.com/stratum-mining/sv2-apps/pull/299
    description:
      EN: Extracts jd_server_sv2 with a modular JobValidationEngine, a Bitcoin Core IPC implementation
        and pool integration. Merged pull request.
      BR: Extrai jd_server_sv2 com uma JobValidationEngine modular, implementação via IPC do Bitcoin
        Core e integração ao pool. Pull request integrado.
  - id: github-stratum-mining-sv2-uniffi-13
    title:
      EN: C++ bindings for Stratum V2
      BR: Bindings C++ para Stratum V2
    source: 'stratum-mining/sv2-uniffi · #13'
    type: PR
    href: https://github.com/stratum-mining/sv2-uniffi/pull/13
    description:
      EN: Adds C++ binding generation, tests and examples alongside the existing Python bindings.
        Merged pull request.
      BR: Adiciona geração de bindings C++, testes e exemplos ao lado dos bindings Python existentes.
        Pull request integrado.
updatedAt: '2026-11-18'
affiliations:
  - organization: Btrust
    role: { EN: Grantee, BR: Grantee }
    status: current
    start: '2026-09'
---
## EN

plebhash develops infrastructure for Stratum V2 adoption. His work connects the reference implementation to Bitcoin Core, makes job declaration reusable for pools and improves missing-transaction recovery in the Stratum V2 applications.

## PT

plebhash desenvolve infraestrutura para a adoção do Stratum V2. Seu trabalho conecta a implementação de referência ao Bitcoin Core, torna o protocolo de declaração de jobs reutilizável por pools e melhora a recuperação de transações ausentes nas aplicações Stratum V2.
