export default {
  list: {
    title: "Volumes",
    subtitle: "{count} volumes persistants",
    searchPlaceholder: "Rechercher un volume...",
    tableHeaders: {
      nameDriver: "Nom / Pilote",
      mountPoint: "Point de Montage",
      createdAt: "Créé",
      actions: "Actions",
    },
    empty: {
      loading: "Recherche...",
      noVolumes: "Aucun volume trouvé.",
    },
  },
  details: {
    back: "Retour",
    volume: "VOLUME",
    deleteVolume: "Supprimer le Volume",
    loading: "Chargement des détails...",
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer le volume "{name}"?',
    removed: "Volume supprimé.",
    headerTitle: "Informations Générales",
    driver: "Pilote",
    createdAt: "Créé le",
    mountpointTitle: "Point de Montage (Chemin sur le Disque)",
    usedByTitle: "Utilisé par ({count})",
    usedByEmpty: "Ce volume n'est actuellement attaché à aucun conteneur.",
    inspectVolumeTitle: "Inspecter le Volume",
    removeVolumeTitle: "Supprimer le Volume",
    itemDeleteConfirm:
      'Êtes-vous sûr de vouloir supprimer le volume "{name}" ?\nCela supprimera définitivement toutes les données.',
  },
};
