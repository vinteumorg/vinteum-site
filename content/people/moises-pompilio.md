---
name: Moises Pompilio
image: /assets/images/people/fellows/moisespompilio.jpg
programs:
  - program: fellowship
    name: Fellowship
    organization: Vinteum
    role:
      EN: Fellow
      BR: Fellow
    status: past
    end: '2025-11'
    start: '2025-03'
    cohort: 1
    work:
      EN: Floresta
      BR: Floresta
    href: /programs/fellowship
    description:
      EN: After the first Bitcoin Dev Launchpad cohort, tested LDK-node interoperability
        during the fellowship. Later expanded Floresta work to RPCs, Electrum and wallets
        with OpenSats support.
      BR: Após a primeira turma do Bitcoin Dev Launchpad, testou interoperabilidade no LDK-node
        durante o fellowship. Depois ampliou o trabalho no Floresta para RPCs, Electrum
        e carteiras, com apoio da OpenSats.
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
focus:
  - Bitcoin Nodes
  - Rust
  - Utreexo
links:
  - label: GitHub
    href: 'https://github.com/moisesPompilio'
    icon: github
  - label: X
    href: 'https://x.com/maicomjt'
    icon: twitter
projects:
  - name: Floresta
    href: 'https://github.com/getfloresta/Floresta'
    description:
      EN: 'A lightweight and embeddable Bitcoin client, built for sovereignty.'
      BR: Cliente Bitcoin compacto e integrável em outras aplicações.
    contribution:
      EN: "Contributes across Floresta’s validation, P2P error handling, RPC compatibility and watch-only wallet integration, with functional and integration testing that also covers Electrum behavior."
      BR: "Contribui para validação, tratamento de erros P2P, compatibilidade de RPCs e integração de carteiras somente de observação no Floresta, com testes funcionais e de integração que também abrangem o comportamento Electrum."
contributions:
  - id: github-getfloresta-Floresta-1376
    title:
      EN: 'refactor(wire): separate block and proof error handling'
      BR: 'refactor(wire): separate block and proof error handling'
    date: '2026-11-03'
    source: 'getfloresta/Floresta · #1376'
    type: PR
    href: 'https://github.com/getfloresta/Floresta/pull/1376'
    description:
      EN: Separates errors attributable to the block sender from Utreexo-proof errors. Adds
        chain-mocked tests for peer punishment and request-state cleanup.
      BR: Separa erros atribuíveis ao remetente do bloco de erros nas provas Utreexo. Acrescenta
        testes com uma cadeia simulada para punição de peers e limpeza do estado das requisições.
  - id: github-getfloresta-Floresta-1375
    title:
      EN: 'refactor(chain): separate block structure and BIP34 validation'
      BR: 'refactor(chain): separate block structure and BIP34 validation'
    date: '2026-11-02'
    source: 'getfloresta/Floresta · #1375'
    type: PR
    href: 'https://github.com/getfloresta/Floresta/pull/1375'
    description:
      EN: Separates block-structure checks for Merkle roots, witness commitments and block
        weight from the height-dependent BIP34 coinbase check, with reusable fixtures and
        tests for invalid blocks.
      BR: Separa verificações estruturais de raízes de Merkle, compromissos de witness e
        peso dos blocos da verificação de altura da coinbase exigida pelo BIP34, com fixtures
        reutilizáveis e testes de blocos inválidos.
updatedAt: '2026-11-18'
media:
  - id: moises-alumni-outlook-2026
    title:
      EN: From LDK-node interoperability to Floresta
      BR: Da interoperabilidade do LDK-node ao Floresta
    source: Vinteum · August 2026
    href: https://www.vinteum.org/blog/bitcoin-dev-launchpad-first-cohort-alumni-outlook
    description:
      EN: Progressed from the first Launchpad cohort to fellowship interoperability testing
        and broader Floresta contributions with OpenSats support.
      BR: Passou da primeira turma do Launchpad aos testes de interoperabilidade no fellowship
        e à ampliação das contribuições ao Floresta com apoio da OpenSats.
    mediaType: article
affiliations:
  - organization: OpenSats
    role: { EN: Grantee, BR: Grantee }
    status: current
    start: '2025-11'
    href: 'https://opensats.org/projects/floresta'
---
## EN

Moises Pompilio contributes to Floresta, a lightweight Bitcoin node using Utreexo. His work covers block validation, network error handling, RPCs and wallet integration, following interoperability testing with LDK-node during his Vinteum fellowship.

## PT

Moises Pompilio contribui para o Floresta, um nó Bitcoin leve que utiliza Utreexo. Trabalha com validação de blocos, tratamento de erros de rede, RPCs e integração com carteiras, após testar a interoperabilidade do LDK-node durante seu fellowship na Vinteum.
