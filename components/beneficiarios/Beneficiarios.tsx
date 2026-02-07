import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Users, Search, Store } from 'lucide-react';
import { useState } from 'react';

export function Beneficiarios() {
  const { state, dispatch } = useApp();
  const [busca, setBusca] = useState('');
  
  const beneficiariosFiltrados = state.beneficiarios
    .filter(b => b.nome.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => b.frequenciaUso - a.frequenciaUso);
  
  // Extrair beneficiários das transações
  const beneficiariosDasTransacoes = state.transacoes
    .filter(t => t.beneficiario)
    .map(t => t.beneficiario!)
    .filter((value, index, self) => self.indexOf(value) === index);
  
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
            Beneficiários
          </h1>
        </div>
      </header>
      
      <div className="p-4 space-y-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--aureos-text-tertiary)]" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar beneficiário..."
            className="h-12 pl-12 rounded-xl"
          />
        </div>
        
        {/* Lista */}
        {beneficiariosFiltrados.length === 0 && beneficiariosDasTransacoes.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-2">
            {/* Beneficiários cadastrados */}
            {beneficiariosFiltrados.map(beneficiario => {
              const categoria = state.categorias.find(c => c.id === beneficiario.categoriaPadraoId);
              
              return (
                <Card key={beneficiario.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--aureos-primary)]/10 flex items-center justify-center">
                      <Store className="w-5 h-5 text-[var(--aureos-primary)]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[var(--aureos-text-primary)]">
                        {beneficiario.nome}
                      </p>
                      {categoria && (
                        <p className="text-xs text-[var(--aureos-text-secondary)]">
                          Categoria: {categoria.nome}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[var(--aureos-text-tertiary)]">
                        {beneficiario.frequenciaUso} usos
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
            
            {/* Beneficiários das transações */}
            {beneficiariosDasTransacoes
              .filter(b => !beneficiariosFiltrados.some(bf => bf.nome.toLowerCase() === b.toLowerCase()))
              .map((beneficiario, index) => (
                <Card key={`transacao-${index}`} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--aureos-divider)] flex items-center justify-center">
                      <Store className="w-5 h-5 text-[var(--aureos-text-tertiary)]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[var(--aureos-text-primary)]">
                        {beneficiario}
                      </p>
                      <p className="text-xs text-[var(--aureos-text-secondary)]">
                        Detectado automaticamente
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="p-8 text-center border-dashed border-2">
      <div className="w-20 h-20 rounded-full bg-[var(--aureos-divider)] flex items-center justify-center mx-auto mb-4">
        <Users className="w-10 h-10 text-[var(--aureos-text-tertiary)]" />
      </div>
      <h3 className="text-lg font-medium text-[var(--aureos-text-primary)] mb-2">
        Nenhum beneficiário
      </h3>
      <p className="text-sm text-[var(--aureos-text-secondary)]">
        Os beneficiários são detectados automaticamente quando você adiciona transações
      </p>
    </Card>
  );
}
