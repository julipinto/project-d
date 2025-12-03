export default {
  list: {
    title: "Networks",
    subtitle: "{count} networks configured",
    searchPlaceholder: "Search network...",
    tableHeaders: {
      nameId: "Name / ID",
      driver: "Driver",
      subnet: "Subnet",
      createdAt: "Created",
    },
    empty: {
      noNetworks: "No networks found.",
    },
  },
  details: {
    loading: "Loading network details...",
    error: "Error loading network",
    backToList: "Back to List",
    overview: "Overview",
    containers: "Containers",
    confirmDelete: "Delete network {name}?",
    removed: "Network removed.",
    noName: "No Name",
    general: {
      notFound: "Network not found.",
      driver: "Driver",
      scope: "Scope",
      internal: "Internal",
      yes: "Yes",
      no: "No",
      created: "Created",
      ipamTitle: "IPAM Configuration (IP Address Management)",
      subnetLabel: "Subnet",
      gatewayLabel: "Gateway",
      autoNA: "Auto / N/A",
    },
    containersTab: {
      headerContainer: "Container",
      headerIPv4: "IPv4 Address",
      headerIPv6: "IPv6 Address",
      empty: "No containers connected to this network.",
    },
    itemRow: {
      internalTitle: "Internal Network (No external access)",
      removeTitle: "Remove Network",
      deleteConfirm:
        'Are you sure you want to remove network "{name}"?\nThis will fail if there are containers connected.',
    },
  },
};
