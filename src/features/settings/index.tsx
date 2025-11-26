import { Component } from "solid-js";
import { Settings, Monitor, Shield } from "lucide-solid";
import { useSettingsStore } from "../../stores/settings-store";

// Imports UI
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Switch } from "../../ui/switch";

export const SettingsPage: Component = () => {
  const { showSystemMonitor, setShowSystemMonitor } = useSettingsStore();

  return (
    <div class="max-w-4xl mx-auto">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-white flex items-center gap-3">
          <Settings class="w-6 h-6 text-neutral-500" />
          Configurações
        </h2>
        <p class="text-neutral-500 mt-1">Gerencie as preferências da aplicação</p>
      </div>

      <Tabs defaultValue="general">
        {/* Barra de Navegação */}
        <TabsList>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        {/* Aba: GERAL */}
        <TabsContent value="general" class="space-y-6">
          {/* Seção: Interface */}
          <section class="bg-[#161b22] border border-neutral-800 rounded-xl p-6">
            <h3 class="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Monitor class="w-4 h-4 text-blue-500" />
              Interface & Aparência
            </h3>

            <div class="divide-y divide-neutral-800">
              {/* O Toggle da Memória */}
              <Switch
                label="Monitoramento de Sistema"
                description="Exibir barra de CPU e RAM no rodapé da aplicação."
                checked={showSystemMonitor()}
                onChange={setShowSystemMonitor}
              />

              {/* Exemplo de outro toggle futuro */}
              <Switch
                label="Animações Reduzidas"
                description="Desativar animações de transição para melhor performance."
                checked={false}
                onChange={() => alert("Em breve")}
              />
            </div>
          </section>
        </TabsContent>

        {/* Aba: AVANÇADO (Placeholder) */}
        <TabsContent value="advanced">
          <section class="bg-[#161b22] border border-neutral-800 rounded-xl p-6">
            <h3 class="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <Shield class="w-4 h-4 text-purple-500" />
              Segurança & Dados
            </h3>
            <p class="text-neutral-500 text-sm">
              Opções avançadas de conexão com o socket virão aqui.
            </p>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};
