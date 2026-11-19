---
name: Victor André
image: /assets/images/people/fellows/victorandre.jpg
programs:
  - program: fellowship
    name: Fellowship
    organization: Vinteum
    role:
      EN: Fellow
      BR: Fellow
    status: past
    end: '2026-09'
    start: '2026-04'
    cohort: 2
    work:
      EN: Bitcoin Core / BNOC
      BR: Bitcoin Core / BNOC
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
      EN: BIP324
      BR: BIP324
    href: /programs/bitcoin-dev-launchpad
    fundedBy: Vinteum
focus:
  - BIP324
  - Fuzzing
  - Research
links:
  - label: GitHub
    href: 'https://github.com/victorandre957'
    icon: github
  - label: Blog
    href: 'https://victorandre957.github.io/personal_blog/'
    icon: blog
projects:
  - name: Bitcoinfuzz
    href: 'https://github.com/bitcoinfuzz/bitcoinfuzz'
    description:
      EN: Differential Fuzzing of Bitcoin protocol implementations and libraries
      BR: Fuzzing diferencial de implementações e bibliotecas Bitcoin.
    contribution:
      EN: "Contributes to differential testing of BIP324’s EllSwift encoding across Bitcoin implementations, extending rust-bitcoin coverage to detect behavioral inconsistencies and regressions."
      BR: "Contribui para testes diferenciais da codificação EllSwift do BIP324 entre implementações Bitcoin, ampliando a cobertura de rust-bitcoin para detectar inconsistências de comportamento e regressões."
  - name: BIP324 Traffic Lab
    href: https://github.com/victorandre957/bip324-traffic-lab
    description:
      EN: Warnet lab for controlled Bitcoin P2P v2 packet captures.
      BR: Laboratório Warnet para capturas controladas de pacotes Bitcoin P2P v2.
    contribution:
      EN: Builds reproducible traffic scenarios and exports PCAPs, node logs and run metadata.
        Capture analysis is handled separately.
      BR: Constrói cenários reproduzíveis de tráfego e exporta PCAPs, logs dos nós e metadados
        das execuções. A análise das capturas é feita separadamente.
  - name: BIP324 Traffic Analysis
    href: https://github.com/victorandre957/bip324-traffic-analysis
    description:
      EN: Experimental passive analysis of BIP324 packet metadata.
      BR: Análise passiva experimental de metadados de pacotes BIP324.
    contribution:
      EN: Analyzes packet size, direction, timing and TCP flows without decrypting messages. Results
        are heuristic candidates, not decoded messages.
      BR: Analisa tamanho, direção, tempo dos pacotes e fluxos TCP sem descriptografar mensagens.
        Os resultados são candidatos heurísticos, não mensagens decodificadas.
  - name: Bitcoin Core
    href: https://github.com/bitcoin/bitcoin
    description:
      EN: Bitcoin full-node software.
      BR: Software de nó completo Bitcoin.
    contribution:
      EN: "Explored Bitcoin Core P2P listening behavior through a tested proposal for persistent, opt-in port randomization. The proposal was closed without merging."
      BR: "Explorou o comportamento de escuta P2P do Bitcoin Core por meio de uma proposta testada de randomização de porta opcional e persistente. A proposta foi fechada sem integração."
contributions:
  - id: github-bitcoinfuzz-bitcoinfuzz-637
    title:
      EN: 'rustbicoin (feat): add BIP324 EllSwift fuzz targets'
      BR: 'rustbicoin (feat): add BIP324 EllSwift fuzz targets'
    date: '2026-08-17'
    source: 'bitcoinfuzz/bitcoinfuzz · #637'
    type: PR
    href: 'https://github.com/bitcoinfuzz/bitcoinfuzz/pull/637'
    description:
      EN: Adds rust-bitcoin to differential testing of EllSwift decoding and secret-key
        round trips.
      BR: Adiciona rust-bitcoin ao teste diferencial da decodificação EllSwift e de round
        trips a partir de chaves secretas.
  - id: github-bitcoin-bitcoin-35585
    title:
      EN: Randomized P2P listening-port proposal
      BR: Proposta de porta P2P de escuta aleatória
    source: 'bitcoin/bitcoin · #35585'
    type: PR
    href: https://github.com/bitcoin/bitcoin/pull/35585
    description:
      EN: Proposed an opt-in randomized P2P listening port persisted across restarts, with unit
        and functional tests. Closed without merge.
      BR: Propôs uma porta P2P de escuta aleatória, opcional e persistida entre reinícios, com
        testes unitários e funcionais. Encerrado sem integração.
discussions:
  - id: passive-traffic-bnoc
    title:
      EN: Passive Traffic Analysis of Bitcoin P2P v2
      BR: Passive Traffic Analysis of Bitcoin P2P v2
    source: BNOC
    date: '2026-08-13'
    href: 'https://bnoc.xyz/t/passive-traffic-analysis-of-bitcoin-p2p-v2/161'
    description:
      EN: Passive-analysis research examining what remains observable in encrypted BIP324
        traffic.
      BR: Pesquisa de análise passiva sobre o que permanece observável no tráfego criptografado
        BIP324.
writing:
  - id: github-ClubeBitcoinUnB-theses-4
    title:
      EN: Academic thesis on Bitcoin
      BR: Trabalho acadêmico sobre Bitcoin
    date: '2026-02-02'
    source: Clube Bitcoin UnB · GitHub
    href: 'https://github.com/ClubeBitcoinUnB/theses/pull/4'
  - id: personal-blog-bip324-traffic-ml-v2-preliminary-results
    title:
      EN: >-
        Classifying BIP324 Traffic in a Full Network Capture: Preliminary ML
        Results
      BR: >-
        Classifying BIP324 Traffic in a Full Network Capture: Preliminary ML
        Results
    source: victorandre957.github.io
    href: >-
      https://victorandre957.github.io/personal_blog/posts/bip324-traffic-ml-v2-preliminary-results/
  - id: personal-blog-what-bip324-changes-for-bitcoin-p2p
    title:
      EN: BIP324 in Bitcoin Core
      BR: BIP324 in Bitcoin Core
    source: victorandre957.github.io
    href: >-
      https://victorandre957.github.io/personal_blog/posts/what-bip324-changes-for-bitcoin-p2p/
updatedAt: '2026-11-18'
---
## EN

Victor André studies Bitcoin P2P privacy and encrypted transport. His work combines passive analysis of BIP324 traffic with differential fuzzing, investigating what network observers can still infer from encrypted connections.

## PT

Victor André pesquisa privacidade P2P do Bitcoin e transporte criptografado. Seu trabalho combina análise passiva do tráfego BIP324 e fuzzing diferencial para investigar o que observadores da rede ainda podem inferir de conexões criptografadas.
