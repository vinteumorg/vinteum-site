---
name: Octavio Lucca
image: /assets/images/people/illustrations/octavio-lucca.webp
illustration: true
programs:
  - program: fellowship
    name: Fellowship
    organization: Vinteum
    role:
      EN: Fellow
      BR: Fellow
    status: past
    end: '2026-09'
    start: '2026-04'
    cohort: 2
    work:
      EN: Peer Observer / Bitcoin Network Operations Collective
      BR: Peer Observer / Bitcoin Network Operations Collective
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
      EN: Peer Observer
      BR: Peer Observer
    href: /programs/bitcoin-dev-launchpad
    fundedBy: Vinteum
focus:
  - P2P Networking
  - Monitoring
  - Rust
links:
  - label: Website
    href: 'https://octavio.xyz/'
    icon: website
  - label: GitHub
    href: 'https://github.com/octaviolucca'
    icon: github
  - label: X
    href: 'https://x.com/octavio_lucca'
    icon: twitter
projects:
  - name: Bitcoin Network Operations Collective
    href: https://bnoc.xyz/
    description:
      EN: "A decentralized initiative to monitor Bitcoin's peer-to-peer network, investigate attacks and anomalies, and feed measurements back into development. Connects contributors, monitoring infrastructure, datasets and analysis tools."
      BR: "Iniciativa descentralizada para monitorar a rede peer-to-peer do Bitcoin, investigar ataques e anomalias e levar evidências para o desenvolvimento do protocolo. Conecta colaboradores, infraestrutura de observação, conjuntos de dados e ferramentas de análise."
    contribution:
      EN: "Develops network observability infrastructure, from node data collection and archiving to reusable replay tooling and DNS-seed monitoring. Adapts monitoring tools to Floresta to extend observations across node implementations."
      BR: "Desenvolve infraestrutura de observabilidade de rede, da coleta e do arquivamento de dados de nós a ferramentas reutilizáveis de replay e monitoramento de seeds DNS. Adapta ferramentas ao Floresta para ampliar as observações entre implementações de nós."
  - name: peer-observer
    href: https://github.com/peer-observer/peer-observer
    description:
      EN: Tooling to monitor for P2P anomalies and attacks using Bitcoin Core honey pot nodes
      BR: Ferramentas para monitorar anomalias e ataques na rede P2P do Bitcoin.
    contribution:
      EN: "Contributes to Bitcoin P2P observability through peer-observer’s event archive and replay infrastructure, working on safe archive processing, storage efficiency and reusable, testable replay tooling."
      BR: "Contribui para a observabilidade P2P do Bitcoin por meio da infraestrutura de arquivamento e replay de eventos do peer-observer, trabalhando no processamento seguro de arquivos, na eficiência de armazenamento e em ferramentas de replay reutilizáveis e testáveis."
contributions:
  - id: github-peer-observer-peer-observer-509
    title:
      EN: 'fix(archive): Dont trust the length prefix when reading a message'
      BR: 'fix(archive): Dont trust the length prefix when reading a message'
    date: '2026-11-01'
    source: 'peer-observer/peer-observer · #509'
    type: PR
    href: 'https://github.com/peer-observer/peer-observer/pull/509'
    description:
      EN: Avoids allocating memory solely from an untrusted message-length prefix and reports
        truncated archive data as an I/O error.
      BR: Evita alocar memória apenas com base em um prefixo de tamanho não confiável e
        retorna erro de I/O para dados truncados no arquivo.
  - id: github-peer-observer-peer-observer-482
    title:
      EN: 'add(archive): --low-data mode'
      BR: 'add(archive): --low-data mode'
    date: '2026-09-03'
    source: 'peer-observer/peer-observer · #482'
    type: PR
    href: 'https://github.com/peer-observer/peer-observer/pull/482'
    description:
      EN: Preserves transaction identifiers and block metadata while omitting large raw
        payloads from the archive.
      BR: Preserva identificadores de transações e metadados de blocos sem armazenar os
        grandes payloads brutos no arquivo.
  - id: octavio-network-replay-floresta
    title:
      EN: Reusable network replay library
      BR: Biblioteca reutilizável de replay de rede
    source: 'peer-observer/peer-observer · #464'
    type: PR
    href: https://github.com/peer-observer/peer-observer/pull/464
    description:
      EN: Merged a refactor moving archive replay into a library module, with focused tests that do not
        spawn the CLI and contextual error reporting.
      BR: Integrou uma refatoração que move o replay de arquivos para um módulo de biblioteca, com testes
        específicos que não iniciam a CLI e relatos de erro contextualizados.
  - id: octavio-floresta-getpeerinfo
    title:
      EN: Core-compatible getpeerinfo fields in Floresta
      BR: Campos getpeerinfo compatíveis com o Core no Floresta
    source: 'getfloresta/Floresta · #1233'
    type: PR
    href: https://github.com/getfloresta/Floresta/pull/1233
    description:
      EN: Merged additional getpeerinfo fields, keeping RPC server/client schemas aligned and extending
        documentation and CLI functional tests. Fields for unsupported functionality return explicit neutral
        values.
      BR: Integrou campos adicionais de getpeerinfo, mantendo os schemas RPC do servidor e cliente alinhados
        e ampliando a documentação e os testes funcionais da CLI. Campos de funcionalidades não implementadas
        retornam valores neutros explícitos.
updatedAt: '2026-11-18'
---
## EN

Octavio Lucca works on Bitcoin network observability, from peer-observer data collection and archiving to reusable replay tooling. He also adapts monitoring tools to Floresta and works with Prometheus, Grafana and DNS seed behaviour.

## PT

Octavio Lucca trabalha com observabilidade da rede Bitcoin, da coleta e do arquivamento de dados no peer-observer a ferramentas reutilizáveis de replay. Também adapta ferramentas de monitoramento ao Floresta e trabalha com Prometheus, Grafana e comportamento de seeds DNS.
