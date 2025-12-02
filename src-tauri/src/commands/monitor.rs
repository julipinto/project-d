// src-tauri/src/commands/monitor.rs
use crate::services::monitor::SystemMonitor;
use serde::Serialize;
use tauri::State;

#[derive(Serialize)]
pub struct HostStats {
  cpu_usage: f32,
  memory_used: u64,
  memory_total: u64,
}

#[tauri::command]
pub fn get_host_stats(state: State<SystemMonitor>) -> HostStats {
  let (cpu, mem, total) = state.get_stats();

  HostStats {
    cpu_usage: cpu,
    memory_used: mem,
    memory_total: total,
  }
}
