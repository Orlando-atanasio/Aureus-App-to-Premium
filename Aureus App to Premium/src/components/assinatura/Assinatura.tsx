import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Crown, Sparkles, Zap, Shield, Cloud, Infinity, ArrowLeft } from 'lucide-react';

const RECURSOS_GRATUITO = [
  'Até 3 carteiras',
  'Transações ilimitadas',
  'Relatórios básicos',
  '5 categorias personalizadas',
  'Backup manual',
];

const RECURSOS_PREMIUM = [
  'Carteiras ilimitadas',
  'Orçamentos avançados',
  'Todos os relatórios',
  'Categorias ilimitadas',
  'Backup automático',
  'Sincronização em tempo real',
  'Exportação PDF/Excel',
  'Suporte prioritário',
];

export function Assinatura() {
  const { state, dispatch } = useApp();
  
  const ativarTrial = () => {
    dispatch({
      type: 'SET_ASSINATURA',
      payload: {
        plano: 'premium',
        trialAtivo: true,
        diasTrialRestantes: 7,
        dataInicio: new Date().toISOString()
      }
    });
  };
  
  const cancelarTrial = () => {
    dispatch({
      type: 'SET_ASSINATURA',
      payload: {
        plano: 'gratuito',
        trialAtivo: false,
        diasTrialRestantes: 0
      }
    });
  };
  
  return (
    <div className="min-h-screen bg-[var(--aureos-bg)] pb-24">
      {/* Header */}
      <header className="bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 px-4 py-8 relative">
        {/* Botão Voltar */}
        <button 
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="text-center pt-4">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-4">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Aureos Premium
          </h1>
          <p className="text-white/80">
            Controle financeiro completo
          </p>
        </div>
      </header>
      
      <div className="p-4 space-y-4 -mt-4">
        {/* Status atual */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--aureos-text-secondary)]">Plano atual</p>
              <p className="text-lg font-bold text-[var(--aureos-text-primary)]">
                {state.assinatura.plano === 'premium' ? 'Premium' : 'Gratuito'}
              </p>
            </div>
            {state.assinatura.trialAtivo && (
              <div className="text-right">
                <p className="text-sm text-[var(--aureos-text-secondary)]">Trial</p>
                <p className="text-lg font-bold text-[var(--aureos-warning)]">
                  {state.assinatura.diasTrialRestantes} dias restantes
                </p>
              </div>
            )}
          </div>
        </Card>
        
        {/* Preços */}
        <div className="grid grid-cols-2 gap-4">
          <Card className={`p-4 ${state.assinatura.plano === 'gratuito' ? 'ring-2 ring-[var(--aureos-primary)]' : ''}`}>
            <div className="text-center">
              <p className="text-sm text-[var(--aureos-text-secondary)] mb-2">Gratuito</p>
              <p className="text-3xl font-bold text-[var(--aureos-text-primary)]">R$ 0</p>
              <p className="text-xs text-[var(--aureos-text-tertiary)]">para sempre</p>
            </div>
          </Card>
          
          <Card className={`p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 ${state.assinatura.plano === 'premium' ? 'ring-2 ring-yellow-400' : ''}`}>
            <div className="text-center">
              <p className="text-sm text-[var(--aureos-text-secondary)] mb-2">Premium</p>
              <p className="text-3xl font-bold text-[var(--aureos-text-primary)]">R$ 9,90</p>
              <p className="text-xs text-[var(--aureos-text-tertiary)]">/mês</p>
            </div>
          </Card>
        </div>
        
        {/* Comparativo */}
        <Card className="p-4">
          <h3 className="font-semibold text-[var(--aureos-text-primary)] mb-4">
            Compare os planos
          </h3>
          
          <div className="space-y-4">
            {/* Gratuito */}
            <div>
              <p className="text-sm font-medium text-[var(--aureos-text-secondary)] mb-2">
                Gratuito
              </p>
              <ul className="space-y-2">
                {RECURSOS_GRATUITO.map((recurso, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-[var(--aureos-success)]" />
                    <span className="text-[var(--aureos-text-secondary)]">{recurso}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="h-px bg-[var(--aureos-border)]" />
            
            {/* Premium */}
            <div>
              <p className="text-sm font-medium text-[var(--aureos-warning)] mb-2 flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Premium
              </p>
              <ul className="space-y-2">
                {RECURSOS_PREMIUM.map((recurso, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-[var(--aureos-warning)]" />
                    <span className="text-[var(--aureos-text-primary)]">{recurso}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
        
        {/* CTA */}
        {state.assinatura.plano === 'gratuito' ? (
          <div className="space-y-3">
            <Button 
              onClick={ativarTrial}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Experimente 7 dias grátis
            </Button>
            <p className="text-center text-xs text-[var(--aureos-text-tertiary)]">
              Cancele quando quiser. Sem compromisso.
            </p>
          </div>
        ) : state.assinatura.trialAtivo ? (
          <div className="space-y-3">
            <Card className="p-4 bg-[var(--aureos-warning)]/10 border-[var(--aureos-warning)]/30">
              <p className="text-sm text-center text-[var(--aureos-warning)]">
                Você está no trial Premium. 
                <br />
                Faltam <strong>{state.assinatura.diasTrialRestantes} dias</strong> para o fim.
              </p>
            </Card>
            <Button 
              onClick={cancelarTrial}
              variant="outline"
              className="w-full h-12 rounded-xl"
            >
              Cancelar Trial
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Card className="p-4 bg-[var(--aureos-success)]/10 border-[var(--aureos-success)]/30">
              <p className="text-sm text-center text-[var(--aureos-success)]">
                Você é assinante Premium!
                <br />
                Aproveite todos os recursos.
              </p>
            </Card>
            <Button 
              variant="outline"
              className="w-full h-12 rounded-xl"
            >
              Gerenciar Assinatura
            </Button>
          </div>
        )}
        
        {/* Benefícios */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-[var(--aureos-text-secondary)]">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Sincronização rápida</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--aureos-text-secondary)]">
            <Shield className="w-4 h-4 text-green-500" />
            <span>Dados seguros</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--aureos-text-secondary)]">
            <Cloud className="w-4 h-4 text-blue-500" />
            <span>Backup automático</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[var(--aureos-text-secondary)]">
            <Infinity className="w-4 h-4 text-purple-500" />
            <span>Sem limites</span>
          </div>
        </div>
      </div>
    </div>
  );
}
