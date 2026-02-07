import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Plus, 
  Bell, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2
} from 'lucide-react';
import type { ContaPagar } from '@/types';

export function ContasPagar() {
  const { state, dispatch, formatarMoeda } = useApp();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'todas' | 'pendentes' | 'vencidas' | 'pagas'>('todas');
  
  // Form
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [carteiraId, setCarteiraId] = useState(state.carteiras.find(c => c.ehPadrao)?.id || '');
  const [notificacaoDias, setNotificacaoDias] = useState(3);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao || !valor || !dataVencimento || !categoriaId || !carteiraId) return;
    
    const novaConta: ContaPagar = {
      id: Date.now().toString(),
      descricao,
      valor: parseFloat(valor),
      dataVencimento: new Date(dataVencimento).toISOString(),
      categoriaId,
      carteiraId,
      situacao: 'pendente',
      notificacaoDias
    };
    
    dispatch({ type: 'ADD_CONTA_PAGAR', payload: novaConta });
    setMostrarForm(false);
    setDescricao('');
    setValor('');
    setDataVencimento('');
    setCategoriaId('');
    setNotificacaoDias(3);
  };
  
  const handlePagar = (conta: ContaPagar) => {
    dispatch({
      type: 'UPDATE_CONTA_PAGAR',
      payload: { ...conta, situacao: 'paga' }
    });
    
    // Criar transação de despesa
    const transacao = {
      id: Date.now().toString(),
      tipo: 'despesa' as const,
      valor: conta.valor,
      descricao: conta.descricao,
      categoriaId: conta.categoriaId,
      carteiraId: conta.carteiraId,
      data: new Date().toISOString(),
      situacao: 'concluida' as const,
      ehRecorrente: false
    };
    
    dispatch({ type: 'ADD_TRANSACAO', payload: transacao });
    
    // Atualizar saldo da carteira
    const carteira = state.carteiras.find(c => c.id === conta.carteiraId);
    if (carteira) {
      dispatch({
        type: 'UPDATE_CARTEIRA',
        payload: { ...carteira, saldo: carteira.saldo - conta.valor }
      });
    }
  };
  
  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_CONTA_PAGAR', payload: id });
  };
  
  const hoje = new Date();
  
  const contasFiltradas = state.contasPagar.filter(conta => {
    if (abaAtiva === 'pendentes') return conta.situacao === 'pendente' && new Date(conta.dataVencimento) >= hoje;
    if (abaAtiva === 'vencidas') return conta.situacao === 'pendente' && new Date(conta.dataVencimento) < hoje;
    if (abaAtiva === 'pagas') return conta.situacao === 'paga';
    return true;
  }).sort((a, b) => new Date(a.dataVencimento).getTime() - new Date(b.dataVencimento).getTime());
  
  const contasVencidas = state.contasPagar.filter(c => 
    c.situacao === 'pendente' && new Date(c.dataVencimento) < hoje
  );
  
  if (mostrarForm) {
    return (
      <div className="min-h-screen bg-[var(--aureos-bg)]">
        <header className="bg-[var(--aureos-surface)] border-b border-[var(--aureos-border)] px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMostrarForm(false)}
              className="w-10 h-10 rounded-xl bg-[var(--aureos-divider)] flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--aureos-text-primary)]" />
            </button>
            <h1 className="text-xl font-bold text-[var(--aureos-text-primary)]">
              Nova Conta a Pagar
            </h1>
          </div>
        </header>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Descrição</Label>
            <Input
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Aluguel, Conta de luz, Internet"
              className="h-12 rounded-xl"
            />
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">Valor</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--aureos-text-tertiary)]">
                {state.usuario.moedaPadrao === 'BRL' ? 'R$' : '$'}
              </span>
              <Input
                type="number"
                step="0.01"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                className="h-12 pl-12 rounded-xl"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">Data de vencimento</Label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--aureos-text-tertiary)]" />
              <Input
                type="date"
                value={dataVencimento}
                onChange={(e) => setDataVencimento(e.target.value)}
                className="h-12 pl-12 rounded-xl"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">Categoria</Label>
            <Select value={categoriaId} onValueChange={setCategoriaId}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {state.categorias.filter(c => c.tipo === 'despesa').map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${cat.cor}20` }}
                      >
                        <span style={{ color: cat.cor }}>●</span>
                      </div>
                      <span>{cat.nome}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">Carteira</Label>
            <Select value={carteiraId} onValueChange={setCarteiraId}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Selecione uma carteira" />
              </SelectTrigger>
              <SelectContent>
                {state.carteiras.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: c.cor }}
                      >
                        <span className="text-white text-xs">{c.nome.charAt(0)}</span>
                      </div>
                      <span>{c.nome}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Notificar {notificacaoDias} dias antes
            </Label>
            <div className="flex gap-2">
              {[1, 3, 5, 7].map(dias => (
                <button
                  key={dias}
                  type="button"
                  onClick={() => setNotificacaoDias(dias)}
                  className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                    notificacaoDias === dias
                      ? 'bg-[var(--aureos-primary)] text-white'
                      : 'bg-[var(--aureos-surface)] text-[var(--aureos-text-secondary)] border border-[var(--aureos-border)]'
                  }`}
                >
                  {dias} dias
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              disabled={!descricao || !valor || !dataVencimento || !categoriaId || !carteiraId}
              className="w-full h-12 rounded-xl bg-[var(--aureos-primary)]"
            >
              Adicionar Conta
            </Button>
          </div>
        </form>
      </div>
    );
  }
  
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
              Contas a Pagar
            </h1>
          </div>
          <button
            onClick={() => setMostrarForm(true)}
            className="w-10 h-10 rounded-xl bg-[var(--aureos-primary)] text-white flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      {/* Alerta de contas vencidas */}
      {contasVencidas.length > 0 && (
        <div className="mx-4 mt-4">
          <Card className="p-4 border-[var(--aureos-danger)]/30 bg-[var(--aureos-danger)]/5">
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
            </div>
          </Card>
        </div>
      )}
      
      {/* Abas */}
      <div className="px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {[
            { id: 'todas', label: 'Todas' },
            { id: 'pendentes', label: 'Pendentes' },
            { id: 'vencidas', label: 'Vencidas' },
            { id: 'pagas', label: 'Pagas' },
          ].map(aba => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                abaAtiva === aba.id
                  ? 'bg-[var(--aureos-primary)] text-white'
                  : 'bg-[var(--aureos-surface)] text-[var(--aureos-text-secondary)]'
              }`}
            >
              {aba.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Lista */}
      <div className="p-4 space-y-3">
        {contasFiltradas.length === 0 ? (
          <EmptyState onAdd={() => setMostrarForm(true)} />
        ) : (
          contasFiltradas.map(conta => {
            const categoria = state.categorias.find(c => c.id === conta.categoriaId);
            const dataVencimento = new Date(conta.dataVencimento);
            const estaVencida = dataVencimento < hoje && conta.situacao === 'pendente';
            const diasAteVencimento = Math.ceil((dataVencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
            
            return (
              <Card key={conta.id} className={`p-4 ${estaVencida ? 'border-[var(--aureos-danger)]/30' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        conta.situacao === 'paga' 
                          ? 'bg-[var(--aureos-success)]/10' 
                          : estaVencida
                          ? 'bg-[var(--aureos-danger)]/10'
                          : 'bg-[var(--aureos-warning)]/10'
                      }`}
                    >
                      {conta.situacao === 'paga' ? (
                        <CheckCircle2 className="w-5 h-5 text-[var(--aureos-success)]" />
                      ) : estaVencida ? (
                        <AlertCircle className="w-5 h-5 text-[var(--aureos-danger)]" />
                      ) : (
                        <Clock className="w-5 h-5 text-[var(--aureos-warning)]" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-[var(--aureos-text-primary)]">
                        {conta.descricao}
                      </h3>
                      <p className="text-xs text-[var(--aureos-text-secondary)]">
                        {categoria?.nome} • Vence em {dataVencimento.toLocaleDateString('pt-BR')}
                      </p>
                      {conta.situacao === 'pendente' && (
                        <p className={`text-xs mt-1 ${
                          estaVencida 
                            ? 'text-[var(--aureos-danger)]' 
                            : diasAteVencimento <= 3 
                            ? 'text-[var(--aureos-warning)]'
                            : 'text-[var(--aureos-text-tertiary)]'
                        }`}>
                          {estaVencida 
                            ? 'Vencida' 
                            : diasAteVencimento === 0 
                            ? 'Vence hoje'
                            : `Faltam ${diasAteVencimento} dias`
                          }
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-semibold ${
                      conta.situacao === 'paga' 
                        ? 'text-[var(--aureos-text-tertiary)] line-through' 
                        : 'text-[var(--aureos-text-primary)]'
                    }`}>
                      {formatarMoeda(conta.valor)}
                    </p>
                    
                    {conta.situacao === 'pendente' && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handlePagar(conta)}
                          className="px-3 py-1 rounded-lg bg-[var(--aureos-success)] text-white text-xs font-medium"
                        >
                          Pagar
                        </button>
                        <button
                          onClick={() => handleDelete(conta.id)}
                          className="w-7 h-7 rounded-lg bg-[var(--aureos-divider)] flex items-center justify-center text-[var(--aureos-text-tertiary)]"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
      
      {/* FAB */}
      <button
        onClick={() => setMostrarForm(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[var(--aureos-primary)] text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <Card className="p-8 text-center border-dashed border-2">
      <div className="w-20 h-20 rounded-full bg-[var(--aureos-divider)] flex items-center justify-center mx-auto mb-4">
        <Bell className="w-10 h-10 text-[var(--aureos-text-tertiary)]" />
      </div>
      <h3 className="text-lg font-medium text-[var(--aureos-text-primary)] mb-2">
        Nenhuma conta a pagar
      </h3>
      <p className="text-sm text-[var(--aureos-text-secondary)] mb-4">
        Adicione contas fixas e receba lembretes antes do vencimento
      </p>
      <Button onClick={onAdd} className="bg-[var(--aureos-primary)]">
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Conta
      </Button>
    </Card>
  );
}
