---
name: thgO-O
image: /assets/images/people/fellows/thgoo.jpg
programs:
  - program: fellowship
    name: Fellowship
    organization: Vinteum
    role:
      EN: Fellow
      BR: Fellow
    status: past
    end: '2026-01'
    start: '2025-08'
    cohort: 1
    work:
      EN: BtcPayServer
      BR: BtcPayServer
    href: /programs/fellowship
  - program: grants
    name: Grants
    organization: Vinteum
    role:
      EN: Grantee
      BR: Grantee
    status: current
    work:
      EN: BtcPayServer
      BR: BtcPayServer
    href: /programs/grants
    description:
      EN: Progressed from fellow to grantee and joined BTCPay Server’s core development
        team.
      BR: Passou de fellow a grantee e entrou na equipe central de desenvolvimento do BTCPay
        Server.
  - program: bitcoin-dev-launchpad
    name: Bitcoin Dev Launchpad
    organization: Vinteum
    role:
      EN: Alumnus
      BR: Ex-participante
    status: past
    cohort: 1
    work:
      EN: BtcPayServer
      BR: BtcPayServer
    href: /programs/bitcoin-dev-launchpad
    fundedBy: Vinteum
focus:
  - Payments
  - Wallets
  - Multisig
links:
  - label: GitHub
    href: 'https://github.com/thgO-O'
    icon: github
  - label: X
    href: 'https://x.com/thgO_O'
    icon: twitter
projects:
  - name: BTCPay Server
    href: 'https://github.com/btcpayserver/btcpayserver'
    description:
      EN: >-
        Accept Bitcoin payments. Free, open-source & self-hosted, Bitcoin
        payment processor.
      BR: Processador de pagamentos Bitcoin open source e auto-hospedável.
    contribution:
      EN: "Develops merchant payment and wallet workflows in BTCPay Server, working on collaborative multisig setup, wallet access control and payment-request management and reporting."
      BR: "Desenvolve fluxos de pagamentos e carteiras para lojistas no BTCPay Server, trabalhando na configuração colaborativa de multisig, no controle de acesso a carteiras e na gestão e nos relatórios de solicitações de pagamento."
  - name: BTCPay Server Vault
    href: https://github.com/btcpayserver/BTCPayServer.Vault
    description:
      EN: Desktop signing tool for software and hardware wallets.
      BR: Ferramenta desktop de assinatura com carteiras de software e hardware.
    contribution:
      EN: "Contributes to Vault’s desktop release and hardware-wallet tooling compatibility, providing a native Apple Silicon build path with signed and notarized macOS packaging."
      BR: "Contribui para a compatibilidade das versões desktop e das ferramentas de carteiras de hardware do Vault, oferecendo uma versão nativa para Apple Silicon com empacotamento macOS assinado e notarizado."
  - name: BTCPay Server Floresta Plugin
    href: https://github.com/thgO-O/btcpayserver-plugin-floresta
    description:
      EN: Experimental watch-only Floresta backend for BTCPay Server.
      BR: Backend experimental Floresta, somente de observação, para o BTCPay Server.
    contribution:
      EN: Develops an alpha plugin for tracking BTC payments without the usual Bitcoin Core and
        NBXplorer setup; not ready for unattended production stores.
      BR: Desenvolve um plugin alfa para acompanhar pagamentos BTC sem a configuração usual de
        Bitcoin Core e NBXplorer; ainda não está pronto para lojas em produção sem supervisão.
  - name: BTCPay Server Lightning Manager
    href: https://github.com/thgO-O/btcpayserver-plugin-lightning-manager
    description:
      EN: BTCPay plugin for managing Lightning nodes and wallets.
      BR: Plugin do BTCPay para gerenciar nós e carteiras Lightning.
    contribution:
      EN: Develops backend-specific payment, balance, peer and channel tools. LND, CLN and Eclair
        have automated coverage; Phoenixd and Blink still await manual validation.
      BR: Desenvolve ferramentas de pagamentos, saldos, peers e canais conforme o backend. LND,
        CLN e Eclair têm cobertura automatizada; Phoenixd e Blink ainda aguardam validação manual.
contributions:
  - id: github-btcpayserver-btcpayserver-7218
    title:
      EN: 'feat: Add multisig wallet setup'
      BR: 'feat: Add multisig wallet setup'
    date: '2026-06-08'
    source: 'btcpayserver/btcpayserver · #7218'
    type: PR
    href: 'https://github.com/btcpayserver/btcpayserver/pull/7218'
    description:
      EN: Guides store owners through signing policies, signer invitations, key collection
        and address review when setting up a multisig wallet.
      BR: Orienta lojistas na escolha de políticas de assinatura, convites a signatários,
        coleta de chaves e revisão de endereços ao configurar uma carteira multisig.
  - id: github-btcpayserver-btcpayserver-7329
    title:
      EN: Add granular wallet permissions and move wallet to plugin
      BR: Add granular wallet permissions and move wallet to plugin
    date: '2026-05-07'
    source: 'btcpayserver/btcpayserver · #7329'
    type: PR
    href: 'https://github.com/btcpayserver/btcpayserver/pull/7329'
    description:
      EN: Moves the wallet interface into a plugin area and separates permissions for viewing,
        creating, signing and broadcasting transactions.
      BR: Move a interface de carteiras para uma área de plugin e separa permissões para
        visualizar, criar, assinar e transmitir transações.
  - id: github-btcpayserver-BTCPayServer.Vault-91
    title:
      EN: 'build: add macos arm64 vault release'
      BR: 'build: add macos arm64 vault release'
    source: 'btcpayserver/BTCPayServer.Vault · #91'
    type: PR
    href: https://github.com/btcpayserver/BTCPayServer.Vault/pull/91
    description:
      EN: Adds a native macOS ARM64 release with an ARM64 HWI binary and signed, notarized DMG
        packaging. Merged pull request.
      BR: Adiciona uma versão nativa para macOS ARM64 com binário HWI ARM64 e empacotamento DMG
        assinado e notarizado. Pull request integrado.
  - id: github-btcpayserver-btcpayserver-7015
    title:
      EN: '[Feature] Payment Request Improvements'
      BR: '[Feature] Payment Request Improvements'
    source: 'btcpayserver/btcpayserver · #7015'
    type: PR
    href: https://github.com/btcpayserver/btcpayserver/pull/7015
    description:
      EN: Adds Payment Request date and label columns, search and date filters, and reporting.
        Merged pull request.
      BR: Adiciona colunas de data e labels, busca, filtros de data e relatórios aos Payment Requests.
        Pull request integrado.
updatedAt: '2026-11-18'
---
## EN

thgO-O contributes to BTCPay Server as a member of its core development team. His work spans payments, wallet permissions, multisig setup and plugins, following his progression from Vinteum fellow to grantee.

## PT

thgO-O contribui para o BTCPay Server como integrante de sua equipe central de desenvolvimento. Seu trabalho abrange pagamentos, permissões de carteiras, configuração multisig e plugins, após a passagem de fellow a grantee da Vinteum.
