"use client";

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wallet, DollarSign, CheckCircle2, TrendingUp, Shield, Sparkles } from 'lucide-react';
import type { Carteira, Transacao } from '@/types';

const MOEDAS = [
  { codigo: 'BRL', nome: 'Real Brasileiro', simbolo: 'R$' },
  { codigo: 'USD', nome: 'Dólar Americano', simbolo: '$' },
  { codigo: 'EUR', nome: 'Euro', simbolo: '€' },
  { codigo: 'GBP', nome: 'Libra Esterlina', simbolo: '£' },
];

export function Onboarding() {
  const { dispatch } = useApp();
  const [step, setStep] = useState(0);
  
  // Dados do passo 1
  const [moeda, setMoeda] = useState('BRL');
  
  // Dados do passo 2
  const [nomeCarteira, setNomeCarteira] = useState('Dinheiro');
  const [saldoInicial, setSaldoInicial] = useState('');
  
  // Dados do passo 3
  const [valorDespesa, setValorDespesa] = useState('');
  const [descricaoDespesa, setDescricaoDespesa] = useState('');
  const [categoriaDespesa, setCategoriaDespesa] = useState('alimentacao');
  
  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };
  
  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  const completeOnboarding = () => {
    // Criar carteira
    const novaCarteira: Carteira = {
      id: Date.now().toString(),
      nome: nomeCarteira,
      icone: 'wallet',
      cor: '#3B82F6',
      saldo: parseFloat(saldoInicial) || 0,
      moeda: moeda,
      ehPadrao: true,
      ocultarSaldo: false
    };
    
    dispatch({ type: 'ADD_CARTEIRA', payload: novaCarteira });
    dispatch({ type: 'SET_USUARIO', payload: { moedaPadrao: moeda } });
    
    // Criar primeira transação se preenchida
    if (valorDespesa && descricaoDespesa) {
      const novaTransacao: Transacao = {
        id: Date.now().toString(),
        tipo: 'despesa',
        valor: parseFloat(valorDespesa),
        descricao: descricaoDespesa,
        categoriaId: categoriaDespesa,
        carteiraId: novaCarteira.id,
        data: new Date().toISOString(),
        situacao: 'concluida',
        ehRecorrente: false
      };
      dispatch({ type: 'ADD_TRANSACAO', payload: novaTransacao });
      
      // Atualizar saldo da carteira
      dispatch({
        type: 'UPDATE_CARTEIRA',
        payload: { ...novaCarteira, saldo: novaCarteira.saldo - parseFloat(valorDespesa) }
      });
    }
    
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  };
  
  const canProceed = () => {
    switch (step) {
      case 0:
        return true;
      case 1:
        return nomeCarteira.trim() !== '';
      case 2:
        return true; // Opcional adicionar despesa
      default:
        return false;
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepBemVindo moeda={moeda} setMoeda={setMoeda} />;
      case 1:
        return (
          <StepCriarCarteira
            nome={nomeCarteira}
            setNome={setNomeCarteira}
            saldo={saldoInicial}
            setSaldo={setSaldoInicial}
            moeda={moeda}
          />
        );
      case 2:
        return (
          <StepPrimeiraDespesa
            valor={valorDespesa}
            setValor={setValorDespesa}
            descricao={descricaoDespesa}
            setDescricao={setDescricaoDespesa}
            categoria={categoriaDespesa}
            setCategoria={setCategoriaDespesa}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-[var(--aureos-bg)] flex flex-col">
      {/* Header com progresso */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-[var(--aureos-text-primary)]">Aureos</span>
          </div>
          <span className="text-sm text-[var(--aureos-text-secondary)]">
            Passo {step + 1} de 3
          </span>
        </div>
        
        {/* Barra de progresso */}
        <div className="aureos-progress">
          <div 
            className="aureos-progress-bar bg-[var(--aureos-primary)]"
            style={{ width: `${((step + 1) / 3) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Conteúdo do passo */}
      <div className="flex-1 flex flex-col px-6 py-4">
        {renderStep()}
      </div>
      
      {/* Footer com botões */}
      <div className="px-6 pb-8 pt-4 bg-[var(--aureos-surface)] border-t border-[var(--aureos-border)]">
        <div className="flex gap-3">
          {step > 0 && (
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl"
              onClick={handleBack}
            >
              Voltar
            </Button>
          )}
          <Button
            className="flex-1 h-12 rounded-xl bg-[var(--aureos-primary)] hover:bg-[var(--aureos-primary-dark)]"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {step === 2 ? 'Começar a usar' : 'Continuar'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Step 0: Bem-vindo
function StepBemVindo({ moeda, setMoeda }: { moeda: string; setMoeda: (m: string) => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center aureos-fade-in">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mb-8 shadow-2xl">
        <TrendingUp className="w-16 h-16 text-white" />
      </div>
      
      <h1 className="text-3xl font-bold text-[var(--aureos-text-primary)] text-center mb-4">
        Bem-vindo ao Aureos
      </h1>
      
      <p className="text-[var(--aureos-text-secondary)] text-center mb-8 max-w-sm">
        Vamos configurar seu app em 3 passos simples. Leva menos de 2 minutos.
      </p>
      
      <div className="w-full max-w-sm">
        <Label className="text-sm font-medium mb-2 block">Qual é sua moeda padrão?</Label>
        <Select value={moeda} onValueChange={setMoeda}>
          <SelectTrigger className="h-12 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MOEDAS.map(m => (
              <SelectItem key={m.codigo} value={m.codigo}>
                <span className="flex items-center gap-2">
                  <span className="font-medium">{m.simbolo}</span>
                  <span>{m.nome}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="mt-8 flex items-center gap-2 text-sm text-[var(--aureos-text-tertiary)]">
        <Shield className="w-4 h-4" />
        <span>Seus dados são armazenados localmente e de forma segura</span>
      </div>
    </div>
  );
}

// Step 1: Criar Carteira
function StepCriarCarteira({ 
  nome, setNome, saldo, setSaldo, moeda 
}: { 
  nome: string; setNome: (n: string) => void;
  saldo: string; setSaldo: (s: string) => void;
  moeda: string;
}) {
  const moedaInfo = MOEDAS.find(m => m.codigo === moeda);
  
  return (
    <div className="flex-1 flex flex-col aureos-fade-in">
      <h2 className="text-2xl font-bold text-[var(--aureos-text-primary)] mb-2">
        Crie sua primeira carteira
      </h2>
      <p className="text-[var(--aureos-text-secondary)] mb-8">
        Uma carteira representa onde você guarda seu dinheiro (dinheiro físico, conta bancária, etc.)
      </p>
      
      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-2 block">Nome da carteira</Label>
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
          <Label className="text-sm font-medium mb-2 block">Saldo inicial (opcional)</Label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--aureos-text-tertiary)]" />
            <Input
              type="number"
              value={saldo}
              onChange={(e) => setSaldo(e.target.value)}
              placeholder="0,00"
              className="h-12 pl-12 rounded-xl"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--aureos-text-tertiary)]">
              {moedaInfo?.simbolo}
            </span>
          </div>
          <p className="text-xs text-[var(--aureos-text-tertiary)] mt-2">
            Você pode adicionar ou ajustar o saldo depois
          </p>
        </div>
      </div>
      
      <div className="mt-auto pt-8">
        <div className="aureos-card p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[var(--aureos-success)] mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[var(--aureos-text-primary)]">Dica</p>
              <p className="text-sm text-[var(--aureos-text-secondary)]">
                Você pode criar mais carteiras depois (até 3 no plano gratuito)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 2: Primeira Despesa
function StepPrimeiraDespesa({ 
  valor, setValor, descricao, setDescricao, categoria, setCategoria 
}: { 
  valor: string; setValor: (v: string) => void;
  descricao: string; setDescricao: (d: string) => void;
  categoria: string; setCategoria: (c: string) => void;
}) {
  const { state } = useApp();
  const categoriasDespesa = state.categorias.filter(c => c.tipo === 'despesa').slice(0, 10);
  
  return (
    <div className="flex-1 flex flex-col aureos-fade-in">
      <h2 className="text-2xl font-bold text-[var(--aureos-text-primary)] mb-2">
        Adicione sua primeira despesa
      </h2>
      <p className="text-[var(--aureos-text-secondary)] mb-6">
        Opcional! Você pode pular e adicionar depois.
      </p>
      
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">Valor</Label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--aureos-text-tertiary)]" />
            <Input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
              className="h-12 pl-12 rounded-xl text-lg"
            />
          </div>
        </div>
        
        <div>
          <Label className="text-sm font-medium mb-2 block">Descrição</Label>
          <Input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Café da manhã, Uber, Mercado"
            className="h-12 rounded-xl"
          />
        </div>
        
        <div>
          <Label className="text-sm font-medium mb-2 block">Categoria</Label>
          <div className="grid grid-cols-2 gap-2">
            {categoriasDespesa.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoria(cat.id)}
                className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                  categoria === cat.id
                    ? 'border-[var(--aureos-primary)] bg-[var(--aureos-primary)]/10'
                    : 'border-[var(--aureos-border)] hover:border-[var(--aureos-primary)]/30'
                }`}
              >
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${cat.cor}20` }}
                >
                  <span style={{ color: cat.cor }}>●</span>
                </div>
                <span className="text-sm font-medium truncate">{cat.nome}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-auto pt-6">
        <div className="aureos-card p-4 border-dashed border-2">
          <p className="text-sm text-center text-[var(--aureos-text-secondary)]">
            💡 <span className="font-medium">Você está pronto!</span>
            <br />
            Depois de começar, você poderá adicionar mais transações, criar orçamentos e ver relatórios.
          </p>
        </div>
      </div>
    </div>
  );
}
