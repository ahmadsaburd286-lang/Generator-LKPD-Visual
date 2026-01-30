
import React, { useState } from 'react';
import { TeacherInput, LkpdMode, Grade, ValidationResult, AlignmentRow, LkpdData, QuestionType, QuestionTypeConfig, LkpdActivity } from './types';
import { validateObjective, generateAlignmentTable, generateLkpdContent, generateActivityImage } from './services/geminiService';
import { Layout, CheckCircle, XCircle, FileText, Printer, ChevronRight, PenTool, BookOpen, List, Check, Plus, Minus, Zap, Target, Baby, ImageIcon } from 'lucide-react';
import VisualLkpd from './components/VisualLkpd';

const QUESTION_TYPES: {id: QuestionType, label: string, icon: string}[] = [
  { id: 'ISIAN', label: 'Isian Singkat', icon: '📝' },
  { id: 'PILIHAN_GANDA', label: 'Pilihan Ganda', icon: '🔘' },
  { id: 'MENCOCOKKAN', label: 'Mencocokkan', icon: '🤝' },
  { id: 'MEWARNAI', label: 'Mewarnai', icon: '🎨' },
  { id: 'MENARIK_GARIS', label: 'Menarik Garis', icon: '📏' },
  { id: 'BENAR_SALAH', label: 'Benar / Salah', icon: '✅' },
];

const App: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [input, setInput] = useState<TeacherInput>({
    grade: 1,
    subject: '',
    topic: '',
    learningObjective: '',
    mode: LkpdMode.MATH,
    questionConfigs: [{ type: 'ISIAN', count: 1 }]
  });
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [alignment, setAlignment] = useState<AlignmentRow[]>([]);
  const [lkpdData, setLkpdData] = useState<LkpdData | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const toggleQuestionType = (type: QuestionType) => {
    setInput(prev => {
      const existing = prev.questionConfigs.find(c => c.type === type);
      if (existing) {
        if (prev.questionConfigs.length === 1) return prev;
        return {
          ...prev,
          questionConfigs: prev.questionConfigs.filter(c => c.type !== type)
        };
      }
      return {
        ...prev,
        questionConfigs: [...prev.questionConfigs, { type, count: 1 }]
      };
    });
  };

  const updateCount = (type: QuestionType, delta: number) => {
    setInput(prev => ({
      ...prev,
      questionConfigs: prev.questionConfigs.map(c => 
        c.type === type ? { ...c, count: Math.max(1, Math.min(5, c.count + delta)) } : c
      )
    }));
  };

  const totalQuestions = input.questionConfigs.reduce((sum, c) => sum + c.count, 0);

  const startValidation = async () => {
    if (!input.subject || !input.topic || !input.learningObjective) {
      setValidation({ isValid: false, reason: "Mohon lengkapi semua data mata pelajaran, materi, dan tujuan." });
      return;
    }
    setLoading(true);
    setLoadingMessage(`Memeriksa Tujuan Pembelajaran...`);
    const result = await validateObjective(input.learningObjective, input.grade);
    setValidation(result);
    if (result.isValid) {
      const table = await generateAlignmentTable(input);
      setAlignment(table);
      setStep(2);
    }
    setLoading(false);
  };

  const processLkpd = async () => {
    setLoading(true);
    setLoadingMessage('Menyusun petualangan...');
    try {
      const content = await generateLkpdContent(input);
      const activitiesWithImages: LkpdActivity[] = [];
      
      // Proses gambar secara SEKUENSIAL untuk stabilitas
      for (let i = 0; i < content.activities.length; i++) {
        const activity = content.activities[i];
        setLoadingMessage(`Melukis visual soal ${i + 1} dari ${content.activities.length}...`);
        
        let imageUrl = "";
        let retries = 2; // Sistem retry 2 kali jika gagal
        
        while (retries > 0 && !imageUrl) {
          try {
            imageUrl = await generateActivityImage(activity.visualPrompt);
          } catch (e) {
            console.warn(`Gagal memuat gambar ${i+1}, mencoba lagi...`);
            retries--;
            await new Promise(r => setTimeout(r, 1000)); // Delay sebentar sebelum retry
          }
        }
        
        activitiesWithImages.push({ ...activity, imageUrl });
      }

      setLkpdData({ ...content, activities: activitiesWithImages });
      setStep(3);
    } catch (error) {
      console.error(error);
      setValidation({ isValid: false, reason: "Terjadi kesalahan sistem. Coba kurangi jumlah soal." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pb-10 bg-[#f8fafc]">
      <header className="bg-green-600 text-white p-6 shadow-md mb-8 no-print">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="bg-white/20 p-2 rounded-2xl">
            <PenTool size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase italic leading-none">Generator LKPD Visual</h1>
            <p className="text-green-100 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Sains & Literasi • Fase A (Kelas 1-2)</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-500 no-print">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border-2 border-green-50">
              <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-green-800 uppercase italic">
                <BookOpen className="text-green-600" />
                Langkah 1: Rencana Petualangan
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Pilih Tingkat Kelas</label>
                  <div className="flex gap-3">
                    {[1, 2].map((g) => (
                      <button
                        key={g}
                        onClick={() => setInput(prev => ({ ...prev, grade: g as Grade }))}
                        className={`flex-1 py-4 rounded-2xl border-4 font-black transition-all flex items-center justify-center gap-3 ${
                          input.grade === g 
                            ? 'bg-green-600 border-green-200 text-white shadow-lg' 
                            : 'bg-white border-gray-50 text-gray-400 hover:border-green-100'
                        }`}
                      >
                        <Baby size={20} />
                        Kelas {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mode Belajar</label>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setInput(prev => ({ ...prev, mode: LkpdMode.MATH }))} 
                      className={`flex-1 py-4 rounded-2xl border-4 font-black text-xs uppercase tracking-widest transition-all ${
                        input.mode === LkpdMode.MATH ? 'bg-green-50 border-green-400 text-green-700' : 'bg-white border-gray-50 text-gray-400'
                      }`}
                    >🔢 Angka</button>
                    <button 
                      onClick={() => setInput(prev => ({ ...prev, mode: LkpdMode.LITERACY }))} 
                      className={`flex-1 py-4 rounded-2xl border-4 font-black text-xs uppercase tracking-widest transition-all ${
                        input.mode === LkpdMode.LITERACY ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-white border-gray-50 text-gray-400'
                      }`}
                    >🔤 Huruf</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mata Pelajaran</label>
                  <input type="text" name="subject" value={input.subject} onChange={handleInputChange} placeholder="IPA / Matematika" className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-green-400 outline-none transition-all font-bold bg-gray-50/50 shadow-inner" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Materi Pokok</label>
                  <input type="text" name="topic" value={input.topic} onChange={handleInputChange} placeholder="Topik Bahasan" className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-green-400 outline-none transition-all font-bold bg-gray-50/50 shadow-inner" />
                </div>
              </div>

              <div className="space-y-2 mb-8">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tujuan Pembelajaran (Input Guru)</label>
                <textarea name="learningObjective" value={input.learningObjective} onChange={handleInputChange} rows={3} placeholder="Apa yang harus dicapai siswa?" className="w-full p-4 rounded-2xl border-2 border-gray-100 focus:border-green-400 outline-none transition-all resize-none font-medium bg-gray-50/50 shadow-inner" />
              </div>

              <div className="mb-8 p-6 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[2rem]">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Misi & Jumlah Soal</label>
                  <div className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">
                    Total: {totalQuestions} Soal
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {QUESTION_TYPES.map(q => {
                    const config = input.questionConfigs.find(c => c.type === q.id);
                    const isActive = !!config;
                    return (
                      <div key={q.id} className={`relative p-4 rounded-[1.5rem] border-4 transition-all ${isActive ? 'bg-green-600 border-green-200 shadow-lg' : 'bg-white border-white hover:border-green-100 shadow-sm'}`}>
                        <button onClick={() => toggleQuestionType(q.id)} className="w-full text-left flex items-start gap-3 mb-3">
                           <span className="text-2xl">{q.icon}</span>
                           <span className={`text-xs font-black leading-tight uppercase ${isActive ? 'text-white' : 'text-gray-500'}`}>{q.label}</span>
                        </button>
                        {isActive && (
                          <div className="flex items-center justify-between bg-white/20 p-2 rounded-xl mt-auto">
                            <button onClick={() => updateCount(q.id, -1)} className="p-1 hover:bg-white/20 rounded-lg text-white"><Minus size={14} /></button>
                            <span className="text-sm font-black text-white">{config.count}</span>
                            <button onClick={() => updateCount(q.id, 1)} className="p-1 hover:bg-white/20 rounded-lg text-white"><Plus size={14} /></button>
                          </div>
                        )}
                        {isActive && <Check size={16} className="absolute top-2 right-2 text-white/50" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button onClick={startValidation} disabled={loading} className="w-full py-6 bg-green-600 text-white font-black rounded-[2rem] hover:bg-green-700 shadow-xl shadow-green-100 uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
                {loading ? (
                  <div className="flex items-center gap-3 italic">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {loadingMessage}
                  </div>
                ) : <><Zap size={20} fill="currentColor" /> Buat Petualangan Kelas {input.grade}</>}
              </button>
            </div>
            
            {validation && !validation.isValid && (
              <div className="p-5 bg-red-50 border-4 border-red-100 rounded-3xl flex items-center gap-4">
                <XCircle className="text-red-500 shrink-0" size={24} />
                <p className="text-red-800 text-sm font-bold uppercase tracking-tight leading-tight">{validation.reason}</p>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in duration-500 no-print">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border-2 border-green-100">
               <div className="flex items-center gap-5 mb-10">
                  <div className="bg-green-100 p-5 rounded-[2rem] text-green-600 shadow-inner">
                    <CheckCircle size={40} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-800 uppercase italic leading-none">Misi Disetujui!</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-3">Kurikulum Kelas {input.grade} Terhubung</p>
                  </div>
               </div>

               <div className="overflow-hidden rounded-[2.5rem] border-4 border-gray-50 mb-10">
                  <table className="w-full text-left text-xs font-bold text-gray-600">
                    <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <tr>
                        <th className="p-6">Tujuan</th>
                        <th className="p-6">Aktivitas</th>
                        <th className="p-6">Asesmen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alignment.map((row, idx) => (
                        <tr key={idx} className="border-t-2 border-gray-50 hover:bg-green-50/50 transition-colors">
                          <td className="p-6 italic text-gray-400">"{row.objective}"</td>
                          <td className="p-6">{row.activity}</td>
                          <td className="p-6 text-green-700">{row.assessment}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>

               <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-5 bg-gray-50 text-gray-400 font-black rounded-3xl uppercase tracking-widest">Revisi</button>
                  <button onClick={processLkpd} disabled={loading} className="flex-[2] py-5 bg-green-600 text-white font-black rounded-3xl uppercase tracking-widest shadow-xl shadow-green-100 flex items-center justify-center gap-3">
                    {loading ? (
                      <div className="flex items-center gap-3 italic text-sm">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {loadingMessage}
                      </div>
                    ) : "Bangun Visual Petualangan"}
                  </button>
               </div>
            </div>
          </div>
        )}

        {step === 3 && lkpdData && (
          <div className="animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center mb-8 no-print px-4">
              <button onClick={() => setStep(2)} className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-green-600 flex items-center gap-2">
                 <ChevronRight className="rotate-180" size={16} /> Kembali
              </button>
              <button onClick={() => window.print()} className="bg-green-600 text-white px-10 py-4 rounded-[2rem] font-black shadow-xl flex items-center gap-3 uppercase text-sm">
                <Printer size={20} /> Cetak Lembar Misi
              </button>
            </div>
            <div className="bg-white md:rounded-[4rem] shadow-2xl overflow-hidden border-4 border-gray-50 print:border-none">
               <VisualLkpd input={input} data={lkpdData} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
