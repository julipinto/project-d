use crate::services::docker::{self, DockerConfig};
use bollard::models::Volume;
use bollard::query_parameters::{ListVolumesOptions, RemoveVolumeOptions};
use tauri::State;

#[tauri::command]
pub async fn list_volumes(
    state: State<'_, DockerConfig>,
    search: Option<String>,
) -> Result<Vec<Volume>, String> {
    let docker = docker::connect(&state)?;

    let response = docker
        .list_volumes(None::<ListVolumesOptions>)
        .await
        .map_err(|e| format!("Erro ao listar volumes: {}", e))?;

    let mut volumes = response.volumes.unwrap_or_default();

    // Lógica de Filtragem
    if let Some(query) = search {
        let q = query.trim().to_lowercase();
        if !q.is_empty() {
            volumes.retain(|v| {
                let match_name = v.name.to_lowercase().contains(&q);
                let match_driver = v.driver.to_lowercase().contains(&q);
                // Mountpoint é onde está no disco do host
                let match_mount = v.mountpoint.to_lowercase().contains(&q);

                match_name || match_driver || match_mount
            });
        }
    }

    Ok(volumes)
}

#[tauri::command]
pub async fn remove_volume(state: State<'_, DockerConfig>, name: String) -> Result<(), String> {
    let docker = docker::connect(&state)?;

    docker
        .remove_volume(&name, None::<RemoveVolumeOptions>)
        .await
        .map_err(|e| format!("Erro ao remover volume: {}", e))?;

    Ok(())
}
