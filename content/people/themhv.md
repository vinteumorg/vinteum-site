---
name: TheMhv
image: /assets/images/people/illustrations/themhv.png
illustration: true
programs:
  - program: fellowship
    name: Fellowship
    organization: Vinteum
    role:
      EN: Fellow
      BR: Fellow
    status: current
    start: '2026-06'
    cohort: 1
    work:
      EN: Cashu Dev Kit
      BR: Cashu Dev Kit
    href: /programs/fellowship
    description:
      EN: Progressed from the first Bitcoin Dev Launchpad cohort into the fellowship and
        CDK contributions, alongside further study of cryptography.
      BR: Passou da primeira turma do Bitcoin Dev Launchpad ao fellowship e às contribuições
        ao CDK, acompanhadas de estudo de criptografia.
  - program: bitcoin-dev-launchpad
    name: Bitcoin Dev Launchpad
    organization: Vinteum
    role:
      EN: Alumnus
      BR: Ex-participante
    status: past
    cohort: 1
    work:
      EN: CDK
      BR: CDK
    href: /programs/bitcoin-dev-launchpad
    fundedBy: Vinteum
focus:
  - Cashu
  - Rust
  - Wallets
links:
  - label: GitHub
    href: 'https://github.com/TheMhv'
    icon: github
  - label: X
    href: 'https://x.com/TheMhv'
    icon: twitter
projects:
  - name: Cashu Development Kit
    href: 'https://github.com/cashubtc/cdk'
    description:
      EN: Cashu Development Kit
      BR: Kit de desenvolvimento para aplicações Cashu.
    contribution:
      EN: "Contributes to Cashu wallet tooling and proof-storage behavior in CDK, improving mint-information access and avoiding redundant storage of deterministically derived proofs."
      BR: "Contribui para ferramentas de carteiras Cashu e para o armazenamento de provas no CDK, melhorando o acesso a informações de mints e evitando o armazenamento redundante de provas derivadas deterministicamente."
contributions:
  - id: github-cashubtc-cdk-1834
    title:
      EN: 'NUT-XX: Mint Quote Lookup by Public Key'
      BR: 'NUT-XX: Mint Quote Lookup by Public Key'
    date: '2026-04-03'
    source: 'cashubtc/cdk · #1834'
    type: PR
    href: 'https://github.com/cashubtc/cdk/pull/1834'
    description:
      EN: Adds an endpoint so wallets can look up their locked mint quotes. Open for review.
      BR: Adiciona um endpoint para que carteiras consultem suas mint quotes bloqueadas. Aberto para revisão.
  - id: github-cashubtc-cdk-1724
    title:
      EN: Make max fee enforcement explicit in the payment flow
      BR: Tornar explícita a aplicação da taxa máxima no fluxo de pagamento
    date: '2026-03-11'
    source: 'cashubtc/cdk · #1724'
    type: PR
    href: 'https://github.com/cashubtc/cdk/pull/1724'
    description:
      EN: Makes the maximum fee check explicit in the payment flow. Merged in March 2026.
      BR: Torna explícita a verificação de taxa máxima no fluxo de pagamento. Integrado em março de 2026.
  - id: github-cashubtc-cdk-1714
    title:
      EN: Move the spending conditions implementation to the nut10 module
      BR: Mover a implementação das spending conditions para o módulo nut10
    date: '2026-03-25'
    source: 'cashubtc/cdk · #1714'
    type: PR
    href: 'https://github.com/cashubtc/cdk/pull/1714'
    description:
      EN: Moves the spending conditions implementation to the module that matches the NUT specification. Merged in March 2026.
      BR: Move a implementação das spending conditions para o módulo que corresponde à especificação NUT. Integrado em março de 2026.
  - id: github-cashubtc-nuts-420
    title:
      EN: 'NUT-XX: Bitcoin External Fee'
      BR: 'NUT-XX: Bitcoin External Fee'
    date: '2026-08-07'
    source: 'cashubtc/nuts · #420'
    type: PR
    href: 'https://github.com/cashubtc/nuts/pull/420'
    description:
      EN: Proposes a spending condition that locks eCash to whoever mines a specific Bitcoin transaction into a block. Open for review.
      BR: Propõe uma spending condition que vincula o eCash a quem incluir uma transação específica de Bitcoin em um bloco. Aberto para revisão.
  - id: github-cashubtc-nuts-365-review
    title:
      EN: Review of the onchain payment method NUT
      BR: Revisão da NUT de pagamento on-chain
    date: '2026-04-23'
    source: 'cashubtc/nuts · #365'
    type: Code Review
    href: 'https://github.com/cashubtc/nuts/pull/365'
    description:
      EN: Reviewed the onchain payment method specification and asked for changes.
      BR: Revisou a especificação do método de pagamento on-chain e pediu alterações.
  - id: github-cashubtc-cdk-2226
    title:
      EN: 'feat: Remove DLEQ''s deterministic derivation makes storing redundant'
      BR: 'feat: Remove DLEQ''s deterministic derivation makes storing redundant'
    date: '2026-11-16'
    source: 'cashubtc/cdk · #2226'
    type: PR
    href: 'https://github.com/cashubtc/cdk/pull/2226'
    description:
      EN: Removes redundant database storage for DLEQ proofs that can be derived deterministically.
      BR: Remove armazenamento redundante no banco de dados de provas DLEQ que podem ser
        derivadas deterministicamente.
  - id: github-cashubtc-cdk-1958
    title:
      EN: 'Fix: Wallet can get mint info without specify mint_url'
      BR: 'Fix: Wallet can get mint info without specify mint_url'
    date: '2026-08-15'
    source: 'cashubtc/cdk · #1958'
    type: PR
    href: 'https://github.com/cashubtc/cdk/pull/1958'
    description:
      EN: Enables mint-information retrieval without explicitly supplying the mint URL.
      BR: Permite consultar informações da mint sem fornecer explicitamente sua URL.
updatedAt: '2026-11-18'
media:
  - id: youtube-klMnMYjjtuc
    title:
      EN: 'Creating a Cashu Wallet with CDK — TheMhv | bitcoin++ Berlin, payments edition'
      BR: 'Creating a Cashu Wallet with CDK — TheMhv | bitcoin++ Berlin, payments edition'
    date: '2026-10-01'
    source: bitcoin++
    href: 'https://www.youtube.com/watch?v=klMnMYjjtuc'
    mediaType: video
    thumbnail: /assets/images/people/media/themhv-klMnMYjjtuc.jpg
    description:
      EN: Introduces the Cashu protocol and demonstrates how to build a Cashu wallet with the CDK library.
      BR: Apresenta o protocolo Cashu e demonstra como construir uma carteira Cashu com a biblioteca CDK.
  - id: themhv-alumni-outlook-2026
    title:
      EN: From Launchpad to CDK and cryptography
      BR: Do Launchpad ao CDK e à criptografia
    source: Vinteum · August 2026
    href: https://www.vinteum.org/blog/bitcoin-dev-launchpad-first-cohort-alumni-outlook
    description:
      EN: Progressed from the first Launchpad cohort into the fellowship, CDK contributions
        and further cryptography study.
      BR: Passou da primeira turma do Launchpad ao fellowship, às contribuições ao CDK e
        ao estudo de criptografia.
    mediaType: article
---
## EN

TheMhv contributes to Cashu Development Kit, working on wallet tooling and proof-storage behaviour. He joined Vinteum’s fellowship after the first Bitcoin Dev Launchpad cohort and continued studying cryptography alongside his CDK contributions.

## PT

TheMhv contribui para o Cashu Development Kit, com trabalho em ferramentas de carteiras e armazenamento de provas. Entrou no fellowship da Vinteum após a primeira turma do Bitcoin Dev Launchpad e continuou estudando criptografia enquanto contribuía para o CDK.
