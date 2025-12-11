import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { LogIn, Lock } from 'lucide-react';
import logoImg from '../assets/talentquest-transparente.png'; // Importando sua logo

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });

      localStorage.setItem('user', JSON.stringify(response.data)); 
      
      navigate('/jobs');
    } catch (err) {
      alert('Login falhou! Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-tq-dark text-white relative overflow-hidden">
      {/* Background Effects (Luzes de fundo baseadas na logo) */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-tq-purple/30 rounded-full blur-[128px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-tq-orange/20 rounded-full blur-[128px]"></div>

      <div className="z-10 w-full max-w-md p-8">
        <div className="bg-tq-card/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          
          <div className="text-center mb-8">
            <img 
              src={logoImg} 
              alt="TalentQuest" 
              className="h-20 mx-auto rounded-xl shadow-lg shadow-tq-purple/50 mb-6 object-cover" 
            />
            <h2 className="text-2xl font-bold text-white">Bem-vindo de volta</h2>
            <p className="text-tq-text text-sm mt-2">Acesse o ecossistema de talentos.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-tq-text mb-1 uppercase tracking-wider">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-tq-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-tq-purple focus:ring-1 focus:ring-tq-purple transition-all placeholder-gray-600"
                placeholder="seu@email.com"
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-tq-text mb-1 uppercase tracking-wider">Senha</label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-tq-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-tq-purple focus:ring-1 focus:ring-tq-purple transition-all placeholder-gray-600"
                  placeholder="••••••"
                  required 
                />
                <Lock className="absolute right-3 top-3.5 w-4 h-4 text-gray-500" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-tq-purple to-tq-orange hover:opacity-90 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-tq-purple/20 flex justify-center items-center"
            >
              {loading ? 'Acessando...' : <><LogIn className="w-4 h-4 mr-2" /> Entrar</>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-tq-text text-sm">
              Não tem conta?{' '}
              <Link to="/register" className="text-white font-semibold hover:text-tq-orange transition-colors">
                Criar conta agora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}