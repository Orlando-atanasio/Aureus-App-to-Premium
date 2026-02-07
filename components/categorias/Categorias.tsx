import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Plus, 
  Tag, 
  TrendingDown, 
  TrendingUp,
  Crown,
  ChevronRight
} from 'lucide-react';
import type { Categoria } from '@/types';

const CORES = [
  '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#10B981',
  '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#D946EF',
  '#F43F5E', '#78716C', '#64748B'
];

export function Categorias() {
  const { state, dispatch } = useApp();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [tipo, setTipo] = useState<'despesa' | 'renda'>('despesa');
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState(CORES[0]);
  
  const categoriasDespesa = state.categorias.filter(c => c.tipo === 'despesa');
  const categoriasRenda = state.categorias.filter(c => c.tipo === 'renda');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) return;
    
    const novaCategoria: Categoria = {
      id: Date.now().toString(),
      nome,
      icone: 'circle',
      cor,
      tipo
    };
    
    dispatch({ type: 'ADD_CATEGORIA', payload: novaCategoria });
    setMostrarForm(false);
    setNome('');
    setCor(CORES[0]);
  };
  
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
              Nova Categoria
            </h1>
          </div>
        </header>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTipo('despesa')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                tipo === 'despesa'
                  ? 'bg-[var(--aureos-danger)] text-white'
                  : 'bg-[var(--aureos-surface)] text-[var(--aureos-text-secondary)]'
              }`}
            >
              <TrendingDown className="w-5 h-5" />
              Despesa
            </button>
            <button
              type="button"
              onClick={() => setTipo('renda')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
                tipo === 'renda'
                  ? 'bg-[var(--aureos-success)] text-white'
                  : 'bg-[var(--aureos-surface)] text-[var(--aureos-text-secondary)]'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Renda
            </button>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">Nome</Label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--aureos-text-tertiary)]" />
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome da categoria"
                className="h-12 pl-12 rounded-xl"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">Cor</Label>
            <div className="flex flex-wrap gap-2">
              {CORES.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCor(c)}
                  className={`w-10 h-10 rounded-xl transition-all ${
                    cor === c ? 'ring-2 ring-offset-2 ring-[var(--aureos-primary)]' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              disabled={!nome}
              className="w-full h-12 rounded-xl bg-[var(--aureos-primary)]"
            >
              Criar Categoria
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
              Categorias
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
      
      <div className="p-4 space-y-6">
        {/* Categorias de Despesa */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--aureos-text-secondary)] uppercase tracking-wide mb-3">
            Despesas
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {categoriasDespesa.map(categoria => (
              <Card key={categoria.id} className="p-3 flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${categoria.cor}20` }}
                >
                  <span style={{ color: categoria.cor }}>●</span>
                </div>
                <span className="text-sm font-medium truncate">{categoria.nome}</span>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Categorias de Renda */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--aureos-text-secondary)] uppercase tracking-wide mb-3">
            Rendas
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {categoriasRenda.map(categoria => (
              <Card key={categoria.id} className="p-3 flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${categoria.cor}20` }}
                >
                  <span style={{ color: categoria.cor }}>●</span>
                </div>
                <span className="text-sm font-medium truncate">{categoria.nome}</span>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Limite do plano */}
        {state.assinatura.plano === 'gratuito' && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--aureos-text-secondary)]">
                  Categorias personalizadas
                </p>
                <p className="text-sm font-medium text-[var(--aureos-text-primary)]">
                  Ilimitadas no Premium
                </p>
              </div>
              <button
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'assinatura' })}
                className="flex items-center gap-1 text-sm text-[var(--aureos-warning)]"
              >
                <Crown className="w-4 h-4" />
                Premium
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
