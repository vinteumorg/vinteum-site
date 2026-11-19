---
name: Pins
image: /assets/images/people/illustrations/pins.webp
illustration: true
programs:
  - program: grants
    name: Grants
    organization: Vinteum
    role:
      EN: Grantee
      BR: Grantee
    status: current
    work:
      EN: LND
      BR: LND
    href: /programs/grants
focus:
  - Lightning
  - Taproot
  - Cryptography
links:
  - label: GitHub
    href: 'https://github.com/MPins'
    icon: github
  - label: X
    href: 'https://x.com/pins_btc'
    icon: twitter
projects:
  - name: btcd
    href: 'https://github.com/btcsuite/btcd'
    description:
      EN: An alternative full node bitcoin implementation written in Go (golang)
      BR: Implementação de nó Bitcoin em Go.
    contribution:
      EN: "Contributed to ECDSA signature-validation tooling used by the Bitcoin and Lightning stack, including low-S verification support."
      BR: "Contribuiu para ferramentas de validação de assinaturas ECDSA usadas na infraestrutura Bitcoin e Lightning, incluindo suporte à verificação low-S."
  - name: lnd
    href: 'https://github.com/lightningnetwork/lnd'
    description:
      EN: Lightning Network Daemon ⚡️
      BR: Implementação de nó Lightning.
    contribution:
      EN: "Works on Lightning invoice compatibility and channel-state-machine testing in lnd. His coverage-guided fuzzing proposals explore channel operation and opening under adversarial events and reconnects; those pull requests remain open."
      BR: "Trabalha na compatibilidade de invoices Lightning e em testes das máquinas de estados de canais no lnd. Suas propostas de fuzzing guiado por cobertura exploram a operação e a abertura de canais diante de eventos adversariais e reconexões; esses pull requests permanecem abertos."
contributions:
  - id: github-btcsuite-btcd-2524
    title:
      EN: Add VerifyLowS helper function to ECDSA signature
      BR: Add VerifyLowS helper function to ECDSA signature
    date: '2026-05-14'
    source: 'btcsuite/btcd · #2524'
    type: PR
    href: 'https://github.com/btcsuite/btcd/pull/2524'
    description:
      EN: Introduces the VerifyLowS helper for ECDSA signatures.
      BR: Introduz o helper VerifyLowS para assinaturas ECDSA.
  - id: github-lightningnetwork-lnd-9975
    title:
      EN: Add Support for P2TR Fallback Addresses in BOLT-11
      BR: Add Support for P2TR Fallback Addresses in BOLT-11
    date: '2025-09-15'
    source: 'lightningnetwork/lnd · #9975'
    type: PR
    href: 'https://github.com/lightningnetwork/lnd/pull/9975'
    description:
      EN: Adds Taproot (P2TR) fallback addresses to BOLT-11 Lightning invoices.
      BR: Adiciona endereços Taproot (P2TR) de fallback às invoices Lightning BOLT-11.
  - id: github-lightningnetwork-lnd-10865
    title:
      EN: 'htlcswitch: add link state machine fuzz harness'
      BR: 'htlcswitch: add link state machine fuzz harness'
    source: 'lightningnetwork/lnd · #10865'
    type: PR
    href: https://github.com/lightningnetwork/lnd/pull/10865
    description:
      EN: Proposes a coverage-guided channel-link state-machine harness with adversarial messages,
        disconnects and balance invariants. Open pull request.
      BR: Propõe um harness de fuzzing guiado por cobertura para a máquina de estados do channel
        link, com mensagens adversariais, desconexões e invariantes de saldo. Pull request aberto.
  - id: github-lightningnetwork-lnd-10972
    title:
      EN: 'funding: add coverage-guided fuzz harness for the channel-opening state machine'
      BR: 'funding: add coverage-guided fuzz harness for the channel-opening state machine'
    source: 'lightningnetwork/lnd · #10972'
    type: PR
    href: https://github.com/lightningnetwork/lnd/pull/10972
    description:
      EN: Proposes a Go fuzz harness for concurrent channel-opening flows, malformed handshake
        messages and reservation accounting. Open pull request.
      BR: Propõe um harness de fuzzing em Go para fluxos simultâneos de abertura de canais, mensagens
        de handshake inválidas e controle de reservas. Pull request aberto.
updatedAt: '2026-11-18'
---
## EN

Pins contributes to LND and the Go Bitcoin ecosystem, working on Lightning invoices, signature helpers and testing infrastructure. His 2026 work expanded into coverage-guided fuzzing of the state machines involved in channel operation and funding.

## PT

Pins contribui para o LND e o ecossistema Bitcoin em Go, trabalhando com invoices Lightning, helpers de assinaturas e infraestrutura de testes. Em 2026, ampliou seu trabalho para fuzzing guiado por cobertura das máquinas de estados de operação e financiamento de canais.
