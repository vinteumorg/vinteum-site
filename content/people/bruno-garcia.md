---
name: Bruno Garcia
image: /assets/images/people/illustrations/bruno-garcia.png
illustration: true
board: true
updatedAt: '2026-11-18'
focus:
  - Bitcoin Core
  - Fuzzing
  - Security
  - Mentorship
links:
  - label: GitHub
    href: 'https://github.com/brunoerg'
    icon: github
  - label: Blog
    icon: blog
    href: 'https://brunoerg.xyz/'
  - label: YouTube
    href: 'https://www.youtube.com/@BrunoGarcia99'
    icon: youtube
  - label: Instagram
    href: 'https://www.instagram.com/bruno.erg/'
    icon: instagram
  - label: Google Scholar
    href: 'https://scholar.google.com/citations?user=LMwaAgkAAAAJ&hl=en'
    icon: scholar
affiliations:
  - organization: Vinteum
    role:
      EN: Head of Engineering
      BR: Head of Engineering
    href: 'https://www.vinteum.org/about'
    directoryRole: team
writing:
  - id: personal-blog-the-state-of-bitcoinfuzz
    title:
      EN: The state of Bitcoinfuzz
      BR: The state of Bitcoinfuzz
    date: '2025-08-21'
    source: brunoerg.xyz
    href: 'https://brunoerg.xyz/2025/08/21/the-state-of-bitcoinfuzz.html'
  - id: personal-blog-dos-floresta
    title:
      EN: 2 DoS vulnerabilities on Floresta
      BR: 2 DoS vulnerabilities on Floresta
    date: '2026-03-10'
    source: brunoerg.xyz
    href: 'https://brunoerg.xyz/2026/03/10/dos-floresta.html'
projects:
  - name: "Bitcoin Core"
    href: "https://github.com/bitcoin/bitcoin"
    current: true
    description:
      EN: "Bitcoin full-node software and reference implementation of the protocol."
      BR: "Software de nó completo e implementação de referência do protocolo Bitcoin."
    contribution:
      EN: "Contributes fuzzing and regression tests across Bitcoin Core's wallet, networking and script logic. Uses mutation testing to identify gaps in test coverage."
      BR: "Contribui com fuzzing e testes de regressão nos componentes de carteira, rede e lógica de scripts do Bitcoin Core. Usa testes de mutação para identificar lacunas na cobertura de testes."
  - name: "Bitcoinfuzz"
    href: "https://github.com/bitcoinfuzz/bitcoinfuzz"
    current: true
    description:
      EN: "Differential-fuzzing framework comparing how independent Bitcoin, Lightning and related library implementations process identical inputs."
      BR: "Framework de fuzzing diferencial que compara como implementações independentes de Bitcoin, Lightning e bibliotecas relacionadas processam as mesmas entradas."
    contribution:
      EN: "Created the framework to investigate implementation disagreements and detect bugs."
      BR: "Criou o framework para investigar divergências entre implementações e detectar bugs."
  - name: "bcore-mutation"
    href: "https://github.com/brunoerg/bcore-mutation"
    current: true
    description:
      EN: "Mutation-testing tool for Bitcoin Core and libsecp256k1."
      BR: "Ferramenta de testes de mutação para Bitcoin Core e libsecp256k1."
    contribution:
      EN: "Develops tooling that generates mutants for changed or covered code, runs test commands against them and persists results for resumed analysis."
      BR: "Desenvolve ferramentas que geram mutantes de código alterado ou coberto por testes, executam comandos de teste contra eles e salvam resultados para retomar a análise."
  - name: Fuzzamoto
    href: https://github.com/oss-garage/fuzzamoto
    current: true
    description:
      EN: Holistic fuzzing framework for Bitcoin protocol implementations.
      BR: Framework de fuzzing holístico para implementações do protocolo Bitcoin.
    contribution:
      EN: "Contributes fuzzing scenarios and protocol-message generators for testing Bitcoin node behavior and compact-block relay."
      BR: "Contribui com cenários de fuzzing e geradores de mensagens de protocolo para testar o comportamento de nós Bitcoin e a retransmissão de blocos compactos."
media:
  - id: optech-podcast-2026-01-20
    title:
      EN: 'Bitcoin Optech Newsletter #388 Recap Podcast'
      BR: 'Bitcoin Optech Newsletter #388 Recap Podcast'
    date: '2026-01-20'
    source: Bitcoin Optech
    badge: '#388'
    href: 'https://bitcoinops.org/en/podcast/2026/01/20/'
    description:
      EN: Guest on the recap of newsletter #388, walking through incremental mutation testing in Bitcoin Core.
      BR: Convidado no recap da newsletter #388 para explicar o mutation testing incremental no Bitcoin Core.
  - id: optech-podcast-2025-09-02
    title:
      EN: 'Bitcoin Optech Newsletter #369 Recap Podcast'
      BR: 'Bitcoin Optech Newsletter #369 Recap Podcast'
    date: '2025-09-02'
    source: Bitcoin Optech
    badge: '#369'
    href: 'https://bitcoinops.org/en/podcast/2025/09/02/'
    description:
      EN: Guest on the recap of newsletter #369, covering the update on differential fuzzing of Bitcoin and Lightning implementations.
      BR: Convidado no recap da newsletter #369, sobre a atualização do fuzzing diferencial de implementações de Bitcoin e Lightning.
  - id: optech-podcast-2024-09-17
    title:
      EN: 'Bitcoin Optech Newsletter #320 Recap Podcast'
      BR: 'Bitcoin Optech Newsletter #320 Recap Podcast'
    date: '2024-09-17'
    source: Bitcoin Optech
    badge: '#320'
    href: 'https://bitcoinops.org/en/podcast/2024/09/17/'
    description:
      EN: Guest on the recap of newsletter #320, presenting Mutation Core, his mutation testing tool for Bitcoin Core.
      BR: Convidado no recap da newsletter #320, apresentando o Mutation Core, sua ferramenta de mutation testing para o Bitcoin Core.
  - id: opensats-developer-spotlight
    title:
      EN: Bruno Garcia Is Making Bitcoin More Resilient Through Testing and Education
      BR: Bruno Garcia Is Making Bitcoin More Resilient Through Testing and Education
    source: OpenSats
    href: 'https://opensats.org/blog/developer-spotlight-bruno-garcia'
    thumbnail: /assets/images/people/media/bruno-opensats-spotlight.jpg
    date: '2026-09-17'
    mediaType: article
    description:
      EN: Developer spotlight on his software-testing work, Bitcoinfuzz and education of Brazilian Bitcoin contributors.
      BR: Perfil sobre seu trabalho em testes de software, o Bitcoinfuzz e a formação de contribuidores brasileiros do Bitcoin.
  - id: livecoins-fuzzing-book
    title:
      EN: Engenheiro brasileiro que trabalha na segurança do Bitcoin lança livro sobre como encontrar falhas em softwares
      BR: Engenheiro brasileiro que trabalha na segurança do Bitcoin lança livro sobre como encontrar falhas em softwares
    source: Livecoins
    href: 'https://livecoins.com.br/engenheiro-brasileiro-que-trabalha-na-seguranca-do-bitcoin-lanca-livro-sobre-como-encontrar-falhas-em-softwares/'
    thumbnail: /assets/images/people/media/bruno-livecoins-fuzzing-book.jpg
    date: '2026-11-12'
    mediaType: article
    description:
      EN: 'Coverage of his Portuguese-language book Fuzzing: Conceitos e Prática and its approach to automated software testing.'
      BR: 'Matéria sobre seu livro Fuzzing: Conceitos e Prática e sua abordagem de testes automatizados de software.'
  - id: bitcoinplusplus-mutation-fuzzing
    title:
      EN: Mutation + Fuzzing | Bruno Garcia | bitcoin++ exploits edition | Feb 2026 Florianópolis, Brazil
      BR: Mutation + Fuzzing | Bruno Garcia | bitcoin++ exploits edition | Feb 2026 Florianópolis, Brazil
    source: bitcoin++
    href: 'https://www.youtube.com/watch?v=seDBHbkXFbg'
    thumbnail: /assets/images/people/media/bruno-btcplusplus-mutation-fuzzing.jpg
    date: '2026-03-11'
    mediaType: video
    description:
      EN: Talk on evaluating fuzz harnesses with mutation testing and using differential fuzzing to identify equivalent mutants.
      BR: Palestra sobre avaliar harnesses de fuzzing com testes de mutação e usar fuzzing diferencial para identificar mutantes equivalentes.
discussions:
  - id: delving-wallet-fuzz-targets
    title:
      EN: 'Writing Fuzz Targets for Wallets: Avoiding Known Issues'
      BR: 'Writing Fuzz Targets for Wallets: Avoiding Known Issues'
    source: Delving Bitcoin
    href: 'https://delvingbitcoin.org/t/writing-fuzz-targets-for-wallets-avoiding-known-issues/2316/1'
    date: '2026-03-03'
    description:
      EN: Explains wallet-fuzzing performance and determinism pitfalls, including keypool size, descriptor complexity and database mocking.
      BR: Explica armadilhas de desempenho e determinismo no fuzzing de carteiras, incluindo tamanho do keypool, complexidade de descritores e simulação do banco de dados.
  - id: delving-incremental-mutation-testing
    title:
      EN: Incremental mutation testing in the Bitcoin Core
      BR: Incremental mutation testing in the Bitcoin Core
    source: Delving Bitcoin
    href: 'https://delvingbitcoin.org/t/incremental-mutation-testing-in-the-bitcoin-core/2197/1'
    date: '2026-01-08'
    description:
      EN: Reports experiments applying bcore-mutation to Bitcoin Core pull requests, selecting tests and filtering unproductive mutants for actionable review feedback.
      BR: Relata experimentos com bcore-mutation em pull requests do Bitcoin Core, selecionando testes e filtrando mutantes improdutivos para orientar a revisão.
  - id: delving-nbitcoin-consensus-bug
    title:
      EN: 'Consensus bug on NBitcoin: out-of-bound issue in `Remove()`'
      BR: 'Consensus bug on NBitcoin: out-of-bound issue in `Remove()`'
    source: Delving Bitcoin
    href: 'https://delvingbitcoin.org/t/consensus-bug-on-nbitcoin-out-of-bound-issue-in-remove/2120/1'
    date: '2025-11-24'
    description:
      EN: Discloses an OP_NIP stack-removal bug found through differential fuzzing, with a reproducer, root-cause analysis and coordinated-fix timeline.
      BR: Divulga um bug na remoção de itens da pilha pelo OP_NIP encontrado com fuzzing diferencial, com reprodução, análise da causa e cronologia da correção coordenada.
  - id: delving-state-of-bitcoinfuzz
    title:
      EN: The state of bitcoinfuzz
      BR: The state of bitcoinfuzz
    source: Delving Bitcoin
    href: 'https://delvingbitcoin.org/t/the-state-of-bitcoinfuzz/1946/1'
    date: '2025-08-27'
    description:
      EN: Reviews Bitcoinfuzz's modular design, Bitcoin and Lightning test targets, reported discrepancies and challenges in maintaining shared fuzzing corpora.
      BR: Apresenta a arquitetura modular do Bitcoinfuzz, alvos de teste de Bitcoin e Lightning, divergências reportadas e desafios na manutenção de corpora compartilhados.
  - id: delving-property-based-testing
    title:
      EN: Property-based testing for Bitcoin Core
      BR: Property-based testing for Bitcoin Core
    source: Delving Bitcoin
    href: 'https://delvingbitcoin.org/t/property-based-testing-for-bitcoin-core/640/1'
    date: '2024-03-05'
    description:
      EN: Shares initial TSTL experiments generating varied peer connections and message sequences to extend a Bitcoin Core resource-exhaustion functional test.
      BR: Compartilha experimentos iniciais com TSTL que variam conexões entre pares e sequências de mensagens para ampliar um teste funcional de exaustão de recursos do Bitcoin Core.
publications:
  - id: "bitcoinfuzz-sast-2026"
    title:
      EN: "BitcoinFuzz: Differential Fuzzing of Bitcoin and Lightning Network Implementations"
      BR: "BitcoinFuzz: Differential Fuzzing of Bitcoin and Lightning Network Implementations"
    date: "2026-09-08"
    authors:
      - "Bruno Ely Reis Garcia"
      - "Erick Cestari"
    venue: "XI Simpósio Brasileiro de Testes de Software Sistemático e Automatizado (SAST 2026), Resumos da Indústria, pp. 271–273"
    publicationType: "conference-abstract"
    doi: "10.5753/sast.2026.29817"
    href: "https://sol.sbc.org.br/index.php/sast/article/view/45882"
    description:
      EN: "Presents BitcoinFuzz, a differential fuzzing framework for finding behavioral inconsistencies across Bitcoin and Lightning Network implementations, and reports practical challenges, bugs, and gaps in protocol specifications."
      BR: "Apresenta o BitcoinFuzz, um framework de fuzzing diferencial para encontrar inconsistências de comportamento entre implementações de Bitcoin e Lightning Network, e relata desafios práticos, bugs e lacunas nas especificações dos protocolos."
  - id: "mutation-testing-wild-sast-2026"
    title:
      EN: "Mutation Testing in the Wild: Challenges and Lessons from Bitcoin Core"
      BR: "Mutation Testing in the Wild: Challenges and Lessons from Bitcoin Core"
    date: "2026-09-08"
    authors:
      - "Bruno Ely Reis Garcia"
    venue: "XI Simpósio Brasileiro de Testes de Software Sistemático e Automatizado (SAST 2026), Resumos da Indústria, pp. 274–276"
    publicationType: "conference-abstract"
    doi: "10.5753/sast.2026.30421"
    href: "https://sol.sbc.org.br/index.php/sast/article/view/45883"
    description:
      EN: "Reports experience applying mutation testing to Bitcoin Core with bcore-mutation, covering incremental test selection, mutant filtering, integration into code review, and evaluation of fuzz harnesses."
      BR: "Relata a aplicação de teste de mutação ao Bitcoin Core com a ferramenta bcore-mutation, abordando seleção incremental de testes, filtragem de mutantes, integração à revisão de código e avaliação de harnesses de fuzzing."
  - id: "differential-fuzzing-equivalent-mutants-preprint-2026"
    title:
      EN: "Investigating the application of differential fuzzing to support the identification and suppression of equivalent mutants: An experimental study"
      BR: "Investigating the application of differential fuzzing to support the identification and suppression of equivalent mutants: An experimental study"
    date: "2026-08-27"
    authors:
      - "Bruno Ely Reis Garcia"
      - "Simone do Rocio Senger de Souza"
    venue: "Research Square, version 1"
    publicationType: "preprint"
    doi: "10.21203/rs.3.rs-9628921/v1"
    href: "https://www.researchsquare.com/article/rs-9628921/v1"
    description:
      EN: "Investigates differential fuzzing as a way to support equivalent-mutant classification through experiments on Bitcoin Core, OpenSSL, LND, and Arrow, comparing it with conventional fuzzing and unit or functional tests."
      BR: "Investiga o fuzzing diferencial como apoio à classificação de mutantes equivalentes em experimentos com Bitcoin Core, OpenSSL, LND e Arrow, comparando-o com fuzzing convencional e testes unitários ou funcionais."
  - id: "fuzzing-mutation-peer-to-peer-dissertation-2025"
    title:
      EN: "Analisando o uso de fuzzing para apoiar o teste de mutação de sistemas peer-to-peer"
      BR: "Analisando o uso de fuzzing para apoiar o teste de mutação de sistemas peer-to-peer"
    date: "2025"
    authors:
      - "Bruno Ely Reis Garcia"
    venue: "Instituto de Ciências Matemáticas e de Computação (ICMC), Universidade de São Paulo, São Carlos"
    publicationType: "masters-thesis"
    doi: "10.11606/D.55.2025.tde-26062026-140619"
    href: "https://repositorio.usp.br/item/003311183"
    description:
      EN: "Examines fuzzing in support of mutation testing for peer-to-peer systems, combining a literature mapping with differential comparison of original and mutated code to support equivalent-mutant analysis in open-source projects."
      BR: "Investiga o uso de fuzzing para apoiar o teste de mutação de sistemas peer-to-peer, combinando mapeamento da literatura e comparação diferencial entre código original e mutado para apoiar a análise de mutantes equivalentes em projetos de código aberto."
  - id: "fuzz-targets-mutation-sast-2025"
    title:
      EN: "An empirical evaluation of fuzz targets using mutation testing"
      BR: "An empirical evaluation of fuzz targets using mutation testing"
    date: "2025-09-22"
    authors:
      - "Bruno E. R. Garcia"
      - "Simone R. S. Souza"
    venue: "X Simpósio Brasileiro de Testes de Software Sistemático e Automatizado (SAST 2025), Artigos Completos, pp. 75–83"
    publicationType: "paper"
    doi: "10.5753/sast.2025.14183"
    href: "https://sol.sbc.org.br/index.php/sast/article/view/36885"
    description:
      EN: "Evaluates Bitcoin Core fuzz targets using mutation testing and examines how explicit assertions, round-trip checks, mathematical oracles, and metamorphic relations help detect behavioral faults beyond crashes."
      BR: "Avalia alvos de fuzzing do Bitcoin Core por meio de teste de mutação e examina como asserções explícitas, verificações de ida e volta, oráculos matemáticos e relações metamórficas ajudam a detectar falhas de comportamento além de crashes."
  - id: "peer-to-peer-testing-state-art-jserd-2025"
    title:
      EN: "Software testing for peer-to-peer systems: Challenges and the state-of-the-art"
      BR: "Software testing for peer-to-peer systems: Challenges and the state-of-the-art"
    date: "2025"
    authors:
      - "Bruno E. R. Garcia"
      - "Simone R. S. Souza"
    venue: "Journal of Software Engineering Research and Development (JSERD), volume 13, issue 1, pp. 13:73–13:88"
    publicationType: "paper"
    doi: "10.5753/jserd.2025.4917"
    href: "https://journals-sol.sbc.org.br/index.php/jserd/article/view/4917"
    description:
      EN: "Maps research on testing peer-to-peer systems, identifying challenges such as consensus, peer churn, reproducibility, and nondeterminism, and reviewing approaches including fuzzing, fault injection, and model-based testing."
      BR: "Mapeia pesquisas sobre teste de sistemas peer-to-peer, identificando desafios como consenso, entrada e saída de pares, reprodutibilidade e não determinismo, e revisando abordagens como fuzzing, injeção de falhas e teste baseado em modelos."
  - id: "differential-fuzzing-equivalent-mutants-sbes-2024"
    title:
      EN: "Towards differential fuzzing to reduce manual efforts to identify equivalent mutants: A preliminary study"
      BR: "Towards differential fuzzing to reduce manual efforts to identify equivalent mutants: A preliminary study"
    date: "2024-09-30"
    authors:
      - "Bruno E. R. Garcia"
      - "Marcio E. Delamaro"
      - "Simone R. S. Souza"
    venue: "XXXVIII Simpósio Brasileiro de Engenharia de Software (SBES 2024), Trilha de Ideias Inovadoras e Resultados Emergentes, pp. 568–573"
    publicationType: "paper"
    doi: "10.5753/sbes.2024.3557"
    href: "https://sol.sbc.org.br/index.php/sbes/article/view/30396"
    description:
      EN: "A preliminary study of differential fuzzing to reduce manual equivalent-mutant analysis, investigating timeout-based classification and the value of existing fuzzing seed corpora."
      BR: "Estudo preliminar sobre fuzzing diferencial para reduzir o esforço manual na análise de mutantes equivalentes, investigando classificação por limite de tempo e o valor de corpora de sementes já existentes."
contributions:
  - id: fuzzamoto-compact-block-relay
    title:
      EN: Feedback-driven compact-block relay fuzzing
      BR: Fuzzing de relay de blocos compactos orientado por feedback
    date: '2026-11-13'
    source: 'oss-garage/fuzzamoto · #150'
    type: PR
    href: https://github.com/oss-garage/fuzzamoto/pull/150
    description:
      EN: Added generators for compact-block requests and missing-transaction requests, using recorded
        node announcements to insert follow-up requests on later mutation passes. Merged in November 2026.
      BR: Adicionou geradores de requisições de blocos compactos e de transações ausentes, usando anúncios
        registrados do nó para inserir requisições subsequentes em novas rodadas de mutação. Integrado em novembro de 2026.
  - id: "github-bitcoin-bitcoin-27549"
    title:
      EN: "Network-aware address-manager fuzzing"
      BR: "Fuzzing do gerenciador de endereços por rede"
    date: "2023-07-13"
    source: "bitcoin/bitcoin · #27549"
    type: "PR"
    href: "https://github.com/bitcoin/bitcoin/pull/27549"
    description:
      EN: "Extended AddrMan fuzzing to exercise network-specific selection, address retrieval and table-size queries. Merged in 2023."
      BR: "Ampliou o fuzzing do AddrMan para exercitar seleção por rede, consulta de endereços e tamanho das tabelas. Integrado em 2023."
  - id: "github-bitcoin-bitcoin-29936"
    title:
      EN: "Wallet transaction-creation fuzz target"
      BR: "Alvo de fuzzing para criação de transações"
    date: "2024-10-25"
    source: "bitcoin/bitcoin · #29936"
    type: "PR"
    href: "https://github.com/bitcoin/bitcoin/pull/29936"
    description:
      EN: "Added fuzzing for CreateTransaction and reusable descriptor-wallet test helpers, including regression coverage for invalid zero-input transactions."
      BR: "Adicionou fuzzing para CreateTransaction e helpers reutilizáveis de testes de carteiras com descritores, incluindo cobertura de regressão para transações inválidas sem entradas."
  - id: "github-bitcoin-bitcoin-32624"
    title:
      EN: "Descriptor-migration fuzz target"
      BR: "Alvo de fuzzing para migração de descritores"
    date: "2026-03-19"
    source: "bitcoin/bitcoin · #32624"
    type: "PR"
    href: "https://github.com/bitcoin/bitcoin/pull/32624"
    description:
      EN: "Added focused fuzzing of MigrateToDescriptor with varied keys, HD chains and scripts, checking the descriptors produced by migration."
      BR: "Adicionou fuzzing de MigrateToDescriptor com diferentes chaves, cadeias HD e scripts, verificando os descritores produzidos pela migração."
  - id: "github-bitcoin-bitcoin-33047"
    title:
      EN: "Mutation-guided OP_2ROT regression test"
      BR: "Teste de regressão de OP_2ROT orientado por mutação"
    date: "2025-07-24"
    source: "bitcoin/bitcoin · #33047"
    type: "PR"
    href: "https://github.com/bitcoin/bitcoin/pull/33047"
    description:
      EN: "Added a stack-depth assertion after mutation testing showed that an incorrect OP_2ROT implementation could pass the existing script tests."
      BR: "Adicionou uma asserção de profundidade da pilha após testes de mutação mostrarem que uma implementação incorreta de OP_2ROT passava pelos testes de scripts existentes."
  - id: "github-bitcoin-bitcoin-35220"
    title:
      EN: "Connection-manager fuzzing invariants"
      BR: "Invariantes de fuzzing do gerenciador de conexões"
    date: "2026-06-26"
    source: "bitcoin/bitcoin · #35220"
    type: "PR"
    href: "https://github.com/bitcoin/bitcoin/pull/35220"
    description:
      EN: "Strengthened connman fuzz assertions for node insertion and removal, duplicate rejection, network activity, services and outbound limits."
      BR: "Reforçou as asserções de fuzzing do connman para inserção e remoção de nós, rejeição de duplicatas, atividade de rede, serviços e limites de saída."
  - id: "github-bitcoin-bitcoin-36470"
    title:
      EN: "Detect false positives in peer-eviction tests"
      BR: "Detectar falsos positivos nos testes de expulsão de peers"
    date: "2026-11-05"
    source: "bitcoin/bitcoin · #36470"
    type: "PR"
    href: "https://github.com/bitcoin/bitcoin/pull/36470"
    description:
      EN: "Fixed a peer-eviction test that passed even when block-time protection was broken, controlling peer ordering and timing and checking actual block and transaction receipt."
      BR: "Corrigiu um teste de expulsão de peers que passava mesmo com a proteção por tempo de bloco quebrada, controlando a ordem e os tempos dos peers e verificando o recebimento de blocos e transações."
---
## EN

Bruno Garcia is a co-founder and Head of Engineering at Vinteum, and a Bitcoin Core contributor focused on software testing. He created Bitcoinfuzz and mentors developers entering Bitcoin open source.

## PT

Bruno Garcia é cofundador e Head de Engenharia da Vinteum e contribuidor do Bitcoin Core, com foco em testes de software. Criou o Bitcoinfuzz e orienta desenvolvedores que estão entrando no Bitcoin open source.
