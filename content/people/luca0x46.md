---
name: Luca0x46
image: /assets/images/people/illustrations/luca0x46.png
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
    start: '2025-03'
    cohort: 1
    work:
      EN: Floresta
      BR: Floresta
    href: /programs/fellowship
    description:
      EN: "Studied networking and systems during the fellowship while contributing to Floresta. After the first Bitcoin Dev Launchpad cohort, moved into QA engineering at Second, drawing on his Floresta contributions and study."
      BR: "Estudou redes e sistemas durante a fellowship enquanto contribuía ao Floresta. Após a primeira turma do Bitcoin Dev Launchpad, passou à engenharia de QA na Second, com base nas contribuições ao Floresta e nos estudos."
  - program: bitcoin-dev-launchpad
    name: Bitcoin Dev Launchpad
    organization: Vinteum
    role:
      EN: Alumnus
      BR: Ex-participante
    status: past
    cohort: 1
    work:
      EN: Second
      BR: Second
    href: /programs/bitcoin-dev-launchpad
focus:
  - Utreexo
  - Bitcoin Nodes
links:
  - label: Website
    href: 'https://luca0x46.com/'
    icon: website
  - label: GitHub
    href: 'https://github.com/luca0x46'
    icon: github
  - label: GitLab
    href: 'https://gitlab.com/luca0x46'
    icon: gitlab
  - label: X
    href: 'https://x.com/luca0x46'
    icon: twitter
projects:
  - name: Floresta
    href: 'https://github.com/getfloresta/Floresta'
    current: false
    description:
      EN: 'A lightweight and embeddable Bitcoin client, built for sovereignty.'
      BR: Cliente Bitcoin compacto e integrável em outras aplicações.
    contribution:
      EN: "Contributed to Floresta’s Utreexo peer verification and accumulator-selection reliability, with validation logic and tests for conflicting or unresponsive peers."
      BR: "Contribuiu para a verificação de peers Utreexo e a confiabilidade da seleção de acumuladores no Floresta, com lógica de validação e testes para peers divergentes ou sem resposta."
  - name: Bark
    href: https://gitlab.com/ark-bitcoin/bark
    current: true
    description:
      EN: Ark wallet, server and libraries developed by Second.
      BR: Carteira, servidor e bibliotecas Ark desenvolvidos pela Second.
    contribution:
      EN: "Works on Bark quality assurance and wallet reliability through fuzzing, integration and differential testing, covering VTXO handling, persistence, wallet synchronization and daemon exit behavior."
      BR: "Trabalha na garantia de qualidade e na confiabilidade de carteiras no Bark por meio de fuzzing e testes de integração e diferenciais, abrangendo VTXOs, persistência, sincronização de carteiras e comportamento de saídas do daemon."
contributions:
  - id: bark-persistence-differential-testing
    title:
      EN: Differential tests for Bark persistence backends
      BR: Testes diferenciais dos backends de persistência do Bark
    date: '2026-03-16'
    source: 'ark-bitcoin/bark · !1744'
    type: PR
    href: https://gitlab.com/ark-bitcoin/bark/-/merge_requests/1744
    description:
      EN: Merged a shared test suite that exercises SQLite and in-memory persistence in lockstep and
        checks that both backends return identical results.
      BR: Integrou uma suíte compartilhada que exercita a persistência SQLite e em memória em paralelo
        e verifica se ambos os backends retornam resultados idênticos.
  - id: bark-deep-reorg-wallet-sync
    title:
      EN: Fix wallet synchronization after deep reorgs
      BR: Correção da sincronização de carteiras após reorganizações profundas
    date: '2026-04-09'
    source: 'ark-bitcoin/bark · !1898'
    type: PR
    href: https://gitlab.com/ark-bitcoin/bark/-/merge_requests/1898
    description:
      EN: Fixed wallet synchronization stalling after deep reorgs by resuming BDK block emission from
        the latest chain agreement rather than the previous tip. Merged with a deep-reorg test.
      BR: Corrigiu o travamento da sincronização após reorganizações profundas, retomando a emissão
        de blocos do BDK a partir do último ponto de concordância da cadeia, em vez do tip anterior.
        Integrado com um teste de reorganização profunda.
  - id: barkd-exit-background-sync
    title:
      EN: Daemon exit synchronization and regression tests
      BR: Sincronização de saídas do daemon e testes de regressão
    date: '2026-04-23'
    source: 'ark-bitcoin/bark · !1931'
    type: PR
    href: https://gitlab.com/ark-bitcoin/bark/-/merge_requests/1931
    description:
      EN: Fixed background exit synchronization when barkd is disconnected from the server and restored
        round synchronization in the daemon loop, with exit-scenario integration tests. Merged in April 2026.
      BR: Corrigiu a sincronização de saídas em segundo plano quando o barkd está desconectado do servidor
        e restaurou a sincronização de rodadas no loop do daemon, com testes de integração de cenários de saída.
  - id: github-getfloresta-Floresta-565
    title:
      EN: Improve find_who_is_lying and find_accumulator_for_block
      BR: Improve find_who_is_lying and find_accumulator_for_block
    date: '2025-12-31'
    source: 'getfloresta/Floresta · #565'
    type: PR
    href: 'https://github.com/getfloresta/Floresta/pull/565'
  - id: second-bark-automated-testing
    title:
      EN: Bark VTXO fuzz targets
      BR: Alvos de fuzzing de VTXOs no Bark
    source: ark-bitcoin/bark · !1557
    type: PR
    href: https://gitlab.com/ark-bitcoin/bark/-/merge_requests/1557
    description:
      EN: Merged fuzz targets for VTXO serialization, deserialization, field access and round-trip checks
        using honggfuzz.
      BR: Alvos de fuzzing integrados para serialização, desserialização, acesso a campos e verificações
        de round-trip de VTXOs com honggfuzz.
  - id: second-barkd-rest-test-framework
    title:
      EN: Bark daemon REST test framework
      BR: Framework de testes REST do daemon Bark
    source: ark-bitcoin/bark · !1708
    type: PR
    href: https://gitlab.com/ark-bitcoin/bark/-/merge_requests/1708
    description:
      EN: Merged an initial barkd REST test framework that creates and funds a wallet, then boards a UTXO
        into a VTXO.
      BR: Integrou um framework inicial de testes REST do barkd que cria e financia uma carteira e converte
        um UTXO em VTXO por boarding.
updatedAt: '2026-11-18'
affiliations:
  - organization: Second
    role: { EN: QA Engineer, BR: Engenheiro de QA }
    status: current
    start: '2026-01'
---
## EN

Luca0x46 is a QA engineer at Second, working on Bark fuzzing, integration tests and wallet reliability. He previously contributed peer-verification logic and tests for Utreexo accumulator handling in Floresta.

## PT

Luca0x46 é engenheiro de QA na Second, trabalhando em fuzzing, testes de integração e confiabilidade de carteiras no Bark. Anteriormente, contribuiu com lógica de verificação de peers e testes do acumulador Utreexo no Floresta.
