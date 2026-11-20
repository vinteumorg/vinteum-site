---
name: K-YU
image: /assets/images/people/illustrations/k-yu.png
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
      EN: Bitcoin Core / Bitcoinfuzz
      BR: Bitcoin Core / Bitcoinfuzz
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
      EN: Bitcoinfuzz
      BR: Bitcoinfuzz
    href: /programs/bitcoin-dev-launchpad
    fundedBy: Vinteum
focus:
  - Bitcoin Core
  - Fuzzing
  - Testing
links:
  - label: GitHub
    href: 'https://github.com/KY-U'
    icon: github
  - label: X
    href: 'https://x.com/KYU2029255'
    icon: twitter
  - label: LinkedIn
    href: 'https://www.linkedin.com/in/caio-ueda-sampaio-23511b253/'
    icon: linkedin
projects:
  - name: Bitcoinfuzz
    href: https://github.com/bitcoinfuzz/bitcoinfuzz
    description:
      EN: Differential fuzzing framework comparing independent Bitcoin implementations.
      BR: Framework de fuzzing diferencial que compara implementações independentes de Bitcoin.
    contribution:
      EN: Develops implementation integrations and differential test targets, investigates behavioral differences and improves build, CI and corpus infrastructure for reproducible testing.
      BR: Desenvolve integrações de implementações e alvos de testes diferenciais, investiga diferenças de comportamento e melhora a infraestrutura de compilação, CI e corpora para testes reproduzíveis.
  - name: Bitcoin Core
    href: https://github.com/bitcoin/bitcoin
    description:
      EN: Bitcoin node and wallet implementation.
      BR: Implementação de nó e carteira Bitcoin.
    contribution:
      EN: Contributes consensus-validation tests and BitcoinKernel API work, alongside code review aimed at improving validation coverage and making kernel behavior accessible to downstream testing tools.
      BR: Contribui com testes de validação de consenso e trabalho na API de BitcoinKernel, além de revisão de código voltada a ampliar a cobertura de validação e expor o comportamento do kernel a ferramentas de teste.
contributions:
  - id: github-bitcoinfuzz-corpora-81
    title:
      EN: Add kernel_transaction_check corpus
      BR: Add kernel_transaction_check corpus
    date: '2026-11-13'
    source: 'bitcoinfuzz/corpora · #81'
    type: PR
    href: https://github.com/bitcoinfuzz/corpora/pull/81
  - id: github-bitcoin-bitcoin-36686
    title:
      EN: 'test: cover cumulative input value range in CheckTxInput tests.'
      BR: 'test: cover cumulative input value range in CheckTxInput tests.'
    date: '2026-11-04'
    source: 'bitcoin/bitcoin · #36686'
    type: PR
    href: https://github.com/bitcoin/bitcoin/pull/36686
  - id: github-bitcoinfuzz-bitcoinfuzz-575
    title:
      EN: Add libbitcoin-system integration to Bitcoinfuzz
      BR: Integrar libbitcoin-system ao Bitcoinfuzz
    date: '2026-06-10'
    source: 'bitcoinfuzz/bitcoinfuzz · #575'
    type: PR
    href: https://github.com/bitcoinfuzz/bitcoinfuzz/pull/575
    description:
      EN: Merged the libbitcoin-system module with script, transaction, address and block targets plus build
        and CI integration.
      BR: Adicionou o módulo libbitcoin-system, com alvos de scripts, transações, endereços e blocos e integração
        de compilação e CI; PR integrado.
  - id: github-bitcoin-kernel-version-discussion-36283
    title:
      EN: Review transaction-version wrapper test coverage
      BR: Revisar cobertura de testes dos wrappers de versão de transação
    date: '2026-09-17'
    source: 'bitcoin/bitcoin · #36283'
    type: Code Review
    href: https://github.com/bitcoin/bitcoin/pull/36283#issuecomment-5716550593
    description:
      EN: Suggested testing GetVersion() on TransactionView as well as the owning Transaction wrapper, providing
        a concrete test diff in the PR discussion.
      BR: Sugeriu testar GetVersion() em TransactionView e no wrapper proprietário Transaction, com um diff
        concreto de testes na discussão do PR.
updatedAt: '2026-11-18'
---
## EN

K-YU contributes to Bitcoin Core testing and differential fuzzing with Bitcoinfuzz. His work examines disagreements between Bitcoin implementations, extends validation coverage and improves test corpora, including integration of libbitcoin-system into Bitcoinfuzz.

## PT

K-YU contribui para testes do Bitcoin Core e fuzzing diferencial com Bitcoinfuzz. Seu trabalho investiga divergências entre implementações de Bitcoin, amplia a cobertura de validação e melhora corpora de teste, incluindo a integração de libbitcoin-system ao Bitcoinfuzz.
