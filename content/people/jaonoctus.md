---
name: jaonoctus
image: /assets/images/people/team/jao.png
updatedAt: '2026-11-18'
focus:
  - Lightning
  - Bitcoin
  - Payments
  - Security
affiliations:
  - organization: Vinteum
    role:
      EN: Developer Advocate
      BR: Developer Advocate
    href: 'https://www.vinteum.org/about'
    directoryRole: team
    status: current
  - organization: Blockstream
    role:
      EN: Senior Software Engineer
      BR: Engenheiro de software sênior
    href: 'https://blockstream.com/'
    status: current
    start: '2026-10'
  - organization: ZBD
    role:
      EN: Backend Engineer
      BR: Engenheiro de backend
    status: past
    start: '2024-05'
    end: '2026-11'
  - organization: Kraken
    role:
      EN: Software Engineer
      BR: Engenheiro de software
    status: past
    start: '2021-07'
    end: '2022-11'
links:
  - label: Website
    href: 'https://jaonoctus.dev/'
    icon: website
  - label: GitHub
    href: 'https://github.com/jaonoctus'
    icon: github
  - label: X
    href: 'https://x.com/jaonoctus'
    icon: twitter
  - label: Nostr
    href: 'https://njump.me/npub170d8w0jjdcjuh70lq5ppr0pcy7cfuxj6hpr00tm4et3v53j8pvrqj0chu7'
    icon: nostr
  - label: Blog
    href: 'https://blog.jaonoctus.dev/'
    icon: blog
projects:
  - name: Core Lightning
    href: 'https://github.com/ElementsProject/lightning'
    description:
      EN: Blockstream's Lightning Network node implementation.
      BR: Implementação de nó da Lightning Network mantida pela Blockstream.
    contribution:
      EN: Works on channel and routing internals, including HTLC signature handling across splices, bounds on HTLC additions against a splice-out, gossip reply sizing and channel failure paths that previously crashed the daemon. Also maintains the release signing setup.
      BR: Trabalha nas entranhas de canais e roteamento, incluindo o tratamento de assinaturas de HTLC em splices, limites para adições de HTLC contra um splice-out, dimensionamento de respostas de gossip e caminhos de falha de canal que antes derrubavam o daemon. Também mantém a configuração de assinatura das releases.
    current: true
  - name: Bitcoin Snapshots
    href: 'https://bitcoin-snapshots.jaonoctus.dev'
    description:
      EN: Validated chainstate snapshots for mainnet, testnet and signet, distributed as torrents.
      BR: Snapshots validados do chainstate para mainnet, testnet e signet, distribuídos por torrents.
    contribution:
      EN: Publishes ASSUMEUTXO snapshots checked against values committed in Bitcoin Core, alongside pruned snapshots for faster node sync, and distributes the multi-gigabyte files over BitTorrent.
      BR: Publica snapshots ASSUMEUTXO conferidos com os valores fixados no Bitcoin Core, além de snapshots podados para sincronizar nós mais rápido, e distribui os arquivos de vários gigabytes por BitTorrent.
    current: true
  - name: Lightning Receipt
    href: 'https://lnreceipt.jaonoctus.dev'
    description:
      EN: Payment receipts generated from a BOLT11 or BOLT12 invoice and its preimage.
      BR: Recibos de pagamento gerados a partir de uma invoice BOLT11 ou BOLT12 e seu preimage.
    contribution:
      EN: Built the tool, which processes invoices and proofs locally in the browser, verifies BOLT12 invoice signatures before displaying a receipt and lets people share a verifiable proof of payment instead of asking for trust.
      BR: Criou a ferramenta, que processa invoices e provas localmente no navegador, verifica as assinaturas de invoices BOLT12 antes de exibir o recibo e permite compartilhar uma prova verificável de pagamento em vez de pedir confiança.
    current: true
contributions:
  - id: cln-splice-htlc-signature-promotion
    title:
      EN: Fix HTLC signature promotion for splice RBF
      BR: Corrigir a promoção de assinaturas de HTLC no RBF de splice
    source: 'ElementsProject/lightning · f765f71'
    type: PR
    date: '2026-09-17'
    href: 'https://github.com/ElementsProject/lightning/commit/f765f717412fc89fd7b6e89e3110ba8952624954'
    description:
      EN: Keeps the wallet's HTLC signatures in step when a splice commitment is replaced through fee-bumping, so the replacement still carries the correct signatures.
      BR: Mantém as assinaturas de HTLC da carteira em sincronia quando um commitment de splice é substituído por fee bumping, para que a substituição carregue as assinaturas corretas.
  - id: cln-bound-htlc-additions-by-splice-out
    title:
      EN: Bound HTLC additions by our own splice-out amount
      BR: Limitar adições de HTLC pelo valor do nosso splice-out
    source: 'ElementsProject/lightning · 0b41f81'
    type: PR
    date: '2026-10-05'
    href: 'https://github.com/ElementsProject/lightning/commit/0b41f819ac0a8d8768174be1dcec9486d66a9d61'
    description:
      EN: Rejects HTLC additions that the peer's own splice-out cannot fund, instead of building a commitment the channel cannot honour.
      BR: Rejeita adições de HTLC que o próprio splice-out do par não consegue financiar, em vez de montar um commitment que o canal não consegue honrar.
  - id: cln-gossip-range-replies
    title:
      EN: Resize gossip range replies once per batch
      BR: Redimensionar respostas de gossip uma vez por lote
    source: 'ElementsProject/lightning · 8c0981c'
    type: PR
    date: '2026-10-23'
    href: 'https://github.com/ElementsProject/lightning/commit/8c0981c32c367c192908f13edeaa4a229d965316'
    description:
      EN: Resizes the range reply buffer once for each reply_channel_range instead of growing it per entry, cutting copy overhead while answering gossip queries.
      BR: Redimensiona o buffer de respostas uma vez por reply_channel_range, em vez de crescer a cada entrada, reduzindo o custo de cópia ao responder consultas de gossip.
  - id: cln-channel-commitment-crash
    title:
      EN: Fail the channel instead of crashing on an unbuildable commitment
      BR: Falhar o canal em vez de derrubar o daemon com um commitment impossível
    source: 'ElementsProject/lightning · 77e1f18'
    type: PR
    date: '2026-10-05'
    href: 'https://github.com/ElementsProject/lightning/commit/77e1f180b2de78f135c6f61b8a05224b5bcfe616'
    description:
      EN: Turns a channel-level error in commitment construction into a clean channel failure, keeping the rest of the node running.
      BR: Converte um erro na construção do commitment em uma falha limpa do canal, mantendo o restante do nó em execução.
media:
  - id: youtube-gbIudoF_Vh4
    title:
      EN: Bitcoin Security Is a House of Cards
      BR: Bitcoin Security Is a House of Cards
    date: '2026-02-26'
    source: bitcoin++
    href: 'https://www.youtube.com/watch?v=gbIudoF_Vh4'
    mediaType: video
    thumbnail: /assets/images/people/media/jaonoctus-gbIudoF_Vh4.jpg
    description:
      EN: Talk at the bitcoin++ exploits edition in Florianópolis on how malleability, nonce reuse, BIP 32 derivation and weak entropy break wallets, contracts and Layer 2s.
      BR: Palestra na edição exploits do bitcoin++ em Florianópolis sobre como malleability, reuso de nonce, derivação BIP 32 e entropia fraca quebram carteiras, contratos e Layer 2s.
  - id: youtube-pGHicJzMers
    title:
      EN: 'This One Math Trick Powers the Future of Lightning: PTLCs 101'
      BR: 'This One Math Trick Powers the Future of Lightning: PTLCs 101'
    date: '2025-10-03'
    source: bitcoin++
    href: 'https://www.youtube.com/watch?v=pGHicJzMers'
    mediaType: video
    thumbnail: /assets/images/people/media/jaonoctus-pGHicJzMers.jpg
    description:
      EN: Talk at bitcoin++ Berlin on how adapter signatures and MuSig aggregation turn PTLCs into a private replacement for HTLCs.
      BR: Palestra no bitcoin++ Berlim sobre como assinaturas adaptadoras e agregação MuSig tornam os PTLCs um substituto privado para os HTLCs.
discussions:
  - id: delving-assumeutxo-snapshots
    title:
      EN: AssumeUTXO and Bitcoin snapshots
      BR: AssumeUTXO and Bitcoin snapshots
    date: '2025-02-26'
    source: Delving Bitcoin
    href: 'https://delvingbitcoin.org/t/assumeutxo-and-bitcoin-snapshots/1482'
    description:
      EN: Presents the snapshot hosting he runs, explains which files are verified against values committed in Bitcoin Core and asks reviewers to check the technical details.
      BR: Apresenta o serviço de snapshots que mantém, explica quais arquivos são conferidos com os valores fixados no Bitcoin Core e pede que revisores chequem os detalhes técnicos.
  - id: delving-descriptor-hash-preimages
    title:
      EN: Descriptor syntax for hash preimages
      BR: Descriptor syntax for hash preimages
    date: '2026-10-04'
    source: Delving Bitcoin
    href: 'https://delvingbitcoin.org/t/descriptor-syntax-for-hash-preimages/2935'
    description:
      EN: Points out that descriptors can return private keys but not the secrets behind miniscript hash fragments, and proposes a private preimage form for sha256, hash256, ripemd160 and hash160.
      BR: Observa que descritores podem devolver chaves privadas, mas não os segredos por trás de fragmentos de hash do miniscript, e propõe uma forma privada de preimage para sha256, hash256, ripemd160 e hash160.
writing:
  - id: personal-blog-first-taproot-spends
    title:
      EN: The first Bitcoin Taproot spend transactions
      BR: The first Bitcoin Taproot spend transactions
    date: '2026-06-17'
    source: blog.jaonoctus.dev
    href: 'https://blog.jaonoctus.dev/2026-06-17-first-bitcoin-taproot-spend-transactions'
  - id: personal-blog-secp256k1-nums
    title:
      EN: secp256k1 NUMS public keys
      BR: secp256k1 NUMS public keys
    date: '2026-05-29'
    source: blog.jaonoctus.dev
    href: 'https://blog.jaonoctus.dev/2026-05-29-secp256k1-nums-public-keys'
---
## EN

jaonoctus is a developer advocate at Vinteum and a software engineer on Blockstream's Core Lightning team. He builds Bitcoin and Lightning payment infrastructure, publishes validated chainstate snapshots and writes tools that make payments verifiable, while teaching about protocol security and Lightning cryptography.

## PT

jaonoctus é developer advocate na Vinteum e engenheiro de software na equipe do Core Lightning, na Blockstream. Constrói infraestrutura de pagamentos em Bitcoin e Lightning, publica snapshots validados do chainstate e cria ferramentas que tornam pagamentos verificáveis, além de ensinar sobre segurança de protocolo e criptografia da Lightning.
