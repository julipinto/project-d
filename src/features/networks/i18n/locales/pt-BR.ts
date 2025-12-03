export default {
  list: {
    title: "Redes",
    subtitle: "{count} redes configuradas",
    searchPlaceholder: "Buscar rede...",
    tableHeaders: {
      nameId: "Nome / ID",
      driver: "Driver",
      subnet: "Subnet",
      createdAt: "Criado em",
    },
    empty: {
      noNetworks: "Nenhuma rede encontrada.",
    },
  },
  details: {
    loading: "Carregando detalhes da rede...",
    error: "Erro ao carregar rede",
    backToList: "Voltar para a Lista",
    overview: "Visão Geral",
    containers: "Containers",
    confirmDelete: "Deletar rede {name}?",
    removed: "Rede removida.",
    noName: "Sem Nome",
    general: {
      notFound: "Rede não encontrada.",
      driver: "Driver",
      scope: "Escopo",
      internal: "Interna",
      yes: "Sim",
      no: "Não",
      created: "Criada",
      ipamTitle: "Configuração IPAM (IP Address Management)",
      subnetLabel: "Subnet",
      gatewayLabel: "Gateway",
      autoNA: "Auto / N/A",
    },
    containersTab: {
      headerContainer: "Container",
      headerIPv4: "IPv4 Address",
      headerIPv6: "IPv6 Address",
      empty: "Nenhum container conectado nesta rede.",
    },
    itemRow: {
      internalTitle: "Rede Interna (Sem acesso externo)",
      removeTitle: "Remover Rede",
      deleteConfirm:
        'Tem certeza que deseja remover a rede "{name}"?\nIsso falhará se houver containers conectados.',
    },
  },
};
