import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  TrendingDown, 
  TrendingUp, 
  ArrowRightLeft,
  Calendar,
  Repeat,
  CheckCircle2,
  Clock,
  Lightbulb,
  Camera
} from 'lucide-react';
import type { Transacao } from '@/types';

interface NovaTransacaoProps {
  tipoInicial?: 'despesa' | 'renda' | 'transferencia';
}

export function NovaTransacao({ tipoInicial = 'despesa' }: NovaTransacaoProps) {
  const { state, dispatch, sugerirCategoria, formatarMoeda } = useApp();
  const [tipo, setTipo] = useState<'despesa' | 'renda' | 'transferencia'>(tipoInicial);
  
  // Campos do formulário
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [carteiraId, setCarteiraId] = useState(state.carteiras.find(c => c.ehPadrao)?.id || '');
  const [carteiraDestinoId, setCarteiraDestinoId] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [situacao, setSituacao] = useState<'concluida' | 'pendente'>('concluida');
  const [ehRecorrente, setEhRecorrente] = useState(false);
  const [frequencia, setFrequencia] = useState<string>('mensal');
  const [beneficiario, setBeneficiario] = useState('');
  const [notas, setNotas] = useState('');
  const [mostrarMaisOpcoes, setMostrarMaisOpcoes] = useState(false);
  
  // Sugestão de categoria
  const [sugestaoCategoria, setSugestaoCategoria] = useState<string | null>(null);
  
  // Autocategorização
  useEffect(() => {
    if (descricao.length >= 3 && !categoriaId) {
      const sugestao = sugerirCategoria(descricao);
      if (sugestao) {
        setSugestaoCategoria(sugestao.id);
      }
    }
  }, [descricao, categoriaId, sugerirCategoria]);
  
  const aplicarSugestao = () => {
    if (sugestaoCategoria) {
      setCategoriaId(sugestaoCategoria);
      setSugestaoCategoria(null);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!valor || !descricao || !carteiraId) return;
    if (tipo !== 'transferencia' && !categoriaId) return;
    if (tipo === 'transferencia' && !carteiraDestinoId) return;
    
    const novaTransacao: Transacao = {
      id: Date.now().toString(),
      tipo,
      valor: parseFloat(valor),
      descricao,
      categoriaId: tipo === 'transferencia' ? 'transferencia' : categoriaId,
      carteiraId,
      carteiraDestinoId: tipo === 'transferencia' ? carteiraDestinoId : undefined,
      data: new Date(data).toISOString(),
      situacao,
      beneficiario: beneficiario || undefined,
      notas: notas || undefined,
      ehRecorrente,
      frequencia: ehRecorrente ? (frequencia as 'diaria' | 'semanal' | 'mensal' | 'anual') : undefined
    };
    
    dispatch({ type: 'ADD_TRANSACAO', payload: novaTransacao });
    
    // Atualizar saldo da carteira
    const carteira = state.carteiras.find(c => c.id === carteiraId);
    if (carteira) {
      let novoSaldo = carteira.saldo;
      if (tipo === 'despesa') novoSaldo -= parseFloat(valor);
      else if (tipo === 'renda') novoSaldo += parseFloat(valor);
      
      dispatch({
        type: 'UPDATE_CARTEIRA',
        payload: { ...carteira, saldo: novoSaldo }
      });
    }
    
    // Atualizar saldo da carteira destino em transferência
    if (tipo === 'transferencia' && carteiraDestinoId) {
      const carteiraDestino = state.carteiras.find(c => c.id === carteiraDestinoId);
      if (carteiraDestino) {
        dispatch({
          type: 'UPDATE_CARTEIRA',
          payload: { ...carteiraDestino, saldo: carteiraDestino.saldo + parseFloat(valor) }
        });
      }
    }
    
    // Adicionar beneficiário se novo
    if (beneficiario && !state.beneficiarios.find(b => b.nome.toLowerCase() === beneficiario.toLowerCase())) {
      dispatch({
        type: 'ADD_BENEFICIARIO',
        payload: {
          id: Date.now().toString(),
          nome: beneficiario,
          categoriaPadraoId: categoriaId,
          frequenciaUso: 1
        }
      });
    }
    
    dispatch({ type: 'SET_VIEW', payload: 'dashboard' });
  };
  
  const categorias = state.categorias.filter(c => 
    tipo === 'despesa' ? c.tipo === 'despesa' : c.tipo === 'renda'
  );
  
  const canSubmit = () => {
    if (!valor || !descricao || !carteiraId) return false;
    if (tipo !== 'transferencia' && !categoriaId) return false;
    if (tipo === 'transferencia' && !carteiraDestinoId) return false;
    return true;
  };
  
  return (
    <div className="min-h-screen bg-[var(--aureos-bg)]">
      {/* Header */}
      <header className="bg-[var(--aureos-surface)] border-b border-[var(--aureos-border)] px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'dashboard' })}
            className="w-10 h-10 rounded-xl bg-[var(--aureos-divider)] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--aureos-text-primary)]" />
          </button>
          <h1 className="text-xl font-bold text-[var(--aureos-text-primary)]">
            Nova {tipo === 'despesa' ? 'Despesa' : tipo === 'renda' ? 'Renda' : 'Transferência'}
          </h1>
        </div>
      </header>
      
      {/* Seletor de tipo */}
      <div className="px-4 py-4">
        <div className="flex gap-2">
          <button
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
          <button
            onClick={() => setTipo('transferencia')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${
              tipo === 'transferencia'
                ? 'bg-[var(--aureos-primary)] text-white'
                : 'bg-[var(--aureos-surface)] text-[var(--aureos-text-secondary)]'
            }`}
          >
            <ArrowRightLeft className="w-5 h-5" />
            Transferir
          </button>
        </div>
      </div>
      
      {/* Formulário */}
      <form onSubmit={handleSubmit} className="px-4 pb-24 space-y-4">
        {/* Valor */}
        <Card className="p-6">
          <Label className="text-sm text-[var(--aureos-text-secondary)] mb-2 block">Valor</Label>
          <div className="relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-bold text-[var(--aureos-text-tertiary)]">
              {state.usuario.moedaPadrao === 'BRL' ? 'R$' : '$'}
            </span>
            <Input
              type="number"
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0,00"
              className="pl-12 text-4xl font-bold border-0 bg-transparent focus-visible:ring-0 p-0 h-auto"
              autoFocus
            />
          </div>
        </Card>
        
        {/* Descrição */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Descrição</Label>
          <Input
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder={tipo === 'despesa' ? 'Ex: Café, Uber, Mercado' : 'Ex: Salário, Freelance, Venda'}
            className="h-12 rounded-xl"
          />
        </div>
        
        {/* Sugestão de categoria */}
        {sugestaoCategoria && !categoriaId && (
          <div 
            className="flex items-center gap-3 p-3 rounded-xl bg-[var(--aureos-primary)]/10 border border-[var(--aureos-primary)]/30 cursor-pointer"
            onClick={aplicarSugestao}
          >
            <Lightbulb className="w-5 h-5 text-[var(--aureos-primary)]" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--aureos-primary)]">
                Sugestão detectada!
              </p>
              <p className="text-xs text-[var(--aureos-text-secondary)]">
                Clique para aplicar: {state.categorias.find(c => c.id === sugestaoCategoria)?.nome}
              </p>
            </div>
            <Button type="button" size="sm" className="bg-[var(--aureos-primary)]">
              Aplicar
            </Button>
          </div>
        )}
        
        {/* Categoria (não mostrar em transferência) */}
        {tipo !== 'transferencia' && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Categoria</Label>
            <div className="grid grid-cols-2 gap-2">
              {categorias.slice(0, 10).map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoriaId(cat.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                    categoriaId === cat.id
                      ? 'border-[var(--aureos-primary)] bg-[var(--aureos-primary)]/10'
                      : 'border-[var(--aureos-border)] hover:border-[var(--aureos-primary)]/30'
                  }`}
                >
                  <div 
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${cat.cor}20` }}
                  >
                    <span style={{ color: cat.cor }}>●</span>
                  </div>
                  <span className="text-sm font-medium truncate">{cat.nome}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Carteira */}
        <div>
          <Label className="text-sm font-medium mb-2 block">
            {tipo === 'transferencia' ? 'Da Carteira' : 'Carteira'}
          </Label>
          <Select value={carteiraId} onValueChange={setCarteiraId}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Selecione uma carteira" />
            </SelectTrigger>
            <SelectContent>
              {state.carteiras.map(c => (
                <SelectItem key={c.id} value={c.id}>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: c.cor }}
                    >
                      <span className="text-white text-xs">{c.nome.charAt(0)}</span>
                    </div>
                    <span>{c.nome}</span>
                    <span className="text-[var(--aureos-text-tertiary)]">
                      ({formatarMoeda(c.saldo)})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Carteira destino (só em transferência) */}
        {tipo === 'transferencia' && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Para a Carteira</Label>
            <Select value={carteiraDestinoId} onValueChange={setCarteiraDestinoId}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Selecione a carteira destino" />
              </SelectTrigger>
              <SelectContent>
                {state.carteiras.filter(c => c.id !== carteiraId).map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: c.cor }}
                      >
                        <span className="text-white text-xs">{c.nome.charAt(0)}</span>
                      </div>
                      <span>{c.nome}</span>
                      <span className="text-[var(--aureos-text-tertiary)]">
                        ({formatarMoeda(c.saldo)})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {/* Data */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Data</Label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--aureos-text-tertiary)]" />
            <Input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="h-12 pl-12 rounded-xl"
            />
          </div>
        </div>
        
        {/* Situação */}
        <div className="flex items-center justify-between p-4 bg-[var(--aureos-surface)] rounded-xl border border-[var(--aureos-border)]">
          <div className="flex items-center gap-3">
            {situacao === 'concluida' ? (
              <CheckCircle2 className="w-5 h-5 text-[var(--aureos-success)]" />
            ) : (
              <Clock className="w-5 h-5 text-[var(--aureos-warning)]" />
            )}
            <div>
              <p className="font-medium text-sm">Situação</p>
              <p className="text-xs text-[var(--aureos-text-secondary)]">
                {situacao === 'concluida' ? 'Já foi paga/recebida' : 'Agendada para depois'}
              </p>
            </div>
          </div>
          <Switch
            checked={situacao === 'concluida'}
            onCheckedChange={(checked) => setSituacao(checked ? 'concluida' : 'pendente')}
          />
        </div>
        
        {/* Mais opções */}
        <div>
          <button
            type="button"
            onClick={() => setMostrarMaisOpcoes(!mostrarMaisOpcoes)}
            className="text-sm text-[var(--aureos-primary)] font-medium"
          >
            {mostrarMaisOpcoes ? 'Menos opções' : 'Mais opções'}
          </button>
          
          {mostrarMaisOpcoes && (
            <div className="mt-4 space-y-4 aureos-slide-up">
              {/* Beneficiário */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Beneficiário (opcional)</Label>
                <Input
                  value={beneficiario}
                  onChange={(e) => setBeneficiario(e.target.value)}
                  placeholder="Ex: Starbucks, Uber, Mercado Extra"
                  className="h-12 rounded-xl"
                />
              </div>
              
              {/* Recorrência */}
              <div className="flex items-center justify-between p-4 bg-[var(--aureos-surface)] rounded-xl border border-[var(--aureos-border)]">
                <div className="flex items-center gap-3">
                  <Repeat className="w-5 h-5 text-[var(--aureos-primary)]" />
                  <div>
                    <p className="font-medium text-sm">Transação recorrente</p>
                    <p className="text-xs text-[var(--aureos-text-secondary)]">
                      Repete automaticamente
                    </p>
                  </div>
                </div>
                <Switch
                  checked={ehRecorrente}
                  onCheckedChange={setEhRecorrente}
                />
              </div>
              
              {ehRecorrente && (
                <div>
                  <Label className="text-sm font-medium mb-2 block">Frequência</Label>
                  <Select value={frequencia} onValueChange={setFrequencia}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="diaria">Diária</SelectItem>
                      <SelectItem value="semanal">Semanal</SelectItem>
                      <SelectItem value="mensal">Mensal</SelectItem>
                      <SelectItem value="anual">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Notas */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Notas (opcional)</Label>
                <Input
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Adicione uma observação"
                  className="h-12 rounded-xl"
                />
              </div>
              
              {/* Anexo */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Comprovante (opcional)</Label>
                <button
                  type="button"
                  className="w-full h-12 rounded-xl border-2 border-dashed border-[var(--aureos-border)] flex items-center justify-center gap-2 text-[var(--aureos-text-secondary)] hover:border-[var(--aureos-primary)]/30 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  <span>Adicionar foto</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
      
      {/* Footer com botão salvar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--aureos-surface)] border-t border-[var(--aureos-border)]">
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!canSubmit()}
          className={`w-full h-12 rounded-xl font-medium ${
            tipo === 'despesa'
              ? 'bg-[var(--aureos-danger)] hover:bg-[var(--aureos-danger-dark)]'
              : tipo === 'renda'
              ? 'bg-[var(--aureos-success)] hover:bg-[var(--aureos-success-dark)]'
              : 'bg-[var(--aureos-primary)] hover:bg-[var(--aureos-primary-dark)]'
          }`}
        >
          Salvar {tipo === 'despesa' ? 'Despesa' : tipo === 'renda' ? 'Renda' : 'Transferência'}
        </Button>
      </div>
    </div>
  );
}
