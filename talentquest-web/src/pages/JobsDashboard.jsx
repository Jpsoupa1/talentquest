import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Building2, Code, Briefcase, Sparkles, PlusCircle, Users, Eye } from 'lucide-react';

// ==========================================
// 1. VISÃO DO ESTUDANTE (Marketplace)
// ==========================================
function StudentDashboard({ jobs }) {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {jobs.map(job => (
        <div key={job.id} className="group bg-tq-card rounded-2xl border border-tq-border hover:border-tq-purple/50 shadow-lg hover:shadow-tq-purple/10 transition-all duration-300 p-6 flex flex-col relative overflow-hidden">
          
          <div className="flex justify-between items-start mb-5 relative z-10">
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 group-hover:bg-tq-purple/10 transition-colors">
              <Building2 className="w-6 h-6 text-tq-purple" />
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-tq-orange/10 text-tq-orange border border-tq-orange/20">
              <Sparkles className="w-3 h-3 mr-1" /> Match Potencial
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-tq-purple transition-colors">{job.title}</h3>
          <div className="flex items-center text-sm text-tq-text mb-4">
            <Briefcase className="w-4 h-4 mr-2 opacity-70" /> {job.company?.name}
          </div>
          <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">{job.description}</p>
          
          <button 
            onClick={() => navigate('/challenge', { state: { challenge: job.challenges[0] } })}
            className="w-full flex items-center justify-center px-4 py-3 bg-white/5 hover:bg-tq-purple text-white rounded-xl border border-white/10 hover:border-transparent transition-all font-bold tracking-wide group-hover:shadow-lg"
          >
            <Code className="w-4 h-4 mr-2" /> Aceitar Desafio
          </button>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 2. VISÃO DA EMPRESA (Meus Posts)
// ==========================================
function CompanyDashboard({ jobs, user }) {
  const navigate = useNavigate();

  const myJobs = jobs.filter(job => job.company && String(job.company.id) === String(user.id));

  return (
    <div>
      {/* Botão de Ação Rápida */}
      <div className="flex justify-end mb-8">
        <button 
          onClick={() => navigate('/create-job')}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-tq-purple to-tq-orange rounded-xl font-bold text-white shadow-lg shadow-tq-purple/20 hover:scale-105 transition-transform"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Publicar Nova Vaga
        </button>
      </div>

      {myJobs.length === 0 ? (
        <div className="text-center py-20 bg-tq-card rounded-3xl border border-tq-border border-dashed">
          <Building2 className="w-16 h-16 text-tq-text mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-white mb-2">Você ainda não publicou vagas</h2>
          <p className="text-gray-400">Crie seu primeiro desafio técnico para atrair talentos.</p>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Briefcase className="text-tq-orange"/> Vagas Ativas ({myJobs.length})
          </h2>
          
          {/* Lista em formato de linhas (Table-like) para Empresas */}
          {myJobs.map(job => (
            <div key={job.id} className="bg-tq-card p-6 rounded-xl border border-tq-border flex flex-col md:flex-row items-center justify-between hover:border-tq-purple/50 transition-all group">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 text-tq-purple font-bold text-xl">
                  {job.title.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-tq-purple transition-colors">{job.title}</h3>
                  <p className="text-sm text-gray-400">Publicado em: Hoje</p>
                </div>
              </div>

              {/* Estatísticas Rápidas (Mock) */}
              <div className="flex gap-8 mr-8">
                <div className="text-center">
                  <span className="block text-2xl font-bold text-white">12</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Visualizações</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl font-bold text-tq-orange">2</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Candidatos</span>
                </div>
              </div>

              {/* Ações */}
              <div className="flex gap-3">
                <button className="p-3 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors" title="Ver Detalhes">
                  <Eye className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => navigate(`/job/${job.id}/candidates`, { state: { jobTitle: job.title } })}
                    className="flex items-center px-4 py-2 bg-tq-purple/10 text-tq-purple border border-tq-purple/30 rounded-lg font-bold hover:bg-tq-purple hover:text-white transition-all"
                  >
                    <Users className="w-4 h-4 mr-2" /> Ver Candidatos
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. COMPONENTE PRINCIPAL (Controlador)
// ==========================================
export default function JobsDashboard() {
  const [jobs, setJobs] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userType = user?.userType; // "COMPANY" ou "STUDENT"

  useEffect(() => {
    api.get('/jobs').then(res => setJobs(res.data)).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-tq-dark text-white font-sans">
      <Navbar />
      
      {/* Hero Diferente para cada perfil */}
      <div className="relative border-b border-tq-border bg-tq-card/30 py-12">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-tq-purple via-tq-orange to-tq-purple opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-2">
            {userType === 'COMPANY' ? 'Painel de Recrutamento' : 'Mural de Missões'}
          </h1>
          <p className="text-tq-text text-lg max-w-2xl">
            {userType === 'COMPANY' 
              ? 'Gerencie suas vagas e encontre os talentos com o Match Cultural ideal.'
              : 'Explore desafios técnicos reais. Prove seu valor através do código.'}
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Lógica de Decisão: Qual Dashboard mostrar? */}
        {userType === 'COMPANY' ? (
          <CompanyDashboard jobs={jobs} user={user} />
        ) : (
          <StudentDashboard jobs={jobs} />
        )}
      </main>
    </div>
  );
}