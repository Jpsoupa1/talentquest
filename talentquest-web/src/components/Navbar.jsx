import { useNavigate } from 'react-router-dom';
import { LogOut, User, FileText, PlusCircle } from 'lucide-react';
// 1. IMPORTANTE: Importe a imagem da logo aqui
import logoImg from '../assets/talentquest-transparente.png'; 

export default function Navbar() {
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userType = user?.userType;

  function handleLogout() {
    localStorage.removeItem('user');
    navigate('/');
  }

  return (
    <nav className="bg-tq-card/80 backdrop-blur-md border-b border-tq-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16">
          
          {/* --- ÁREA DA LOGO (ALTERADA) --- */}
          <div className="flex items-center cursor-pointer gap-3" onClick={() => navigate('/jobs')}>
            {/* Imagem da Logo */}
            <img 
              src={logoImg} 
              alt="TalentQuest Logo" 
              className="h-10 w-10 rounded-lg object-cover shadow-lg shadow-tq-purple/20 hover:scale-105 transition-transform" 
            />
            
            {/* Texto da Marca */}
            <span className="text-xl font-bold text-white tracking-tight">
              Talent<span className="text-transparent bg-clip-text bg-gradient-to-r from-tq-purple to-tq-orange">Quest</span>
            </span>
          </div>
          
          {/* --- AÇÕES DO USUÁRIO --- */}
          <div className="flex items-center gap-6">
            
            {/* Botão Estudante */}
            {userType === 'STUDENT' && (
              <button 
                onClick={() => navigate('/profile')}
                className="flex items-center px-4 py-2 bg-tq-purple/10 text-tq-purple border border-tq-purple/50 rounded-lg text-sm font-bold hover:bg-tq-purple hover:text-white transition-all shadow-lg shadow-tq-purple/5"
              >
                <FileText className="w-4 h-4 mr-2" /> 
                Meu Perfil
              </button>
            )}

            {/* Botão Empresa */}
            {userType === 'COMPANY' && (
              <button 
                onClick={() => navigate('/create-job')}
                className="flex items-center px-4 py-2 bg-tq-orange/10 text-tq-orange border border-tq-orange/50 rounded-lg text-sm font-bold hover:bg-tq-orange hover:text-white transition-all shadow-lg shadow-tq-orange/5"
              >
                <PlusCircle className="w-4 h-4 mr-2" /> 
                Nova Vaga
              </button>
            )}

            <div className="h-6 w-px bg-white/10 hidden sm:block"></div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold text-gray-200">{user.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-tq-text font-bold">
                  {userType === 'COMPANY' ? 'Recrutador' : 'Desenvolvedor'}
                </span>
              </div>
              
              {/* Avatar Padrão */}
              <div className="h-9 w-9 bg-white/5 rounded-full flex items-center justify-center border border-white/10 text-tq-text">
                <User className="h-5 w-5" />
              </div>
              
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Sair">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}