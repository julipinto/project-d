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
                    .with_cpu(sysinfo::CpuRefreshKind::everything())
                    .with_memory(MemoryRefreshKind::everything())
                    .with_processes(ProcessRefreshKind::everything()),
            )),
            pid: my_pid,
        }
    }

    pub fn get_stats(&self) -> (f32, u64, u64) {
        let mut sys = self.sys.lock().unwrap();

        // 1. Geral update of system info
        sys.refresh_memory();
        sys.refresh_cpu_all();

        // 2. Update ONLY our process (Very light and focused)
        sys.refresh_processes_specifics(
            ProcessesToUpdate::Some(&[self.pid]),
            true,
            ProcessRefreshKind::everything(),
        );

        let total_mem = sys.total_memory();
        let cpu_count = sys.cpus().len() as f32;

        // 3. Extract process data
        if let Some(process) = sys.process(self.pid) {
            let app_cpu = process.cpu_usage();
            let app_mem = process.memory();

            // Normalization:
            // sysinfo returns "100.0" if using 1 full core.
            // If you have 8 cores, we want this to show as "12.5
            let normalized_cpu = if cpu_count > 0.0 {
                app_cpu / cpu_count
            } else {
                app_cpu
            };

            return (normalized_cpu, app_mem, total_mem);
        }

        // Fallback caso não consiga ler o próprio processo
        (0.0, 0, total_mem)
    }
}
