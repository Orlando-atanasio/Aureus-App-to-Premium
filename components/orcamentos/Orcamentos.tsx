import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
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
  Target, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import type { Orcamento } from '@/types';

export function Orcamentos() {
  const { state, dispatch, getProgressoOrcamento, formatarMoeda } = useApp();
  const [mostrarForm, setMostrarForm] = useState(false);
  
  // Form
  const [categoriaId, setCategoriaId] = useState('');
  const [valorLimite, setValorLimite] = useState('');
  const [alertaPercentual, setAlertaPercentual] = useState(80);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoriaId || !valorLimite) return;
    
    const novoOrcamento: Orcamento = {
      id: Date.now().toString(),
      categoriaId,
      valorLimite: parseFloat(valorLimite),
      periodo: 'mensal',
      alertaPercentual
    };
    
    dispatch({ type: 'ADD_ORCAMENTO', payload: novoOrcamento });
    setMostrarForm(false);
    setCategoriaId('');
    setValorLimite('');
    setAlertaPercentual(80);
  };
  
  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_ORCAMENTO', payload: id });
  };
  
  const categoriasSemOrcamento = state.categorias.filter(
    c => c.tipo === 'despesa' && !state.orcamentos.find(o => o.categoriaId === c.id)
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
              Novo Orçamento
            </h1>
          </div>
        </header>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div>
            <Label className="text-sm font-medium mb-2 block">Categoria</Label>
            <Select value={categoriaId} onValueChange={setCategoriaId}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categoriasSemOrcamento.map(cat => (
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
            <Label className="text-sm font-medium mb-2 block">Limite mensal</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--aureos-text-tertiary)]">
                {state.usuario.moedaPadrao === 'BRL' ? 'R$' : '$'}
              </span>
              <Input
                type="number"
                step="0.01"
                value={valorLimite}
                onChange={(e) => setValorLimite(e.target.value)}
                placeholder="0,00"
                className="h-12 pl-12 rounded-xl text-lg"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Alertar quando atingir {alertaPercentual}%
            </Label>
            <Slider
              value={[alertaPercentual]}
              onValueChange={(value) => setAlertaPercentual(value[0])}
              min={50}
              max={100}
              step={5}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-[var(--aureos-text-tertiary)]">
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              disabled={!categoriaId || !valorLimite}
              className="w-full h-12 rounded-xl bg-[var(--aureos-primary)]"
            >
              Criar Orçamento
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
              Orçamentos
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
      
      <div className="p-4">
        {state.orcamentos.length === 0 ? (
          <EmptyState onAdd={() => setMostrarForm(true)} />
        ) : (
          <div className="space-y-4">
            {state.orcamentos.map(orcamento => {
              const progresso = getProgressoOrcamento(orcamento.id);
              const categoria = state.categorias.find(c => c.id === orcamento.categoriaId);
              if (!categoria) return null;
              
              const alerta = progresso.percentual >= orcamento.alertaPercentual;
              const estourado = progresso.usado > progresso.limite;
              
              return (
                <Card key={orcamento.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${categoria.cor}20` }}
                      >
                        <span style={{ color: categoria.cor }}>●</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-[var(--aureos-text-primary)]">
                          {categoria.nome}
                        </h3>
                        <p className="text-xs text-[var(--aureos-text-secondary)]">
                          Limite: {formatarMoeda(orcamento.valorLimite)}/mês
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(orcamento.id)}
                      className="w-8 h-8 rounded-lg hover:bg-[var(--aureos-danger)]/10 flex items-center justify-center text-[var(--aureos-text-tertiary)] hover:text-[var(--aureos-danger)]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${
                        estourado ? 'text-[var(--aureos-danger)]' : 
                        alerta ? 'text-[var(--aureos-warning)]' : 
                        'text-[var(--aureos-text-secondary)]'
                      }`}>
                        {Math.round(progresso.percentual)}% usado
                      </span>
                      <span className="text-sm text-[var(--aureos-text-secondary)]">
                        {formatarMoeda(progresso.usado)} / {formatarMoeda(progresso.limite)}
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(progresso.percentual, 100)} 
                      className="h-2"
                    />
                  </div>
                  
                  {estourado && (
                    <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-[var(--aureos-danger)]/10 text-[var(--aureos-danger)] text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Orçamento estourado em {formatarMoeda(progresso.usado - progresso.limite)}</span>
                    </div>
                  )}
                  
                  {alerta && !estourado && (
                    <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-[var(--aureos-warning)]/10 text-[var(--aureos-warning)] text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Você atingiu {Math.round(progresso.percentual)}% do orçamento</span>
                    </div>
                  )}
                  
                  {!alerta && !estourado && progresso.percentual > 0 && (
                    <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-[var(--aureos-success)]/10 text-[var(--aureos-success)] text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Dentro do orçamento</span>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
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
        <Target className="w-10 h-10 text-[var(--aureos-text-tertiary)]" />
      </div>
      <h3 className="text-lg font-medium text-[var(--aureos-text-primary)] mb-2">
        Nenhum orçamento
      </h3>
      <p className="text-sm text-[var(--aureos-text-secondary)] mb-4 max-w-xs mx-auto">
        Crie seu primeiro orçamento para controlar gastos em categorias específicas
      </p>
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 rounded-xl mb-4">
        <div className="flex items-center gap-2 text-sm text-[var(--aureos-text-secondary)]">
          <TrendingUp className="w-5 h-5 text-[var(--aureos-success)]" />
          <span>Usuários com orçamentos economizam em média <strong>23% mais</strong> por mês</span>
        </div>
      </div>
      <Button onClick={onAdd} className="bg-[var(--aureos-primary)]">
        <Plus className="w-4 h-4 mr-2" />
        Criar Orçamento
      </Button>
    </Card>
  );
}
