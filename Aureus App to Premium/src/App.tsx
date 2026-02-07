import { AppProvider, useApp } from '@/context/AppContext';
import { Onboarding } from '@/components/onboarding/Onboarding';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { MenuLateral } from '@/components/ui-custom/MenuLateral';
import { NovaTransacao } from '@/components/transacoes/NovaTransacao';
import { Transacoes } from '@/components/transacoes/Transacoes';
import { Orcamentos } from '@/components/orcamentos/Orcamentos';
import { Relatorios } from '@/components/relatorios/Relatorios';
import { ContasPagar } from '@/components/contas-pagar/ContasPagar';
import { Configuracoes } from '@/components/configuracoes/Configuracoes';
import { Assinatura } from '@/components/assinatura/Assinatura';
import { Carteiras } from '@/components/carteiras/Carteiras';
import { Categorias } from '@/components/categorias/Categorias';
import { Beneficiarios } from '@/components/beneficiarios/Beneficiarios';
import { Toaster } from '@/components/ui/sonner';

function AppContent() {
  const { state } = useApp();
  
  const renderView = () => {
    switch (state.view) {
      case 'onboarding':
        return <Onboarding />;
      case 'dashboard':
        return <Dashboard />;
      case 'novaTransacao':
        return <NovaTransacao />;
      case 'transacoes':
        return <Transacoes />;
      case 'orcamentos':
        return <Orcamentos />;
      case 'relatorios':
        return <Relatorios />;
      case 'contasPagar':
        return <ContasPagar />;
      case 'configuracoes':
        return <Configuracoes />;
      case 'assinatura':
        return <Assinatura />;
      case 'carteiras':
        return <Carteiras />;
      case 'categorias':
        return <Categorias />;
      case 'beneficiarios':
        return <Beneficiarios />;
      default:
        return <Dashboard />;
    }
  };
  
  return (
    <div className="min-h-screen bg-[var(--aureos-bg)]">
      {renderView()}
      <MenuLateral />
      <Toaster position="top-center" />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
