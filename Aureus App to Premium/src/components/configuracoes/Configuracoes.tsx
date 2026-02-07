import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
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
  User, 
  Bell, 
  Palette, 
  Shield, 
  Cloud,
  Database,
  ChevronRight,
  Moon,
  Sun,
  Smartphone,
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  Globe,
  DollarSign
} from 'lucide-react';

type SecaoConfiguracao = 'conta' | 'notificacoes' | 'aparencia' | 'seguranca' | 'backup' | null;

const MOEDAS = [
  { codigo: 'BRL', nome: 'Real Brasileiro', simbolo: 'R$' },
  { codigo: 'USD', nome: 'Dólar Americano', simbolo: '$' },
  { codigo: 'EUR', nome: 'Euro', simbolo: '€' },
  { codigo: 'GBP', nome: 'Libra Esterlina', simbolo: '£' },
];

const IDIOMAS = [
  { codigo: 'pt-BR', nome: 'Português (Brasil)' },
  { codigo: 'en-US', nome: 'English (US)' },
  { codigo: 'es', nome: 'Español' },
];

export function Configuracoes() {
  const { state, dispatch } = useApp();
  const [secaoAtiva, setSecaoAtiva] = useState<SecaoConfiguracao>(null);
  
  const renderSecao = () => {
    switch (secaoAtiva) {
      case 'conta':
        return <SecaoConta onBack={() => setSecaoAtiva(null)} />;
      case 'notificacoes':
        return <SecaoNotificacoes onBack={() => setSecaoAtiva(null)} />;
      case 'aparencia':
        return <SecaoAparencia onBack={() => setSecaoAtiva(null)} />;
      case 'seguranca':
        return <SecaoSeguranca onBack={() => setSecaoAtiva(null)} />;
      case 'backup':
        return <SecaoBackup onBack={() => setSecaoAtiva(null)} />;
      default:
        return null;
    }
  };
  
  if (secaoAtiva) {
    return (
      <div className="min-h-screen bg-[var(--aureos-bg)]">
        {renderSecao()}
      </div>
    );
  }
  
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
            Configurações
          </h1>
        </div>
      </header>
      
      <div className="p-4 space-y-4">
        {/* Perfil */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {state.usuario.nome ? state.usuario.nome.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-[var(--aureos-text-primary)]">
                {state.usuario.nome || 'Usuário'}
              </h2>
              <p className="text-sm text-[var(--aureos-text-secondary)]">
                {state.assinatura.plano === 'premium' ? 'Plano Premium' : 'Plano Gratuito'}
              </p>
            </div>
            <button 
              onClick={() => setSecaoAtiva('conta')}
              className="w-10 h-10 rounded-xl bg-[var(--aureos-divider)] flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5 text-[var(--aureos-text-secondary)]" />
            </button>
          </div>
        </Card>
        
        {/* Menu de configurações */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-[var(--aureos-text-tertiary)] uppercase tracking-wider px-2">
            Geral
          </p>
          
          <Card>
            <button
              onClick={() => setSecaoAtiva('notificacoes')}
              className="w-full flex items-center gap-3 p-4 hover:bg-[var(--aureos-divider)]/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--aureos-primary)]/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-[var(--aureos-primary)]" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-[var(--aureos-text-primary)]">Notificações</p>
                <p className="text-xs text-[var(--aureos-text-secondary)]">
                  Lembretes e alertas
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--aureos-text-tertiary)]" />
            </button>
            
            <div className="h-px bg-[var(--aureos-border)] mx-4" />
            
            <button
              onClick={() => setSecaoAtiva('aparencia')}
              className="w-full flex items-center gap-3 p-4 hover:bg-[var(--aureos-divider)]/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-[var(--aureos-text-primary)]">Aparência</p>
                <p className="text-xs text-[var(--aureos-text-secondary)]">
                  Tema, tamanho da fonte
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--aureos-text-tertiary)]" />
            </button>
          </Card>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs font-medium text-[var(--aureos-text-tertiary)] uppercase tracking-wider px-2">
            Segurança e Dados
          </p>
          
          <Card>
            <button
              onClick={() => setSecaoAtiva('seguranca')}
              className="w-full flex items-center gap-3 p-4 hover:bg-[var(--aureos-divider)]/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-[var(--aureos-text-primary)]">Segurança</p>
                <p className="text-xs text-[var(--aureos-text-secondary)]">
                  Biometria, mascaramento de saldo
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--aureos-text-tertiary)]" />
            </button>
            
            <div className="h-px bg-[var(--aureos-border)] mx-4" />
            
            <button
              onClick={() => setSecaoAtiva('backup')}
              className="w-full flex items-center gap-3 p-4 hover:bg-[var(--aureos-divider)]/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Cloud className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-[var(--aureos-text-primary)]">Backup e Sincronização</p>
                <p className="text-xs text-[var(--aureos-text-secondary)]">
                  Backup na nuvem
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-[var(--aureos-text-tertiary)]" />
            </button>
          </Card>
        </div>
        
        {/* Sobre */}
        <Card className="p-4">
          <div className="text-center">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-2xl font-bold">A</span>
            </div>
            <h3 className="font-semibold text-[var(--aureos-text-primary)]">Aureos</h3>
            <p className="text-sm text-[var(--aureos-text-secondary)]">Versão 2.0.0</p>
          </div>
          
          <div className="h-px bg-[var(--aureos-border)] my-4" />
          
          <div className="space-y-2 text-center">
            <button className="text-sm text-[var(--aureos-primary)]">
              Termos de Uso
            </button>
            <span className="text-[var(--aureos-text-tertiary)]"> • </span>
            <button className="text-sm text-[var(--aureos-primary)]">
              Política de Privacidade
            </button>
            <span className="text-[var(--aureos-text-tertiary)]"> • </span>
            <button className="text-sm text-[var(--aureos-primary)]">
              Suporte
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

// Seção Conta
function SecaoConta({ onBack }: { onBack: () => void }) {
  const { state, dispatch } = useApp();
  const [nome, setNome] = useState(state.usuario.nome);
  
  return (
    <>
      <header className="bg-[var(--aureos-surface)] border-b border-[var(--aureos-border)] px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-[var(--aureos-divider)] flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-[var(--aureos-text-primary)]" />
          </button>
          <h1 className="text-xl font-bold text-[var(--aureos-text-primary)]">Conta</h1>
        </div>
      </header>
      
      <div className="p-4 space-y-4">
        <Card className="p-4 space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Nome</Label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--aureos-text-tertiary)]" />
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className="h-12 pl-12 rounded-xl"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">Moeda padrão</Label>
            <Select 
              value={state.usuario.moedaPadrao} 
              onValueChange={(v) => dispatch({ type: 'SET_USUARIO', payload: { moedaPadrao: v } })}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MOEDAS.map(m => (
                  <SelectItem key={m.codigo} value={m.codigo}>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>{m.nome} ({m.simbolo})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm font-medium mb-2 block">Idioma</Label>
            <Select 
              value={state.usuario.idioma} 
              onValueChange={(v) => dispatch({ type: 'SET_USUARIO', payload: { idioma: v } })}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {IDIOMAS.map(i => (
                  <SelectItem key={i.codigo} value={i.codigo}>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>{i.nome}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>
        
        <Button 
          onClick={() => {
            dispatch({ type: 'SET_USUARIO', payload: { nome } });
            onBack();
          }}
          className="w-full h-12 rounded-xl bg-[var(--aureos-primary)]"
        >
          Salvar Alterações
        </Button>
      </div>
    </>
  );
}

// Seção Notificações
function SecaoNotificacoes({ onBack }: { onBack: () => void }) {
  const { state, dispatch } = useApp();
  
  return (
    <>
      <header className="bg-[var(--aureos-surface)] border-b border-[var(--aureos-border)] px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-[var(--aureos-divider)] flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-[var(--aureos-text-primary)]" />
          </button>
          <h1 className="text-xl font-bold text-[var(--aureos-text-primary)]">Notificações</h1>
        </div>
      </header>
      
      <div className="p-4 space-y-4">
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[var(--aureos-text-primary)]">Lembretes de contas</p>
              <p className="text-xs text-[var(--aureos-text-secondary)]">
                Receber alertas antes do vencimento
              </p>
            </div>
            <Switch
              checked={state.usuario.notificacoes.lembretesContas}
              onCheckedChange={(v) => dispatch({ 
                type: 'SET_USUARIO', 
                payload: { 
                  notificacoes: { ...state.usuario.notificacoes, lembretesContas: v } 
                } 
              })}
            />
          </div>
          
          {state.usuario.notificacoes.lembretesContas && (
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Dias antes do vencimento: {state.usuario.notificacoes.diasAntesLembrete}
              </Label>
              <Slider
                value={[state.usuario.notificacoes.diasAntesLembrete]}
                onValueChange={(v) => dispatch({ 
                  type: 'SET_USUARIO', 
                  payload: { 
                    notificacoes: { ...state.usuario.notificacoes, diasAntesLembrete: v[0] } 
                  } 
                })}
                min={1}
                max={7}
                step={1}
              />
            </div>
          )}
        </Card>
        
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[var(--aureos-text-primary)]">Alertas de orçamento</p>
              <p className="text-xs text-[var(--aureos-text-secondary)]">
                Avisar quando atingir limite
              </p>
            </div>
            <Switch
              checked={state.usuario.notificacoes.alertasOrcamento}
              onCheckedChange={(v) => dispatch({ 
                type: 'SET_USUARIO', 
                payload: { 
                  notificacoes: { ...state.usuario.notificacoes, alertasOrcamento: v } 
                } 
              })}
            />
          </div>
          
          {state.usuario.notificacoes.alertasOrcamento && (
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Alertar ao atingir: {state.usuario.notificacoes.percentualAlertaOrcamento}%
              </Label>
              <Slider
                value={[state.usuario.notificacoes.percentualAlertaOrcamento]}
                onValueChange={(v) => dispatch({ 
                  type: 'SET_USUARIO', 
                  payload: { 
                    notificacoes: { ...state.usuario.notificacoes, percentualAlertaOrcamento: v[0] } 
                  } 
                })}
                min={50}
                max={100}
                step={5}
              />
            </div>
          )}
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[var(--aureos-text-primary)]">Sons</p>
              <p className="text-xs text-[var(--aureos-text-secondary)]">
                Tocar som nas notificações
              </p>
            </div>
            <Switch
              checked={state.usuario.notificacoes.som}
              onCheckedChange={(v) => dispatch({ 
                type: 'SET_USUARIO', 
                payload: { 
                  notificacoes: { ...state.usuario.notificacoes, som: v } 
                } 
              })}
            />
          </div>
        </Card>
      </div>
    </>
  );
}

// Seção Aparência
function SecaoAparencia({ onBack }: { onBack: () => void }) {
  const { state, dispatch } = useApp();
  
  return (
    <>
      <header className="bg-[var(--aureos-surface)] border-b border-[var(--aureos-border)] px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-[var(--aureos-divider)] flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-[var(--aureos-text-primary)]" />
          </button>
          <h1 className="text-xl font-bold text-[var(--aureos-text-primary)]">Aparência</h1>
        </div>
      </header>
      
      <div className="p-4 space-y-4">
        <Card className="p-4">
          <Label className="text-sm font-medium mb-4 block">Tema</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'claro', label: 'Claro', icon: Sun },
              { id: 'escuro', label: 'Escuro', icon: Moon },
              { id: 'sistema', label: 'Sistema', icon: Smartphone },
            ].map(tema => (
              <button
                key={tema.id}
                onClick={() => dispatch({ type: 'SET_USUARIO', payload: { tema: tema.id as any } })}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                  state.usuario.tema === tema.id
                    ? 'border-[var(--aureos-primary)] bg-[var(--aureos-primary)]/10'
                    : 'border-[var(--aureos-border)]'
                }`}
              >
                <tema.icon className="w-6 h-6" />
                <span className="text-sm font-medium">{tema.label}</span>
              </button>
            ))}
          </div>
        </Card>
        
        <Card className="p-4">
          <Label className="text-sm font-medium mb-4 block">Tamanho da fonte</Label>
          <div className="flex gap-3">
            {[
              { id: 'pequeno', label: 'A' },
              { id: 'normal', label: 'AA' },
              { id: 'grande', label: 'AAA' },
            ].map(tamanho => (
              <button
                key={tamanho.id}
                onClick={() => dispatch({ type: 'SET_USUARIO', payload: { tamanhoFonte: tamanho.id as any } })}
                className={`flex-1 py-3 rounded-xl border transition-all ${
                  state.usuario.tamanhoFonte === tamanho.id
                    ? 'border-[var(--aureos-primary)] bg-[var(--aureos-primary)]/10'
                    : 'border-[var(--aureos-border)]'
                }`}
              >
                <span className={`font-medium ${
                  tamanho.id === 'pequeno' ? 'text-sm' :
                  tamanho.id === 'normal' ? 'text-base' :
                  'text-lg'
                }`}>
                  {tamanho.label}
                </span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

// Seção Segurança
function SecaoSeguranca({ onBack }: { onBack: () => void }) {
  const { state, dispatch } = useApp();
  
  return (
    <>
      <header className="bg-[var(--aureos-surface)] border-b border-[var(--aureos-border)] px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-[var(--aureos-divider)] flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-[var(--aureos-text-primary)]" />
          </button>
          <h1 className="text-xl font-bold text-[var(--aureos-text-primary)]">Segurança</h1>
        </div>
      </header>
      
      <div className="p-4 space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--aureos-primary)]/10 flex items-center justify-center">
                <Fingerprint className="w-5 h-5 text-[var(--aureos-primary)]" />
              </div>
              <div>
                <p className="font-medium text-[var(--aureos-text-primary)]">Biometria</p>
                <p className="text-xs text-[var(--aureos-text-secondary)]">
                  Desbloquear com digital/face
                </p>
              </div>
            </div>
            <Switch
              checked={state.usuario.biometria}
              onCheckedChange={(v) => dispatch({ type: 'SET_USUARIO', payload: { biometria: v } })}
            />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium text-[var(--aureos-text-primary)]">Senha de acesso</p>
                <p className="text-xs text-[var(--aureos-text-secondary)]">
                  PIN para abrir o app
                </p>
              </div>
            </div>
            <Switch
              checked={state.usuario.senhaAcesso}
              onCheckedChange={(v) => dispatch({ type: 'SET_USUARIO', payload: { senhaAcesso: v } })}
            />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                {state.saldosOcultos ? (
                  <EyeOff className="w-5 h-5 text-green-500" />
                ) : (
                  <Eye className="w-5 h-5 text-green-500" />
                )}
              </div>
              <div>
                <p className="font-medium text-[var(--aureos-text-primary)]">Ocultar saldos</p>
                <p className="text-xs text-[var(--aureos-text-secondary)]">
                  Toque para revelar valores
                </p>
              </div>
            </div>
            <Switch
              checked={state.saldosOcultos}
              onCheckedChange={() => dispatch({ type: 'TOGGLE_SALDOS_OCULTOS' })}
            />
          </div>
        </Card>
      </div>
    </>
  );
}

// Seção Backup
function SecaoBackup({ onBack }: { onBack: () => void }) {
  const { state, dispatch } = useApp();
  
  return (
    <>
      <header className="bg-[var(--aureos-surface)] border-b border-[var(--aureos-border)] px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 rounded-xl bg-[var(--aureos-divider)] flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-[var(--aureos-text-primary)]" />
          </button>
          <h1 className="text-xl font-bold text-[var(--aureos-text-primary)]">Backup</h1>
        </div>
      </header>
      
      <div className="p-4 space-y-4">
        <Card className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <Cloud className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="font-semibold text-[var(--aureos-text-primary)] mb-1">
            Backup na Nuvem
          </h3>
          <p className="text-sm text-[var(--aureos-text-secondary)] mb-4">
            Status: <span className="text-green-500 font-medium">Sincronizado</span>
          </p>
          <p className="text-xs text-[var(--aureos-text-tertiary)] mb-4">
            Último backup: Hoje, {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
          <Button className="w-full bg-[var(--aureos-primary)]">
            Sincronizar Agora
          </Button>
        </Card>
        
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[var(--aureos-text-primary)]">Backup automático</p>
              <p className="text-xs text-[var(--aureos-text-secondary)]">
                Sincronizar automaticamente
              </p>
            </div>
            <Switch
              checked={state.usuario.backupAutomatico}
              onCheckedChange={(v) => dispatch({ type: 'SET_USUARIO', payload: { backupAutomatico: v } })}
            />
          </div>
          
          {state.usuario.backupAutomatico && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Frequência</Label>
              <Select 
                value={state.usuario.frequenciaBackup} 
                onValueChange={(v) => dispatch({ type: 'SET_USUARIO', payload: { frequenciaBackup: v as any } })}
              >
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">Diário</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </Card>
        
        <Card className="p-4">
          <p className="text-sm font-medium text-[var(--aureos-text-primary)] mb-4">
            Modo Avançado
          </p>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--aureos-divider)] hover:bg-[var(--aureos-border)] transition-colors">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-[var(--aureos-text-secondary)]" />
                <span className="text-sm">Exportar dados (CSV)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--aureos-text-tertiary)]" />
            </button>
            <button className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--aureos-divider)] hover:bg-[var(--aureos-border)] transition-colors">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-[var(--aureos-text-secondary)]" />
                <span className="text-sm">Importar dados</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--aureos-text-tertiary)]" />
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}
