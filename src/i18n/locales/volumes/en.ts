export default {
  list: {
    title: "Volumes",
    subtitle: "{count} persistent volumes",
    searchPlaceholder: "Search volume...",
    tableHeaders: {
      nameDriver: "Name / Driver",
      mountPoint: "Mount Point",
      createdAt: "Created",
      actions: "Actions",
    },
    empty: {
      loading: "Searching...",
      noVolumes: "No volumes found.",
    },
  },
  details: {
    back: "Back",
    volume: "VOLUME",
    deleteVolume: "Delete Volume",
    loading: "Loading details...",
    confirmDelete: 'Are you sure you want to remove volume "{name}"?',
    removed: "Volume removed.",
    headerTitle: "General Information",
    driver: "Driver",
    createdAt: "Created at",
    mountpointTitle: "Mountpoint (Disk Path)",
    usedByTitle: "Used by ({count})",
    usedByEmpty: "This volume is not attached to any container at the moment.",
    inspectVolumeTitle: "Inspect Volume",
    removeVolumeTitle: "Remove Volume",
    itemDeleteConfirm:
      'Are you sure you want to remove volume "{name}"?\nThis will permanently delete all data.',
  },
};
