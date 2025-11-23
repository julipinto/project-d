mod commands;
mod services;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle().clone();

            // 1. Inicia monitor de eventos
            services::docker::spawn_event_monitor(handle);

            // 2. FORÇA ABERTURA DO DEVTOOLS (Apenas em modo dev)
            // #[cfg(debug_assertions)]
            // {
            //     if let Some(window) = app.get_webview_window("main") {
            //         window.open_devtools();
            //     }
            // }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::containers::list_containers,
            commands::system::manage_docker
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
