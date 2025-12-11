import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { User, Save, BarChart, UploadCloud, FileText, CheckCircle, FileCheck } from 'lucide-react';

export default function ProfilePage() {
  const userLocal = JSON.parse(localStorage.getItem('user'));
  
  // Estado das Skills
  const [skills, setSkills] = useState({ "Java": 5, "Spring Boot": 5, "React": 5, "SQL": 5 });
  
  // Estados de Upload e Arquivo
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingResume, setExistingResume] = useState(null); // <--- NOVO: Para guardar o nome do arquivo que veio do banco
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [loadingSkills, setLoadingSkills] = useState(false);

  // --- O SEGREDO ESTÁ AQUI: CARREGAR DADOS AO ABRIR ---
  useEffect(() => {
    async function loadProfile() {
      if (!userLocal?.id) return;

      try {
        // Busca os dados do estudante no Backend
        const response = await api.get(`/students/${userLocal.id}`);
        const student = response.data;

        console.log("Perfil carregado:", student);

        // 1. Atualiza as skills se existirem no banco
        if (student.skillsProfile && Object.keys(student.skillsProfile).length > 0) {
          setSkills(student.skillsProfile);
        }

        // 2. Atualiza o nome do currículo se existir
        if (student.resumeUrl) {
          setExistingResume(student.resumeUrl);
        }

      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      }
    }

    loadProfile();
  }, [userLocal.id]); // Executa apenas uma vez quando o ID é identificado
  // -----------------------------------------------------

  async function handleSaveSkills() {
    try {
      setLoadingSkills(true);
      await api.put(`/students/${userLocal.id}/profile`, {
        userId: userLocal.id,
        skills: skills
      });
      alert('Matriz de competências salva com sucesso!');
    } catch (error) {
      alert('Erro ao salvar perfil.');
    } finally {
      setLoadingSkills(false);
    }
  }

  async function handleFileUpload(e) {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploadStatus('uploading');
      await api.post(`/students/${userLocal.id}/resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setUploadStatus('success');
      // Atualiza visualmente o nome do arquivo imediatamente
      setExistingResume(selectedFile.name); 
      alert('Currículo enviado!');
      
    } catch (error) {
      setUploadStatus('error');
      alert('Erro no envio do arquivo.');
    }
  }

  return (
    <div className="min-h-screen bg-tq-dark text-white font-sans">
      <Navbar />
      
      <div className="max-w-5xl mx-auto p-8 animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center gap-6 mb-10 pb-8 border-b border-tq-border">
          <div className="w-24 h-24 bg-gradient-to-br from-tq-purple to-tq-orange rounded-full p-[3px]">
            <div className="w-full h-full bg-tq-dark rounded-full flex items-center justify-center overflow-hidden">
              <User className="w-10 h-10 text-gray-400" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{userLocal.name}</h1>
            <p className="text-tq-purple font-medium flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Perfil de Candidato Ativo
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* CARD 1: SKILLS */}
          <div className="bg-tq-card p-8 rounded-2xl border border-tq-border shadow-xl">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-white">
              <BarChart className="text-tq-purple" /> Calibragem de Skills
            </h2>
            <p className="text-sm text-gray-400 mb-8">
              Estes valores ficam salvos e são usados pelo algoritmo de Match.
            </p>

            <div className="space-y-6">
              {Object.keys(skills).map(skillName => (
                <div key={skillName}>
                  <div className="flex justify-between mb-2 text-sm">
                    <label className="font-bold text-gray-300">{skillName}</label>
                    <span className="text-tq-purple font-bold">{skills[skillName]}/10</span>
                  </div>
                  <input 
                    type="range" min="0" max="10" 
                    value={skills[skillName]}
                    onChange={e => setSkills({...skills, [skillName]: parseInt(e.target.value)})}
                    className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-tq-purple hover:accent-tq-orange transition-all"
                  />
                </div>
              ))}
            </div>

            <button 
              onClick={handleSaveSkills} 
              disabled={loadingSkills}
              className="w-full mt-8 bg-tq-purple hover:bg-tq-purple/90 py-3 rounded-xl font-bold transition-all text-white shadow-lg shadow-tq-purple/20 flex justify-center items-center gap-2"
            >
              {loadingSkills ? 'Salvando...' : <><Save className="w-4 h-4" /> Salvar Alterações</>}
            </button>
          </div>

          {/* CARD 2: UPLOAD DE CURRÍCULO */}
          <div className="bg-tq-card p-8 rounded-2xl border border-tq-border shadow-xl flex flex-col">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-white">
              <FileText className="text-tq-orange" /> Currículo Profissional
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Envie seu PDF para análise automática das empresas.
            </p>

            {/* MOSTRAR ARQUIVO JÁ SALVO - VISUAL NOVO */}
            {existingResume && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <FileCheck className="w-6 h-6 text-green-500" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-green-400 font-bold uppercase mb-0.5">Arquivo Atual Salvo</p>
                  <p className="text-sm text-white truncate font-mono" title={existingResume}>
                    {existingResume.replace(/^cv_[^_]+_/, '')} {/* Remove o UUID feio do começo só visualmente */}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleFileUpload} className="flex-1 flex flex-col">
              <div className="flex-1 border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-tq-orange/50 hover:bg-white/5 transition-all cursor-pointer relative group min-h-[150px]">
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => {
                    setSelectedFile(e.target.files[0]);
                    setUploadStatus('idle');
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="w-14 h-14 bg-black/30 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  {uploadStatus === 'success' ? (
                    <CheckCircle className="w-7 h-7 text-green-500" />
                  ) : (
                    <UploadCloud className="w-7 h-7 text-tq-text group-hover:text-tq-orange transition-colors" />
                  )}
                </div>
                
                {selectedFile ? (
                  <span className="text-tq-orange font-bold text-sm break-all">{selectedFile.name}</span>
                ) : (
                  <>
                    <span className="text-white font-medium block mb-1">
                      {existingResume ? 'Clique para substituir' : 'Clique para selecionar'}
                    </span>
                    <span className="text-gray-500 text-xs">PDF (Máx 10MB)</span>
                  </>
                )}
              </div>

              <button 
                type="submit" 
                disabled={!selectedFile || uploadStatus === 'uploading'}
                className="w-full mt-6 bg-white/10 hover:bg-white/20 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white flex justify-center items-center gap-2"
              >
                {uploadStatus === 'uploading' ? 'Enviando...' : 
                 uploadStatus === 'success' ? 'Enviado com Sucesso!' : 
                 uploadStatus === 'error' ? 'Tentar Novamente' : 'Enviar Arquivo'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}