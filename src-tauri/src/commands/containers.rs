use crate::services::docker::{self, DockerConfig};

use bollard::models::{ContainerCreateBody, ContainerInspectResponse, HostConfig, PortBinding};
use bollard::query_parameters::{
  CreateContainerOptions, InspectContainerOptions, ListContainersOptions, RemoveContainerOptions,
  StartContainerOptions, StopContainerOptions,
};
use std::collections::HashMap;
use tauri::State;

#[tauri::command]
pub async fn list_containers(
  state: State<'_, DockerConfig>,
  search: Option<String>,
) -> Result<Vec<bollard::models::ContainerSummary>, String> {
  let docker = docker::connect(&state)?;

  let options = Some(ListContainersOptions {
    all: true,
    ..Default::default()
  });

  let mut containers = docker
    .list_containers(options)
    .await
    .map_err(|e| format!("Erro ao listar: {}", e))?;

  if let Some(query) = search {
    let q = query.trim().to_lowercase();
    if !q.is_empty() {
      containers.retain(|c| {
        let match_name = c
          .names
          .as_ref()
          .is_some_and(|names| names.iter().any(|n| n.to_lowercase().contains(&q)));
        let match_image = c
          .image
          .as_ref()
          .is_some_and(|img| img.to_lowercase().contains(&q));
        let match_id = c
          .id
          .as_ref()
          .is_some_and(|id| id.to_lowercase().contains(&q));
        let match_group = c.labels.as_ref().is_some_and(|labels| {
          labels
            .get("com.docker.compose.project")
            .is_some_and(|proj| proj.to_lowercase().contains(&q))
        });
        match_name || match_image || match_id || match_group
      });
    }
  }

  Ok(containers)
}

#[tauri::command]
pub async fn start_container(state: State<'_, DockerConfig>, id: String) -> Result<(), String> {
  let docker = docker::connect(&state)?;
  docker
    .start_container(&id, None::<StartContainerOptions>)
    .await
    .map_err(|e| format!("Erro ao iniciar: {}", e))?;
  Ok(())
}

#[tauri::command]
pub async fn stop_container(state: State<'_, DockerConfig>, id: String) -> Result<(), String> {
  let docker = docker::connect(&state)?;
  docker
    .stop_container(&id, None::<StopContainerOptions>)
    .await
    .map_err(|e| format!("Erro ao parar: {}", e))?;
  Ok(())
}

#[tauri::command]
pub async fn remove_container(state: State<'_, DockerConfig>, id: String) -> Result<(), String> {
  let docker = docker::connect(&state)?;
  let options = Some(RemoveContainerOptions {
    force: true,
    v: true,
    ..Default::default()
  });
  docker
    .remove_container(&id, options)
    .await
    .map_err(|e| format!("Erro ao remover: {}", e))?;
  Ok(())
}

#[tauri::command]
pub async fn inspect_container(
  state: State<'_, DockerConfig>,
  id: String,
) -> Result<ContainerInspectResponse, String> {
  let docker = docker::connect(&state)?;
  let result = docker
    .inspect_container(&id, None::<InspectContainerOptions>)
    .await
    .map_err(|e| format!("Erro ao inspecionar: {}", e))?;
  Ok(result)
}

#[tauri::command]
pub async fn manage_container_group(
  state: State<'_, DockerConfig>,
  group: String,
  action: String,
) -> Result<(), String> {
  let docker = docker::connect(&state)?;
  let mut filters = HashMap::new();
  filters.insert(
    "label".to_string(),
    vec![format!("com.docker.compose.project={}", group)],
  );
  let list_options = Some(ListContainersOptions {
    all: true,
    filters: Some(filters),
    ..Default::default()
  });
  let containers = docker
    .list_containers(list_options)
    .await
    .map_err(|e| format!("Erro ao buscar grupo: {}", e))?;

  for container in containers {
    if let Some(id) = container.id {
      let result = match action.as_str() {
        "start" => {
          docker
            .start_container(&id, None::<StartContainerOptions>)
            .await
        }
        "stop" => {
          docker
            .stop_container(&id, None::<StopContainerOptions>)
            .await
        }
        _ => Err(bollard::errors::Error::IOError {
          err: std::io::Error::new(std::io::ErrorKind::InvalidInput, "Ação inválida"),
        }),
      };
      if let Err(e) = result {
        eprintln!("Erro ao executar {} no container {}: {}", action, id, e);
      }
    }
  }
  Ok(())
}

// --- STRUCT E FUNÇÃO DE CRIAÇÃO ---

#[derive(serde::Deserialize)]
pub struct RunContainerConfig {
  image: String,
  name: Option<String>,
  ports: Vec<(String, String)>,
  env: Vec<(String, String)>,
  mounts: Vec<(String, String)>,
}

#[tauri::command]
pub async fn create_and_start_container(
  state: State<'_, DockerConfig>,
  config: RunContainerConfig,
) -> Result<String, String> {
  let docker = docker::connect(&state)?;

  let mut port_bindings = HashMap::new();
  let mut exposed_ports = HashMap::new();

  for (host_port, container_port) in config.ports {
    let container_key = format!("{}/tcp", container_port);
    // Exposed Ports usa um HashMap vazio como valor para indicar "existe"
    exposed_ports.insert(container_key.clone(), HashMap::new());

    port_bindings.insert(
      container_key,
      Some(vec![PortBinding {
        host_ip: Some("0.0.0.0".to_string()),
        host_port: Some(host_port),
      }]),
    );
  }

  let envs: Vec<String> = config
    .env
    .iter()
    .map(|(k, v)| format!("{}={}", k, v))
    .collect();

  let binds: Vec<String> = config
    .mounts
    .iter()
    .map(|(host_path, container_path)| format!("{}:{}", host_path, container_path))
    .collect();

  let host_config = HostConfig {
    port_bindings: Some(port_bindings),
    binds: Some(binds),
    ..Default::default()
  };

  let container_config = ContainerCreateBody {
    image: Some(config.image),
    exposed_ports: Some(exposed_ports),
    env: Some(envs),
    host_config: Some(host_config),
    ..Default::default()
  };

  let options = config
    .name
    .filter(|n| !n.is_empty())
    .map(|name| CreateContainerOptions {
      name: Some(name),
      ..Default::default()
    });

  let create_res = docker
    .create_container(options, container_config)
    .await
    .map_err(|e| format!("Erro ao criar: {}", e))?;

  docker
    .start_container(&create_res.id, None::<StartContainerOptions>)
    .await
    .map_err(|e| {
      format!(
        "Container criado ({}), mas falhou ao iniciar: {}",
        create_res.id, e
      )
    })?;

  Ok(create_res.id)
}
