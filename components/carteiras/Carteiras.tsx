import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Plus, 
  Wallet, 
  Trash2, 
  Edit3,
  Crown,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import type { Carteira } from '@/types';

const CORES = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

const ICONES = ['wallet', 'landmark', 'credit-card', 'piggy-bank', 'banknote'];

export function Carteiras() {
  const { state, dispatch, formatarMoeda, podeCriarCarteira } = useApp();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [carteiraEditando, setCarteiraEditando] = useState<Carteira | null>(null);
  
  // Form
  const [nome, setNome] = useState('');
  const [saldo, setSaldo] = useState('');
  const [cor, setCor] = useState(CORES[0]);
  const [icone, setIcone] = useState(ICONES[0]);
  const [ocultarSaldo, setOcultarSaldo] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome) return;
    
    if (carteiraEditando) {
      dispatch({
        type: 'UPDATE_CARTEIRA',
        payload: {
          ...carteiraEditando,
          nome,
          saldo: parseFloat(saldo) || 0,
          cor,
          ocultarSaldo
        }
      });
    } else {
      if (!podeCriarCarteira()) return;
      
      const novaCarteira: Carteira = {
        id: Date.now().toString(),
        nome,
        icone,
        cor,
        saldo: parseFloat(saldo) || 0,
        moeda: state.usuario.moedaPadrao,
        ehPadrao: state.carteiras.length === 0,
        ocultarSaldo
      };
      
      dispatch({ type: 'ADD_CARTEIRA', payload: novaCarteira });
    }
    
    resetForm();
  };
  
  const resetForm = () => {
    setMostrarForm(false);
    setCarteiraEditando(null);
    setNome('');
    setSaldo('');
    setCor(CORES[0]);
    setIcone(ICONES[0]);
    setOcultarSaldo(false);
  };
  
  const handleEditar = (carteira: Carteira) => {
    setCarteiraEditando(carteira);
    setNome(carteira.nome);
    setSaldo(carteira.saldo.toString());
    setCor(carteira.cor);
    setIcone(carteira.icone);
    setOcultarSaldo(carteira.ocultarSaldo);
    setMostrarForm(true);
  };
  
  const handleExcluir = (id: string) => {
    dispatch({ type: 'DELETE_CARTEIRA', payload: id });
  };
  
  const handleDefinirPadrao = (carteira: Carteira) => {
    state.carteiras.forEach(c => {
      if (c.id !== carteira.id && c.ehPadrao) {
        dispatch({ type: 'UPDATE_CARTEIRA', payload: { ...c, ehPadrao: false } });
      }
    });
    dispatch({ type: 'UPDATE_CARTEIRA', payload: { ...carteira, ehPadrao: true } });
  };
  
  if (mostrarForm) {
    return (
      <div className="min-h-screen bg-[var(--aureos-bg)]">
        <header className="bg-[var(--aureos-surface)] border-b border-[var(--aureos-border)] px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={resetForm}
              className="w-10 h-10 rounded-xl bg-[var(--aureos-divider)] flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--aureos-text-primary)]" />
            </button>
            <h1 className="text-xl font-bold text-[var(--aureos-text-primary)]">
              {carteiraEditando ? 'Editar Carteira' : 'Nova Carteira'}
            </h1>
          </div>
        </header>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Nome</Label>
            <div className="relative">
              <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--aureos-text-tertiary)]" />
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Dinheiro, Nubank, Carteira"
                className="h-12 pl-12 rounded-xl"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">Saldo atual</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--aureos-text-tertiary)]">
                {state.usuario.moedaPadrao === 'BRL' ? 'R$' : '$'}
              </span>
              <Input
                type="number"
                step="0.01"
                value={saldo}
                onChange={(e) => setSaldo(e.target.value)}
                placeholder="0,00"
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
          
          <div className="flex items-center justify-between p-4 bg-[var(--aureos-surface)] rounded-xl border border-[var(--aureos-border)]">
            <div className="flex items-center gap-3">
              {ocultarSaldo ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              <div>
                <p className="font-medium text-sm">Ocultar saldo</p>
                <p className="text-xs text-[var(--aureos-text-secondary)]">
                  Não mostrar valor no dashboard
                </p>
              </div>
            </div>
            <Switch checked={ocultarSaldo} onCheckedChange={setOcultarSaldo} />
          </div>
          
          <div className="pt-4">
            <Button
              type="submit"
              disabled={!nome}
              className="w-full h-12 rounded-xl bg-[var(--aureos-primary)]"
            >
              {carteiraEditando ? 'Salvar Alterações' : 'Criar Carteira'}
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
              Carteiras
            </h1>
          </div>
          <button
            onClick={() => setMostrarForm(true)}
            disabled={!podeCriarCarteira()}
            className="w-10 h-10 rounded-xl bg-[var(--aureos-primary)] text-white flex items-center justify-center disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      <div className="p-4 space-y-4">
        {/* Limite do plano */}
        {state.assinatura.plano === 'gratuito' && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--aureos-text-secondary)]">
                  Carteiras ({state.carteiras.length}/3)
                </p>
                <div className="w-32 h-2 bg-[var(--aureos-divider)] rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-[var(--aureos-primary)] rounded-full"
                    style={{ width: `${(state.carteiras.length / 3) * 100}%` }}
                  />
                </div>
              </div>
              {state.carteiras.length >= 3 && (
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'assinatura' })}
                  className="flex items-center gap-1 text-sm text-[var(--aureos-warning)]"
                >
                  <Crown className="w-4 h-4" />
                  Premium
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </Card>
        )}
        
        {/* Lista de carteiras */}
        {state.carteiras.length === 0 ? (
          <EmptyState onAdd={() => setMostrarForm(true)} />
        ) : (
          <div className="space-y-3">
            {state.carteiras.map(carteira => (
              <Card key={carteira.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: carteira.cor }}
                    >
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-[var(--aureos-text-primary)]">
                          {carteira.nome}
                        </h3>
                        {carteira.ehPadrao && (
                          <span className="text-[10px] bg-[var(--aureos-primary)]/10 text-[var(--aureos-primary)] px-2 py-0.5 rounded-full">
                            Padrão
                          </span>
                        )}
                      </div>
                      <p className="text-lg font-bold text-[var(--aureos-text-primary)]">
                        {formatarMoeda(carteira.saldo)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    {!carteira.ehPadrao && (
                      <button
                        onClick={() => handleDefinirPadrao(carteira)}
                        className="w-8 h-8 rounded-lg hover:bg-[var(--aureos-divider)] flex items-center justify-center text-[var(--aureos-text-tertiary)]"
                        title="Definir como padrão"
                      >
                        <span className="text-xs">★</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleEditar(carteira)}
                      className="w-8 h-8 rounded-lg hover:bg-[var(--aureos-divider)] flex items-center justify-center text-[var(--aureos-text-tertiary)]"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {state.carteiras.length > 1 && (
                      <button
                        onClick={() => handleExcluir(carteira.id)}
                        className="w-8 h-8 rounded-lg hover:bg-[var(--aureos-danger)]/10 flex items-center justify-center text-[var(--aureos-text-tertiary)] hover:text-[var(--aureos-danger)]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* FAB */}
      {podeCriarCarteira() && (
        <button
          onClick={() => setMostrarForm(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[var(--aureos-primary)] text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <Card className="p-8 text-center border-dashed border-2">
      <div className="w-20 h-20 rounded-full bg-[var(--aureos-divider)] flex items-center justify-center mx-auto mb-4">
        <Wallet className="w-10 h-10 text-[var(--aureos-text-tertiary)]" />
      </div>
      <h3 className="text-lg font-medium text-[var(--aureos-text-primary)] mb-2">
        Nenhuma carteira
      </h3>
      <p className="text-sm text-[var(--aureos-text-secondary)] mb-4">
        Crie sua primeira carteira para começar a controlar suas finanças
      </p>
      <Button onClick={onAdd} className="bg-[var(--aureos-primary)]">
        <Plus className="w-4 h-4 mr-2" />
        Criar Carteira
      </Button>
    </Card>
  );
}
