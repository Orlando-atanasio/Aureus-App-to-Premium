import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Plus, 
  TrendingDown, 
  TrendingUp, 
  ArrowRightLeft,
  Search,
  Filter,
  Calendar,
  Trash2
} from 'lucide-react';
import type { Transacao } from '@/types';

export function Transacoes() {
  const { state, dispatch, formatarMoeda } = useApp();
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'despesa' | 'renda' | 'transferencia'>('todos');
  
  const transacoesFiltradas = state.transacoes
    .filter(t => {
      if (filtroTipo !== 'todos' && t.tipo !== filtroTipo) return false;
      if (busca && !t.descricao.toLowerCase().includes(busca.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  
  const handleExcluir = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACAO', payload: id });
  };
  
  const handleNovaTransacao = (_tipo: 'despesa' | 'renda') => {
    dispatch({ type: 'SET_VIEW', payload: 'novaTransacao' });
  };
  
  // Agrupar por data
  const transacoesPorData: Record<string, Transacao[]> = {};
  transacoesFiltradas.forEach(t => {
    const data = new Date(t.data).toLocaleDateString('pt-BR');
    if (!transacoesPorData[data]) transacoesPorData[data] = [];
    transacoesPorData[data].push(t);
  });
  
  return (
    <div className="min-h-screen bg-[var(--aureos-bg)] pb-24">
      <header className="bg-[var(--aureos-surface)] border-b border-[var(--aureos-border)] px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })}
              className="w-10 h-10 rounded-xl bg-[var(--aureos-divider)] flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--aureos-text-primary)]" />
            </button>
            <h1 className="text-xl font-bold text-[var(--aureos-text-primary)]">
              Transações
            </h1>
          </div>
          <button
            onClick={() => handleNovaTransacao('despesa')}
            className="w-10 h-10 rounded-xl bg-[var(--aureos-primary)] text-white flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      <div className="p-4 space-y-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--aureos-text-tertiary)]" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar transação..."
            className="h-12 pl-12 rounded-xl"
          />
        </div>
        
        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {[
            { id: 'todos', label: 'Todas' },
            { id: 'despesa', label: 'Despesas' },
            { id: 'renda', label: 'Rendas' },
            { id: 'transferencia', label: 'Transferências' },
          ].map(filtro => (
            <button
              key={filtro.id}
              onClick={() => setFiltroTipo(filtro.id as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filtroTipo === filtro.id
                  ? 'bg-[var(--aureos-primary)] text-white'
                  : 'bg-[var(--aureos-surface)] text-[var(--aureos-text-secondary)]'
              }`}
            >
              {filtro.label}
            </button>
          ))}
        </div>
        
        {/* Lista */}
        {transacoesFiltradas.length === 0 ? (
          <EmptyState onAdd={() => handleNovaTransacao('despesa')} />
        ) : (
          <div className="space-y-6">
            {Object.entries(transacoesPorData).map(([data, transacoes]) => (
              <div key={data}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-[var(--aureos-text-tertiary)]" />
                  <span className="text-sm font-medium text-[var(--aureos-text-secondary)]">
                    {data}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {transacoes.map(transacao => {
                    const categoria = state.categorias.find(c => c.id === transacao.categoriaId);
                    const carteira = state.carteiras.find(c => c.id === transacao.carteiraId);
                    
                    return (
                      <Card key={transacao.id} className="p-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                              transacao.tipo === 'despesa' 
                                ? 'bg-[var(--aureos-danger)]/10' 
                                : transacao.tipo === 'renda'
                                ? 'bg-[var(--aureos-success)]/10'
                                : 'bg-[var(--aureos-primary)]/10'
                            }`}
                          >
                            {transacao.tipo === 'despesa' ? (
                              <TrendingDown className="w-5 h-5 text-[var(--aureos-danger)]" />
                            ) : transacao.tipo === 'renda' ? (
                              <TrendingUp className="w-5 h-5 text-[var(--aureos-success)]" />
                            ) : (
                              <ArrowRightLeft className="w-5 h-5 text-[var(--aureos-primary)]" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{transacao.descricao}</p>
                            <p className="text-xs text-[var(--aureos-text-secondary)]">
                              {categoria?.nome} • {carteira?.nome}
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <p className={`font-semibold text-sm ${
                              transacao.tipo === 'despesa' ? 'text-[var(--aureos-danger)]' : 
                              transacao.tipo === 'renda' ? 'text-[var(--aureos-success)]' :
                              'text-[var(--aureos-primary)]'
                            }`}>
                              {transacao.tipo === 'despesa' ? '-' : transacao.tipo === 'renda' ? '+' : '↔'}
                              {formatarMoeda(transacao.valor)}
                            </p>
                            {transacao.situacao === 'pendente' && (
                              <span className="text-[10px] text-[var(--aureos-warning)]">
                                Pendente
                              </span>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleExcluir(transacao.id)}
                            className="w-8 h-8 rounded-lg hover:bg-[var(--aureos-danger)]/10 flex items-center justify-center text-[var(--aureos-text-tertiary)] hover:text-[var(--aureos-danger)]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* FAB */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3">
        <button
          onClick={() => handleNovaTransacao('renda')}
          className="w-12 h-12 rounded-full bg-[var(--aureos-success)] text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        >
          <TrendingUp className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleNovaTransacao('despesa')}
          className="w-14 h-14 rounded-full bg-[var(--aureos-danger)] text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        >
          <TrendingDown className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <Card className="p-8 text-center border-dashed border-2">
      <div className="w-20 h-20 rounded-full bg-[var(--aureos-divider)] flex items-center justify-center mx-auto mb-4">
        <Filter className="w-10 h-10 text-[var(--aureos-text-tertiary)]" />
      </div>
      <h3 className="text-lg font-medium text-[var(--aureos-text-primary)] mb-2">
        Nenhuma transação
      </h3>
      <p className="text-sm text-[var(--aureos-text-secondary)] mb-4">
        Adicione sua primeira transação para começar
      </p>
      <Button onClick={onAdd} className="bg-[var(--aureos-danger)]">
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Despesa
      </Button>
    </Card>
  );
}
