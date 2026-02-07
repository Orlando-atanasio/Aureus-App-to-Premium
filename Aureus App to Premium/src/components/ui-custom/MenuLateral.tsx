import { useApp } from '@/context/AppContext';
import { 
  LayoutDashboard, 
  Receipt, 
  PieChart, 
  FileText, 
  Bell, 
  Settings, 
  Crown,
  X,
  Wallet,
  Tag,
  Users
} from 'lucide-react';
import type { View } from '@/types';

interface MenuItem {
  id: View;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const MENU_PRINCIPAL: MenuItem[] = [
  { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
  { id: 'transacoes', label: 'Transações', icon: Receipt },
  { id: 'orcamentos', label: 'Orçamentos', icon: PieChart },
  { id: 'relatorios', label: 'Relatórios', icon: FileText },
  { id: 'contasPagar', label: 'Contas a Pagar', icon: Bell },
];

const MENU_CONFIG: MenuItem[] = [
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
  { id: 'assinatura', label: 'Assinatura PRO', icon: Crown, badge: 'PRO' },
];

export function MenuLateral() {
  const { state, dispatch } = useApp();
  
  const handleNavigate = (view: View) => {
    dispatch({ type: 'SET_VIEW', payload: view });
    dispatch({ type: 'CLOSE_MENU' });
  };
  
  if (!state.mostrarMenu) return null;
  
  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 aureos-fade-in"
        onClick={() => dispatch({ type: 'CLOSE_MENU' })}
      />
      
      {/* Menu */}
      <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-[var(--aureos-surface)] z-50 aureos-slide-in-right shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[var(--aureos-border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-[var(--aureos-text-primary)]">Aureos</h1>
                {state.assinatura.plano === 'premium' && (
                  <span className="text-[10px] bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full font-medium">
                    PREMIUM
                  </span>
                )}
              </div>
            </div>
            <button 
              onClick={() => dispatch({ type: 'CLOSE_MENU' })}
              className="w-8 h-8 rounded-lg hover:bg-[var(--aureos-divider)] flex items-center justify-center"
            >
              <X className="w-5 h-5 text-[var(--aureos-text-secondary)]" />
            </button>
          </div>
        </div>
        
        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Menu Principal */}
          <div className="px-3 mb-6">
            <p className="text-xs font-medium text-[var(--aureos-text-tertiary)] uppercase tracking-wider px-3 mb-2">
              Principal
            </p>
            <nav className="space-y-1">
              {MENU_PRINCIPAL.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    state.view === item.id
                      ? 'bg-[var(--aureos-primary)]/10 text-[var(--aureos-primary)]'
                      : 'text-[var(--aureos-text-secondary)] hover:bg-[var(--aureos-divider)] hover:text-[var(--aureos-text-primary)]'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
          
          {/* Configurações */}
          <div className="px-3 mb-6">
            <p className="text-xs font-medium text-[var(--aureos-text-tertiary)] uppercase tracking-wider px-3 mb-2">
              Configurações
            </p>
            <nav className="space-y-1">
              <button
                onClick={() => handleNavigate('carteiras')}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[var(--aureos-text-secondary)] hover:bg-[var(--aureos-divider)] hover:text-[var(--aureos-text-primary)] transition-all"
              >
                <Wallet className="w-5 h-5" />
                <span className="font-medium">Carteiras</span>
              </button>
              <button
                onClick={() => handleNavigate('categorias')}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[var(--aureos-text-secondary)] hover:bg-[var(--aureos-divider)] hover:text-[var(--aureos-text-primary)] transition-all"
              >
                <Tag className="w-5 h-5" />
                <span className="font-medium">Categorias</span>
              </button>
              <button
                onClick={() => handleNavigate('beneficiarios')}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[var(--aureos-text-secondary)] hover:bg-[var(--aureos-divider)] hover:text-[var(--aureos-text-primary)] transition-all"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Beneficiários</span>
              </button>
            </nav>
          </div>
          
          {/* Sistema */}
          <div className="px-3">
            <p className="text-xs font-medium text-[var(--aureos-text-tertiary)] uppercase tracking-wider px-3 mb-2">
              Sistema
            </p>
            <nav className="space-y-1">
              {MENU_CONFIG.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    state.view === item.id
                      ? 'bg-[var(--aureos-primary)]/10 text-[var(--aureos-primary)]'
                      : 'text-[var(--aureos-text-secondary)] hover:bg-[var(--aureos-divider)] hover:text-[var(--aureos-text-primary)]'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-0.5 rounded-full font-medium">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-[var(--aureos-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--aureos-divider)] flex items-center justify-center">
              <span className="font-medium text-[var(--aureos-text-primary)]">
                {state.usuario.nome ? state.usuario.nome.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-[var(--aureos-text-primary)] truncate">
                {state.usuario.nome || 'Usuário'}
              </p>
              <p className="text-xs text-[var(--aureos-text-secondary)]">
                {state.assinatura.plano === 'premium' ? 'Plano Premium' : 'Plano Gratuito'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
