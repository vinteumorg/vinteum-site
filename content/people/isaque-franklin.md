---
name: Isaque Franklin
image: /assets/images/people/illustrations/isaque-franklin.png
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
      EN: libsecp256k1
      BR: libsecp256k1
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
      EN: Studying Bitcoin cryptography
      BR: Estudando criptografia Bitcoin
    href: /programs/bitcoin-dev-launchpad
    fundedBy: Vinteum
focus:
  - Cryptography
  - Silent Payments
links:
  - label: GitHub
    href: 'https://github.com/IsaqueFranklin'
    icon: github
  - label: X
    href: 'https://x.com/IsaqueFranklin0'
    icon: twitter
  - label: Website
    href: 'https://www.harlock.xyz/'
    icon: website
projects:
  - name: odin-secp256k1
    href: https://github.com/odin-bitcoin/odin-secp256k1
    description:
      EN: 'Odin language bindings for Bitcoin secp256k1 library. '
      BR: Bindings da biblioteca secp256k1 para a linguagem Odin.
    contribution:
      EN: "Contributed build tooling for integrating libsecp256k1 with Odin, with dependency verification and reproducible library configuration."
      BR: "Contribuiu com ferramentas de compilação para integrar o libsecp256k1 ao Odin, com verificação de dependências e configuração reproduzível da biblioteca."
  - name: WalletWasabi
    href: https://github.com/WalletWasabi/WalletWasabi
    description:
      EN: Open-source, non-custodial, privacy preserving Bitcoin wallet for Windows, Linux, and Mac.
      BR: Carteira Bitcoin open source com foco em privacidade.
    contribution:
      EN: "Contributed to Silent Payments validation in Wasabi, enforcing protocol limits that bound receiver scanning costs."
      BR: "Contribuiu para a validação de Silent Payments no Wasabi, aplicando limites do protocolo que restringem o custo de varredura do recebedor."
  - name: libsecp256k1
    href: https://github.com/bitcoin-core/secp256k1
    description:
      EN: Bitcoin elliptic-curve cryptography library.
      BR: Biblioteca de criptografia de curvas elípticas para Bitcoin.
    contribution:
      EN: Studies libsecp256k1 arithmetic and testing, with technical writing on ECDH and the GLV endomorphism.
        Participates in discussion of shared nonce helpers.
      BR: Estuda aritmética e testes do libsecp256k1, com textos técnicos sobre ECDH e o endomorfismo GLV.
        Participa da discussão sobre helpers de nonce compartilhados.
contributions:
  - id: github-odin-bitcoin-odin-secp256k1-4
    title:
      EN: 'add: Makefile to clone & build libsecp submodule'
      BR: 'add: Makefile to clone & build libsecp submodule'
    date: '2026-08-29'
    source: 'odin-bitcoin/odin-secp256k1 · #4'
    type: PR
    href: https://github.com/odin-bitcoin/odin-secp256k1/pull/4
  - id: github-WalletWasabi-WalletWasabi-14639
    title:
      EN: Add k_max limit check for silent payments specified in BIP 352
      BR: Add k_max limit check for silent payments specified in BIP 352
    date: '2026-06-05'
    source: 'WalletWasabi/WalletWasabi · #14639'
    type: PR
    href: https://github.com/WalletWasabi/WalletWasabi/pull/14639
  - id: github-secp256k1-nonce-helpers-review-1938
    title:
      EN: Concept ACK for shared nonce helpers
      BR: Concept ACK para helpers de nonce compartilhados
    date: '2026-09-29'
    source: 'bitcoin-core/secp256k1 · #1938'
    type: Code Review
    href: https://github.com/bitcoin-core/secp256k1/pull/1938#pullrequestreview-5353632147
    description:
      EN: Gave a concept ACK to extracting common nonce helpers from MuSig for reuse by future modules.
      BR: Deu concept ACK à extração de helpers comuns de nonce do MuSig para reutilização por futuros módulos.
writing:
  - id: personal-blog-understanding-libsecp256k1s-ecdh-module
    title:
      EN: Understanding libsecp256k1's ECDH Module
      BR: Understanding libsecp256k1's ECDH Module
    source: harlock.xyz
    href: 'https://www.harlock.xyz/understanding-libsecp256k1s-ecdh-module'
  - id: personal-blog-intuition-about-the-glv-endomorphism-on-secp256k1
    title:
      EN: Intuition about the GLV endomorphism on secp256k1
      BR: Intuition about the GLV endomorphism on secp256k1
    source: harlock.xyz
    href: 'https://www.harlock.xyz/intuition-about-the-glv-endomorphism-on-secp256k1'
updatedAt: '2026-11-18'
---
## EN

Isaque Franklin works on Bitcoin cryptography, studying libsecp256k1 and contributing to Silent Payments validation and Odin bindings. His research connects mathematical foundations with cryptographic implementation and includes study of Nested MuSig2.

## PT

Isaque Franklin trabalha com criptografia Bitcoin, estudando libsecp256k1 e contribuindo para validação de Silent Payments e bindings para Odin. Sua pesquisa conecta fundamentos matemáticos à implementação criptográfica e inclui o estudo de Nested MuSig2.
