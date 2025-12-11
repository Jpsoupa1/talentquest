import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Building2, GraduationCap, UserPlus, ArrowLeft } from 'lucide-react';
import logoImg from '../assets/talentquest-transparente.png';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'STUDENT' // Padrão
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      alert('Conta criada com sucesso! Faça login.');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data || 'Erro ao criar conta.';
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-tq-dark text-white relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tq-purple/20 rounded-full blur-[150px]"></div>

      <div className="z-10 w-full max-w-lg p-6">
        <Link to="/" className="flex items-center text-tq-text hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar ao Login
        </Link>

        <div className="bg-tq-card/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <img src={logoImg} alt="TQ" className="h-12 mx-auto rounded-lg mb-4 opacity-90" />
            <h2 className="text-2xl font-bold">Crie sua Identidade</h2>
            <p className="text-tq-text text-sm">Escolha como você quer participar.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* SELETOR DE PERFIL (A RESPOSTA PARA SUA PERGUNTA) */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <label className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${formData.userType === 'STUDENT' ? 'bg-tq-purple/20 border-tq-purple shadow-[0_0_15px_rgba(124,58,237,0.3)]' : 'bg-tq-dark/50 border-white/10 hover:border-white/30'}`}>
                <input type="radio" name="userType" value="STUDENT" checked={formData.userType === 'STUDENT'} onChange={handleChange} className="hidden" />
                <GraduationCap className={`w-8 h-8 ${formData.userType === 'STUDENT' ? 'text-tq-purple' : 'text-gray-500'}`} />
                <span className="font-semibold text-sm">Sou Estudante</span>
              </label>

              <label className={`cursor-pointer p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${formData.userType === 'COMPANY' ? 'bg-tq-orange/20 border-tq-orange shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'bg-tq-dark/50 border-white/10 hover:border-white/30'}`}>
                <input type="radio" name="userType" value="COMPANY" checked={formData.userType === 'COMPANY'} onChange={handleChange} className="hidden" />
                <Building2 className={`w-8 h-8 ${formData.userType === 'COMPANY' ? 'text-tq-orange' : 'text-gray-500'}`} />
                <span className="font-semibold text-sm">Sou Empresa</span>
              </label>
            </div>

            {/* Campos Padrão */}
            <div>
              <label className="block text-xs text-tq-text mb-1 uppercase">Nome Completo</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange}
                className="w-full bg-tq-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-tq-orange focus:outline-none transition-all"
                placeholder={formData.userType === 'COMPANY' ? "Nome da Empresa" : "Seu Nome"} />
            </div>

            <div>
              <label className="block text-xs text-tq-text mb-1 uppercase">Email</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange}
                className="w-full bg-tq-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-tq-orange focus:outline-none transition-all"
                placeholder="seu@email.com" />
            </div>

            <div>
              <label className="block text-xs text-tq-text mb-1 uppercase">Senha</label>
              <input type="password" name="password" required value={formData.password} onChange={handleChange}
                className="w-full bg-tq-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-tq-orange focus:outline-none transition-all"
                placeholder="••••••" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full mt-4 bg-white text-tq-dark font-bold py-3 rounded-lg hover:bg-gray-200 transition-all flex justify-center items-center">
              {loading ? 'Criando...' : <><UserPlus className="w-4 h-4 mr-2" /> Cadastrar</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}