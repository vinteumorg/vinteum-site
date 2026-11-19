---
name: joaozinho
image: /assets/images/people/fellows/joaozinho.jpg
programs:
  - program: bitcoin-dev-launchpad
    name: Bitcoin Dev Launchpad
    organization: Vinteum
    role:
      EN: Alumnus
      BR: Ex-participante
    status: past
    cohort: 1
    work:
      EN: Krux
      BR: Krux
    href: /programs/bitcoin-dev-launchpad
    fundedBy: OpenSats
focus:
  - Hardware Wallets
  - Developer Tools
links:
  - label: GitHub
    href: 'https://github.com/joaozinhom'
    icon: github
  - label: Nostr
    href: >-
      https://primal.net/p/nprofile1qqs0xwjg3fwjrqm3anxlgq0t48wg8n9zp8007ryl034nckyljdaktmqm4mmyv
    icon: nostr
projects:
  - name: krux-installer
    href: 'https://github.com/selfcustody/krux-installer'
    description:
      EN: 'A GUI based application to flash Krux firmware on K210 based devices.'
      BR: >-
        Aplicativo gráfico para instalar o firmware Krux em dispositivos
        compatíveis.
    contribution:
      EN: >-
        Maintains releases, CI and packaging for Linux, macOS and Windows,
        and support for new devices such as tzt and WonderK. Reviews
        contributions, hardens the release and dependency process, and keeps
        quality tasks and git history hygiene.
      BR: >-
        Mantém releases, CI e empacotamento para Linux, macOS e Windows,
        e suporte a novos dispositivos como tzt e WonderK. Revisa contribuições,
        reforça a segurança do processo de release e das dependências e cuida
        das tarefas de qualidade e da higiene do histórico git.
    current: true
  - name: krux
    href: 'https://github.com/selfcustody/krux'
    description:
      EN: 'Open-source firmware that turns K210 based devices into air-gapped Bitcoin signing devices.'
      BR: >-
        Firmware open-source que transforma dispositivos baseados no chip K210
        em assinadores de Bitcoin air-gapped.
    contribution:
      EN: >-
        Contributor; release security hardening and device documentation.
        Reviews changes across the ecosystem.
      BR: >-
        Contribuidor; segurança do processo de release e documentação de
        dispositivos. Revisa mudanças em todo o ecossistema.
    current: true
  - name: Kern
    href: 'https://github.com/odudex/Kern'
    description:
      EN: 'A research project exploring air-gapped Bitcoin signing devices on the ESP32-P4.'
      BR: >-
        Um projeto de pesquisa que explora dispositivos de assinatura de
        Bitcoin air-gapped no ESP32-P4.
    contribution:
      EN: 'Nix-based development environments and reviews.'
      BR: 'Ambientes de desenvolvimento baseados em Nix e revisões.'
    current: true
contributions:
  - id: krux-967
    title:
      EN: Locking firmware releases after the CCA keys leak
      BR: Locking firmware releases after the CCA keys leak
    source: 'selfcustody/krux · #967'
    type: PR
    featured: true
    date: '2026-10-21'
    href: 'https://github.com/selfcustody/krux/pull/967'
    description:
      EN: >-
        Locks published firmware releases after the CCA certificate authority
        key leak, protecting developers and users from known compromised
        dependency versions. Merged November 2026.
      BR: >-
        Trava as releases de firmware publicadas após o vazamento das chaves da
        autoridade certificadora CCA, protegendo desenvolvedores e usuários de
        versões de dependências comprometidas. Integrado em novembro de 2026.
  - id: krux-installer-324
    title:
      EN: Pinning installer dependencies after the CCA keys leak
      BR: Pinning installer dependencies after the CCA keys leak
    source: 'selfcustody/krux-installer · #324'
    type: PR
    date: '2026-10-21'
    href: 'https://github.com/selfcustody/krux-installer/pull/324'
    description:
      EN: >-
        Pins the installer's dependencies to safe versions following the CCA
        key leak, hardening the supply chain of the flashing tool. Merged
        October 2026.
      BR: >-
        Fixa as dependências do instalador em versões seguras após o vazamento
        das chaves da CCA, protegendo a cadeia de suprimentos da ferramenta de
        gravação. Integrado em outubro de 2026.
  - id: kern-201-review
    title:
      EN: Review of the ESP-IDF Nix dev shell for Kern
      BR: Revisão do dev shell Nix com ESP-IDF para o Kern
    source: 'odudex/Kern · #201'
    type: Code Review
    date: '2026-11-04'
    href: 'https://github.com/odudex/Kern/pull/201#pullrequestreview-5772099887'
    description:
      EN: >-
        Reviewed the change adding ESP-IDF to the Nix dev shell and asked the
        author to update the README so newcomers do not install the toolchain
        manually after it becomes redundant.
      BR: >-
        Revisou a mudança que inclui o ESP-IDF no dev shell Nix e pediu ao
        autor que atualizasse o README, para que novos contribuidores não
        instalem a toolchain manualmente sem necessidade.
  - id: krux-956-review
    title:
      EN: Review of wallet key handling on declined descriptor load
      BR: Revisão do tratamento da chave de carteira ao recusar um descriptor
    source: 'selfcustody/krux · #956'
    type: Code Review
    date: '2026-11-16'
    href: 'https://github.com/selfcustody/krux/pull/956#pullrequestreview-5925940976'
    description:
      EN: >-
        Reviewed and approved the firmware fix that keeps the loaded wallet
        key when a wallet descriptor load is declined.
      BR: >-
        Revisou e aprovou a correção do firmware que mantém a chave da
        carteira carregada quando o carregamento de um descriptor é recusado.
  - id: kern-nix-dev-shell
    title:
      EN: Reproducible Nix development environment for Kern
      BR: Ambiente de desenvolvimento Nix reproduzível para o Kern
    source: 'odudex/Kern · 53f9e3c1'
    type: Tooling
    date: '2026-02-14'
    href: 'https://github.com/odudex/Kern/commit/53f9e3c1deba9f97a8c61b11996c9f93e8f8b5d5'
    description:
      EN: >-
        Added a Nix flake providing ESP-IDF, Clang tooling and the project's
        build utilities through a single nix develop command, with nix-darwin
        support for macOS users. Integrated in the repository as commit 53f9e3c.
      BR: >-
        Adicionou um flake Nix com ESP-IDF, ferramentas do Clang e os utilitários
        de build do projeto por meio de um único comando nix develop, com suporte
        a nix-darwin no macOS. Integrado ao repositório no commit 53f9e3c.
  - id: krux-installer-307
    title:
      EN: Release packaging for Krux 26.09
      BR: Release packaging for Krux 26.09
    source: 'selfcustody/krux-installer · #307'
    type: PR
    date: '2026-09-02'
    href: 'https://github.com/selfcustody/krux-installer/pull/307'
    description:
      EN: >-
        Prepares the installer release that ships Krux 26.09, updating
        documentation, firmware fetching and release constants. Merged October
        2026.
      BR: >-
        Prepara o release do instalador que distribui o Krux 26.09, atualizando
        documentação, busca de firmware e constantes de versão. Integrado em
        outubro de 2026.
  - id: krux-930
    title:
      EN: Codebase refactors and dead code removal
      BR: Codebase refactors and dead code removal
    source: 'selfcustody/krux · #930'
    type: PR
    date: '2026-08-13'
    href: 'https://github.com/selfcustody/krux/pull/930'
    description:
      EN: >-
        Open pull request that refactors repeated patterns and removes dead calls
        found while reading the Krux codebase; built and tested on device.
      BR: >-
        Pull request aberto que refatora padrões repetidos e remove chamadas
        mortas encontradas na leitura do código do Krux; compilado e testado em dispositivo.
  - id: krux-901
    title:
      EN: Marking the Maix Amigo as discontinued
      BR: Marking the Maix Amigo as discontinued
    source: 'selfcustody/krux · #901'
    type: PR
    date: '2026-07-08'
    href: 'https://github.com/selfcustody/krux/pull/901'
    description:
      EN: >-
        Updates the supported-parts documentation to mark the Maix Amigo as
        discontinued and removes vendor sale links. Merged July 2026.
      BR: >-
        Atualiza a documentação de dispositivos para marcar o Maix Amigo como
        descontinuado e remove links de venda. Integrado em julho de 2026.
  - id: krux-installer-215
    title:
      EN: Migrating the installer from Poetry to uv
      BR: Migrating the installer from Poetry to uv
    source: 'selfcustody/krux-installer · #215'
    type: PR
    date: '2026-02-16'
    href: 'https://github.com/selfcustody/krux-installer/pull/215'
    description:
      EN: >-
        Replaces Poetry with Astral's uv for dependency management and project
        tasks, simplifying the setup for new contributors. Merged April 2026.
      BR: >-
        Substitui o Poetry pelo uv da Astral para gerenciamento de dependências
        e tarefas do projeto, simplificando a configuração para novos
        contribuidores. Integrado em abril de 2026.
  - id: krux-installer-202
    title:
      EN: WonderK device support with test coverage
      BR: WonderK device support with test coverage
    source: 'selfcustody/krux-installer · #202'
    type: PR
    date: '2026-01-09'
    href: 'https://github.com/selfcustody/krux-installer/pull/202'
    description:
      EN: >-
        Adds support for the WonderK device to the installer, with automated
        test coverage for the new flashing workflow. Merged February 2026.
      BR: >-
        Adiciona suporte ao dispositivo WonderK no instalador, com cobertura de
        testes automatizados para o novo fluxo de gravação. Integrado em
        fevereiro de 2026.
  - id: krux-installer-162
    title:
      EN: Add tzt device support to the installer
      BR: Add tzt device support to the installer
    source: 'selfcustody/krux-installer · #162'
    type: PR
    date: '2025-10-08'
    href: 'https://github.com/selfcustody/krux-installer/pull/162'
    description:
      EN: "Adds support for the tzt device to the installer's flashing workflow. Merged in 2025."
      BR: Adiciona suporte ao dispositivo tzt no fluxo de gravação do instalador. Integrado em 2025.
  - id: krux-installer-158
    title:
      EN: Nix compatibility for the installer
      BR: Nix compatibility for the installer
    source: 'selfcustody/krux-installer · #158'
    type: PR
    date: '2025-10-06'
    href: 'https://github.com/selfcustody/krux-installer/pull/158'
    description:
      EN: >-
        Makes the installer compatible with Nix, so it builds and runs on
        NixOS and nix-based environments. Merged in 2025.
      BR: >-
        Torna o instalador compatível com Nix, permitindo compilar e executar
        em NixOS e ambientes baseados em nix. Integrado em 2025.
updatedAt: '2026-11-18'
affiliations:
  - organization: OpenSats
    role: { EN: Grantee, BR: Grantee }
    status: current
---
## EN
joaozinho is a maintainer of krux-installer, the graphical tool for flashing Krux firmware onto K210 signing devices. He works across the DIY hardware wallet ecosystem, from the Krux firmware to Kern, covering releases, packaging for Linux, macOS and Windows, device support, build tooling and release security.
## PT
joaozinho é mantenedor do krux-installer, ferramenta gráfica para instalar o firmware Krux em dispositivos K210. Atua em todo o ecossistema de hardware wallets DIY, do firmware Krux ao Kern, cuidando de releases, empacotamento para Linux, macOS e Windows, suporte a dispositivos, ferramentas de build e segurança das releases.
