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
  - program: deep-dive
    name: Deep Dive
    organization: Vinteum
    role:
      EN: Participant
      BR: Participante
    status: past
    start: '2026-10-19'
    end: '2026-10-23'
    work:
      EN: Offchain protocols and Bitcoin Layer 2
      BR: Protocolos offchain e camada 2 do Bitcoin
    href: https://www.vinteum.org/blog/inside-a-vinteum-deep-dive-sharing-and-transferring-bitcoin-utxos-offchain
    description:
      EN: "Week-long study at Casa21 in São Paulo of payment channels, eltoo, channel factories, CoinPool, Ark and statechains, reconstructing their transaction structures, conflict-resolution mechanisms and unilateral exit paths."
      BR: "Semana de estudos na Casa21, em São Paulo, sobre canais de pagamento, eltoo, channel factories, CoinPool, Ark e statechains, reconstruindo suas estruturas de transações, mecanismos de resolução de conflitos e caminhos de saída unilateral."
focus:
  - Ark
  - Fuzzing
  - Testing
  - Rust
  - Utreexo
  - Bitcoin Nodes
links:
  - label: Website
    href: 'https://luca0x46.com/'
    icon: website
  - label: Blog
    href: 'https://luca0x46.com/blog'
    icon: blog
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
  - name: Bark
    href: https://gitlab.com/ark-bitcoin/bark
    current: true
    description:
      EN: Ark wallet, server and libraries developed by Second.
      BR: Carteira, servidor e bibliotecas Ark desenvolvidos pela Second.
    contribution:
      EN: "Works on Bark quality assurance, test infrastructure and wallet reliability. Built the barkd integration and differential persistence test suites, introduced mutation testing, reworked wallet recovery for large wallets, fixed exit progression and hardened server input validation. Also performs security reviews, validates Bark integrations before release and supports users and integrators."
      BR: "Trabalha na garantia de qualidade, na infraestrutura de testes e na confiabilidade de carteiras no Bark. Criou as suítes de testes de integração do barkd e de testes diferenciais de persistência, introduziu testes de mutação, reformulou a recuperação de carteiras grandes, corrigiu a progressão de saídas e reforçou a validação de entradas no servidor. Também realiza revisões de segurança, valida integrações do Bark antes do lançamento e dá suporte a usuários e integradores."
  - name: Bark fuzzing
    href: https://gitlab.com/ark-bitcoin/bark/-/tree/master/fuzz
    current: true
    description:
      EN: Coverage-guided fuzzing of Bark's protocol decoders with honggfuzz.
      BR: Fuzzing guiado por cobertura dos decodificadores de protocolo do Bark com honggfuzz.
    contribution:
      EN: "Created the fuzzing setup, including decoder targets, runner, crash tooling, CI checks and a shared harness that mirrors the server's unwind-on-panic behavior. Runs continuous campaigns and fixed panics found in decoders that parse untrusted input."
      BR: "Criou a estrutura de fuzzing, incluindo alvos de decodificadores, executor, ferramentas de análise de falhas, verificações de CI e um harness compartilhado que reproduz o comportamento de unwind em panics do servidor. Executa campanhas contínuas e corrigiu panics encontrados em decodificadores que processam entradas não confiáveis."
  - name: Floresta
    href: 'https://github.com/getfloresta/Floresta'
    current: false
    description:
      EN: 'A lightweight and embeddable Bitcoin client, built for sovereignty.'
      BR: Cliente Bitcoin compacto e integrável em outras aplicações.
    contribution:
      EN: "Contributed to Floresta’s Utreexo peer verification and accumulator-selection reliability, with validation logic and tests for conflicting or unresponsive peers."
      BR: "Contribuiu para a verificação de peers Utreexo e a confiabilidade da seleção de acumuladores no Floresta, com lógica de validação e testes para peers divergentes ou sem resposta."
contributions:
  - id: bark-exit-rbf
    featured: true
    title:
      EN: Fee bumping for exits in a dynamic fee market
      BR: Aumento de taxa em saídas com mercado de taxas dinâmico
    date: '2026-06-24'
    source: ark-bitcoin/bark · !2216
    type: PR
    href: https://gitlab.com/ark-bitcoin/bark/-/merge_requests/2216
    description:
      EN: Fixed exit transactions stalling when fee rates rose, because replacement was skipped for
        wallet-originated transactions. Merged in June 2026.
      BR: Corrigiu transações de saída que travavam quando as taxas subiam, porque a substituição era
        ignorada para transações originadas na carteira. Integrado em junho de 2026.
  - id: bark-batched-recovery
    featured: true
    title:
      EN: Batched VTXO recovery
      BR: Recuperação de VTXOs em lotes
    date: '2026-10-13'
    source: ark-bitcoin/bark · !2617
    type: PR
    href: https://gitlab.com/ark-bitcoin/bark/-/merge_requests/2617
    description:
      EN: Made wallet recovery fetch VTXO data in batches through new server RPCs instead of one
        request per VTXO, so wallets with tens of thousands of VTXOs can recover. Merged in October 2026.
      BR: Fez a recuperação de carteiras buscar dados de VTXOs em lotes por meio de novos RPCs do
        servidor, em vez de uma requisição por VTXO, permitindo recuperar carteiras com dezenas de
        milhares de VTXOs. Integrado em outubro de 2026.
  - id: second-bark-automated-testing
    title:
      EN: Bark VTXO fuzz targets
      BR: Alvos de fuzzing de VTXOs no Bark
    date: '2026-02-20'
    source: ark-bitcoin/bark · !1557
    type: PR
    href: https://gitlab.com/ark-bitcoin/bark/-/merge_requests/1557
    description:
      EN: Introduced fuzzing to Bark with honggfuzz targets for VTXO serialization, deserialization,
        field access and round-trip checks. Merged in February 2026.
      BR: Introduziu fuzzing no Bark com alvos honggfuzz para serialização, desserialização, acesso a
        campos e verificações de round-trip de VTXOs. Integrado em fevereiro de 2026.
  - id: bark-fuzz-server-panic-harness
    title:
      EN: Fuzz harness mirroring server panic behavior
      BR: Harness de fuzzing que reproduz o comportamento de panics do servidor
    date: '2026-07-16'
    source: ark-bitcoin/bark · !2282
    type: PR
    href: https://gitlab.com/ark-bitcoin/bark/-/merge_requests/2282
    description:
      EN: Added a shared harness that contains panics as the server does, with a replay mode,
        panic-preserving minimization and seed-corpus protection. Merged in July 2026.
      BR: Adicionou um harness compartilhado que contém panics como o servidor, com modo de replay,
        minimização que preserva panics e proteção do corpus inicial. Integrado em julho de 2026.
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
  - id: second-barkd-rest-test-framework
    title:
      EN: Bark daemon REST test framework
      BR: Framework de testes REST do daemon Bark
    date: '2026-03-06'
    source: ark-bitcoin/bark · !1708
    type: PR
    href: https://gitlab.com/ark-bitcoin/bark/-/merge_requests/1708
    description:
      EN: Merged an initial barkd REST test framework that creates and funds a wallet, then boards a UTXO
        into a VTXO.
      BR: Integrou um framework inicial de testes REST do barkd que cria e financia uma carteira e converte
        um UTXO em VTXO por boarding.
  - id: bark-mutation-testing-signatures
    title:
      EN: Signature-validation tests from mutation testing
      BR: Testes de validação de assinaturas a partir de testes de mutação
    date: '2026-11-16'
    source: ark-bitcoin/bark · !2784
    type: PR
    href: https://gitlab.com/ark-bitcoin/bark/-/merge_requests/2784
    description:
      EN: Added a regression test, driven by mutation testing of the unit suite, showing that
        validate_sigs rejects an invalid signature. Merged in November 2026.
      BR: Adicionou um teste de regressão, motivado por testes de mutação da suíte de unidade,
        que garante que validate_sigs rejeita uma assinatura inválida. Integrado em novembro de 2026.
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
  - id: bark-server-exited-offboards
    title:
      EN: Refuse offboards of exited VTXOs
      BR: Recusa de offboards de VTXOs já saídos
    date: '2026-08-03'
    source: ark-bitcoin/bark · !2337
    type: PR
    href: https://gitlab.com/ark-bitcoin/bark/-/merge_requests/2337
    description:
      EN: Made the server reject offboards of VTXOs that were already exited on-chain, with a
        regression test. Merged in August 2026.
      BR: Fez o servidor rejeitar offboards de VTXOs que já saíram on-chain, com um teste de
        regressão. Integrado em agosto de 2026.
  - id: bark-server-htlc-inputs
    title:
      EN: Refuse HTLC VTXOs as generic inputs
      BR: Recusa de VTXOs HTLC como entradas genéricas
    date: '2026-08-03'
    source: ark-bitcoin/bark · !2341
    type: PR
    href: https://gitlab.com/ark-bitcoin/bark/-/merge_requests/2341
    description:
      EN: Gated round, offboard and arkoor inputs on VTXO policy type so HTLC VTXOs cannot be spent
        through generic paths. Merged in August 2026.
      BR: Condicionou entradas de rodadas, offboards e arkoor ao tipo de política do VTXO, para que
        VTXOs HTLC não possam ser gastos por caminhos genéricos. Integrado em agosto de 2026.
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
  - id: bark-cli-drives-barkd
    title:
      EN: bark-cli as a thin client over barkd
      BR: bark-cli como cliente leve sobre o barkd
    date: '2026-10-22'
    source: ark-bitcoin/bark · !2357
    type: PR
    href: https://gitlab.com/ark-bitcoin/bark/-/merge_requests/2357
    description:
      EN: Refactored the command-line wallet into a REST client that drives barkd, adding BIP 321,
        watch, round-list and debug-info commands. Merged in October 2026.
      BR: Refatorou a carteira de linha de comando em um cliente REST que controla o barkd, adicionando
        comandos de BIP 321, watch, listagem de rodadas e debug-info. Integrado em outubro de 2026.
  - id: bark-harden-datadir
    title:
      EN: Harden wallet datadir and secret files
      BR: Proteção do datadir e dos arquivos secretos da carteira
    date: '2026-06-29'
    source: ark-bitcoin/bark · !2194
    type: PR
    href: https://gitlab.com/ark-bitcoin/bark/-/merge_requests/2194
    description:
      EN: Restricted permissions on the wallet datadir, database and mnemonic files. Merged in June 2026.
      BR: Restringiu as permissões do datadir, do banco de dados e dos arquivos de mnemônico da carteira.
        Integrado em junho de 2026.
  - id: github-getfloresta-Floresta-565
    title:
      EN: Improve find_who_is_lying and find_accumulator_for_block
      BR: Improve find_who_is_lying and find_accumulator_for_block
    date: '2025-12-31'
    source: 'getfloresta/Floresta · #565'
    type: PR
    href: 'https://github.com/getfloresta/Floresta/pull/565'
writing:
  - id: personal-blog-btcpp-2026
    title:
      EN: Exploiting BTC
      BR: Exploiting BTC
    date: '2026-03-02'
    source: luca0x46.com
    href: 'https://luca0x46.com/blog/btcpp'
    description:
      EN: Notes from btc++ 2026 in Brazil, the exploit edition, covering differential fuzzing, a hardware-wallet exploitation workshop, BitVM3 and bridge security.
      BR: Notas do btc++ 2026 no Brasil, edição exploit, sobre fuzzing diferencial, um workshop de exploração de carteiras de hardware, BitVM3 e segurança de bridges.
  - id: personal-blog-mechanical-engineer-boss
    title:
      EN: A Mechanical Engineer's Guide to Become a BOSS
      BR: A Mechanical Engineer's Guide to Become a BOSS
    date: '2026-03-02'
    source: luca0x46.com
    href: 'https://luca0x46.com/blog/mechanical-engineers-guide-to-become-a-boss'
updatedAt: '2026-11-19'
affiliations:
  - organization: Second
    role: { EN: QA Engineer & Support, BR: Engenheiro de QA e Suporte }
    status: current
    start: '2026-01'
    href: https://second.tech
---
## EN

Luca0x46 is a QA engineer at Second, where he also handles support. He works on Bark testing and reliability through fuzzing and integration, differential and mutation testing, covering wallet recovery, unilateral exits and server input validation. He previously contributed peer-verification logic and tests for Utreexo accumulator handling in Floresta.

## PT

Luca0x46 é engenheiro de QA na Second, onde também atua no suporte. Trabalha nos testes e na confiabilidade do Bark com fuzzing e testes de integração, diferenciais e de mutação, cobrindo recuperação de carteiras, saídas unilaterais e validação de entradas no servidor. Antes, contribuiu com verificação de peers e testes do acumulador Utreexo no Floresta.
