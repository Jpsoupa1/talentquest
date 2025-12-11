import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Users, Download, ArrowLeft, Trophy, FileText, Mail } from 'lucide-react';

export default function CandidatesPage() {
  const { jobId } = useParams(); // Pega o ID da URL
  const { state } = useLocation();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [jobTitle, setJobTitle] = useState(state?.jobTitle || 'Vaga');

  useEffect(() => {
    // Busca os candidatos do Backend
    api.get(`/submissions/job/${jobId}`)
      .then(res => setCandidates(res.data))
      .catch(err => console.error("Erro ao buscar candidatos", err));
  }, [jobId]);

  const handleDownload = async (filename) => {
    if (!filename) return alert("Candidato não enviou currículo.");
    try {
      // Truque para baixar arquivo via API com Token
      const response = await api.get(`/submissions/download/${filename}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert("Erro ao baixar arquivo. Verifique se o arquivo existe no servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-tq-dark text-white font-sans">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-8 animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/jobs')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-400" />
          </button>
          <div>
            <span className="text-xs font-bold text-tq-purple uppercase tracking-wider">Gestão de Talentos</span>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              Candidatos: <span className="text-white font-normal">{jobTitle}</span>
            </h1>
          </div>
        </div>

        {candidates.length === 0 ? (
          <div className="text-center py-20 bg-tq-card rounded-2xl border border-tq-border border-dashed">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">Ainda não há candidatos</h3>
            <p className="text-gray-500">Aguarde os estudantes submeterem os desafios.</p>
          </div>
        ) : (
          <div className="bg-tq-card rounded-2xl border border-tq-border overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20 border-b border-tq-border text-xs uppercase text-gray-400 font-bold tracking-wider">
                  <th className="p-6">Ranking</th>
                  <th className="p-6">Candidato</th>
                  <th className="p-6">Contato</th>
                  <th className="p-6">Score (Match)</th>
                  <th className="p-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tq-border">
                {candidates.map((candidate, index) => (
                  <tr key={candidate.id} className="hover:bg-white/5 transition-colors group">
                    
                    {/* Ranking (Troféu para Top 3) */}
                    <td className="p-6">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                        index === 1 ? 'bg-gray-400/20 text-gray-400' :
                        index === 2 ? 'bg-orange-700/20 text-orange-700' :
                        'bg-white/5 text-gray-500'
                      }`}>
                        {index + 1}
                      </div>
                    </td>

                    {/* Nome */}
                    <td className="p-6">
                      <div className="font-bold text-white text-lg flex items-center gap-2">
                        {candidate.studentName}
                        {index === 0 && <Trophy className="w-4 h-4 text-yellow-500" />}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Submetido via TalentQuest</div>
                    </td>

                    {/* Email */}
                    <td className="p-6">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Mail className="w-4 h-4 mr-2" /> {candidate.studentEmail}
                      </div>
                    </td>

                    {/* Score */}
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${candidate.score >= 90 ? 'bg-green-500' : candidate.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                            style={{ width: `${candidate.score}%` }}
                          ></div>
                        </div>
                        <span className={`font-bold ${candidate.score >= 90 ? 'text-green-400' : 'text-white'}`}>
                          {candidate.score}
                        </span>
                      </div>
                    </td>

                    {/* Botão Download */}
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => handleDownload(candidate.resumeUrl)}
                        disabled={!candidate.resumeUrl}
                        className="inline-flex items-center px-4 py-2 bg-tq-purple/10 text-tq-purple border border-tq-purple/30 rounded-lg text-sm font-bold hover:bg-tq-purple hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Download className="w-4 h-4 mr-2" /> 
                        {candidate.resumeUrl ? 'Baixar CV' : 'Sem CV'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}