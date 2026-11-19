---
name: Vinicius Cestari
image: /assets/images/people/illustrations/vinicius-cestari.webp
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
  - name: Bitcoin Core
    href: https://github.com/bitcoin/bitcoin
    current: true
    description:
      EN: Bitcoin node and wallet implementation.
      BR: Implementação de nó e carteira Bitcoin.
    contribution:
      EN: "Strengthens Bitcoin Core's test suite with mutation testing and works on faster, more reliable functional tests. Reviews pull requests, especially around IPC."
      BR: "Fortalece a suíte de testes do Bitcoin Core com testes de mutação e trabalha para tornar os testes funcionais mais rápidos e confiáveis. Revisa pull requests, especialmente relacionados a IPC."
  - name: libsecp256k1
    href: 'https://github.com/bitcoin-core/secp256k1'
    current: true
    description:
      EN: Optimized C library for EC operations on curve secp256k1
      BR: Biblioteca C otimizada para operações na curva secp256k1.
    contribution:
      EN: "Contributes tests and test maintainability improvements, using mutation testing to find coverage gaps."
      BR: "Contribui com testes e melhorias na manutenção dos testes, usando testes de mutação para encontrar lacunas na cobertura."
  - name: libmultiprocess
    href: 'https://github.com/bitcoin-core/libmultiprocess'
    current: true
    description:
      EN: >-
        C++ library and code generator making it easy to call functions and
        reference objects in different processes
      BR: >-
        Biblioteca C++ para chamadas de funções e referências a objetos entre
        processos.
    contribution:
      EN: "Works on the reliability of interprocess communication used by Bitcoin Core, through fixes, tests and code review."
      BR: "Trabalha na confiabilidade da comunicação entre processos usada pelo Bitcoin Core, com correções, testes e revisão de código."
  - name: mutant-harness
    href: 'https://github.com/ViniciusCestarii/mutant-harness'
    current: true
    description:
      EN: Agent-driven mutation testing tool for Bitcoin Core and libsecp256k1.
      BR: Ferramenta de testes de mutação guiada por agente para Bitcoin Core e libsecp256k1.
    contribution:
      EN: "Created the tool, which plants targeted, structural mutants where impact is high and coverage is thin, then verifies which ones survive the test suites."
      BR: "Criou a ferramenta, que insere mutantes estruturais e direcionados onde o impacto é alto e a cobertura é baixa, e verifica quais sobrevivem às suítes de testes."
  - name: bitcoin-node-os-fingerprint
    href: 'https://github.com/ViniciusCestarii/bitcoin-node-os-fingerprint'
    current: true
    description:
      EN: Survey of the operating systems run by publicly reachable Bitcoin nodes.
      BR: Levantamento dos sistemas operacionais usados por nós Bitcoin publicamente acessíveis.
    contribution:
      EN: "Created the project, which scans public nodes with nmap, groups the results by OS and publishes the datasets and results."
      BR: "Criou o projeto, que escaneia nós públicos com nmap, agrupa os resultados por sistema operacional e publica os dados e resultados."
contributions:
  - id: github-bitcoin-bitcoin-36525-review
    title:
      EN: Review of the mining Block interface and template data race fix
      BR: Revisão da interface Block de mineração e da correção de data race no template
    date: '2026-11-16'
    source: 'bitcoin/bitcoin · #36525'
    type: Code Review
    href: 'https://github.com/bitcoin/bitcoin/pull/36525#issuecomment-6914720024'
    description:
      EN: Reproduced the reported IPC latency and prototyped an alternative that keeps block templates immutable without the slowdown.
      BR: Reproduziu a latência de IPC relatada e prototipou uma alternativa que mantém os templates de bloco imutáveis sem a perda de desempenho.
  - id: github-bitcoin-bitcoin-35793-review
    title:
      EN: Review of the BIP54 (Consensus Cleanup) implementation
      BR: Revisão da implementação do BIP54 (Consensus Cleanup)
    date: '2026-10-27'
    source: 'bitcoin/bitcoin · #35793'
    type: Code Review
    href: 'https://github.com/bitcoin/bitcoin/pull/35793#issuecomment-6443600738'
    description:
      EN: Ran mutation testing on the PR and found surviving mutants that shifted BIP54 enforcement by one block at activation.
      BR: Aplicou testes de mutação ao PR e encontrou mutantes sobreviventes que deslocavam em um bloco a aplicação do BIP54 na ativação.
  - id: github-bitcoin-bitcoin-36231
    featured: true
    title:
      EN: 'test: add pow tests covering live mutants'
      BR: 'test: add pow tests covering live mutants'
    date: '2026-10-19'
    source: 'bitcoin/bitcoin · #36231'
    type: PR
    href: 'https://github.com/bitcoin/bitcoin/pull/36231'
    description:
      EN: Adds proof-of-work tests that kill surviving mutants affecting consensus and header sync.
      BR: Adiciona testes de proof-of-work que eliminam mutantes sobreviventes que afetam o consenso e a sincronização de cabeçalhos.
  - id: github-bitcoin-bitcoin-36440
    featured: true
    title:
      EN: 'test: speed up functional tests by removing avoidable waits'
      BR: 'test: speed up functional tests by removing avoidable waits'
    date: '2026-10-13'
    source: 'bitcoin/bitcoin · #36440'
    type: PR
    href: 'https://github.com/bitcoin/bitcoin/pull/36440'
    description:
      EN: Cuts accumulated functional test runtime by 17.5% by removing avoidable waits in P2P
        helpers and relay settings.
      BR: Reduz em 17,5% o tempo acumulado dos testes funcionais ao remover esperas evitáveis nos
        helpers de P2P e nas configurações de relay.
  - id: github-bitcoin-bitcoin-36128
    title:
      EN: 'test: add script_tests cases covering more interpreter mutants'
      BR: 'test: add script_tests cases covering more interpreter mutants'
    date: '2026-10-05'
    source: 'bitcoin/bitcoin · #36128'
    type: PR
    href: 'https://github.com/bitcoin/bitcoin/pull/36128'
    description:
      EN: Adds script tests that kill more consensus-relevant surviving mutants in the script interpreter, including Tapscript rules.
      BR: Adiciona testes de script que eliminam mais mutantes sobreviventes relevantes para o consenso no interpretador de scripts, incluindo regras de Tapscript.
  - id: github-bitcoin-core-secp256k1-1948
    title:
      EN: 'tests: add ECDSA verify case where r + n overflows p'
      BR: 'tests: add ECDSA verify case where r + n overflows p'
    date: '2026-09-30'
    source: 'bitcoin-core/secp256k1 · #1948'
    type: PR
    href: 'https://github.com/bitcoin-core/secp256k1/pull/1948'
    description:
      EN: Adds an ECDSA verification test for the r + n ≥ p edge case, killing a surviving mutant.
      BR: Adiciona um teste de verificação ECDSA para o caso limite r + n ≥ p, eliminando um mutante
        sobrevivente.
  - id: github-bitcoin-bitcoin-36130
    title:
      EN: 'test: add tests in transaction_tests.cpp covering live mutants'
      BR: 'test: add tests in transaction_tests.cpp covering live mutants'
    date: '2026-09-05'
    source: 'bitcoin/bitcoin · #36130'
    type: PR
    href: 'https://github.com/bitcoin/bitcoin/pull/36130'
    description:
      EN: Adds transaction tests that kill consensus-relevant surviving mutants in transaction validation.
      BR: Adiciona testes de transação que eliminam mutantes sobreviventes relevantes para o consenso na validação de transações.
  - id: github-bitcoin-bitcoin-36054
    featured: true
    title:
      EN: 'test: add script_tests cases covering interpreter mutants'
      BR: 'test: add script_tests cases covering interpreter mutants'
    date: '2026-08-31'
    source: 'bitcoin/bitcoin · #36054'
    type: PR
    href: 'https://github.com/bitcoin/bitcoin/pull/36054'
    description:
      EN: Adds script tests that kill consensus-relevant surviving mutants in the script interpreter.
      BR: Adiciona testes de script que eliminam mutantes sobreviventes relevantes para o consenso no
        interpretador de scripts.
  - id: github-bitcoin-core-libmultiprocess-231-review
    title:
      EN: Review of Windows support in libmultiprocess
      BR: Revisão do suporte a Windows na libmultiprocess
    date: '2026-08-06'
    source: 'bitcoin-core/libmultiprocess · #231'
    type: Code Review
    href: 'https://github.com/bitcoin-core/libmultiprocess/pull/231#pullrequestreview-4874459914'
    description:
      EN: Tested the PR and found issues that could leave the parent process hanging forever.
      BR: Testou o PR e encontrou problemas que podiam deixar o processo pai travado para sempre.
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
  - id: personal-blog-bitcoin-core-ipc-event-loop
    title:
      EN: Bitcoin Core IPC Event Loop
      BR: Bitcoin Core IPC Event Loop
    date: '2026-08-10'
    source: viniciuscestari.dev
    href: 'https://viniciuscestari.dev/posts/bitcoin-core-ipc-event-loop'
  - id: personal-blog-inside-bitcoin-core-ipc
    title:
      EN: Inside Bitcoin Core IPC
      BR: Inside Bitcoin Core IPC
    date: '2026-07-23'
    source: viniciuscestari.dev
    href: 'https://viniciuscestari.dev/posts/inside-bitcoin-core-ipc'
  - id: personal-blog-introduction-to-bitcoin-core-ipc
    title:
      EN: Introduction to Bitcoin Core IPC
      BR: Introduction to Bitcoin Core IPC
    date: '2026-06-17'
    source: viniciuscestari.dev
    href: 'https://viniciuscestari.dev/posts/introduction-to-bitcoin-core-ipc'
  - id: personal-blog-from-tx-to-mempool
    title:
      EN: From TX message to mempool
      BR: From TX message to mempool
    date: '2026-05-12'
    source: viniciuscestari.dev
    href: 'https://viniciuscestari.dev/posts/from-tx-to-mempool'
updatedAt: '2026-11-18'
---
## EN

Vinicius Cestari is a Vinteum fellow and Bitcoin Core contributor focused on testing and interprocess communication. Using mutation testing, he added tests for consensus-critical code in the script interpreter, transaction validation and proof-of-work, and found test gaps in several pull requests. He also works on libmultiprocess, the IPC library behind Bitcoin Core's multiprocess architecture.

## PT

Vinicius Cestari é fellow da Vinteum e contribuidor do Bitcoin Core, com foco em testes e comunicação entre processos. Com testes de mutação, cobriu código de consenso no interpretador de scripts, na validação de transações e no proof-of-work, e achou lacunas em vários pull requests. Também trabalha na libmultiprocess, biblioteca de IPC do Core.
