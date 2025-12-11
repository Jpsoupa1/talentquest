import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Play, ArrowLeft, Cpu, Terminal, CheckCircle2, XCircle, Zap } from 'lucide-react';

export default function ChallengePage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const challenge = state?.challenge;

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const studentId = user.id || 4; // Fallback para demo

  const [code, setCode] = useState('// Ambiente Java Seguro v17\n// Escreva sua solução abaixo...\n\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!challenge) return <div className="p-10 text-white bg-tq-dark h-screen">Erro: Nenhum desafio selecionado.</div>;

  async function handleSubmit() {
    setLoading(true);
    try {
      const res = await api.post('/submissions', { studentId, challengeId: challenge.id, code });
      setResult(res.data);
    } catch (err) { alert('Erro ao submeter.'); } 
    finally { setLoading(false); }
  }

  return (
    <div className="h-screen flex flex-col bg-tq-dark text-gray-300 font-sans overflow-hidden">
      {/* Header IDE */}
      <header className="h-16 bg-tq-card border-b border-white/10 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/jobs')} className="hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
            <ArrowLeft className="w-5 h-5"/>
          </button>
          <div>
            <span className="text-xs text-tq-purple font-bold tracking-wider uppercase">Desafio Técnico</span>
            <h1 className="font-bold text-white text-lg flex items-center gap-2">
              <Cpu className="w-5 h-5 text-tq-orange"/> {challenge.title}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono bg-black/40 px-3 py-1.5 rounded text-tq-text border border-white/5">
            Java Environment v17
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Painel Esquerdo: Problema */}
        <div className="w-1/3 border-r border-white/10 flex flex-col bg-tq-dark/50 p-6 overflow-y-auto custom-scrollbar">
          <h2 className="text-xl font-bold text-white mb-6">Instruções</h2>
          <p className="text-gray-400 mb-8 leading-relaxed text-sm">
            {challenge.problemStatement}
          </p>

          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-tq-purple to-tq-orange rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative bg-black p-4 rounded-lg border border-white/10">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Input Exemplo</h3>
                <code className="font-mono text-green-400 text-sm block">{challenge.inputSample}</code>
              </div>
            </div>

            <div className="relative">
              <div className="bg-black p-4 rounded-lg border border-white/10">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Output Esperado</h3>
                <code className="font-mono text-tq-orange text-sm block">{challenge.outputExpected}</code>
              </div>
            </div>
          </div>
        </div>

        {/* Painel Direito: Editor */}
        <div className="w-2/3 flex flex-col bg-[#0b101e]">
          <textarea value={code} onChange={e => setCode(e.target.value)}
            className="flex-1 bg-[#0b101e] text-gray-300 p-6 font-mono text-sm resize-none focus:outline-none custom-scrollbar leading-6" 
            spellCheck="false" 
          />
          
          <div className="h-20 bg-tq-card border-t border-white/10 flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Terminal className="w-4 h-4 text-tq-purple" />
              <span>Console Ready...</span>
            </div>
            
            <button onClick={handleSubmit} disabled={loading}
              className={`flex items-center px-8 py-3 rounded-xl font-bold text-white transition-all transform active:scale-95 ${
                loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-gradient-to-r from-tq-purple to-tq-orange hover:shadow-lg hover:shadow-tq-purple/25'
              }`}>
              {loading ? 'Processando...' : <><Play className="w-4 h-4 mr-2 fill-current"/> Executar Código</>}
            </button>
          </div>

          {/* Resultado Overlay */}
          {result && (
            <div className={`p-6 border-t border-white/10 animate-in slide-in-from-bottom-10 fade-in duration-300 ${
              result.score >= 70 ? 'bg-green-900/10 border-green-500/20' : 'bg-red-900/10 border-red-500/20'
            }`}>
              <div className="flex items-start gap-5">
                <div className={`p-3 rounded-full ${result.score >= 70 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {result.score >= 70 ? <CheckCircle2 className="w-8 h-8"/> : <XCircle className="w-8 h-8"/>}
                </div>
                <div>
                  <h3 className={`font-bold text-lg mb-1 ${result.score >= 70 ? 'text-white' : 'text-red-200'}`}>
                    {result.score >= 70 ? 'Missão Cumprida!' : 'Compilação Falhou ou Score Baixo'}
                  </h3>
                  <div className="text-3xl font-bold text-white mb-2 flex items-baseline gap-2">
                    {result.score}<span className="text-sm text-gray-500 font-normal">/100 Points</span>
                  </div>
                  <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
                    {result.feedback}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}