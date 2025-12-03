export default {
  list: {
    title: "Réseaux",
    subtitle: "{count} réseaux configurés",
    searchPlaceholder: "Rechercher un réseau...",
    tableHeaders: {
      nameId: "Nom / ID",
      driver: "Pilote",
      subnet: "Sous-réseau",
      createdAt: "Créé",
    },
    empty: {
      noNetworks: "Aucun réseau trouvé.",
    },
  },
  details: {
    loading: "Chargement des détails du réseau...",
    error: "Erreur lors du chargement du réseau",
    backToList: "Retour à la Liste",
    overview: "Vue d'ensemble",
    containers: "Conteneurs",
    confirmDelete: "Supprimer le réseau {name}?",
    removed: "Réseau supprimé.",
    noName: "Sans Nom",
    general: {
      notFound: "Réseau introuvable.",
      driver: "Pilote",
      scope: "Portée",
      internal: "Interne",
      yes: "Oui",
      no: "Non",
      created: "Créé",
      ipamTitle: "Configuration IPAM (Gestion des Adresses IP)",
      subnetLabel: "Sous-réseau",
      gatewayLabel: "Passerelle",
      autoNA: "Auto / N/A",
    },
    containersTab: {
      headerContainer: "Conteneur",
      headerIPv4: "Adresse IPv4",
      headerIPv6: "Adresse IPv6",
      empty: "Aucun conteneur connecté à ce réseau.",
    },
    itemRow: {
      internalTitle: "Réseau Interne (Pas d'accès externe)",
      removeTitle: "Supprimer le Réseau",
      deleteConfirm:
        'Êtes-vous sûr de vouloir supprimer le réseau "{name}" ?\nCela échouera s\'il y a des conteneurs connectés.',
    },
  },
};
