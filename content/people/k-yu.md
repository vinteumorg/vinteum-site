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
  - Fuzzing
  - Differential Testing
  - Security
  - Bitcoin Core
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
  - id: github-bitcoin-bitcoin-36207
    title:
      EN: 'kernel: add wtxid accessor'
      BR: 'kernel: adicionar acesso ao wtxid'
    date: '2026-09-15'
    source: 'bitcoin/bitcoin · #36207'
    type: PR
    featured: true
    href: 'https://github.com/bitcoin/bitcoin/pull/36207'
    description:
      EN: Exposed cached transaction wtxids and witness detection through the libbitcoinkernel C API and C++ wrappers, avoiding client-side hash recomputation, with tests for legacy and witness transactions. Merged in September 2026.
      BR: Expôs o wtxid já calculado e a detecção de witness pela API C e pelos wrappers C++ do libbitcoinkernel, evitando que clientes recalculem o hash, com testes para transações com e sem witness. Integrado em setembro de 2026.
  - id: github-bitcoinfuzz-bitcoinfuzz-429
    title:
      EN: Differential libbitcoinkernel integration
      BR: Integração diferencial de libbitcoinkernel
    date: '2026-03-16'
    source: 'bitcoinfuzz/bitcoinfuzz · #429'
    type: PR
    featured: true
    href: 'https://github.com/bitcoinfuzz/bitcoinfuzz/pull/429'
    description:
      EN: Added differential fuzzing between two statically linked libbitcoinkernel builds, with configurable revisions and symbol renaming to avoid collisions. Merged in March 2026.
      BR: Adicionou fuzzing diferencial entre dois builds de libbitcoinkernel ligados estaticamente, com revisões configuráveis e renomeação de símbolos para evitar colisões. Integrado em março de 2026.
  - id: github-bitcoinfuzz-bitcoinfuzz-625
    title:
      EN: Compare PSBT parsing failures across implementations
      BR: Comparar falhas no parsing de PSBT entre implementações
    date: '2026-09-02'
    source: 'bitcoinfuzz/bitcoinfuzz · #625'
    type: PR
    href: 'https://github.com/bitcoinfuzz/bitcoinfuzz/pull/625'
    description:
      EN: Standardised PSBT parsing failures across implementations. The work uncovered divergences in embit, libwally-core and NBitcoin. Merged in September 2026.
      BR: Padronizou falhas no parsing de PSBT entre implementações. O trabalho revelou divergências em embit, libwally-core e NBitcoin. Integrado em setembro de 2026.
  - id: github-bitcoinfuzz-bitcoinfuzz-480
    title:
      EN: Integrate bitcoinerlab Miniscript into Bitcoinfuzz
      BR: Integrar Miniscript de bitcoinerlab ao Bitcoinfuzz
    date: '2026-05-06'
    source: 'bitcoinfuzz/bitcoinfuzz · #480'
    type: PR
    href: 'https://github.com/bitcoinfuzz/bitcoinfuzz/pull/480'
    description:
      EN: Integrated bitcoinerlab's TypeScript Miniscript implementation into Bitcoinfuzz for differential parser testing. Merged in May 2026.
      BR: Integrou a implementação TypeScript de Miniscript de bitcoinerlab ao Bitcoinfuzz para testes diferenciais de parsing. Integrado em maio de 2026.
  - id: github-libbitcoin-libbitcoin-system-1829
    title:
      EN: Reject empty blocks in consensus validation
      BR: Rejeitar blocos vazios na validação de consenso
    date: '2026-05-08'
    source: 'libbitcoin/libbitcoin-system · #1829'
    type: PR
    href: 'https://github.com/libbitcoin/libbitcoin-system/pull/1829'
    description:
      EN: Fixed a consensus-validation bug in empty-block rejection, discovered while integrating libbitcoin-system into Bitcoinfuzz. Merged in May 2026.
      BR: Corrigiu uma falha de validação de consenso na rejeição de blocos vazios, identificada durante a integração do libbitcoin-system ao Bitcoinfuzz. Integrado em maio de 2026.
  - id: github-libbitcoin-libbitcoin-system-1837
    title:
      EN: Abort script execution on structural OP_CHECKMULTISIG errors
      BR: Interromper execução em erros estruturais de OP_CHECKMULTISIG
    date: '2026-05-21'
    source: 'libbitcoin/libbitcoin-system · #1837'
    type: PR
    href: 'https://github.com/libbitcoin/libbitcoin-system/pull/1837'
    description:
      EN: Corrected consensus-validation behaviour for OP_CHECKMULTISIG. Merged in May 2026.
      BR: Corrigiu o comportamento de validação de consenso de OP_CHECKMULTISIG. Integrado em maio de 2026.
  - id: github-libbitcoin-libbitcoin-system-1860
    title:
      EN: Reject non-canonical CompactSize encodings
      BR: Rejeitar codificações CompactSize não canônicas
    date: '2026-06-05'
    source: 'libbitcoin/libbitcoin-system · #1860'
    type: PR
    href: 'https://github.com/libbitcoin/libbitcoin-system/pull/1860'
    description:
      EN: Made the CompactSize reader reject non-canonical encodings, added regression tests and updated tests that relied on overlong encodings. Identified through differential testing while integrating libbitcoin-system into Bitcoinfuzz. Merged in June 2026.
      BR: Fez o leitor CompactSize rejeitar codificações não canônicas, adicionou testes de regressão e ajustou testes que dependiam de codificações maiores que o necessário. Problema identificado em testes diferenciais durante a integração do libbitcoin-system ao Bitcoinfuzz. Integrado em junho de 2026.
  - id: github-bitcoinfuzz-bitcoinfuzz-647
    title:
      EN: Compare libbitcoinkernel transaction validation with Bitcoin Core
      BR: Comparar a validação de transações do libbitcoinkernel com o Bitcoin Core
    date: '2026-09-08'
    source: 'bitcoinfuzz/bitcoinfuzz · #647'
    type: PR
    href: 'https://github.com/bitcoinfuzz/bitcoinfuzz/pull/647'
    description:
      EN: Added transaction_eval to the libbitcoinkernel modules, enabling differential comparison of transaction validation through the public kernel API against Bitcoin Core's internal behaviour. Merged in September 2026.
      BR: Adicionou transaction_eval aos módulos libbitcoinkernel, permitindo comparar por fuzzing diferencial a validação de transações pela API pública do kernel com o comportamento interno do Bitcoin Core. Integrado em setembro de 2026.
  - id: github-metacosa-nbitcoin-1327
    title:
      EN: Reject trailing data during transaction deserialization
      BR: Rejeitar dados excedentes na desserialização de transações
    date: '2026-08-27'
    source: 'MetacoSA/NBitcoin · #1327'
    type: PR
    href: 'https://github.com/MetacoSA/NBitcoin/pull/1327'
    description:
      EN: Fixed transaction deserialization to reject trailing bytes and added a PSBT regression test, discovered while investigating parsing divergences with Bitcoinfuzz. Merged in August 2026.
      BR: Corrigiu a desserialização de transações para rejeitar bytes excedentes e adicionou um teste de regressão de PSBT, descoberto durante a investigação de divergências de parsing com o Bitcoinfuzz. Integrado em agosto de 2026.
  - id: github-elementsproject-libwally-core-541
    title:
      EN: Reject trailing data in PSBT parsing
      BR: Rejeitar dados excedentes no parsing de PSBT
    date: '2026-08-06'
    source: 'ElementsProject/libwally-core · #541'
    type: PR
    href: 'https://github.com/ElementsProject/libwally-core/pull/541'
    description:
      EN: Proposed rejecting trailing bytes in PSBT parsing and added regression vectors after finding a divergence with Bitcoinfuzz. The maintainer incorporated the change in #542 behind a parse flag to preserve compatibility. Open.
      BR: Propôs rejeitar bytes excedentes no parsing de PSBT e adicionou vetores de regressão após encontrar uma divergência com o Bitcoinfuzz. O mantenedor incorporou a alteração no #542 sob uma flag de parsing para preservar compatibilidade. Aberto.
  - id: github-bitcoin-bitcoin-36686
    title:
      EN: 'test: cover cumulative input value range in CheckTxInput tests'
      BR: 'test: cover cumulative input value range in CheckTxInput tests'
    date: '2026-11-04'
    source: 'bitcoin/bitcoin · #36686'
    type: PR
    href: 'https://github.com/bitcoin/bitcoin/pull/36686'
  - id: github-bitcoinfuzz-bitcoinfuzz-575
    title:
      EN: Add libbitcoin-system integration to Bitcoinfuzz
      BR: Integrar libbitcoin-system ao Bitcoinfuzz
    date: '2026-06-10'
    source: 'bitcoinfuzz/bitcoinfuzz · #575'
    type: PR
    featured: true
    href: 'https://github.com/bitcoinfuzz/bitcoinfuzz/pull/575'
    description:
      EN: Completed the integration of libbitcoin-system into Bitcoinfuzz, with differential targets and build and CI support. The investigation led to upstream fixes in consensus validation, non-canonical CompactSize decoding and BIP32 key validation. Merged in June 2026.
      BR: Concluiu a integração do libbitcoin-system ao Bitcoinfuzz, com alvos diferenciais e suporte de compilação e CI. A investigação resultou em correções upstream de validação de consenso, desserialização CompactSize não canônica e validação de chaves BIP32. Integrado em junho de 2026.
publications:
  - id: quantum-software-engineering-systematic-mapping-2024
    title:
      EN: 'Uncovering the Effects of Quantum Computing on Software Engineering: A Systematic Mapping'
      BR: 'Uncovering the Effects of Quantum Computing on Software Engineering: A Systematic Mapping'
    date: '2024-10-26'
    authors:
      - Valter Vieira de Camargo
      - Renato Bueno
      - Caio O. W. G. Cadini
      - Guilherme d. S. Wisniewski
      - Augusto d. S. G. Vaz
      - Caio U. Sampaio
      - Vanderlei de Brito Junior
      - Daniel San Martín
    venue: 'The 30th International Conference on Distributed Multimedia Systems (DMSVIVA 2024), pp. 55-63'
    publicationType: paper
    doi: 10.18293/dmsviva2024-090
    href: 'https://doi.org/10.18293/dmsviva2024-090'
    description:
      EN: Maps research on software engineering for quantum computing, covering testing and quality, reengineering and modernization, modeling, and development processes and platforms.
      BR: Mapeia pesquisas sobre engenharia de software para computação quântica, abrangendo testes e qualidade, reengenharia e modernização, modelagem e processos e plataformas de desenvolvimento.
updatedAt: '2026-11-23'
---
## EN

K-YU contributes to Bitcoin Core testing and differential fuzzing with Bitcoinfuzz. His work examines disagreements between Bitcoin implementations, extends validation coverage and improves test corpora, including integration of libbitcoin-system into Bitcoinfuzz.

## PT

K-YU contribui para testes do Bitcoin Core e fuzzing diferencial com Bitcoinfuzz. Seu trabalho investiga divergências entre implementações de Bitcoin, amplia a cobertura de validação e melhora corpora de teste, incluindo a integração de libbitcoin-system ao Bitcoinfuzz.
