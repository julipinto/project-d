export default {
  list: {
    title: "Volúmenes",
    subtitle: "{count} volúmenes persistentes",
    searchPlaceholder: "Buscar volumen...",
    tableHeaders: {
      nameDriver: "Nombre / Controlador",
      mountPoint: "Punto de Montaje",
      createdAt: "Creado",
      actions: "Acciones",
    },
    empty: {
      loading: "Buscando...",
      noVolumes: "No se encontraron volúmenes.",
    },
  },
  details: {
    back: "Volver",
    volume: "VOLUMEN",
    deleteVolume: "Eliminar Volumen",
    loading: "Cargando detalles...",
    confirmDelete: '¿Está seguro de que desea eliminar el volumen "{name}"?',
    removed: "Volumen eliminado.",
    headerTitle: "Información General",
    driver: "Controlador",
    createdAt: "Creado en",
    mountpointTitle: "Punto de Montaje (Ruta en Disco)",
    usedByTitle: "Usado por ({count})",
    usedByEmpty: "Este volumen no está conectado a ningún contenedor actualmente.",
    inspectVolumeTitle: "Inspeccionar Volumen",
    removeVolumeTitle: "Eliminar Volumen",
    itemDeleteConfirm:
      '¿Está seguro de que desea eliminar el volumen "{name}"?\nEsto eliminará todos los datos permanentemente.',
  },
};
