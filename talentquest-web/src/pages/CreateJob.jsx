import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Building2, Save, Target, FileCode } from 'lucide-react';

export default function CreateJob() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [job, setJob] = useState({ title: '', description: '', javaLevel: 5, springLevel: 5 });
  const [challenge, setChallenge] = useState({ title: '', problem: '', input: '', output: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const jobRes = await api.post('/jobs', {
        title: job.title,
        description: job.description,
        companyId: user.id,
        requiredProfile: { "Java": job.javaLevel, "Spring Boot": job.springLevel }
      });

      const jobId = jobRes.data.id;

      await api.post(`/jobs/${jobId}/challenges`, {
        title: challenge.title,
        problemStatement: challenge.problem,
        inputSample: challenge.input,
        outputExpected: challenge.output,
        jobId: jobId
      });

      alert('Vaga publicada com sucesso!');
      navigate('/jobs');
    } catch (error) {
      alert('Erro ao criar vaga.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-tq-dark text-white font-sans">
      <Navbar />
      <div className="max-w-4xl mx-auto p-8 animate-fade-in">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-white">
          <Target className="text-tq-orange w-8 h-8"/> Criar Nova Oportunidade
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* CARD 1: DADOS DA VAGA */}
          <div className="bg-tq-card p-8 rounded-2xl border border-tq-border shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-tq-purple flex items-center gap-2">
              <Building2 className="w-5 h-5"/> Detalhes da Posição
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-tq-text uppercase mb-1 block">Título da Vaga</label>
                <input type="text" placeholder="Ex: Desenvolvedor Java Senior" required 
                  className="w-full bg-tq-dark/50 border border-tq-border rounded-lg p-3 text-white focus:border-tq-purple focus:ring-1 focus:ring-tq-purple outline-none transition-all"
                  onChange={e => setJob({...job, title: e.target.value})} />
              </div>
              
              <div>
                <label className="text-xs font-bold text-tq-text uppercase mb-1 block">Descrição Completa</label>
                <textarea placeholder="Descreva as responsabilidades e a cultura da empresa..." required rows="4"
                  className="w-full bg-tq-dark/50 border border-tq-border rounded-lg p-3 text-white focus:border-tq-purple focus:ring-1 focus:ring-tq-purple outline-none transition-all"
                  onChange={e => setJob({...job, description: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-2 block">Nível de Java Exigido: <span className="text-tq-purple">{job.javaLevel}</span></label>
                  <input type="range" min="1" max="10" value={job.javaLevel} 
                    className="w-full h-2 bg-tq-dark rounded-lg appearance-none cursor-pointer accent-tq-purple"
                    onChange={e => setJob({...job, javaLevel: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 mb-2 block">Nível de Spring Exigido: <span className="text-tq-purple">{job.springLevel}</span></label>
                  <input type="range" min="1" max="10" value={job.springLevel} 
                    className="w-full h-2 bg-tq-dark rounded-lg appearance-none cursor-pointer accent-tq-purple"
                    onChange={e => setJob({...job, springLevel: parseInt(e.target.value)})} />
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: DESAFIO TÉCNICO */}
          <div className="bg-tq-card p-8 rounded-2xl border border-tq-border shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-tq-orange flex items-center gap-2">
              <FileCode className="w-5 h-5"/> Configurar Desafio Técnico
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-tq-text uppercase mb-1 block">Título do Desafio</label>
                <input type="text" placeholder="Ex: Algoritmo de Soma de Pares" required 
                  className="w-full bg-tq-dark/50 border border-tq-border rounded-lg p-3 text-white focus:border-tq-orange focus:ring-1 focus:ring-tq-orange outline-none transition-all"
                  onChange={e => setChallenge({...challenge, title: e.target.value})} />
              </div>

              <div>
                <label className="text-xs font-bold text-tq-text uppercase mb-1 block">Enunciado do Problema</label>
                <textarea placeholder="Explique claramente o que o candidato deve codificar..." required rows="3"
                  className="w-full bg-tq-dark/50 border border-tq-border rounded-lg p-3 text-white focus:border-tq-orange focus:ring-1 focus:ring-tq-orange outline-none transition-all"
                  onChange={e => setChallenge({...challenge, problem: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-tq-text uppercase mb-1 block">Input de Teste</label>
                  <input type="text" placeholder="Ex: 10, 20" required 
                    className="w-full bg-black/40 border border-tq-border rounded-lg p-3 font-mono text-green-400 focus:border-green-500 outline-none"
                    onChange={e => setChallenge({...challenge, input: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-tq-text uppercase mb-1 block">Output Esperado</label>
                  <input type="text" placeholder="Ex: 30" required 
                    className="w-full bg-black/40 border border-tq-border rounded-lg p-3 font-mono text-tq-orange focus:border-tq-orange outline-none"
                    onChange={e => setChallenge({...challenge, output: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-tq-purple to-tq-orange py-4 rounded-xl font-bold text-lg text-white hover:shadow-lg hover:shadow-tq-purple/30 transition-all flex justify-center items-center gap-2 disabled:opacity-50">
            {loading ? 'Publicando...' : <><Save className="w-5 h-5" /> Publicar Vaga no Mural</>}
          </button>
        </form>
      </div>
    </div>
  );
}