// Tipos do Aureos - Sistema Financeiro Premium

export interface Carteira {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  saldo: number;
  moeda: string;
  ehPadrao: boolean;
  ocultarSaldo: boolean;
}

export interface Categoria {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  tipo: 'despesa' | 'renda';
  subcategorias?: string[];
}

export interface Transacao {
  id: string;
  tipo: 'despesa' | 'renda' | 'transferencia';
  valor: number;
  descricao: string;
  categoriaId: string;
  carteiraId: string;
  carteiraDestinoId?: string;
  data: string;
  situacao: 'concluida' | 'pendente';
  beneficiario?: string;
  notas?: string;
  ehRecorrente: boolean;
  frequencia?: 'diaria' | 'semanal' | 'mensal' | 'anual';
}

export interface ContaPagar {
  id: string;
  descricao: string;
  valor: number;
  dataVencimento: string;
  categoriaId: string;
  carteiraId: string;
  situacao: 'pendente' | 'paga' | 'vencida';
  notificacaoDias: number;
  notas?: string;
}

export interface Orcamento {
  id: string;
  categoriaId: string;
  valorLimite: number;
  periodo: 'mensal' | 'semanal' | 'anual';
  alertaPercentual: number;
}

export interface Beneficiario {
  id: string;
  nome: string;
  categoriaPadraoId?: string;
  frequenciaUso: number;
}

export interface Usuario {
  nome: string;
  email?: string;
  moedaPadrao: string;
  idioma: string;
  tema: 'claro' | 'escuro' | 'sistema';
  tamanhoFonte: 'pequeno' | 'normal' | 'grande';
  biometria: boolean;
  senhaAcesso: boolean;
  ocultarSaldos: boolean;
  backupAutomatico: boolean;
  frequenciaBackup: 'diario' | 'semanal' | 'mensal';
  notificacoes: {
    lembretesContas: boolean;
    diasAntesLembrete: number;
    alertasOrcamento: boolean;
    percentualAlertaOrcamento: number;
    som: boolean;
    horario: string;
  };
}

export interface Assinatura {
  plano: 'gratuito' | 'premium';
  dataInicio?: string;
  dataExpiracao?: string;
  trialAtivo: boolean;
  diasTrialRestantes: number;
}

export interface DashboardWidget {
  id: string;
  tipo: 'carteiras' | 'transacoes' | 'orcamentos' | 'contasPagar' | 'alertas' | 'gastosCategoria';
  visivel: boolean;
  ordem: number;
}

export type View = 
  | 'onboarding' 
  | 'dashboard' 
  | 'transacoes' 
  | 'orcamentos' 
  | 'relatorios' 
  | 'contasPagar' 
  | 'configuracoes' 
  | 'assinatura'
  | 'novaTransacao'
  | 'novaContaPagar'
  | 'novoOrcamento'
  | 'carteiras'
  | 'categorias'
  | 'beneficiarios';

export interface Autocategorizacao {
  termo: string;
  categoriaId: string;
  frequencia: number;
}

export const CORES_CATEGORIA = [
  '#EF4444', '#F97316', '#F59E0B', '#84CC16', '#10B981',
  '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#D946EF',
  '#F43F5E', '#78716C', '#64748B'
];

export const ICONES_CARTEIRA = [
  'wallet', 'landmark', 'credit-card', 'piggy-bank', 'banknote',
  'coins', 'circle-dollar-sign', 'bitcoin', 'euro', 'pound-sterling'
];

export const CATEGORIAS_PADRAO: Categoria[] = [
  { id: 'moradia', nome: 'Moradia', icone: 'home', cor: '#3B82F6', tipo: 'despesa', subcategorias: ['Aluguel', 'Condomínio', 'IPTU'] },
  { id: 'alimentacao', nome: 'Alimentação', icone: 'utensils', cor: '#F97316', tipo: 'despesa', subcategorias: ['Mercado', 'Restaurante', 'Lanche'] },
  { id: 'transporte', nome: 'Transporte', icone: 'car', cor: '#10B981', tipo: 'despesa', subcategorias: ['Combustível', 'Ônibus', 'Uber'] },
  { id: 'servicos', nome: 'Serviços', icone: 'zap', cor: '#F59E0B', tipo: 'despesa', subcategorias: ['Luz', 'Água', 'Internet', 'Celular'] },
  { id: 'lazer', nome: 'Lazer', icone: 'gamepad-2', cor: '#D946EF', tipo: 'despesa', subcategorias: ['Cinema', 'Viagem', 'Hobbies'] },
  { id: 'saude', nome: 'Saúde', icone: 'heart-pulse', cor: '#EF4444', tipo: 'despesa', subcategorias: ['Médico', 'Remédio', 'Plano'] },
  { id: 'compras', nome: 'Compras', icone: 'shopping-bag', cor: '#8B5CF6', tipo: 'despesa', subcategorias: ['Roupas', 'Eletrônicos', 'Presentes'] },
  { id: 'educacao', nome: 'Educação', icone: 'graduation-cap', cor: '#06B6D4', tipo: 'despesa', subcategorias: ['Curso', 'Livros', 'Material'] },
  { id: 'financeiro', nome: 'Financeiro', icone: 'trending-up', cor: '#84CC16', tipo: 'despesa', subcategorias: ['Investimento', 'Imposto', 'Taxas'] },
  { id: 'outros', nome: 'Outros', icone: 'more-horizontal', cor: '#78716C', tipo: 'despesa' },
  { id: 'salario', nome: 'Salário', icone: 'banknote', cor: '#10B981', tipo: 'renda' },
  { id: 'freelance', nome: 'Freelance', icone: 'laptop', cor: '#3B82F6', tipo: 'renda' },
  { id: 'investimentos', nome: 'Investimentos', icone: 'trending-up', cor: '#F59E0B', tipo: 'renda' },
  { id: 'presentes', nome: 'Presentes', icone: 'gift', cor: '#D946EF', tipo: 'renda' },
  { id: 'outras-rendas', nome: 'Outras Rendas', icone: 'plus-circle', cor: '#64748B', tipo: 'renda' },
];
