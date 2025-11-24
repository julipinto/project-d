use crate::services::docker;
use bollard::query_parameters::{
    InspectContainerOptions, ListContainersOptions, RemoveContainerOptions, StartContainerOptions,
    StopContainerOptions,
};

use bollard::models::ContainerInspectResponse;

#[tauri::command]
pub async fn list_containers() -> Result<Vec<bollard::models::ContainerSummary>, String> {
    let docker = docker::connect()?;

    let options = Some(ListContainersOptions {
        all: true,
        ..Default::default()
    });

    let containers = docker
        .list_containers(options)
        .await
        .map_err(|e| format!("Erro ao listar: {}", e))?;

    Ok(containers)
}

#[tauri::command]
pub async fn start_container(id: String) -> Result<(), String> {
    let docker = docker::connect()?;

    docker
        .start_container(&id, None::<StartContainerOptions>)
        .await
        .map_err(|e| format!("Erro ao iniciar: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn stop_container(id: String) -> Result<(), String> {
    let docker = docker::connect()?;

    docker
        .stop_container(&id, None::<StopContainerOptions>)
        .await
        .map_err(|e| format!("Erro ao parar: {}", e))?;

    Ok(())
}

#[tauri::command]
pub async fn remove_container(id: String) -> Result<(), String> {
    let docker = docker::connect()?;

    // force: true garante que remove mesmo se estiver rodando (kill + rm)
    // v: true remove volumes anônimos associados (boa prática pra não deixar lixo)
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
pub async fn inspect_container(id: String) -> Result<ContainerInspectResponse, String> {
    let docker = docker::connect()?;

    // CORREÇÃO AQUI: Tipamos o None com InspectContainerOptions
    let result = docker
        .inspect_container(&id, None::<InspectContainerOptions>)
        .await
        .map_err(|e| format!("Erro ao inspecionar: {}", e))?;

    Ok(result)
}
