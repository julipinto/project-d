export default {
  list: {
    title: "Volumes",
    subtitle: "{count} volumes persistentes",
    searchPlaceholder: "Buscar volume...",
    tableHeaders: {
      nameDriver: "Nome / Driver",
      mountPoint: "Ponto de Montagem",
      createdAt: "Criado em",
      actions: "Ações",
    },
    empty: {
      loading: "Buscando...",
      noVolumes: "Nenhum volume encontrado.",
    },
  },
  details: {
    back: "Voltar",
    volume: "VOLUME",
    deleteVolume: "Deletar Volume",
    loading: "Carregando detalhes...",
    confirmDelete: 'Tem certeza que deseja remover o volume "{name}"?',
    removed: "Volume removido.",
    headerTitle: "Informações Gerais",
    driver: "Driver",
    createdAt: "Criado em",
    mountpointTitle: "Mountpoint (Local no Disco)",
    usedByTitle: "Utilizado por ({count})",
    usedByEmpty: "Este volume não está conectado a nenhum container no momento.",
    inspectVolumeTitle: "Inspecionar Volume",
    removeVolumeTitle: "Remover Volume",
    itemDeleteConfirm:
      'Tem certeza que deseja remover o volume "{name}"?\nIsso apagará todos os dados permanentemente.',
  },
};
