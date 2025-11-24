use std::process;
use std::sync::Mutex;
use sysinfo::{MemoryRefreshKind, Pid, ProcessRefreshKind, ProcessesToUpdate, RefreshKind, System};

pub struct SystemMonitor {
    sys: Mutex<System>,
    pid: Pid,
}

impl SystemMonitor {
    pub fn new() -> Self {
        let my_pid = Pid::from_u32(process::id());

        Self {
            sys: Mutex::new(System::new_with_specifics(
                RefreshKind::nothing()
                    .with_memory(MemoryRefreshKind::everything())
                    .with_processes(ProcessRefreshKind::everything()),
            )),
            pid: my_pid,
        }
    }

    pub fn get_stats(&self) -> (f32, u64, u64) {
        let mut sys = self.sys.lock().unwrap();

        // 1. Atualiza memória global
        sys.refresh_memory();

        sys.refresh_processes_specifics(
            ProcessesToUpdate::Some(&[self.pid]), // Lista de PIDs para atualizar
            true,                                 // true = remover processos mortos da lista
            ProcessRefreshKind::everything(),     // O que atualizar
        );

        let total_mem = sys.total_memory();

        if let Some(process) = sys.process(self.pid) {
            let app_cpu = process.cpu_usage();
            let app_mem = process.memory();
            return (app_cpu, app_mem, total_mem);
        }

        (0.0, 0, total_mem)
    }
}
