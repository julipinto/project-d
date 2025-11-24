use std::process::Command;

#[tauri::command]
pub async fn is_docker_service_active() -> bool {
    let output = Command::new("systemctl")
        .arg("is-active")
        .arg("docker")
        .output();

    match output {
        Ok(o) => {
            let stdout = String::from_utf8_lossy(&o.stdout).trim().to_string();
            // Retorna true apenas se estiver estritamente 'active'
            stdout == "active"
        }
        Err(_) => false,
    }
}

#[tauri::command]
pub async fn manage_docker(action: String) -> Result<String, String> {
    if action != "start" && action != "stop" {
        return Err("Ação desconhecida".to_string());
    }

    let mut cmd = Command::new("pkexec");
    cmd.arg("systemctl").arg(&action);

    if action == "stop" {
        cmd.arg("docker").arg("docker.socket");
    } else {
        cmd.arg("docker");
    }

    let output = cmd
        .output()
        .map_err(|e| format!("Falha ao executar comando: {}", e))?;

    if output.status.success() {
        Ok(format!("Docker {}", action))
    } else {
        let err = String::from_utf8_lossy(&output.stderr);
        Err(format!("Erro systemctl: {}", err))
    }
}
