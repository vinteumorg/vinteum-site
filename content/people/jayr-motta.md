---
name: Jayr Motta
image: /assets/images/people/fellows/jayrmotta.jpg
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
      EN: Mujina
      BR: Mujina
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
      EN: Mujina
      BR: Mujina
    href: /programs/bitcoin-dev-launchpad
    fundedBy: Vinteum
focus:
  - Mining
  - Developer Tools
links:
  - label: GitHub
    href: 'https://github.com/jayrmotta'
    icon: github
  - label: X
    href: 'https://x.com/jayrmotta'
    icon: twitter
projects:
  - name: mujina
    href: 'https://github.com/256foundation/mujina'
    description:
      EN: Open-Source Bitcoin Mining Firmware
      BR: Firmware open source para mineração Bitcoin.
    contribution:
      EN: "Contributes to mining-firmware development and contributor documentation, with proposed work on pool-protocol support, configuration and hardware control."
      BR: "Contribui para o desenvolvimento do firmware de mineração e a documentação para contribuidores, com propostas de suporte a protocolos de pool, configuração e controle de hardware."
  - name: minesploit
    href: 'https://github.com/johnnyasantoss/minesploit'
    description:
      EN: A metasploit like framework and REPL for white hackers on bitcoin mining
      BR: Framework e REPL para pesquisa de segurança em mineração Bitcoin.
    contribution:
      EN: "Contributed to interactive execution of mining-security research modules, connecting the command-line workflow to module execution and result reporting."
      BR: "Contribuiu para a execução interativa de módulos de pesquisa de segurança em mineração, conectando o fluxo de linha de comando à execução dos módulos e à apresentação de resultados."
contributions:
  - id: github-256foundation-mujina-67
    title:
      EN: 'docs(contributing): reflect agreed contribution flow and channels'
      BR: 'docs(contributing): reflect agreed contribution flow and channels'
    date: '2026-07-04'
    source: '256foundation/mujina · #67'
    type: Documentation
    href: https://github.com/256foundation/mujina/pull/67
  - id: github-johnnyasantoss-minesploit-1
    title:
      EN: Interactive execution of payloads
      BR: Interactive execution of payloads
    date: '2026-02-28'
    source: 'johnnyasantoss/minesploit · #1'
    type: PR
    href: https://github.com/johnnyasantoss/minesploit/pull/1
  - id: github-256foundation-mujina-65
    title:
      EN: Draft Stratum V2 support for Mujina
      BR: Suporte a Stratum V2 em rascunho para Mujina
    date: '2026-06-05'
    source: '256foundation/mujina · #65'
    type: PR
    href: https://github.com/256foundation/mujina/pull/65
    description:
      EN: Open draft PR adds extended channels, reconnect handling and protocol tests; not merged.
      BR: PR aberto em rascunho adiciona canais estendidos, reconexão e testes de protocolo;
        não integrado.
  - id: github-jayrmotta-mujina-3
    title:
      EN: Compute BM13xx HCN nonce ranges
      BR: Calcular intervalos de nonce HCN para BM13xx
    date: '2026-06-18'
    source: 'jayrmotta/mujina · #3'
    type: PR
    href: https://github.com/jayrmotta/mujina/pull/3
    description:
      EN: Open, unmerged PR in his public Mujina fork computes nonce ranges from chip topology and clock
        frequency, replacing the BM1370 small-engine count with the big-core divisor.
      BR: PR aberto e não integrado em seu fork público do Mujina calcula intervalos de nonce pela topologia
        dos chips e frequência, usando os núcleos principais como divisor no BM1370.
  - id: github-256foundation-mujina-88
    title:
      EN: Introduce the Mujina configuration tree
      BR: Introduzir a árvore de configuração do Mujina
    date: '2026-08-05'
    source: '256foundation/mujina · #88'
    type: PR
    href: https://github.com/256foundation/mujina/pull/88
    description:
      EN: Open, unmerged PR populates a configuration tree from environment variables and exposes it read-only
        through the HTTP API; no persistence or write path.
      BR: PR aberto e não integrado preenche uma árvore de configuração por variáveis de ambiente e a expõe
        para leitura na API HTTP; sem persistência nem escrita.
  - id: github-256foundation-mujina-33
    title:
      EN: Add PI-based Bitaxe fan control
      BR: Adicionar controle PI da ventoinha do Bitaxe
    date: '2026-03-03'
    source: '256foundation/mujina · #33'
    type: PR
    href: https://github.com/256foundation/mujina/pull/33
    description:
      EN: Open, unmerged firmware PR regulates fan speed from ASIC temperature and falls back to full speed
        when readings are unsafe or unavailable.
      BR: PR de firmware aberto e não integrado regula a ventoinha pela temperatura do ASIC e usa velocidade
        máxima quando as leituras são inseguras ou indisponíveis.
updatedAt: '2026-11-18'
---
## EN

Jayr Motta works on Bitcoin mining software, connecting protocols, firmware and physical devices. His contributions include Mujina contributor documentation and interactive payload execution in minesploit, alongside experimental work on mining-job distribution.

## PT

Jayr Motta trabalha com software de mineração Bitcoin, conectando protocolos, firmware e dispositivos físicos. Suas contribuições incluem documentação para contribuidores do Mujina e execução interativa de payloads no minesploit, além de experimentos com distribuição do trabalho de mineração.
