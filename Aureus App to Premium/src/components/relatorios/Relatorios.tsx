import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  PieChart, 
  TrendingUp, 
  BarChart3,
  Download,
  Crown,
  ChevronRight
} from 'lucide-react';

const PERIODOS = [
  { valor: 'este-mes', label: 'Este Mês' },
  { valor: 'ultimos-3-meses', label: 'Últimos 3 Meses' },
  { valor: 'ultimos-6-meses', label: 'Últimos 6 Meses' },
  { valor: 'este-ano', label: 'Este Ano' },
];

export function Relatorios() {
  const { state, dispatch, getGastosPorCategoria, formatarMoeda } = useApp();
  const [periodo, setPeriodo] = useState('este-mes');
  
  const gastosPorCategoria = getGastosPorCategoria();
  const totalGastos = gastosPorCategoria.reduce((sum, g) => sum + g.valor, 0);
  
  // Calcular totais de renda e despesa
  const transacoesMes = state.transacoes.filter(t => {
    const data = new Date(t.data);
    const hoje = new Date();
    return data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();
  });
  
  const totalRenda = transacoesMes
    .filter(t => t.tipo === 'renda')
    .reduce((sum, t) => sum + t.valor, 0);
  
  const totalDespesa = transacoesMes
    .filter(t => t.tipo === 'despesa')
    .reduce((sum, t) => sum + t.valor, 0);
  
  const economia = totalRenda - totalDespesa;
  const taxaEconomia = totalRenda > 0 ? (economia / totalRenda) * 100 : 0;
  
  const podeUsarAvancado = state.assinatura.plano === 'premium' || state.assinatura.trialAtivo;
  
  return (
    <div className="min-h-screen bg-[var(--aureos-bg)] pb-24">
      <header className="bg-[var(--aureos-surface)] border-b border-[var(--aureos-border)] px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })}
            className="w-10 h-10 rounded-xl bg-[var(--aureos-divider)] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--aureos-text-primary)]" />
          </button>
          <h1 className="text-xl font-bold text-[var(--aureos-text-primary)]">
            Relatórios
          </h1>
        </div>
      </header>
      
      <div className="p-4">
        {/* Seletor de período */}
        <div className="mb-6">
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIODOS.map(p => (
                <SelectItem key={p.valor} value={p.valor}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="gastos" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="gastos" className="text-xs">
              <PieChart className="w-4 h-4 mr-1" />
              Onde Gastei
            </TabsTrigger>
            <TabsTrigger value="evolucao" className="text-xs">
              <TrendingUp className="w-4 h-4 mr-1" />
              Evolução
            </TabsTrigger>
            <TabsTrigger value="economia" className="text-xs">
              <BarChart3 className="w-4 h-4 mr-1" />
              Economia
            </TabsTrigger>
          </TabsList>
          
          {/* Onde Gastei */}
          <TabsContent value="gastos" className="space-y-4">
            {gastosPorCategoria.length === 0 ? (
              <EmptyStateRelatorio tipo="gastos" />
            ) : (
              <>
                {/* Gráfico de pizza simulado */}
                <Card className="p-6">
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-40 h-40">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        {gastosPorCategoria.reduce((acc, { categoria, valor }) => {
                          const percentual = (valor / totalGastos) * 100;
                          const offset = acc.offset;
                          const dashArray = `${percentual} ${100 - percentual}`;
                          
                          acc.circles.push(
                            <circle
                              key={categoria.id}
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke={categoria.cor}
                              strokeWidth="20"
                              strokeDasharray={dashArray}
                              strokeDashoffset={-offset}
                            />
                          );
                          
                          acc.offset += percentual;
                          return acc;
                        }, { circles: [] as React.ReactNode[], offset: 0 }).circles}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs text-[var(--aureos-text-secondary)]">Total</span>
                        <span className="text-lg font-bold">{formatarMoeda(totalGastos)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Legenda */}
                  <div className="space-y-2">
                    {gastosPorCategoria.map(({ categoria, valor }) => {
                      const percentual = ((valor / totalGastos) * 100).toFixed(1);
                      return (
                        <div key={categoria.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: categoria.cor }}
                            />
                            <span className="text-sm">{categoria.nome}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">{formatarMoeda(valor)}</span>
                            <span className="text-xs text-[var(--aureos-text-secondary)] ml-2">
                              ({percentual}%)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
                
                {/* Exportar */}
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar PDF
                </Button>
              </>
            )}
          </TabsContent>
          
          {/* Evolução do Saldo */}
          <TabsContent value="evolucao" className="space-y-4">
            {!podeUsarAvancado ? (
              <PaywallRelatorio />
            ) : (
              <Card className="p-6">
                <h3 className="font-medium text-[var(--aureos-text-primary)] mb-4">
                  Evolução do Saldo
                </h3>
                
                {/* Gráfico de linha simulado */}
                <div className="h-48 flex items-end justify-between gap-2 mb-4">
                  {[65, 45, 80, 55, 70, 90, 75, 85, 60, 95, 70, 88].map((valor, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-[var(--aureos-primary)]/20 rounded-t-lg relative group"
                      style={{ height: `${valor}%` }}
                    >
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-[var(--aureos-primary)] rounded-t-lg transition-all"
                        style={{ height: `${valor * 0.7}%` }}
                      />
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between text-xs text-[var(--aureos-text-secondary)]">
                  <span>Jan</span>
                  <span>Fev</span>
                  <span>Mar</span>
                  <span>Abr</span>
                  <span>Mai</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Ago</span>
                  <span>Set</span>
                  <span>Out</span>
                  <span>Nov</span>
                  <span>Dez</span>
                </div>
                
                <div className="mt-6 pt-4 border-t border-[var(--aureos-border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--aureos-text-secondary)]">Média mensal</span>
                    <span className="font-medium">{formatarMoeda(totalRenda - totalDespesa)}</span>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>
          
          {/* Economia */}
          <TabsContent value="economia" className="space-y-4">
            <Card className="p-6">
              <h3 className="font-medium text-[var(--aureos-text-primary)] mb-4">
                Renda vs Despesa
              </h3>
              
              {/* Gráfico de barras */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[var(--aureos-text-secondary)]">Renda</span>
                    <span className="font-medium text-[var(--aureos-success)]">
                      {formatarMoeda(totalRenda)}
                    </span>
                  </div>
                  <div className="h-4 bg-[var(--aureos-divider)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--aureos-success)] rounded-full"
                      style={{ width: `${Math.min((totalRenda / (totalRenda + totalDespesa)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[var(--aureos-text-secondary)]">Despesa</span>
                    <span className="font-medium text-[var(--aureos-danger)]">
                      {formatarMoeda(totalDespesa)}
                    </span>
                  </div>
                  <div className="h-4 bg-[var(--aureos-divider)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--aureos-danger)] rounded-full"
                      style={{ width: `${Math.min((totalDespesa / (totalRenda + totalDespesa)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Taxa de economia */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[var(--aureos-text-secondary)]">Taxa de Economia</p>
                    <p className={`text-2xl font-bold ${
                      taxaEconomia >= 20 ? 'text-[var(--aureos-success)]' :
                      taxaEconomia >= 10 ? 'text-[var(--aureos-warning)]' :
                      'text-[var(--aureos-danger)]'
                    }`}>
                      {taxaEconomia.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[var(--aureos-text-secondary)]">Economizado</p>
                    <p className="text-xl font-bold text-[var(--aureos-text-primary)]">
                      {formatarMoeda(Math.max(0, economia))}
                    </p>
                  </div>
                </div>
              </div>
              
              {taxaEconomia < 10 && (
                <div className="mt-4 p-3 rounded-lg bg-[var(--aureos-warning)]/10 text-[var(--aureos-warning)] text-sm">
                  💡 Dica: Tente economizar pelo menos 20% da sua renda mensal
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EmptyStateRelatorio({ tipo: _tipo }: { tipo: string }) {
  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-[var(--aureos-divider)] flex items-center justify-center mx-auto mb-4">
        <PieChart className="w-8 h-8 text-[var(--aureos-text-tertiary)]" />
      </div>
      <h3 className="font-medium text-[var(--aureos-text-primary)] mb-2">
        Sem dados suficientes
      </h3>
      <p className="text-sm text-[var(--aureos-text-secondary)]">
        Adicione algumas transações para ver seu relatório
      </p>
    </Card>
  );
}

function PaywallRelatorio() {
  const { dispatch } = useApp();
  
  return (
    <Card className="p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
        <Crown className="w-8 h-8 text-white" />
      </div>
      <h3 className="font-medium text-[var(--aureos-text-primary)] mb-2">
        Relatório PRO
      </h3>
      <p className="text-sm text-[var(--aureos-text-secondary)] mb-4">
        Veja tendências de 12 meses e análises avançadas com o plano Premium
      </p>
      <Button 
        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'assinatura' })}
        className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
      >
        Ativar Premium
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </Card>
  );
}
