"use client";

import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { 
  Carteira, 
  Transacao, 
  ContaPagar, 
  Orcamento, 
  Categoria, 
  Beneficiario, 
  Usuario, 
  Assinatura,
  DashboardWidget,
  View,
  Autocategorizacao
} from '@/types';
import { CATEGORIAS_PADRAO } from '@/types';

// Estado inicial
interface AppState {
  // Fluxo
  view: View;
  onboardingStep: number;
  mostrarMenu: boolean;
  
  // Dados do usuário
  usuario: Usuario;
  assinatura: Assinatura;
  
  // Dados financeiros
  carteiras: Carteira[];
  transacoes: Transacao[];
  contasPagar: ContaPagar[];
  orcamentos: Orcamento[];
  categorias: Categoria[];
  beneficiarios: Beneficiario[];
  
  // Configurações de UI
  widgets: DashboardWidget[];
  saldosOcultos: boolean;
  
  // Autocategorização
  autocategorizacoes: Autocategorizacao[];
  
  // Dados de exemplo (sandbox)
  mostrarExemplos: boolean;
}

const initialState: AppState = {
  view: 'onboarding',
  onboardingStep: 0,
  mostrarMenu: false,
  
  usuario: {
    nome: '',
    moedaPadrao: 'BRL',
    idioma: 'pt-BR',
    tema: 'sistema',
    tamanhoFonte: 'normal',
    biometria: false,
    senhaAcesso: false,
    ocultarSaldos: false,
    backupAutomatico: true,
    frequenciaBackup: 'diario',
    notificacoes: {
      lembretesContas: true,
      diasAntesLembrete: 3,
      alertasOrcamento: true,
      percentualAlertaOrcamento: 80,
      som: true,
      horario: '08:00'
    }
  },
  
  assinatura: {
    plano: 'gratuito',
    trialAtivo: false,
    diasTrialRestantes: 0
  },
  
  carteiras: [],
  transacoes: [],
  contasPagar: [],
  orcamentos: [],
  categorias: CATEGORIAS_PADRAO,
  beneficiarios: [],
  
  widgets: [
    { id: '1', tipo: 'carteiras', visivel: true, ordem: 1 },
    { id: '2', tipo: 'orcamentos', visivel: true, ordem: 2 },
    { id: '3', tipo: 'transacoes', visivel: true, ordem: 3 },
    { id: '4', tipo: 'contasPagar', visivel: true, ordem: 4 },
    { id: '5', tipo: 'gastosCategoria', visivel: true, ordem: 5 }
  ],
  
  saldosOcultos: false,
  
  autocategorizacoes: [
    { termo: 'starbucks', categoriaId: 'alimentacao', frequencia: 12 },
    { termo: 'uber', categoriaId: 'transporte', frequencia: 8 },
    { termo: 'ifood', categoriaId: 'alimentacao', frequencia: 15 },
    { termo: 'mercado', categoriaId: 'alimentacao', frequencia: 20 },
    { termo: 'posto', categoriaId: 'transporte', frequencia: 6 },
    { termo: 'farmacia', categoriaId: 'saude', frequencia: 5 },
    { termo: 'netflix', categoriaId: 'lazer', frequencia: 10 },
    { termo: 'spotify', categoriaId: 'lazer', frequencia: 8 },
    { termo: 'salario', categoriaId: 'salario', frequencia: 12 },
  ],
  
  mostrarExemplos: true
};

// Actions
type Action =
  | { type: 'SET_VIEW'; payload: View }
  | { type: 'SET_ONBOARDING_STEP'; payload: number }
  | { type: 'TOGGLE_MENU' }
  | { type: 'CLOSE_MENU' }
  | { type: 'SET_USUARIO'; payload: Partial<Usuario> }
  | { type: 'SET_ASSINATURA'; payload: Partial<Assinatura> }
  | { type: 'ADD_CARTEIRA'; payload: Carteira }
  | { type: 'UPDATE_CARTEIRA'; payload: Carteira }
  | { type: 'DELETE_CARTEIRA'; payload: string }
  | { type: 'ADD_TRANSACAO'; payload: Transacao }
  | { type: 'UPDATE_TRANSACAO'; payload: Transacao }
  | { type: 'DELETE_TRANSACAO'; payload: string }
  | { type: 'ADD_CONTA_PAGAR'; payload: ContaPagar }
  | { type: 'UPDATE_CONTA_PAGAR'; payload: ContaPagar }
  | { type: 'DELETE_CONTA_PAGAR'; payload: string }
  | { type: 'ADD_ORCAMENTO'; payload: Orcamento }
  | { type: 'UPDATE_ORCAMENTO'; payload: Orcamento }
  | { type: 'DELETE_ORCAMENTO'; payload: string }
  | { type: 'ADD_CATEGORIA'; payload: Categoria }
  | { type: 'ADD_BENEFICIARIO'; payload: Beneficiario }
  | { type: 'TOGGLE_SALDOS_OCULTOS' }
  | { type: 'SET_MOSTRAR_EXEMPLOS'; payload: boolean }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'LOAD_STATE'; payload: AppState };

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload, mostrarMenu: false };
    case 'SET_ONBOARDING_STEP':
      return { ...state, onboardingStep: action.payload };
    case 'TOGGLE_MENU':
      return { ...state, mostrarMenu: !state.mostrarMenu };
    case 'CLOSE_MENU':
      return { ...state, mostrarMenu: false };
    case 'SET_USUARIO':
      return { ...state, usuario: { ...state.usuario, ...action.payload } };
    case 'SET_ASSINATURA':
      return { ...state, assinatura: { ...state.assinatura, ...action.payload } };
    case 'ADD_CARTEIRA':
      return { ...state, carteiras: [...state.carteiras, action.payload] };
    case 'UPDATE_CARTEIRA':
      return { 
        ...state, 
        carteiras: state.carteiras.map(c => c.id === action.payload.id ? action.payload : c) 
      };
    case 'DELETE_CARTEIRA':
      return { 
        ...state, 
        carteiras: state.carteiras.filter(c => c.id !== action.payload) 
      };
    case 'ADD_TRANSACAO':
      return { ...state, transacoes: [action.payload, ...state.transacoes] };
    case 'UPDATE_TRANSACAO':
      return { 
        ...state, 
        transacoes: state.transacoes.map(t => t.id === action.payload.id ? action.payload : t) 
      };
    case 'DELETE_TRANSACAO':
      return { 
        ...state, 
        transacoes: state.transacoes.filter(t => t.id !== action.payload) 
      };
    case 'ADD_CONTA_PAGAR':
      return { ...state, contasPagar: [...state.contasPagar, action.payload] };
    case 'UPDATE_CONTA_PAGAR':
      return { 
        ...state, 
        contasPagar: state.contasPagar.map(c => c.id === action.payload.id ? action.payload : c) 
      };
    case 'DELETE_CONTA_PAGAR':
      return { 
        ...state, 
        contasPagar: state.contasPagar.filter(c => c.id !== action.payload) 
      };
    case 'ADD_ORCAMENTO':
      return { ...state, orcamentos: [...state.orcamentos, action.payload] };
    case 'UPDATE_ORCAMENTO':
      return { 
        ...state, 
        orcamentos: state.orcamentos.map(o => o.id === action.payload.id ? action.payload : o) 
      };
    case 'DELETE_ORCAMENTO':
      return { 
        ...state, 
        orcamentos: state.orcamentos.filter(o => o.id !== action.payload) 
      };
    case 'ADD_CATEGORIA':
      return { ...state, categorias: [...state.categorias, action.payload] };
    case 'ADD_BENEFICIARIO':
      return { ...state, beneficiarios: [...state.beneficiarios, action.payload] };
    case 'TOGGLE_SALDOS_OCULTOS':
      return { ...state, saldosOcultos: !state.saldosOcultos };
    case 'SET_MOSTRAR_EXEMPLOS':
      return { ...state, mostrarExemplos: action.payload };
    case 'COMPLETE_ONBOARDING':
      return { ...state, view: 'dashboard', onboardingStep: 3 };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  // Helpers
  getSaldoTotal: () => number;
  getTransacoesMes: (mes?: number, ano?: number) => Transacao[];
  getGastosPorCategoria: (mes?: number, ano?: number) => { categoria: Categoria; valor: number }[];
  getProgressoOrcamento: (orcamentoId: string) => { usado: number; limite: number; percentual: number };
  getContasVencidas: () => ContaPagar[];
  getContasAVencer: () => ContaPagar[];
  sugerirCategoria: (descricao: string) => Categoria | null;
  formatarMoeda: (valor: number) => string;
  podeCriarCarteira: () => boolean;
  podeUsarRelatorioAvancado: () => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Persistir no localStorage
  useEffect(() => {
    const saved = localStorage.getItem('aureos-data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: { ...initialState, ...parsed, view: parsed.view || 'onboarding' } });
      } catch (e) {
        console.error('Erro ao carregar dados:', e);
      }
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('aureos-data', JSON.stringify(state));
  }, [state]);
  
  // Helpers
  const getSaldoTotal = () => {
    return state.carteiras.reduce((total, carteira) => total + carteira.saldo, 0);
  };
  
  const getTransacoesMes = (mes = new Date().getMonth(), ano = new Date().getFullYear()) => {
    return state.transacoes.filter(t => {
      const data = new Date(t.data);
      return data.getMonth() === mes && data.getFullYear() === ano;
    });
  };
  
  const getGastosPorCategoria = (mes = new Date().getMonth(), ano = new Date().getFullYear()) => {
    const transacoesMes = getTransacoesMes(mes, ano).filter(t => t.tipo === 'despesa');
    const gastosPorCategoria: Record<string, number> = {};
    
    transacoesMes.forEach(t => {
      gastosPorCategoria[t.categoriaId] = (gastosPorCategoria[t.categoriaId] || 0) + t.valor;
    });
    
    return Object.entries(gastosPorCategoria)
      .map(([categoriaId, valor]) => ({
        categoria: state.categorias.find(c => c.id === categoriaId) || state.categorias[9],
        valor
      }))
      .sort((a, b) => b.valor - a.valor);
  };
  
  const getProgressoOrcamento = (orcamentoId: string) => {
    const orcamento = state.orcamentos.find(o => o.id === orcamentoId);
    if (!orcamento) return { usado: 0, limite: 0, percentual: 0 };
    
    const transacoesMes = getTransacoesMes().filter(t => 
      t.tipo === 'despesa' && t.categoriaId === orcamento.categoriaId
    );
    
    const usado = transacoesMes.reduce((total, t) => total + t.valor, 0);
    const percentual = Math.min((usado / orcamento.valorLimite) * 100, 100);
    
    return { usado, limite: orcamento.valorLimite, percentual };
  };
  
  const getContasVencidas = () => {
    const hoje = new Date();
    return state.contasPagar.filter(c => 
      c.situacao === 'pendente' && new Date(c.dataVencimento) < hoje
    );
  };
  
  const getContasAVencer = () => {
    const hoje = new Date();
    const proximaSemana = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
    return state.contasPagar.filter(c => 
      c.situacao === 'pendente' && 
      new Date(c.dataVencimento) >= hoje && 
      new Date(c.dataVencimento) <= proximaSemana
    );
  };
  
  const sugerirCategoria = (descricao: string) => {
    const termo = descricao.toLowerCase().trim();
    const sugestao = state.autocategorizacoes.find(a => termo.includes(a.termo));
    if (sugestao) {
      return state.categorias.find(c => c.id === sugestao.categoriaId) || null;
    }
    return null;
  };
  
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: state.usuario.moedaPadrao
    }).format(valor);
  };
  
  const podeCriarCarteira = () => {
    if (state.assinatura.plano === 'premium') return true;
    return state.carteiras.length < 3;
  };
  
  const podeUsarRelatorioAvancado = () => {
    return state.assinatura.plano === 'premium' || state.assinatura.trialAtivo;
  };
  
  return (
    <AppContext.Provider value={{
      state,
      dispatch,
      getSaldoTotal,
      getTransacoesMes,
      getGastosPorCategoria,
      getProgressoOrcamento,
      getContasVencidas,
      getContasAVencer,
      sugerirCategoria,
      formatarMoeda,
      podeCriarCarteira,
      podeUsarRelatorioAvancado
    }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
}
