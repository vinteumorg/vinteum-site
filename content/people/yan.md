---
name: Yan
image: /assets/images/people/illustrations/yan.png
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
      EN: Bitcoin Dev Kit
      BR: Bitcoin Dev Kit
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
      EN: Bitcoin Dev Kit
      BR: Bitcoin Dev Kit
    href: /programs/bitcoin-dev-launchpad
    fundedBy: Vinteum
focus:
  - Wallets
  - Bitcoin Analysis
  - Testing
links:
  - label: X
    href: 'https://x.com/yanfsb'
    icon: twitter
  - label: Website
    href: 'https://indianboy.sh/'
    icon: website
  - label: GitHub
    href: 'https://github.com/yanfsb'
    icon: github
projects:
  - name: bdk-cli
    href: 'https://github.com/bitcoindevkit/bdk-cli'
    description:
      EN: 'A CLI wallet library and REPL tool to demo and test the BDK library '
      BR: Carteira de linha de comando e REPL para testar e demonstrar o BDK.
    contribution:
      EN: "Contributes to BDK’s command-line wallet configuration workflows, keeping saved configuration management separate from wallet database storage."
      BR: "Contribui para os fluxos de configuração de carteiras na linha de comando do BDK, mantendo a gestão das configurações salvas separada do armazenamento dos bancos de dados das carteiras."
  - name: BlockSci (Clube Bitcoin UnB)
    href: 'https://github.com/ClubeBitcoinUnB/BlockSci'
    description:
      EN: A high-performance tool for blockchain science and exploration
      BR: Fork do BlockSci para análise e exploração de dados de blockchains.
    contribution:
      EN: "Contributes to reproducible cross-platform builds and automated validation in the Clube Bitcoin UnB BlockSci fork, covering Linux, Apple Silicon and Nix environments."
      BR: "Contribui para builds reproduzíveis em diferentes plataformas e validação automatizada no fork do BlockSci do Clube Bitcoin UnB, abrangendo ambientes Linux, Apple Silicon e Nix."
  - name: BDK Wallet (Vinteum research fork)
    href: https://github.com/vinteumorg/bdk_wallet
    description:
      EN: Fork of BDK Wallet used for descriptor-metadata experiments.
      BR: Fork do BDK Wallet usado em experimentos com metadados de descritores.
    contribution:
      EN: Researches compact script-index metadata and sparse restoration. Benchmarks isolate local
        script processing rather than end-to-end network recovery.
      BR: Pesquisa metadados compactos de índices de scripts e restauração esparsa. Os benchmarks
        isolam o processamento local de scripts, não a recuperação completa pela rede.
contributions:
  - id: github-bitcoindevkit-bdk-cli-312
    title:
      EN: Add command to delete saved wallet config
      BR: Add command to delete saved wallet config
    date: '2026-10-22'
    source: 'bitcoindevkit/bdk-cli · #312'
    type: PR
    href: 'https://github.com/bitcoindevkit/bdk-cli/pull/312'
    description:
      EN: Deletes saved wallet configuration entries without deleting wallet databases.
      BR: Remove configurações salvas de carteiras sem apagar seus bancos de dados.
  - id: github-ClubeBitcoinUnB-BlockSci-14
    title:
      EN: Change from Travis/CircleCi in favor of Github Actions
      BR: Change from Travis/CircleCi in favor of Github Actions
    date: '2026-08-12'
    source: 'ClubeBitcoinUnB/BlockSci · #14'
    type: PR
    href: 'https://github.com/ClubeBitcoinUnB/BlockSci/pull/14'
    description:
      EN: Migrates CI to GitHub Actions with Linux, macOS ARM64 and Nix checks in the Clube
        Bitcoin UnB BlockSci fork.
      BR: Migra o CI para GitHub Actions com verificações de Linux, macOS ARM64 e Nix no
        fork do BlockSci do Clube Bitcoin UnB.
  - id: github-vinteumorg-bdk_wallet-13
    title:
      EN: Descriptor-metadata validation and sparse restoration
      BR: Validação de metadados de descritores e restauração esparsa
    source: 'vinteumorg/bdk_wallet · #13'
    type: PR
    href: https://github.com/vinteumorg/bdk_wallet/pull/13
    description:
      EN: Adds experimental descriptor-metadata validation and sparse wallet-restoration benchmarks,
        including base64 and bech32 encoding changes. Open research pull request in a fork, not
        upstream BDK.
      BR: Adiciona validação experimental de metadados de descritores e benchmarks de restauração
        esparsa de carteiras, incluindo mudanças nas codificações base64 e bech32. Pull request
        de pesquisa aberto em um fork, não no BDK upstream.
writing:
  - id: personal-blog-floresta-mainnet-journey
    title:
      EN: 'Three Weeks Stuck on IBD: Getting Floresta to Sync on a VPS'
      BR: 'Three Weeks Stuck on IBD: Getting Floresta to Sync on a VPS'
    date: '2026-04-30'
    source: indianboy.sh
    href: 'https://indianboy.sh/blog/floresta-mainnet-journey'
  - id: personal-blog-floresta-on-steamdeck
    title:
      EN: Running a Floresta Node on a Steam Deck
      BR: Running a Floresta Node on a Steam Deck
    date: '2026-04-10'
    source: indianboy.sh
    href: 'https://indianboy.sh/blog/floresta-on-steamdeck'
updatedAt: '2026-11-18'
---
## EN

Yan works on Bitcoin wallet infrastructure and BDK. His work combines wallet configuration tooling with research into compact descriptor metadata, exploring how wallets can preserve information about derived, revealed and used script indices.

## PT

Yan trabalha com infraestrutura de carteiras Bitcoin e BDK. Seu trabalho combina ferramentas de configuração de carteiras e pesquisa sobre metadados compactos de descritores, explorando como preservar informações sobre índices de scripts derivados, revelados e usados.
