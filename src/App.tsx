import { useState, useEffect } from 'react'
import './App.css'
import { AgendarHorario, MeusAgendamentos, Historico, MeuPerfil as ClientePerfil } from './components/ClientArea'
import { Dashboard, Funcionarios, Servicos, Agendamentos as AdminAgendamentos, Horarios, Configuracoes, Usuarios, Produtos as ProdutosAdmin } from './components/AdminArea'
import { Agendamentos as FuncionarioAgendamentos, MeuPerfil as FuncionarioPerfil } from './components/FuncionarioArea'
import { auth } from './lib/supabase'
import { authService } from './services/auth'
import type { FuncionarioAuth } from './services/auth'
import SuccessScreen from './components/SuccessScreen'
import { configuracoes } from './services/configuracoes'
import type { Configuracoes as ConfiguracoesType } from './services/configuracoes'
import ListaProdutos from './components/ClientArea/ListaProdutos'
import ReactInputMask from 'react-input-mask'
import { formatarTelefone, validarTelefone, limparTelefone } from './utils/formatters'
import toast from 'react-hot-toast'

// Interface para os tipos de dados
interface Funcionario {
  id: number
  nome: string
  email: string
  cargo: string
  telefone: string
  comissao: number
}

interface Servico {
  id: number
  nome: string
  preco: number
  duracao: number
  categoria: 'barbearia' | 'salao'
}

interface Cliente {
  id: number
  nome: string
  email: string
  telefone: string
  senha: string
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header Mobile */}
      <header className="lg:hidden bg-[#1a1a1a] border-b border-red-600/20 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
            <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-400 hover:text-white transition-colors"
            >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
            </button>
        <span className="text-lg font-bold text-red-500">Painel Administrativo</span>
      </header>

      <div className="flex h-[calc(100vh-56px)] lg:h-screen">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-[#1a1a1a] border-r border-red-600/20
          transform lg:transform-none transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Header Desktop */}
          <div className="flex items-center justify-between p-4 border-b border-red-600/20">
            <span className="text-lg font-bold text-red-500">Painel Administrativo</span>
              <button 
              onClick={onLogout}
              className="text-gray-400 hover:text-white transition-colors"
              title="Sair"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>

          {/* Navigation */}
          <nav className="p-4 space-y-2">
              <button
                onClick={() => {
                  setActiveTab('dashboard')
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'dashboard'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:bg-red-600/10 hover:text-white'
                }`}
              >
                <span>📊</span>
                <span>Dashboard</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('funcionarios')
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'funcionarios'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:bg-red-600/10 hover:text-white'
                }`}
              >
                <span>👥</span>
                <span>Funcionários</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('servicos')
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'servicos'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:bg-red-600/10 hover:text-white'
                }`}
              >
                <span>✂️</span>
                <span>Serviços</span>
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('agendamentos')
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'agendamentos'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:bg-red-600/10 hover:text-white'
                }`}
              >
                <span>📅</span>
                <span>Agendamentos</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('horarios')
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'horarios'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:bg-red-600/40 hover:text-white'
                }`}
              >
                <span>⏰</span>
                <span>Horários</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('usuarios')
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'usuarios'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:bg-red-600/10 hover:text-white'
                }`}
              >
                <span>👤</span>
                <span>Usuários</span>
              </button>

                <button
                onClick={() => {
                  setActiveTab('produtos')
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'produtos'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:bg-red-600/10 hover:text-white'
                }`}
              >
                <span>🛍️</span>
                <span>Produtos</span>
                </button>

              <button
                onClick={() => {
                  setActiveTab('configuracoes')
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'configuracoes'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:bg-red-600/10 hover:text-white'
                }`}
              >
                <span>⚙️</span>
                <span>Configurações</span>
              </button>
            </nav>
        </aside>

        {/* Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
              ></div>
            )}

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto p-4 lg:p-8">
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'funcionarios' && <Funcionarios />}
            {activeTab === 'servicos' && <Servicos />}
            {activeTab === 'agendamentos' && <AdminAgendamentos />}
            {activeTab === 'horarios' && <Horarios />}
            {activeTab === 'configuracoes' && <Configuracoes />}
            {activeTab === 'usuarios' && <Usuarios />}
            {activeTab === 'produtos' && <ProdutosAdmin />}
          </div>
        </main>
      </div>
    </div>
  )
}

function FuncionarioPanel({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'agendamentos' | 'perfil'>('agendamentos')
  const [funcionario, setFuncionario] = useState<FuncionarioAuth | null>(null)

  useEffect(() => {
    const func = authService.getFuncionarioLogado()
    if (!func) {
      onLogout()
      return
    }
    setFuncionario(func)
  }, [])

  if (!funcionario) return null

  return (
    <div className="min-h-screen bg-[#121212]">
      {/* Header */}
      <header className="bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] border-b border-red-600/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-red-500">Área do Funcionário</h1>
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Informações do Funcionário */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-red-600/20 p-6 mb-6">
          <div className="flex items-center gap-4">
            {funcionario.foto_url ? (
              <img 
                src={funcionario.foto_url} 
                alt={funcionario.nome}
                className="w-16 h-16 rounded-full object-cover border-2 border-red-600"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center border-2 border-red-600">
                <span className="text-xl font-bold text-red-500">
                  {funcionario.nome.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-white">{funcionario.nome}</h2>
              <div className="flex items-center gap-4 mt-1">
                <p className="text-gray-400 text-sm">{funcionario.email}</p>
                <span className="inline-block px-2 py-1 bg-red-600/20 text-red-500 text-xs rounded-full">
                  {funcionario.funcao.charAt(0).toUpperCase() + funcionario.funcao.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navegação */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('agendamentos')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'agendamentos'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:bg-red-600/10 hover:text-white'
            }`}
          >
            Meus Agendamentos
          </button>
          <button
            onClick={() => setActiveTab('perfil')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'perfil'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:bg-red-600/10 hover:text-white'
            }`}
          >
            Meu Perfil
          </button>
        </div>

        {/* Conteúdo */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-xl border border-red-600/20 p-6">
          {activeTab === 'agendamentos' ? (
            <FuncionarioAgendamentos funcionarioId={funcionario.id} />
          ) : (
            <FuncionarioPerfil />
          )}
        </div>
      </div>
    </div>
  )
}

function LoginModal({ isOpen, onClose, onLoginSuccess }: { 
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: (userType: 'admin' | 'funcionario') => void 
}) {
  const [tipoAcesso, setTipoAcesso] = useState<'administrador' | 'funcionario'>('administrador')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setLoading(true)

    try {
      if (tipoAcesso === 'administrador') {
        if (email === 'camilomelo8428@gmail.com' && senha === '071012') {
          onLoginSuccess('admin')
          onClose()
        } else {
          setErro('E-mail ou senha incorretos')
        }
      } else {
        const { success, error } = await authService.loginFuncionario(email, senha)
        
        if (success) {
          onLoginSuccess('funcionario')
          onClose()
        } else {
          setErro(error || 'Erro ao fazer login')
        }
      }
    } catch (err: any) {
      setErro(err.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] p-6 sm:p-8 rounded-lg w-full max-w-md relative border border-red-600/30">
        <h2 className="text-red-600 text-3xl font-bold mb-8 text-center">ÁREA RESTRITA</h2>
        
        {/* Tipo de Acesso */}
        <div className="mb-6">
          <p className="text-gray-400 mb-3 text-sm">TIPO DE ACESSO</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setTipoAcesso('administrador')
                setErro('')
              }}
              className={`py-2 px-4 rounded transition-colors ${
                tipoAcesso === 'administrador'
                  ? 'bg-red-600 text-white'
                  : 'border border-red-600 text-white hover:bg-red-600/10'
              }`}
            >
              ADMINISTRADOR
            </button>
            <button
              onClick={() => {
                setTipoAcesso('funcionario')
                setErro('')
              }}
              className={`py-2 px-4 rounded transition-colors ${
                tipoAcesso === 'funcionario'
                  ? 'bg-red-600 text-white'
                  : 'border border-red-600 text-white hover:bg-red-600/10'
              }`}
            >
              FUNCIONÁRIO
            </button>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-2">E-MAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-red-600/20 rounded p-3 text-white focus:border-red-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">SENHA</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-red-600/20 rounded p-3 text-white focus:border-red-600 focus:outline-none"
              required
            />
          </div>

          {erro && (
            <div className="bg-red-500/10 border border-red-500/20 rounded p-3">
              <p className="text-red-500 text-sm">{erro}</p>
            </div>
          )}

            <button
              type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 rounded hover:from-red-700 hover:to-red-900 transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Entrando...</span>
              </div>
            ) : (
              'ENTRAR'
            )}
            </button>
        </form>

            <button
              onClick={onClose}
          className="w-full mt-4 py-3 border border-red-600/20 text-white rounded hover:bg-red-600/10 transition-colors"
            >
              VOLTAR PARA HOME
            </button>
      </div>
    </div>
  )
}

function ClientLoginModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [showCadastro, setShowCadastro] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<'agendar' | 'agendamentos' | 'historico' | 'perfil' | 'produtos'>('agendar')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showProdutos, setShowProdutos] = useState(false)

  // Resetar estados quando o modal é fechado
  useEffect(() => {
    if (!isOpen) {
      setShowProdutos(false)
      setActiveTab('agendar')
    }
  }, [isOpen])

  // Dados do cadastro
  const [nomeCadastro, setNomeCadastro] = useState('')
  const [emailCadastro, setEmailCadastro] = useState('')
  const [telefoneCadastro, setTelefoneCadastro] = useState('')
  const [senhaCadastro, setSenhaCadastro] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')

  // Verificar sessão ao montar o componente
  useEffect(() => {
    const verificarSessao = async () => {
      const { session } = await auth.getSession()
      if (session) {
        setIsAuthenticated(true)
      }
    }
    verificarSessao()
  }, [])

  if (!isOpen) return null

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    try {
      const { success, error } = await auth.login(email, senha)
      
      if (success) {
        setIsAuthenticated(true)
      } else {
        setErro('E-mail ou senha incorretos')
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      setErro('Erro ao fazer login. Tente novamente.')
    }
  }

  const handleLogout = async () => {
    try {
      const { success } = await auth.logout()
      if (success) {
        setIsAuthenticated(false)
        setEmail('')
        setSenha('')
        onClose()
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value
    setTelefoneCadastro(valor)
  }

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    // Validações básicas
    if (!nomeCadastro.trim()) {
      setErro('Por favor, insira seu nome completo.')
      return
    }

    if (!emailCadastro.trim()) {
      setErro('Por favor, insira seu e-mail.')
      return
    }

    if (!telefoneCadastro.trim()) {
      setErro('Por favor, insira seu telefone.')
      return
    }

    // Validação específica para telefone
    if (!validarTelefone(telefoneCadastro)) {
      setErro('Por favor, insira um número de telefone válido (10 ou 11 dígitos).')
      return
    }

    if (senhaCadastro !== confirmarSenha) {
      setErro('As senhas não coincidem')
      return
    }

    if (senhaCadastro.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres')
      return
    }

    try {
      const telefoneLimpo = limparTelefone(telefoneCadastro)
      const { success, error } = await auth.registrar(
        emailCadastro,
        senhaCadastro,
        nomeCadastro,
        telefoneLimpo
      )

      if (success) {
        // Mostrar tela de sucesso
        setShowSuccess(true)
        
        // Limpar campos
        setNomeCadastro('')
        setEmailCadastro('')
        setTelefoneCadastro('')
        setSenhaCadastro('')
        setConfirmarSenha('')
        setErro('')
      } else {
        setErro(error ? String(error) : 'Erro ao criar conta')
      }
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error)
      setErro('Erro ao criar conta. Tente novamente.')
    }
  }

  // Se estiver mostrando a tela de sucesso
  if (showSuccess) {
    return (
      <SuccessScreen 
        onClose={() => {
          setShowSuccess(false)
          setShowCadastro(false)
          onClose()
        }}
        onLogin={() => {
          setShowSuccess(false)
          setShowCadastro(false)
        }}
      />
    )
  }

  // Se o usuário estiver autenticado, mostrar a área do cliente
  if (isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] w-full h-full relative border-x border-red-600/30 shadow-2xl flex flex-col">
          {/* Efeito de Brilho */}
          <div className="absolute -inset-[2px] bg-gradient-to-r from-red-600/20 to-orange-600/20 blur-xl opacity-50"></div>
          
          {/* Conteúdo */}
          <div className="relative z-10 flex flex-col h-full p-6">
            {/* Cabeçalho */}
            <div className="flex justify-between items-center mb-8 shrink-0">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                ÁREA DO CLIENTE
              </h2>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            {/* Menu de Opções */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 shrink-0">
              {/* Agendar Horário */}
              <button 
                onClick={() => setActiveTab('agendar')}
                className={`group relative bg-[#2a2a2a] p-4 rounded-xl border ${
                  activeTab === 'agendar' 
                    ? 'border-red-600/40 bg-gradient-to-br from-red-600/10 to-red-800/10' 
                    : 'border-red-600/20 hover:border-red-600/40'
                } transition-all`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-red-800/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>
                <span className="text-2xl mb-2 block transform group-hover:scale-110 transition-transform">✂️</span>
                <h3 className="text-sm font-semibold text-red-500">Agendar</h3>
              </button>

              {/* Meus Agendamentos */}
              <button 
                onClick={() => setActiveTab('agendamentos')}
                className={`group relative bg-[#2a2a2a] p-4 rounded-xl border ${
                  activeTab === 'agendamentos' 
                    ? 'border-red-600/40 bg-gradient-to-br from-red-600/10 to-red-800/10' 
                    : 'border-red-600/20 hover:border-red-600/40'
                } transition-all`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-red-800/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>
                <span className="text-2xl mb-2 block transform group-hover:scale-110 transition-transform">📅</span>
                <h3 className="text-sm font-semibold text-red-500">Agendamentos</h3>
              </button>

              {/* Histórico */}
              <button 
                onClick={() => setActiveTab('historico')}
                className={`group relative bg-[#2a2a2a] p-4 rounded-xl border ${
                  activeTab === 'historico' 
                    ? 'border-red-600/40 bg-gradient-to-br from-red-600/10 to-red-800/10' 
                    : 'border-red-600/20 hover:border-red-600/40'
                } transition-all`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-red-800/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>
                <span className="text-2xl mb-2 block transform group-hover:scale-110 transition-transform">📋</span>
                <h3 className="text-sm font-semibold text-red-500">Histórico</h3>
              </button>

              {/* Perfil */}
              <button 
                onClick={() => setActiveTab('perfil')}
                className={`group relative bg-[#2a2a2a] p-4 rounded-xl border ${
                  activeTab === 'perfil' 
                    ? 'border-red-600/40 bg-gradient-to-br from-red-600/10 to-red-800/10' 
                    : 'border-red-600/20 hover:border-red-600/40'
                } transition-all`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-red-800/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>
                <span className="text-2xl mb-2 block transform group-hover:scale-110 transition-transform">👤</span>
                <h3 className="text-sm font-semibold text-red-500">Perfil</h3>
              </button>

              {/* Produtos */}
              <button 
                onClick={() => {
                  setActiveTab('produtos')
                  setShowProdutos(true)
                }}
                className={`group relative bg-[#2a2a2a] p-4 rounded-xl border ${
                  activeTab === 'produtos' 
                    ? 'border-red-600/40 bg-gradient-to-br from-red-600/10 to-red-800/10' 
                    : 'border-red-600/20 hover:border-red-600/40'
                } transition-all`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-red-800/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>
                <span className="text-2xl mb-2 block transform group-hover:scale-110 transition-transform">🛍️</span>
                <h3 className="text-sm font-semibold text-red-500">Produtos</h3>
              </button>

              {/* Sair */}
              <button 
                onClick={handleLogout}
                className="group relative bg-[#2a2a2a] p-4 rounded-xl border border-red-600/20 hover:border-red-600/40 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-red-800/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity"></div>
                <span className="text-2xl mb-2 block transform group-hover:scale-110 transition-transform">🚪</span>
                <h3 className="text-sm font-semibold text-red-500">Sair</h3>
              </button>
            </div>

            {/* Conteúdo da Tab Ativa */}
            <div className="mt-6 bg-[#1a1a1a] rounded-xl border border-red-600/20 flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-red-600/30 hover:scrollbar-thumb-red-600/50 scrollbar-track-transparent">
                {activeTab === 'agendar' && <AgendarHorario />}
                {activeTab === 'agendamentos' && <MeusAgendamentos />}
                {activeTab === 'historico' && <Historico />}
                {activeTab === 'perfil' && <ClientePerfil />}
                {activeTab === 'produtos' && <ListaProdutos />}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-6 sm:p-8 rounded-xl w-full max-w-md relative border border-red-600/30 shadow-2xl">
        {/* Efeito de Brilho */}
        <div className="absolute -inset-[2px] bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-xl blur-xl opacity-50"></div>
        
        {/* Conteúdo */}
        <div className="relative z-10">
          {/* Botão Voltar */}
          <button
            onClick={onClose}
            className="absolute -top-2 -left-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            ×
          </button>

          {/* Logo e Título */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 relative">
              <div className="rounded-full bg-red-600/20 absolute inset-0 blur-md"></div>
              <img
                src="https://i.pinimg.com/736x/6c/64/b0/6c64b09b27222ab9645868925391c2c0.jpg"
                alt="Logo"
                className="w-full h-full object-cover rounded-full relative z-10 border-2 border-red-600/50"
              />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              {showCadastro ? 'Criar Conta' : 'Bem-vindo'}
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              {showCadastro ? 'Preencha seus dados para começar' : 'Faça login para agendar seu horário'}
            </p>
          </div>

          {!showCadastro ? (
            // Formulário de Login
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-red-500">@</span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#ffffff0a] border border-red-600/20 rounded-lg p-3 pl-10 text-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 placeholder-gray-500"
                    placeholder="Seu e-mail"
                    required
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-red-500">🔒</span>
                  </div>
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full bg-[#ffffff0a] border border-red-600/20 rounded-lg p-3 pl-10 text-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 placeholder-gray-500"
                    placeholder="Sua senha"
                    required
                  />
                </div>
              </div>

              {erro && (
                <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex items-center gap-2">
                  <span>⚠️</span> {erro}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Entrar
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#1a1a1a] text-gray-400">ou</span>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowCadastro(true)}
                  className="text-red-500 hover:text-red-400 transition-all duration-300 text-sm hover:tracking-wider"
                >
                  Criar uma nova conta →
                </button>
              </div>
            </form>
          ) : (
            // Formulário de Cadastro
            <form onSubmit={handleCadastro} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-red-500">👤</span>
                  </div>
                  <input
                    type="text"
                    value={nomeCadastro}
                    onChange={(e) => setNomeCadastro(e.target.value)}
                    className="w-full bg-[#ffffff0a] border border-red-600/20 rounded-lg p-3 pl-10 text-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 placeholder-gray-500"
                    placeholder="Nome completo"
                    required
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-red-500">@</span>
                  </div>
                  <input
                    type="email"
                    value={emailCadastro}
                    onChange={(e) => setEmailCadastro(e.target.value)}
                    className="w-full bg-[#ffffff0a] border border-red-600/20 rounded-lg p-3 pl-10 text-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 placeholder-gray-500"
                    placeholder="Seu melhor e-mail"
                    required
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-red-500">📱</span>
                  </div>
                  <ReactInputMask
                    mask="(99) 99999-9999"
                    maskChar={null}
                    value={telefoneCadastro}
                    onChange={handleTelefoneChange}
                    className="w-full bg-[#ffffff0a] border border-red-600/20 rounded-lg p-3 pl-10 text-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 placeholder-gray-500"
                    placeholder="(91) 98888-7777"
                    required
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-red-500">🔒</span>
                  </div>
                  <input
                    type="password"
                    value={senhaCadastro}
                    onChange={(e) => setSenhaCadastro(e.target.value)}
                    className="w-full bg-[#ffffff0a] border border-red-600/20 rounded-lg p-3 pl-10 text-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 placeholder-gray-500"
                    placeholder="Crie uma senha forte"
                    required
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-red-500">🔒</span>
                  </div>
                  <input
                    type="password"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="w-full bg-[#ffffff0a] border border-red-600/20 rounded-lg p-3 pl-10 text-white focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 placeholder-gray-500"
                    placeholder="Confirme sua senha"
                    required
                  />
                </div>
              </div>

              {erro && (
                <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex items-center gap-2">
                  <span>⚠️</span> {erro}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Criar Conta
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowCadastro(false)}
                  className="text-red-500 hover:text-red-400 transition-all duration-300 text-sm hover:tracking-wider"
                >
                  ← Voltar para o login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Modal de Produtos */}
      {showProdutos && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60]">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] w-full h-full relative border-x border-red-600/30 shadow-2xl flex flex-col">
            {/* Efeito de Brilho */}
            <div className="absolute -inset-[2px] bg-gradient-to-r from-red-600/20 to-orange-600/20 blur-xl opacity-50"></div>
            
            {/* Conteúdo */}
            <div className="relative z-10 flex flex-col h-full">
              {/* Cabeçalho */}
              <div className="flex justify-between items-center p-6 shrink-0">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  PRODUTOS
                </h2>
                <button
                  onClick={() => setShowProdutos(false)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              {/* Lista de Produtos */}
              <div className="flex-1 overflow-y-auto">
                <ListaProdutos />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Adicione este componente para o menu mobile
function MobileMenu({ isOpen, onClose, onClientLogin, onAdminLogin }: {
  isOpen: boolean
  onClose: () => void
  onClientLogin: () => void
  onAdminLogin: () => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 z-50">
      <div className="relative h-full flex flex-col items-center justify-center p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col gap-6 items-center">
          <button 
            onClick={() => {
              onClientLogin()
              onClose()
            }}
            className="flex items-center gap-2 text-xl text-gray-300 hover:text-red-500 transition-all"
          >
            <span>👤</span> ÁREA DO CLIENTE
          </button>
          <button 
            onClick={() => {
              onAdminLogin()
              onClose()
            }}
            className="flex items-center gap-2 text-xl text-gray-300 hover:text-red-500 transition-all"
          >
            <span>🔒</span> ÁREA RESTRITA
          </button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isClientLoginOpen, setIsClientLoginOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showProdutos, setShowProdutos] = useState(false)
  const [config, setConfig] = useState<ConfiguracoesType>({
    id: '1',
    nome_empresa: 'Barbearia Skull',
    logo_url: 'https://i.pinimg.com/736x/6c/64/b0/6c64b09b27222ab9645868925391c2c0.jpg',
    telefone: '(91) 3333-4444',
    email: 'contato@barbeariaskull.com',
    endereco: 'Av. Principal, 1234',
    bairro: 'Centro',
    cidade: 'Belém',
    estado: 'PA',
    cep: '66000-000',
    horario_funcionamento: 'Seg à Sex: 09h - 20h | Sáb: 09h - 18h | Dom: Fechado',
    instagram: '@barbeariaskull',
    facebook: '/barbeariaskull',
    whatsapp: '(91) 98888-7777',
    updated_at: new Date().toISOString()
  })

  const [userType, setUserType] = useState<'admin' | 'funcionario' | null>(null)

  useEffect(() => {
    const carregarConfiguracoes = async () => {
      try {
        const data = await configuracoes.obter()
        setConfig(data)
      } catch (err) {
        console.error('Erro ao carregar configurações:', err)
      }
    }

    carregarConfiguracoes()
  }, [])

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserType(null)
    authService.logout()
  }

  if (isAuthenticated) {
    if (userType === 'admin') {
      return <AdminPanel onLogout={handleLogout} />
    } else if (userType === 'funcionario') {
      return <FuncionarioPanel onLogout={handleLogout} />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header com Navegação */}
      <header className="fixed w-full z-40 bg-gradient-to-b from-black to-transparent">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo e Botão Admin */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <img
                  src={config.logo_url || "https://i.pinimg.com/736x/6c/64/b0/6c64b09b27222ab9645868925391c2c0.jpg"}
                  alt="Logo"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-red-600/50"
                />
                <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
                  {config.nome_empresa}
                </span>
              </div>

              {/* Botão Admin Desktop */}
              <button
                onClick={() => setIsLoginOpen(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-red-500 transition-colors duration-300 relative group"
              >
                <span className="text-xl transform group-hover:rotate-180 transition-transform duration-700">⚙️</span>
              </button>
            </div>

            {/* Menu Mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-gray-300 hover:text-red-500 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background com Efeito Parallax */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90 z-10"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')] bg-cover bg-center bg-no-repeat opacity-50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] z-20"></div>
        </div>

        {/* Conteúdo Hero */}
        <div className="relative z-30 container mx-auto px-4 flex flex-col items-center">
          {/* Logo e Título */}
          <div className="text-center mb-12">
            <div className="relative w-40 h-40 sm:w-56 sm:h-56 mx-auto mb-8 group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 to-red-800 blur-2xl opacity-40 group-hover:opacity-60 transition-all duration-500"></div>
              <div className="relative w-full h-full rounded-full p-2 bg-gradient-to-br from-red-600/20 to-red-900/20 backdrop-blur-sm border border-red-600/20">
                <img
                  src={config.logo_url || "https://i.pinimg.com/736x/6c/64/b0/6c64b09b27222ab9645868925391c2c0.jpg"}
                  alt="Barbearia Logo"
                  className="w-full h-full object-cover rounded-full transform group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-red-600 to-red-800 opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-500"></div>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-red-500 to-red-800 bg-clip-text text-transparent">
              {config.nome_empresa}
      </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto px-4 leading-relaxed">
              Transformando seu estilo com <span className="text-red-500">excelência</span> e <span className="text-red-500">tradição</span>
            </p>
          </div>
          
          {/* Botões */}
          <div className="w-full max-w-3xl mx-auto space-y-8">
            {/* Botão Principal */}
            <button 
              onClick={() => setIsClientLoginOpen(true)}
              className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-red-600 to-red-800 rounded-xl shadow-lg shadow-red-600/20 hover:shadow-red-600/40 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
            >
              <span className="flex items-center justify-center gap-4 text-xl font-semibold">
                <span className="transform group-hover:scale-110 transition-transform">👤</span>
                <span className="relative">
                  ÁREA DO CLIENTE
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </button>

            {/* Botões Secundários */}
            <div className="flex justify-center w-full">
              {/* Produtos */}
              <button 
                onClick={() => setShowProdutos(true)}
                className="group relative w-full max-w-sm px-8 py-4 bg-transparent rounded-xl overflow-hidden"
              >
                <div className="absolute inset-0 border-2 border-red-600 rounded-xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center gap-3 text-lg font-semibold">
                  <span className="transform group-hover:scale-110 transition-transform">🛍️</span>
                  <span className="relative">
                    PRODUTOS
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-red-600/20 opacity-30 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-tl from-red-800/10 opacity-30 blur-3xl"></div>
        </div>
      </section>

      {/* Informações */}
      <section className="relative py-24 sm:py-32 bg-[#0a0a0a] overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-red-600/10 opacity-30 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-red-800/10 opacity-30 blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Localização */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl transform transition-transform duration-300 group-hover:scale-[0.98]"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-8 border border-red-600/10 rounded-2xl backdrop-blur-sm">
                <div className="relative w-16 h-16 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center text-3xl">
                    📍
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-white via-red-500 to-red-800 bg-clip-text text-transparent">
                  LOCALIZAÇÃO
                </h2>
                <div className="space-y-3 text-gray-400">
                  <p className="flex items-center gap-3 group/item">
                    <span className="w-2 h-2 rounded-full bg-red-600 group-hover/item:bg-red-500 transition-colors"></span>
                    {config.endereco}
                  </p>
                  <p className="flex items-center gap-3 group/item">
                    <span className="w-2 h-2 rounded-full bg-red-600 group-hover/item:bg-red-500 transition-colors"></span>
                    {config.bairro} - {config.cidade}, {config.estado}
                  </p>
                </div>
              </div>
            </div>

            {/* Horário */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl transform transition-transform duration-300 group-hover:scale-[0.98]"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-8 border border-red-600/10 rounded-2xl backdrop-blur-sm">
                <div className="relative w-16 h-16 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center text-3xl">
                    ⏰
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-white via-red-500 to-red-800 bg-clip-text text-transparent">
                  HORÁRIOS
                </h2>
                <div className="space-y-3 text-gray-400">
                  {config.horario_funcionamento.split('|').map((horario: string, index: number) => (
                    <p key={index} className="flex items-center gap-3 group/item">
                    <span className="w-2 h-2 rounded-full bg-red-600 group-hover/item:bg-red-500 transition-colors"></span>
                      {horario.trim()}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Contatos */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl transform transition-transform duration-300 group-hover:scale-[0.98]"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-8 border border-red-600/10 rounded-2xl backdrop-blur-sm">
                <div className="relative w-16 h-16 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center text-3xl">
                    📱
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-white via-red-500 to-red-800 bg-clip-text text-transparent">
                  CONTATOS
                </h2>
                <div className="space-y-3 text-gray-400">
                  <p className="flex items-center gap-3 group/item">
                    <span className="w-2 h-2 rounded-full bg-red-600 group-hover/item:bg-red-500 transition-colors"></span>
                    {config.telefone}
                  </p>
                  <p className="flex items-center gap-3 group/item">
                    <span className="w-2 h-2 rounded-full bg-red-600 group-hover/item:bg-red-500 transition-colors"></span>
                    {config.whatsapp}
                  </p>
                </div>
              </div>
            </div>

            {/* Redes Sociais */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-2xl transform transition-transform duration-300 group-hover:scale-[0.98]"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-red-800/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-8 border border-red-600/10 rounded-2xl backdrop-blur-sm">
                <div className="relative w-16 h-16 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="relative w-full h-full bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center text-3xl">
                    💈
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-white via-red-500 to-red-800 bg-clip-text text-transparent">
                  REDES SOCIAIS
                </h2>
                <div className="space-y-3 text-gray-400">
                  <p className="flex items-center gap-3 group/item hover:text-red-500 transition-colors cursor-pointer">
                    <span className="w-2 h-2 rounded-full bg-red-600 group-hover/item:bg-red-500 transition-colors"></span>
                    {config.instagram}
                  </p>
                  <p className="flex items-center gap-3 group/item hover:text-red-500 transition-colors cursor-pointer">
                    <span className="w-2 h-2 rounded-full bg-red-600 group-hover/item:bg-red-500 transition-colors"></span>
                    {config.facebook}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#0a0a0a] border-t border-red-600/10 py-8 sm:py-12 overflow-hidden">
        {/* Efeito de Gradiente */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-red-600/10 opacity-30 blur-3xl"></div>
          <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-bl from-red-800/10 opacity-30 blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 transform group-hover:scale-110 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                <img
                  src={config.logo_url || "https://i.pinimg.com/736x/6c/64/b0/6c64b09b27222ab9645868925391c2c0.jpg"}
                  alt="Logo"
                  className="relative w-full h-full object-cover rounded-full border border-red-600/50 group-hover:border-red-600 transition-colors"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-red-500 to-red-800 bg-clip-text text-transparent">
                {config.nome_empresa}
              </span>
            </div>

            {/* Linha Divisória Animada */}
            <div className="w-full max-w-[200px] h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent"></div>

            {/* Informações */}
            <div className="space-y-4">
              <p className="text-center text-sm text-gray-500">
                © 2005 CamiloTec. Todos os direitos reservados.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
                <p className="text-gray-400 text-sm flex items-center gap-2 group cursor-pointer hover:text-red-500 transition-colors">
                  <span className="transform group-hover:scale-110 transition-transform">👨‍💻</span>
                  <span className="relative">
                    Desenvolvido por Camilo Melo
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
                </span>
              </p>
                <a 
                  href="tel:+5591981845943" 
                  className="text-gray-400 text-sm flex items-center gap-2 group hover:text-red-500 transition-colors"
                >
                <span className="transform group-hover:rotate-12 transition-transform duration-300">📞</span>
                <span className="relative">
                  (91) 98184-5943
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
                </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Menu Mobile */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onClientLogin={() => setIsClientLoginOpen(true)}
        onAdminLogin={() => setIsLoginOpen(true)}
      />

      {/* Modais */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(userType) => {
          setIsAuthenticated(true)
          setUserType(userType)
        }}
      />
      <ClientLoginModal
        isOpen={isClientLoginOpen}
        onClose={() => setIsClientLoginOpen(false)}
      />
    </div>
  )
}

export default App

