---
name: Lorenzo Maturano
image: /assets/images/people/illustrations/lorenzo-maturano.png
illustration: true
handle: lorenzolfm
updatedAt: '2026-11-18'
focus:
  - Bitcoin
  - Lightning
  - Rust
  - Education
affiliations:
  - organization: Vinteum
    role:
      EN: Developer Advocate
      BR: Developer Advocate
    href: 'https://www.vinteum.org/about'
    directoryRole: team
    status: current
    start: '2024-06'
  - organization: Bipa
    role:
      EN: Backend Engineer
      BR: Engenheiro de backend
    status: past
links:
  - label: GitHub
    href: 'https://github.com/lorenzolfm'
    icon: github
  - label: Website
    href: 'https://lorenzo.sh/'
    icon: website
  - label: X
    href: 'https://x.com/lorenzolfm'
    icon: twitter
  - label: LinkedIn
    href: 'https://www.linkedin.com/in/lorenzo-maturano-55429b181/'
    icon: linkedin
projects:
  - name: Floresta
    href: 'https://github.com/getfloresta/Floresta'
    description:
      EN: Lightweight Bitcoin node built on Utreexo, with embeddable Rust libraries.
      BR: Nó Bitcoin leve baseado em Utreexo, com bibliotecas Rust integráveis.
    contribution:
      EN: Works on chain state and reorg handling around assumeutreexo, including accumulator persistence and the ordering of tip updates, alongside Bitcoin Core-compatible RPC coverage and node configuration.
      BR: Trabalha no estado da cadeia e no tratamento de reorgs em torno do assumeutreexo, incluindo a persistência do acumulador e a ordem das atualizações de ponta, além de cobertura de RPC compatível com o Bitcoin Core e configuração do nó.
    current: true
  - name: Cashu Development Kit
    href: 'https://github.com/cashubtc/cdk'
    description:
      EN: Rust libraries for building Cashu mints and wallets.
      BR: Bibliotecas Rust para construir mints e carteiras Cashu.
    contribution:
      EN: Hardens the mint's persistence layer, guarding saga finalization, melt lease claims and blind signature writes against stale state, and rejects database configurations the engine cannot actually honour.
      BR: Reforça a camada de persistência do mint, protegendo a finalização de sagas, o claim de lease de melt e a gravação de assinaturas cegas contra estado desatualizado, e rejeita configurações de banco que o engine não consegue honrar.
    current: true
contributions:
  - id: floresta-publish-reorg-tip-and-accumulator
    title:
      EN: Publish the reorg tip and accumulator together
      BR: Publicar juntos a ponta do reorg e o acumulador
    source: 'getfloresta/Floresta · #1318'
    type: PR
    date: '2026-09-08'
    href: 'https://github.com/getfloresta/Floresta/pull/1318'
    description:
      EN: Stops the node from exposing a new tip before the accumulator that matches it, closing a window where readers saw an inconsistent chain state.
      BR: Impede que o nó exponha uma nova ponta antes do acumulador correspondente, fechando uma janela em que leitores viam um estado de cadeia inconsistente.
  - id: floresta-reorg-accumulator-validation-index
    title:
      EN: Take the reorg accumulator from the validation index
      BR: Obter o acumulador do reorg a partir do índice de validação
    source: 'getfloresta/Floresta · #1320'
    type: PR
    date: '2026-09-14'
    href: 'https://github.com/getfloresta/Floresta/pull/1320'
    description:
      EN: Fixes a reorg above the validation index that wiped the accumulator, sourcing it from the validation index instead.
      BR: Corrige um reorg acima do índice de validação que apagava o acumulador, obtendo-o do índice de validação.
  - id: floresta-assumed-roots
    title:
      EN: Save the assumed roots at the assumed block
      BR: Salvar as raízes assumidas no bloco assumido
    source: 'getfloresta/Floresta · #1325'
    type: PR
    date: '2026-09-16'
    href: 'https://github.com/getfloresta/Floresta/pull/1325'
    description:
      EN: Persists the assumed roots at the block they belong to, so an assumeutreexo node no longer loses its accumulator on restart.
      BR: Persiste as raízes assumidas no bloco a que pertencem, para que um nó assumeutreexo não perca mais o acumulador ao reiniciar.
  - id: floresta-getnetworkinfo
    title:
      EN: Implement getnetworkinfo
      BR: Implementar getnetworkinfo
    source: 'getfloresta/Floresta · #1068'
    type: PR
    date: '2026-05-21'
    href: 'https://github.com/getfloresta/Floresta/pull/1068'
    description:
      EN: Adds the RPC that tooling expects from a Bitcoin node, extending Floresta's Core-compatible interface.
      BR: Adiciona o RPC que ferramentas esperam de um nó Bitcoin, ampliando a interface compatível com o Core no Floresta.
  - id: floresta-fixed-peers
    title:
      EN: Allow passing multiple fixed peers
      BR: Permitir passar vários peers fixos
    source: 'getfloresta/Floresta · #1092'
    type: PR
    date: '2026-06-02'
    href: 'https://github.com/getfloresta/Floresta/pull/1092'
    description:
      EN: Lets an operator configure several fixed peers instead of a single one, useful for private and testing networks.
      BR: Permite configurar vários peers fixos em vez de apenas um, útil para redes privadas e de teste.
  - id: cdk-saga-finalization-guard
    title:
      EN: Guard the saga finalization write on the stored state
      BR: Proteger a gravação de finalização da saga pelo estado armazenado
    source: 'cashubtc/cdk · #2879'
    type: PR
    date: '2026-11-10'
    href: 'https://github.com/cashubtc/cdk/pull/2879'
    description:
      EN: Applies the write only when the stored state still matches, preventing a stale finalization from overwriting a newer saga state.
      BR: Aplica a gravação apenas quando o estado armazenado ainda corresponde, evitando que uma finalização antiga sobrescreva um estado de saga mais novo.
  - id: cdk-blind-signature-guard
    title:
      EN: Guard the blind signature write on the stored state
      BR: Proteger a gravação da assinatura cega pelo estado armazenado
    source: 'cashubtc/cdk · #2918'
    type: PR
    date: '2026-11-17'
    href: 'https://github.com/cashubtc/cdk/pull/2918'
    description:
      EN: Same compare-and-write discipline for blind signatures, so a mint cannot persist a signature for a request that already moved on.
      BR: A mesma disciplina de comparação e gravação para assinaturas cegas, para que um mint não persista uma assinatura de uma requisição que já avançou.
---
## EN

Lorenzo Maturano is a developer advocate at Vinteum. He contributes to Floresta, the lightweight Bitcoin node, on chain state, reorg handling and RPC compatibility, and to Cashu's development kit, where he hardens mint state transitions. He also teaches developers how Bitcoin and Lightning work.

## PT

Lorenzo Maturano é developer advocate na Vinteum. Contribui para o Floresta, o nó Bitcoin leve, em estado da cadeia, tratamento de reorgs e compatibilidade de RPC, e para o kit de desenvolvimento do Cashu, onde reforça as transições de estado do mint. Também ensina desenvolvedores a trabalhar com Bitcoin e Lightning.
