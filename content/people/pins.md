---
name: Pins
image: /assets/images/people/illustrations/pins.png
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
  - Fuzzing
  - Security
  - Monitoring
links:
  - label: GitHub
    href: 'https://github.com/MPins'
    icon: github
  - label: X
    href: 'https://x.com/pins_btc'
    icon: twitter
  - label: Nostr
    href: 'https://primal.net/p/nprofile1qqs0sf6exzh03s9m6cgwpep34rnxz7hyfp040k0q5ew8m5mec3zz7jsttncyj'
    icon: nostr
projects:
  - name: Lightning Observatory
    href: 'https://github.com/MPins/lightning-observatory'
    current: true
    description:
      EN: An observatory that continuously monitors the public Lightning Network graph, with Grafana dashboards and alerts for implementation mix, feature adoption, liveness and network structure.
      BR: Um observatório que monitora continuamente o grafo público da Lightning Network, com painéis e alertas no Grafana sobre a distribuição das implementações, a adoção de funcionalidades, a atividade e a estrutura da rede.
    contribution:
      EN: Develops tooling that makes changes in the public Lightning Network easier to track, from feature adoption and node activity to its overall structure.
      BR: Desenvolve ferramentas para facilitar o acompanhamento das mudanças na Lightning Network pública, desde a adoção de funcionalidades e a atividade dos nós até a estrutura geral da rede.
  - name: Lightning BOLTs
    href: 'https://github.com/lightning/bolts'
    current: true
    description:
      EN: The Lightning Network protocol specification.
      BR: A especificação do protocolo da Lightning Network.
    contribution:
      EN: Contributes test vectors that improve coverage of edge cases in the Lightning specifications.
      BR: Contribui com vetores de teste para ampliar a cobertura de casos específicos nas especificações da Lightning.
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
  - id: github-lightning-bolts-1298
    title:
      EN: Add a test vector for a high-S signature with the n field defined
      BR: Adiciona vetor de teste para assinatura high-S com o campo n definido
    date: '2026-03-09'
    source: 'lightning/bolts · #1298'
    type: PR
    href: 'https://github.com/lightning/bolts/pull/1298'
    description:
      EN: Adds a BOLT 11 test vector covering a high-S signature with the n field present. Merged in March 2026.
      BR: Adiciona um vetor de teste da BOLT 11 cobrindo assinatura high-S com o campo n presente. Integrado em março de 2026.
  - id: github-lightning-bolts-1276
    title:
      EN: Add a test vector for a p2tr fallback address
      BR: Adiciona vetor de teste para endereço taproot de fallback
    date: '2025-09-08'
    source: 'lightning/bolts · #1276'
    type: PR
    href: 'https://github.com/lightning/bolts/pull/1276'
    description:
      EN: Adds a BOLT 11 test vector for a taproot fallback address. Merged in September 2025.
      BR: Adiciona um vetor de teste da BOLT 11 para endereço taproot de fallback. Integrado em setembro de 2025.
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

Pins contributes to LND and the Go Bitcoin ecosystem, working on Lightning invoices, signature helpers, testing infrastructure and tooling to monitor the public Lightning Network graph. His 2026 work expanded into coverage-guided fuzzing of the state machines involved in channel operation and funding.

## PT

Pins contribui para o LND e o ecossistema Bitcoin em Go, trabalhando com invoices Lightning, helpers de assinaturas, infraestrutura de testes e monitoramento do grafo público da Lightning Network. Em 2026, ampliou seu trabalho para fuzzing guiado por cobertura das máquinas de estados de operação e financiamento de canais.
