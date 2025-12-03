export default {
  list: {
    title: "Redes",
    subtitle: "{count} redes configuradas",
    searchPlaceholder: "Buscar red...",
    tableHeaders: {
      nameId: "Nombre / ID",
      driver: "Controlador",
      subnet: "Subred",
      createdAt: "Creado",
    },
    empty: {
      noNetworks: "No se encontraron redes.",
    },
  },
  details: {
    loading: "Cargando detalles de la red...",
    error: "Error al cargar la red",
    backToList: "Volver a la Lista",
    overview: "Resumen",
    containers: "Contenedores",
    confirmDelete: "¿Eliminar red {name}?",
    removed: "Red eliminada.",
    noName: "Sin Nombre",
    general: {
      notFound: "Red no encontrada.",
      driver: "Controlador",
      scope: "Ámbito",
      internal: "Interna",
      yes: "Sí",
      no: "No",
      created: "Creada",
      ipamTitle: "Configuración IPAM (Gestión de Direcciones IP)",
      subnetLabel: "Subred",
      gatewayLabel: "Puerta de enlace",
      autoNA: "Auto / N/A",
    },
    containersTab: {
      headerContainer: "Contenedor",
      headerIPv4: "Dirección IPv4",
      headerIPv6: "Dirección IPv6",
      empty: "Ningún contenedor conectado a esta red.",
    },
    itemRow: {
      internalTitle: "Red Interna (Sin acceso externo)",
      removeTitle: "Eliminar Red",
      deleteConfirm:
        '¿Está seguro de que desea eliminar la red "{name}"?\nEsto fallará si hay contenedores conectados.',
    },
  },
};
