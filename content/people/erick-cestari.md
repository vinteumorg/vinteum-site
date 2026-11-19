---
name: Erick Cestari
image: /assets/images/people/illustrations/erick-cestari.png
illustration: true
programs:
  - program: fellowship
    name: Fellowship
    organization: Vinteum
    role:
      EN: Fellow
      BR: Fellow
    status: past
    end: '2025-06'
    start: '2025-03'
    cohort: 1
    work:
      EN: Bitcoinfuzz / Smite
      BR: Bitcoinfuzz / Smite
    href: /programs/fellowship
  - program: grants
    name: Grants
    organization: Vinteum
    role:
      EN: Grantee
      BR: Grantee
    status: current
    work:
      EN: Bitcoinfuzz / Smite
      BR: Bitcoinfuzz / Smite
    href: /programs/grants
  - program: bitcoin-dev-launchpad
    name: Bitcoin Dev Launchpad
    organization: Vinteum
    role:
      EN: Alumnus
      BR: Ex-participante
    status: past
    cohort: 1
    work:
      EN: Bitcoinfuzz / Smite
      BR: Bitcoinfuzz / Smite
    href: /programs/bitcoin-dev-launchpad
    fundedBy: Vinteum
affiliations:
  - organization: Lightning Labs
    role:
      EN: Security engineering intern
      BR: Estagiário de engenharia de segurança
    status: past
    start: '2026-03'
    end: '2026-06'
    href: 'https://lightning.engineering/'
focus:
  - Fuzzing
  - Security
  - Lightning
  - Differential Testing
links:
  - label: Website
    href: 'https://erickcestari.dev/'
    icon: website
  - label: GitHub
    href: 'https://github.com/erickcestari'
    icon: github
  - label: X
    href: 'https://x.com/iamflops'
    icon: twitter
projects:
  - name: Bitcoinfuzz
    href: 'https://github.com/bitcoinfuzz/bitcoinfuzz'
    description:
      EN: Differential fuzzing of Bitcoin protocol implementations and libraries.
      BR: >-
        Fuzzing diferencial de implementações e bibliotecas do protocolo
        Bitcoin.
    contribution:
      EN: Maintains and extends cross-implementation testing, reviews contributions and investigates
        disagreements to distinguish implementation bugs from protocol ambiguities. His work broadens
        Bitcoin and Lightning coverage and keeps known differences from obscuring new findings. Divergences
        he found led to fixes aligning rust-bitcoin and btcd with Bitcoin Core on message parsing, PSBT
        validation and addrv2 handling.
      BR: Mantém e amplia os testes entre implementações, revisa contribuições e investiga divergências
        para distinguir bugs de ambiguidades no protocolo. Seu trabalho expande a cobertura de Bitcoin
        e Lightning e evita que diferenças conhecidas ocultem novas descobertas. Divergências que encontrou
        levaram a correções que alinharam rust-bitcoin e btcd ao Bitcoin Core no parsing de mensagens, na
        validação de PSBTs e no tratamento de addrv2.
  - name: Smite
    href: 'https://github.com/lnfuzz/smite'
    description:
      EN: Snapshot fuzzing for the Bitcoin Lightning Network.
      BR: Fuzzing baseado em snapshots para a Lightning Network.
    contribution:
      EN: Develops the protocol and testing infrastructure needed to explore Lightning channel behavior
        with snapshot fuzzing. His work connects structured test scenarios and coverage improvements
        to investigating crashes and reporting implementation defects upstream.
      BR: Desenvolve a infraestrutura de protocolo e testes para explorar o comportamento de canais
        Lightning com fuzzing baseado em snapshots. Seu trabalho conecta cenários estruturados e
        melhorias de cobertura à investigação de crashes e ao relato de defeitos aos projetos de origem.
  - name: Fuzzamoto
    href: 'https://github.com/oss-garage/fuzzamoto'
    description:
      EN: Full-node fuzzing for Bitcoin protocol implementations.
      BR: Fuzzing de nós completos de implementações do protocolo Bitcoin.
    contribution:
      EN: Contributes to transport support and reusable testing infrastructure so fuzzing scenarios can
        exercise Bitcoin Core through both legacy and BIP324 encrypted connections, extending protocol
        coverage beyond isolated library tests.
      BR: Contribui para o suporte a transportes e a infraestrutura reutilizável de testes para que
        cenários de fuzzing exercitem o Bitcoin Core por conexões legadas e criptografadas com BIP324,
        ampliando a cobertura do protocolo além dos testes isolados de bibliotecas.
  - name: Lightning BOLTs
    href: 'https://github.com/lightning/bolts'
    description:
      EN: The Lightning Network protocol specification.
      BR: A especificação do protocolo da Lightning Network.
    contribution:
      EN: When fuzzing shows implementations disagreeing, or the spec saying nothing, he writes the missing
        requirement or test vector into the BOLTs for invoices, offers and channel funding. He made the
        payment secret mandatory and added a feature bit that tells senders whether a node relays onion
        messages from peers without a channel. Checking the Simple Taproot Channels extension against the
        BIP reference code, he fixed its output key derivations, signature rules and test vectors. His
        research on onion message jamming informs his reviews of the HTLC accountability and onion messages
        v2 proposals.
      BR: Quando o fuzzing revela divergências entre implementações ou lacunas na especificação, ele escreve
        nas BOLTs o requisito ou o vetor de teste que faltava para invoices, offers e financiamento de canais.
        Tornou o payment secret obrigatório e adicionou um feature bit que informa aos remetentes se um nó
        repassa onion messages de pares sem canal. Ao comparar a extensão Simple Taproot Channels com o código
        de referência das BIPs, corrigiu suas derivações de chaves de saída, regras de assinatura e vetores de
        teste. Sua pesquisa sobre jamming de onion messages embasa suas revisões das propostas de HTLC
        accountability e onion messages v2.
  - name: diffsecp
    href: 'https://github.com/erickcestari/diffsecp'
    description:
      EN: Differential fuzzing of libsecp256k1 across builds, architectures and library versions.
      BR: Fuzzing diferencial da libsecp256k1 entre builds, arquiteturas e versões da biblioteca.
    contribution:
      EN: Created the tool, which runs each input through many builds of libsecp256k1 and replays the
        corpus on other CPU architectures, to catch builds that disagree on whether a signature is valid
        and could split consensus.
      BR: Criou a ferramenta, que executa cada entrada em vários builds da libsecp256k1 e reproduz o corpus
        em outras arquiteturas de CPU, para detectar builds que divergem sobre a validade de uma assinatura
        e poderiam dividir o consenso.
  - name: fee1dead
    href: 'https://github.com/erickcestari/fee1dead'
    description:
      EN: AI-driven vulnerability discovery harness.
      BR: Harness de descoberta de vulnerabilidades com IA.
    contribution:
      EN: Created the harness, which runs AI coding agents in a firewalled container through staged recon
        and parallel hunting tasks, and turns their output into schema-validated findings.
      BR: Criou o harness, que executa agentes de programação com IA em um contêiner isolado por firewall,
        em etapas de reconhecimento e tarefas paralelas de busca, e converte o resultado em achados
        validados por schema.
contributions:
  - id: github-acinq-eclair-3324
    title:
      EN: Report a crash loop from unfunded channels in Eclair
      BR: Relatar um ciclo de crashes causado por canais não financiados no Eclair
    date: '2026-07-04'
    source: 'ACINQ/eclair · #3324'
    type: Research
    featured: true
    href: 'https://github.com/ACINQ/eclair/pull/3324'
    description:
      EN: Two channel id tracking bugs let one peer pile up never-funded channels past the rate limiter until
        the node ran out of memory, and the persisted channels crashed it again on every restart. Found with
        his AI harness and confirmed with a proof of concept; the fix landed in this pull request and shipped
        in v0.14.1.
      BR: Dois bugs no rastreamento de ids de canal permitiam que um único par acumulasse canais nunca
        financiados além do limite de taxa até esgotar a memória do nó, e os canais persistidos o derrubavam
        a cada reinício. Encontrados com seu harness de IA e confirmados com uma prova de conceito; a correção
        entrou neste pull request e saiu na v0.14.1.
  - id: github-elementsproject-lightning-8525
    title:
      EN: Report remote memory exhaustion in Core Lightning
      BR: Relatar esgotamento remoto de memória no Core Lightning
    date: '2025-08-25'
    source: 'ElementsProject/lightning · #8525'
    type: Research
    featured: true
    href: 'https://github.com/ElementsProject/lightning/pull/8525'
    description:
      EN: Found while writing his own BOLT 8 implementation that any peer could flood connectd with pings for
        maximum-size pongs and never read them, queueing replies until the node was killed for running out of
        memory. Reported privately and fixed in v25.09.
      BR: Descobriu, ao escrever sua própria implementação da BOLT 8, que qualquer par podia inundar o connectd
        com pings pedindo pongs de tamanho máximo sem nunca lê-los, acumulando respostas até o nó ser encerrado
        por falta de memória. Relatado de forma privada e corrigido na v25.09.
  - id: github-btcsuite-btcd-2518
    title:
      EN: Report unbounded P2P message buffers in btcd
      BR: Relatar buffers de mensagens P2P sem limite no btcd
    date: '2025-07-03'
    source: 'btcsuite/btcd · #2518'
    type: Research
    featured: true
    href: 'https://github.com/btcsuite/btcd/pull/2518'
    description:
      EN: Found with Bitcoinfuzz that btcd allocated up to 32 MiB for each alert, cfcheckpt and reject message
        from any peer, enough to exhaust a node's memory across its peer slots. The follow-up fix below caps
        reject at the protocol message limit; the series shipped in v0.25.0 and v0.26.0.
      BR: Identificou com o Bitcoinfuzz que o btcd alocava até 32 MiB para cada mensagem alert, cfcheckpt e
        reject de qualquer par, o suficiente para esgotar a memória do nó somando suas conexões. A correção
        seguinte limita a mensagem reject ao teto do protocolo; a série saiu nas versões v0.25.0 e v0.26.0.
  - id: github-btcsuite-btcd-2504
    title:
      EN: Separate btcd's P2P message limit from its serialization bound
      BR: Separar o limite de mensagens P2P do btcd do seu limite de serialização
    date: '2026-04-08'
    source: 'btcsuite/btcd · #2504'
    type: PR
    href: 'https://github.com/btcsuite/btcd/pull/2504'
    description:
      EN: Caps peer messages at 4 MB while internal decoding, such as transactions read from the database, keeps
        the 32 MiB bound, mirroring Bitcoin Core. Part of the fix for the memory exhaustion he reported.
      BR: Limita mensagens de pares a 4 MB e mantém o limite de 32 MiB na decodificação interna, como a de
        transações lidas do banco de dados, seguindo o Bitcoin Core. Faz parte da correção do esgotamento de
        memória que ele relatou.
  - id: github-lightningnetwork-lnd-10650
    title:
      EN: Validate MuSig2 nonces on decode in lnd
      BR: Validar nonces MuSig2 na decodificação no lnd
    date: '2026-03-25'
    source: 'lightningnetwork/lnd · #10650'
    type: PR
    href: 'https://github.com/lightningnetwork/lnd/pull/10650'
    description:
      EN: Rejects nonces that are not valid secp256k1 points as soon as taproot channel messages such as
        commit_sig, shutdown and closing_sig are decoded, instead of failing later in the signing flow.
      BR: Rejeita nonces que não são pontos válidos da secp256k1 já na decodificação de mensagens de canais
        taproot como commit_sig, shutdown e closing_sig, em vez de falhar depois, no fluxo de assinatura.
  - id: github-lightningnetwork-lightning-onion-74
    title:
      EN: Fix hop payload bounds in lnd's Sphinx library
      BR: Corrigir limites do payload de salto na biblioteca Sphinx do lnd
    date: '2026-01-08'
    source: 'lightningnetwork/lightning-onion · #74'
    type: PR
    href: 'https://github.com/lightningnetwork/lightning-onion/pull/74'
    description:
      EN: Confines hop payload decoding to the routing info, so a malformed length can no longer read into
        the padding. Covers both HTLC onions and onion messages.
      BR: Restringe a decodificação do payload de salto às informações de roteamento, para que um tamanho
        malformado não leia mais o padding. Vale para onions de HTLC e para onion messages.
  - id: github-eclair-3385
    title:
      EN: Report missing balance validation in Eclair splicing
      BR: Relatar ausência de validação de saldo no splicing do Eclair
    date: '2026-09-25'
    source: 'ACINQ/eclair · #3385'
    type: Research
    href: 'https://github.com/ACINQ/eclair/issues/3385'
    description:
      EN: Found with Smite that Eclair acknowledges an excessive splice-out before aborting later,
        rather than rejecting it as specified. Reported upstream as a protocol-compliance issue.
      BR: Identificou com o Smite que o Eclair aceita inicialmente uma retirada excessiva via splicing
        e só depois aborta, em vez de rejeitá-la conforme a especificação. Relatou a divergência ao projeto.
  - id: github-lightning-9492
    title:
      EN: Report unchecked output amounts in Core Lightning
      BR: Relatar valores de saída não validados no Core Lightning
    date: '2026-09-10'
    source: 'ElementsProject/lightning · #9492'
    type: Research
    href: 'https://github.com/ElementsProject/lightning/issues/9492'
    description:
      EN: Found with Smite that missing amount checks in interactive transaction handling could crash
        channel-related daemons. Reported the defect, which was subsequently fixed upstream.
      BR: Identificou com o Smite que a falta de validação de valores em transações interativas podia
        causar crashes em daemons de canais. Relatou o defeito, que depois foi corrigido pelo projeto.
  - id: github-lnfuzz-smite-170
    title:
      EN: Add BOLT 4 onion routing to Smite
      BR: Adicionar roteamento onion da BOLT 4 ao Smite
    date: '2026-11-05'
    source: 'lnfuzz/smite · #170'
    type: PR
    href: 'https://github.com/lnfuzz/smite/pull/170'
    description:
      EN: Builds and peels Sphinx onion packets, reproducing the BOLT reference packet byte for byte, so
        Smite can send valid and deliberately malformed onions to the node under test.
      BR: Constrói e decifra pacotes onion Sphinx, reproduzindo byte a byte o pacote de referência das BOLTs,
        para que o Smite envie onions válidos e malformados ao nó testado.
  - id: github-oss-garage-fuzzamoto-92
    title:
      EN: Add BIP324 v2 transport support to Fuzzamoto
      BR: Adicionar transporte v2 BIP324 ao Fuzzamoto
    date: '2026-01-09'
    source: 'oss-garage/fuzzamoto · #92'
    type: PR
    href: https://github.com/oss-garage/fuzzamoto/pull/92
    description:
      EN: Merged encrypted P2P transport support, including initiator/responder roles and a feature flag
        for fuzzing Bitcoin Core over v2 connections.
      BR: Adicionou suporte integrado ao transporte P2P criptografado, com papéis de iniciador e respondente
        e uma flag para fuzzing do Bitcoin Core por conexões v2.
  - id: github-lightning-bolts-1280-review
    title:
      EN: 'Review: outgoing reputation and HTLC accountability'
      BR: 'Revisão: reputação de saída e HTLC accountability'
    date: '2026-06-10'
    source: 'lightning/bolts · #1280'
    type: Code Review
    href: 'https://github.com/lightning/bolts/pull/1280#pullrequestreview-4468774716'
    description:
      EN: Reviews the slow-jamming mitigation proposal, catching a BOLT 11 field mapped to the wrong bech32
        character and a missing parenthesis in the decay-rate formula that would erase reputation almost at once.
      BR: Revisa a proposta de mitigação de slow jamming, identificando um campo da BOLT 11 associado ao
        caractere bech32 errado e um parêntese ausente na fórmula de decaimento que apagaria a reputação quase
        imediatamente.
  - id: github-lightning-bolts-1352
    title:
      EN: Fix output key derivations and test vectors in Simple Taproot Channels
      BR: Corrigir derivações de chaves de saída e vetores de teste em Simple Taproot Channels
    date: '2026-10-19'
    source: 'lightning/bolts · #1352'
    type: Protocol Specification
    href: 'https://github.com/lightning/bolts/pull/1352'
    description:
      EN: Re-derived every published value in the extension and checked it against the BIP reference code,
        lnd and Eclair, correcting output key formulas, signature rules and test vectors.
      BR: Recalculou todos os valores publicados na extensão e os comparou com o código de referência das
        BIPs, o lnd e o Eclair, corrigindo fórmulas de chaves de saída, regras de assinatura e vetores de
        teste.
  - id: github-lightning-bolts-1343
    title:
      EN: Add option_onion_messages_only_channels
      BR: Adicionar option_onion_messages_only_channels
    date: '2026-07-27'
    source: 'lightning/bolts · #1343'
    type: Protocol Specification
    href: 'https://github.com/lightning/bolts/pull/1343'
    description:
      EN: Makes relaying onion messages from channelless peers the baseline and adds a feature bit for nodes
        that only accept them from channel peers, so senders know in advance instead of being silently dropped.
      BR: Torna padrão o repasse de onion messages de pares sem canal e adiciona um feature bit para nós que
        só as aceitam de pares com canal, para que remetentes saibam antes, em vez de terem mensagens
        descartadas silenciosamente.
  - id: github-lightning-bolts-1242
    title:
      EN: Make payment_secret mandatory and ASSUMED
      BR: Tornar payment_secret obrigatório e ASSUMED
    date: '2025-04-08'
    source: 'lightning/bolts · #1242'
    type: Protocol Specification
    href: 'https://github.com/lightning/bolts/pull/1242'
    description:
      EN: Requires BOLT 11 readers to reject invoices without a payment secret and marks the feature as
        assumed, now that implementations have adopted it. His lnd#9752 makes lnd refuse to pay such invoices.
      BR: Exige que leitores da BOLT 11 rejeitem invoices sem payment secret e marca a funcionalidade como
        assumida, já que as implementações a adotaram. Seu lnd#9752 faz o lnd recusar o pagamento dessas
        invoices.
  - id: github-rust-bitcoin-rust-bitcoin-5697
    title:
      EN: Enforce Bitcoin Core's CompactSize limit in rust-bitcoin
      BR: Aplicar o limite de CompactSize do Bitcoin Core no rust-bitcoin
    date: '2026-03-14'
    source: 'rust-bitcoin/rust-bitcoin · #5697'
    type: PR
    href: 'https://github.com/rust-bitcoin/rust-bitcoin/pull/5697'
    description:
      EN: Rejects CompactSize values above 0x02000000 during deserialization, matching Bitcoin Core. Found by
        differential fuzzing with Bitcoinfuzz.
      BR: Rejeita valores CompactSize acima de 0x02000000 na desserialização, como o Bitcoin Core. Encontrado
        por fuzzing diferencial com o Bitcoinfuzz.
  - id: github-bitcoin-core-secp256k1-1956-review
    title:
      EN: 'Review: libFuzzer harness for libsecp256k1'
      BR: 'Revisão: harness libFuzzer para a libsecp256k1'
    date: '2026-10-10'
    source: 'bitcoin-core/secp256k1 · #1956'
    type: Code Review
    href: 'https://github.com/bitcoin-core/secp256k1/pull/1956#pullrequestreview-5479415481'
    description:
      EN: Tested the targets for about nine million executions under ASan and UBSan, and suggested roundtrip
        and consistency checks plus a context reset so crashes reproduce.
      BR: Testou os alvos por cerca de nove milhões de execuções com ASan e UBSan e sugeriu verificações de
        roundtrip e consistência, além de reiniciar o contexto para que crashes sejam reproduzíveis.
publications:
  - id: bitcoinfuzz-sast-2026
    title:
      EN: 'BitcoinFuzz: Differential Fuzzing of Bitcoin and Lightning Network Implementations'
      BR: 'BitcoinFuzz: Differential Fuzzing of Bitcoin and Lightning Network Implementations'
    date: '2026-09-08'
    authors:
      - Bruno Ely Reis Garcia
      - Erick Cestari
    venue: 'XI Simpósio Brasileiro de Testes de Software Sistemático e Automatizado (SAST 2026), Resumos da Indústria, pp. 271–273'
    publicationType: conference-abstract
    doi: 10.5753/sast.2026.29817
    href: 'https://sol.sbc.org.br/index.php/sast/article/view/45882'
    description:
      EN: Presents BitcoinFuzz, a differential fuzzing framework for finding behavioral inconsistencies across
        Bitcoin and Lightning Network implementations, and reports practical challenges, bugs, and gaps in
        protocol specifications.
      BR: Apresenta o BitcoinFuzz, um framework de fuzzing diferencial para encontrar inconsistências de
        comportamento entre implementações de Bitcoin e Lightning Network, e relata desafios práticos, bugs e
        lacunas nas especificações dos protocolos.
discussions:
  - id: delving-onion-message-jamming
    title:
      EN: Onion Message Jamming in the Lightning Network
      BR: Onion Message Jamming in the Lightning Network
    date: '2026-04-13'
    source: Delving Bitcoin
    href: 'https://delvingbitcoin.org/t/onion-message-jamming-in-the-lightning-network/2414'
    description:
      EN: Shows how free onion message forwarding lets attackers trigger rate limits that drop honest traffic,
        amplified by long routes, and compares upfront fees, hop leashes, paid sessions and backpressure as
        mitigations.
      BR: Mostra como o repasse gratuito de onion messages permite que atacantes acionem limites de taxa que
        descartam tráfego legítimo, com amplificação por rotas longas, e compara taxas antecipadas, hop leashes,
        sessões pagas e backpressure como mitigações.
writing:
  - id: personal-blog-btcd-reject-oom
    title:
      EN: A rejection too large for btcd to survive
      BR: A rejection too large for btcd to survive
    date: '2026-09-29'
    source: erickcestari.dev
    href: 'https://erickcestari.dev/blog/btcd-reject-oom/'
  - id: personal-blog-onion-message-jamming
    title:
      EN: Onion message jamming in the Lightning Network
      BR: Onion message jamming in the Lightning Network
    date: '2026-04-16'
    source: erickcestari.dev
    href: 'https://erickcestari.dev/blog/onion-message-jamming/'
  - id: personal-blog-eclair-oom-pending-channels
    title:
      EN: Crashing an eclair node with unfunded channels
      BR: Crashing an eclair node with unfunded channels
    date: '2026-09-30'
    source: erickcestari.dev
    href: 'https://erickcestari.dev/blog/eclair-oom-pending-channels/'
  - id: personal-blog-ping-flood-oom
    title:
      EN: Crashing a Lightning node with a flood of pings
      BR: Crashing a Lightning node with a flood of pings
    date: '2026-08-25'
    source: erickcestari.dev
    href: 'https://erickcestari.dev/blog/ping-flood-oom/'
media:
  - id: optech-podcast-2026-10-20
    title:
      EN: 'Bitcoin Optech Newsletter #427 Recap Podcast'
      BR: 'Bitcoin Optech Newsletter #427 Recap Podcast'
    date: '2026-10-20'
    source: Bitcoin Optech
    badge: '#427'
    href: 'https://bitcoinops.org/en/podcast/2026/10/20/'
    description:
      EN: Guest on the disclosure of two Eclair denial-of-service vulnerabilities fixed in v0.14.1, one of which he found.
      BR: Convidado sobre a divulgação de duas vulnerabilidades de negação de serviço no Eclair, corrigidas na v0.14.1, uma delas encontrada por ele.
  - id: optech-podcast-2026-09-08
    title:
      EN: 'Bitcoin Optech Newsletter #421 Recap Podcast'
      BR: 'Bitcoin Optech Newsletter #421 Recap Podcast'
    date: '2026-09-08'
    source: Bitcoin Optech
    badge: '#421'
    href: 'https://bitcoinops.org/en/podcast/2026/09/08/'
    description:
      EN: Guest on his disclosure of a Core Lightning denial-of-service in which a flood of pings exhausts memory.
      BR: Convidado sobre sua divulgação de uma negação de serviço no Core Lightning em que uma enxurrada de pings esgota a memória.
  - id: youtube-LEaZI1OQpK0
    title:
      EN: 'Differential Fuzzing | Erick Cestari | bitcoin++ exploits edition | Feb 2026 Florianópolis, Brazil'
      BR: 'Differential Fuzzing | Erick Cestari | bitcoin++ exploits edition | Feb 2026 Florianópolis, Brazil'
    source: bitcoin++
    href: 'https://www.youtube.com/watch?v=LEaZI1OQpK0'
    mediaType: video
    thumbnail: /assets/images/people/media/erick-LEaZI1OQpK0.jpg
  - id: youtube-vGFdaVoa3BE
    title:
      EN: Differential Fuzzing on Lightning Network - Erick Cestari
      BR: Differential Fuzzing on Lightning Network - Erick Cestari
    source: bitcoin++
    href: 'https://www.youtube.com/watch?v=vGFdaVoa3BE'
    mediaType: video
    thumbnail: /assets/images/people/media/erick-vGFdaVoa3BE.jpg
updatedAt: '2026-11-18'
---
## EN

Erick Cestari is a Bitcoin and Lightning security researcher who maintains Bitcoinfuzz and contributes to Smite. Through fuzzing and protocol testing, he has reported bugs and vulnerabilities in btcd and in all four major Lightning implementations: Core Lightning, Eclair, LDK and lnd. He also contributes to the BOLTs and helps develop reusable open-source testing infrastructure.

## PT

Erick Cestari é pesquisador de segurança de Bitcoin e Lightning, mantenedor do Bitcoinfuzz e contribuidor do Smite. Com fuzzing e testes de protocolo, relatou bugs e vulnerabilidades no btcd e nas quatro principais implementações Lightning: Core Lightning, Eclair, LDK e lnd. Também contribui para as BOLTs e para infraestrutura reutilizável de testes de código aberto.
