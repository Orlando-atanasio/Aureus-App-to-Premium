import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Wallet, 
  TrendingDown, 
  TrendingUp, 
  Eye, 
  EyeOff, 
  Plus, 
  ArrowRight,
  AlertCircle,
  Receipt,
  PieChart,
  Calendar,
  Wallet2
} from 'lucide-react';
import type { Transacao } from '@/types';

// Dados de exemplo para sandbox
const TRANSACOES_EXEMPLO: Transacao[] = [
  {
    id: 'exemplo-1',
    tipo: 'despesa',
    valor: 45.90,
    descricao: 'Café da manhã',
    categoriaId: 'alimentacao',
    carteiraId: 'exemplo-carteira',
    data: new Date(Date.now() - 86400000).toISOString(),
    situacao: 'concluida',
    ehRecorrente: false
  },
  {
    id: 'exemplo-2',
    tipo: 'despesa',
    valor: 120.00,
    descricao: 'Supermercado',
    categoriaId: 'alimentacao',
    carteiraId: 'exemplo-carteira',
    data: new Date(Date.now() - 172800000).toISOString(),
    situacao: 'concluida',
    ehRecorrente: false
  },
  {
    id: 'exemplo-3',
    tipo: 'renda',
    valor: 5000.00,
    descricao: 'Salário',
    categoriaId: 'salario',
    carteiraId: 'exemplo-carteira',
    data: new Date(Date.now() - 259200000).toISOString(),
    situacao: 'concluida',
    ehRecorrente: true
  },
  {
    id: 'exemplo-4',
    tipo: 'despesa',
    valor: 89.90,
    descricao: 'Uber',
    categoriaId: 'transporte',
    carteiraId: 'exemplo-carteira',
    data: new Date(Date.now() - 345600000).toISOString(),
    situacao: 'concluida',
    ehRecorrente: false
  },
  {
    id: 'exemplo-5',
    tipo: 'despesa',
    valor: 250.00,
    descricao: 'Conta de luz',
    categoriaId: 'servicos',
    carteiraId: 'exemplo-carteira',
    data: new Date(Date.now() - 432000000).toISOString(),
    situacao: 'concluida',
    ehRecorrente: true
  }
];

export function Dashboard() {
  const { 
    state, 
    dispatch, 
    getSaldoTotal, 
    formatarMoeda, 
    getGastosPorCategoria,
    getProgressoOrcamento,
    getContasVencidas,
    getContasAVencer
  } = useApp();
  
  const saldoTotal = getSaldoTotal();
  const transacoes = state.mostrarExemplos && state.transacoes.length === 0 
    ? TRANSACOES_EXEMPLO 
    : state.transacoes.slice(0, 5);
  const gastosPorCategoria = getGastosPorCategoria();
  const contasVencidas = getContasVencidas();
  const contasAVencer = getContasAVencer();
  
  const toggleSaldos = () => {
    dispatch({ type: 'TOGGLE_SALDOS_OCULTOS' });
  };
  
  const handleNovaTransacao = (_tipo: 'despesa' | 'renda') => {
    dispatch({ type: 'SET_VIEW', payload: 'novaTransacao' });
  };
  
  return (
    <div className="min-h-screen bg-[var(--aureos-bg)] pb-24">
      {/* Header */}
      <header className="bg-[var(--aureos-surface)] border-b border-[var(--aureos-border)] px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => dispatch({ type: 'TOGGLE_MENU' })}
              className="w-10 h-10 rounded-xl bg-[var(--aureos-divider)] flex items-center justify-center"
            >
              <div className="space-y-1">
                <div className="w-5 h-0.5 bg-[var(--aureos-text-primary)]" />
                <div className="w-5 h-0.5 bg-[var(--aureos-text-primary)]" />
                <div className="w-3 h-0.5 bg-[var(--aureos-text-primary)]" />
              </div>
            </button>
            <div>
              <p className="text-xs text-[var(--aureos-text-secondary)]">Saldo Total</p>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-[var(--aureos-text-primary)]">
                  {state.saldosOcultos ? '•••••' : formatarMoeda(saldoTotal)}
                </h1>
                <button 
                  onClick={toggleSaldos}
                  className="text-[var(--aureos-text-tertiary)] hover:text-[var(--aureos-text-primary)]"
                >
                  {state.saldosOcultos ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'configuracoes' })}
            className="w-10 h-10 rounded-xl bg-[var(--aureos-divider)] flex items-center justify-center text-[var(--aureos-text-secondary)]"
          >
            <div className="w-2 h-2 rounded-full bg-[var(--aureos-primary)] absolute top-3 right-3" />
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>
      
      {/* Conteúdo */}
      <div className="p-4 space-y-4">
        {/* Carteiras */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--aureos-text-secondary)] uppercase tracking-wide">
              Minhas Carteiras
            </h2>
            <button 
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'carteiras' })}
              className="text-xs text-[var(--aureos-primary)] flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          {state.carteiras.length === 0 ? (
            <EmptyStateCarteiras />
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {state.carteiras.map(carteira => (
                <Card 
                  key={carteira.id}
                  className="min-w-[140px] p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4" />
                    <span className="text-xs opacity-80 truncate">{carteira.nome}</span>
                  </div>
                  <p className="text-lg font-bold">
                    {state.saldosOcultos ? '••••' : formatarMoeda(carteira.saldo)}
                  </p>
                </Card>
              ))}
              <button 
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'carteiras' })}
                className="min-w-[100px] p-4 rounded-xl border-2 border-dashed border-[var(--aureos-border)] flex flex-col items-center justify-center text-[var(--aureos-text-tertiary)]"
              >
                <Plus className="w-6 h-6 mb-1" />
                <span className="text-xs">Nova</span>
              </button>
            </div>
          )}
        </section>
        
        {/* Orçamentos */}
        {state.orcamentos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-[var(--aureos-text-secondary)] uppercase tracking-wide">
                Orçamentos do Mês
              </h2>
              <button 
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'orcamentos' })}
                className="text-xs text-[var(--aureos-primary)] flex items-center gap-1"
              >
                Ver todos <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-3">
              {state.orcamentos.slice(0, 3).map(orcamento => {
                const progresso = getProgressoOrcamento(orcamento.id);
                const categoria = state.categorias.find(c => c.id === orcamento.categoriaId);
                if (!categoria) return null;
                
                const alerta = progresso.percentual >= orcamento.alertaPercentual;
                const estourado = progresso.usado > progresso.limite;
                
                return (
                  <Card key={orcamento.id} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${categoria.cor}20` }}
                        >
                          <span style={{ color: categoria.cor }}>●</span>
                        </div>
                        <span className="font-medium text-sm">{categoria.nome}</span>
                      </div>
                      <span className={`text-xs font-medium ${alerta ? 'text-[var(--aureos-warning)]' : 'text-[var(--aureos-text-secondary)]'}`}>
                        {Math.round(progresso.percentual)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(progresso.percentual, 100)} 
                      className="h-2"
                    />
                    <div className="flex items-center justify-between mt-2 text-xs text-[var(--aureos-text-secondary)]">
                      <span>{formatarMoeda(progresso.usado)}</span>
                      <span>{formatarMoeda(progresso.limite)}</span>
                    </div>
                    {estourado && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-[var(--aureos-danger)]">
                        <AlertCircle className="w-3 h-3" />
                        <span>Orçamento estourado!</span>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>
        )}
        
        {/* Alertas de Contas */}
        {(contasVencidas.length > 0 || contasAVencer.length > 0) && (
          <section>
            <h2 className="text-sm font-semibold text-[var(--aureos-text-secondary)] uppercase tracking-wide mb-3">
              Contas a Pagar
            </h2>
            
            {contasVencidas.length > 0 && (
              <Card className="p-4 mb-3 border-[var(--aureos-danger)]/30 bg-[var(--aureos-danger)]/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--aureos-danger)]/10 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-[var(--aureos-danger)]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-[var(--aureos-danger)]">
                      {contasVencidas.length} conta{contasVencidas.length > 1 ? 's' : ''} vencida{contasVencidas.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-[var(--aureos-text-secondary)]">
                      Total: {formatarMoeda(contasVencidas.reduce((sum, c) => sum + c.valor, 0))}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'contasPagar' })}
                  >
                    Ver
                  </Button>
                </div>
              </Card>
            )}
            
            {contasAVencer.length > 0 && (
              <Card className="p-4 border-[var(--aureos-warning)]/30 bg-[var(--aureos-warning)]/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--aureos-warning)]/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[var(--aureos-warning)]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-[var(--aureos-warning)]">
                      {contasAVencer.length} conta{contasAVencer.length > 1 ? 's' : ''} a vencer
                    </p>
                    <p className="text-xs text-[var(--aureos-text-secondary)]">
                      Próximos 7 dias
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'contasPagar' })}
                  >
                    Ver
                  </Button>
                </div>
              </Card>
            )}
          </section>
        )}
        
        {/* Transações Recentes */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--aureos-text-secondary)] uppercase tracking-wide">
              Transações Recentes
            </h2>
            <button 
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'transacoes' })}
              className="text-xs text-[var(--aureos-primary)] flex items-center gap-1"
            >
              Ver todas <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          
          {transacoes.length === 0 ? (
            <EmptyStateTransacoes onAdd={() => handleNovaTransacao('despesa')} />
          ) : (
            <div className="space-y-2">
              {transacoes.map(transacao => {
                const categoria = state.categorias.find(c => c.id === transacao.categoriaId);
                const isExemplo = transacao.id.startsWith('exemplo-');
                
                return (
                  <Card 
                    key={transacao.id} 
                    className={`p-3 flex items-center gap-3 ${isExemplo ? 'opacity-60' : ''}`}
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: categoria ? `${categoria.cor}20` : '#E2E8F0' }}
                    >
                      {transacao.tipo === 'despesa' ? (
                        <TrendingDown className="w-5 h-5" style={{ color: categoria?.cor || '#EF4444' }} />
                      ) : (
                        <TrendingUp className="w-5 h-5 text-[var(--aureos-success)]" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{transacao.descricao}</p>
                      <p className="text-xs text-[var(--aureos-text-secondary)]">
                        {categoria?.nome} • {new Date(transacao.data).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-semibold text-sm ${
                        transacao.tipo === 'despesa' ? 'text-[var(--aureos-danger)]' : 'text-[var(--aureos-success)]'
                      }`}>
                        {transacao.tipo === 'despesa' ? '-' : '+'}
                        {state.saldosOcultos ? '•••' : formatarMoeda(transacao.valor)}
                      </p>
                      {isExemplo && (
                        <span className="text-[10px] text-[var(--aureos-text-tertiary)]">Exemplo</span>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
          
          {/* Toggle exemplos */}
          {state.transacoes.length === 0 && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <input
                type="checkbox"
                id="mostrar-exemplos"
                checked={state.mostrarExemplos}
                onChange={(e) => dispatch({ type: 'SET_MOSTRAR_EXEMPLOS', payload: e.target.checked })}
                className="rounded border-[var(--aureos-border)]"
              />
              <label htmlFor="mostrar-exemplos" className="text-xs text-[var(--aureos-text-secondary)]">
                Mostrar exemplos
              </label>
            </div>
          )}
        </section>
        
        {/* Gastos por Categoria */}
        {gastosPorCategoria.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-[var(--aureos-text-secondary)] uppercase tracking-wide mb-3">
              Gastos por Categoria
            </h2>
            
            <Card className="p-4">
              <div className="space-y-3">
                {gastosPorCategoria.slice(0, 5).map(({ categoria, valor }) => (
                  <div key={categoria.id} className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${categoria.cor}20` }}
                    >
                      <span style={{ color: categoria.cor }}>●</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{categoria.nome}</span>
                        <span className="text-sm font-semibold">{formatarMoeda(valor)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="ghost" 
                className="w-full mt-4 text-[var(--aureos-primary)]"
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'relatorios' })}
              >
                <PieChart className="w-4 h-4 mr-2" />
                Ver relatório completo
              </Button>
            </Card>
          </section>
        )}
      </div>
      
      {/* FAB Simplificado */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button
          onClick={() => handleNovaTransacao('renda')}
          className="w-12 h-12 rounded-full bg-[var(--aureos-success)] text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          title="Adicionar Renda"
        >
          <TrendingUp className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleNovaTransacao('despesa')}
          className="w-14 h-14 rounded-full bg-[var(--aureos-danger)] text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
          title="Adicionar Despesa"
        >
          <TrendingDown className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

// Empty State para Carteiras
function EmptyStateCarteiras() {
  const { dispatch } = useApp();
  
  return (
    <Card className="p-6 text-center border-dashed border-2">
      <div className="w-16 h-16 rounded-full bg-[var(--aureos-divider)] flex items-center justify-center mx-auto mb-4">
        <Wallet2 className="w-8 h-8 text-[var(--aureos-text-tertiary)]" />
      </div>
      <h3 className="font-medium text-[var(--aureos-text-primary)] mb-2">
        Nenhuma carteira
      </h3>
      <p className="text-sm text-[var(--aureos-text-secondary)] mb-4">
        Crie sua primeira carteira para começar
      </p>
      <Button 
        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'carteiras' })}
        className="bg-[var(--aureos-primary)]"
      >
        <Plus className="w-4 h-4 mr-2" />
        Criar Carteira
      </Button>
    </Card>
  );
}

// Empty State para Transações
function EmptyStateTransacoes({ onAdd }: { onAdd: () => void }) {
  return (
    <Card className="p-6 text-center border-dashed border-2">
      <div className="w-16 h-16 rounded-full bg-[var(--aureos-divider)] flex items-center justify-center mx-auto mb-4">
        <Receipt className="w-8 h-8 text-[var(--aureos-text-tertiary)]" />
      </div>
      <h3 className="font-medium text-[var(--aureos-text-primary)] mb-2">
        Nenhuma transação
      </h3>
      <p className="text-sm text-[var(--aureos-text-secondary)] mb-4">
        Adicione sua primeira despesa para começar a controlar suas finanças
      </p>
      <Button 
        onClick={onAdd}
        className="bg-[var(--aureos-danger)]"
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Despesa
      </Button>
    </Card>
  );
}
