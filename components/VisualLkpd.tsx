
import React from 'react';
import { TeacherInput, LkpdData, LkpdMode, QuestionType } from '../types';
import { Star, Smile, Heart, User, Calendar, Book, Info, Layout, XCircle, Image as ImageIcon, Zap, Target, PenTool, Award } from 'lucide-react';

interface VisualLkpdProps {
  input: TeacherInput;
  data: LkpdData;
}

const VisualLkpd: React.FC<VisualLkpdProps> = ({ input, data }) => {
  const renderAnswerArea = (type: QuestionType) => {
    switch (type) {
      case 'PILIHAN_GANDA':
        return (
          <div className="grid grid-cols-1 gap-3 mt-4">
            {['A', 'B', 'C'].map(opt => (
              <div key={opt} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full border-4 border-gray-100 flex items-center justify-center font-black text-gray-300 bg-white group-hover:border-green-200 transition-colors">{opt}</div>
                <div className="h-10 flex-grow border-2 border-gray-50 bg-gray-50/50 rounded-xl border-dashed"></div>
              </div>
            ))}
          </div>
        );
      case 'BENAR_SALAH':
        return (
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-3 px-6 py-4 border-4 border-green-50 rounded-[1.5rem] bg-white">
              <div className="w-10 h-10 rounded-xl border-4 border-green-100 flex items-center justify-center font-black text-green-200 text-xl">V</div>
              <span className="font-black text-green-700 text-xs uppercase tracking-widest">Benar</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-4 border-4 border-red-50 rounded-[1.5rem] bg-white">
              <div className="w-10 h-10 rounded-xl border-4 border-red-100 flex items-center justify-center font-black text-red-200 text-xl">X</div>
              <span className="font-black text-red-700 text-xs uppercase tracking-widest">Salah</span>
            </div>
          </div>
        );
      case 'MENARIK_GARIS':
        return (
          <div className="mt-4 p-4 bg-blue-50/30 rounded-[2rem] border-2 border-blue-50 border-dashed flex items-center justify-center h-24">
            <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Tarik Garis Hubung ke Sini ➔</p>
          </div>
        );
      case 'MENCOCOKKAN':
        return (
          <div className="mt-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-50 border-4 border-yellow-100 rounded-2xl flex items-center justify-center">
              <span className="text-yellow-200 font-black">?</span>
            </div>
            <div className="h-1 bg-yellow-100 w-12 rounded-full"></div>
            <div className="w-16 h-16 bg-gray-50 border-4 border-gray-100 rounded-2xl border-dashed"></div>
          </div>
        );
      case 'MEWARNAI':
        return (
          <div className="mt-4 p-4 border-4 border-pink-50 rounded-[2rem] border-dashed flex flex-col items-center">
            <div className="flex gap-2 mb-2">
              <div className="w-4 h-4 rounded-full bg-red-400" />
              <div className="w-4 h-4 rounded-full bg-yellow-400" />
              <div className="w-4 h-4 rounded-full bg-blue-400" />
              <div className="w-4 h-4 rounded-full bg-green-400" />
            </div>
            <p className="text-[10px] font-black text-pink-300 uppercase tracking-widest">Warnai Gambar di Samping!</p>
          </div>
        );
      default: // ISIAN
        return (
          <div className="relative mt-4">
            <div className="h-28 w-full bg-gray-50 border-4 border-gray-100 rounded-[2rem] border-dashed flex items-center justify-center overflow-hidden">
               <PenTool size={32} className="text-gray-100 absolute -bottom-2 -right-2 rotate-12" />
            </div>
            <p className="text-[10px] text-gray-300 mt-2 font-black uppercase text-center tracking-widest">Tulis Jawaban di Atas 👆</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6 md:p-12 text-gray-800 max-w-full bg-white relative overflow-hidden">
      {/* Decorative Adventure Background Props */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 no-print">
        <Award size={300} className="text-green-600" />
      </div>

      {/* Header identity */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-8 border-b-8 border-double border-green-50 pb-10">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white px-5 py-2 rounded-full text-xs font-black uppercase mb-4 shadow-lg">
            <Zap size={16} fill="currentColor" />
            Misi Belajar: {input.subject}
          </div>
          <h1 className="text-4xl font-black text-green-700 leading-none tracking-tighter mb-2 uppercase italic">
            {input.topic || "Eksplorasi Hebat"}
          </h1>
          <div className="flex gap-4 font-black text-[10px] text-gray-400 uppercase tracking-widest">
             <span className="flex items-center gap-1"><Heart size={12} className="text-red-400" /> Kelas {input.grade} SD</span>
             <span className="flex items-center gap-1 text-green-500"><Award size={12} /> Kurikulum Merdeka</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 w-full md:w-80">
          <div className="bg-gray-50/50 p-4 rounded-3xl border-2 border-gray-50 flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl shadow-sm text-gray-300"><User size={20} /></div>
            <div className="flex-grow">
               <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Nama Detektif Kecil</p>
               <div className="h-6 border-b-2 border-gray-200"></div>
            </div>
          </div>
          <div className="bg-gray-50/50 p-4 rounded-3xl border-2 border-gray-50 flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl shadow-sm text-gray-300"><Calendar size={20} /></div>
            <div className="flex-grow">
               <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Hari Penjelajahan</p>
               <div className="h-6 border-b-2 border-gray-200"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Box */}
      <div className="bg-gradient-to-br from-green-50 to-white rounded-[3rem] p-8 mb-12 border-4 border-green-100 shadow-sm relative overflow-hidden group">
        <div className="flex items-start gap-6 relative z-10">
          <div className="bg-green-600 p-4 rounded-3xl shadow-xl text-white transform -rotate-6 group-hover:rotate-0 transition-transform">
            <Target size={32} />
          </div>
          <div>
            <h2 className="font-black text-green-600 uppercase text-xs tracking-[0.2em] mb-2">Target Misi Kita:</h2>
            <p className="text-xl text-gray-700 font-bold leading-relaxed italic">
              "{input.learningObjective}"
            </p>
          </div>
        </div>
      </div>

      {/* Activities */}
      <div className="space-y-16 mb-16">
        {data.activities.map((activity, idx) => (
          <div key={idx} className="relative group animate-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 150}ms` }}>
            {/* Level Indicator */}
            <div className="absolute -top-6 -left-2 z-20 flex items-center gap-2">
               <div className="bg-yellow-400 text-yellow-900 font-black px-6 py-2 rounded-full shadow-xl text-xs border-4 border-white uppercase tracking-tighter flex items-center gap-2 transform -rotate-2">
                  Tantangan {idx + 1}
               </div>
               {idx === data.activities.length - 1 && (
                 <div className="bg-red-500 text-white font-black px-4 py-1 rounded-full text-[10px] uppercase shadow-lg animate-pulse">Boss Level!</div>
               )}
            </div>

            <div className="bg-white border-[6px] border-gray-50 rounded-[4rem] p-10 hover:border-green-100 transition-all flex flex-col md:flex-row gap-12 shadow-sm hover:shadow-xl relative overflow-hidden">
               {/* Left side: Visuals */}
               <div className="md:w-5/12">
                 <div className="bg-gray-50 border-8 border-white rounded-[3rem] h-72 flex items-center justify-center overflow-hidden shadow-inner relative group-hover:scale-[1.03] transition-transform duration-500">
                    {activity.imageUrl ? (
                      <img 
                        src={activity.imageUrl} 
                        alt={activity.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-200 flex flex-col items-center">
                         <ImageIcon size={64} />
                         <span className="text-xs font-black mt-4 uppercase tracking-widest">Memuat Visual...</span>
                      </div>
                    )}
                    
                    {/* Interaction Stars */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1 no-print">
                       {[1,2,3].map(i => (
                         <div key={i} className="bg-white/80 backdrop-blur-sm p-2 rounded-full border border-white shadow-sm">
                           <Star size={16} className="text-gray-200" />
                         </div>
                       ))}
                       <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white shadow-sm flex items-center gap-2">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sangat Hebat!</span>
                       </div>
                    </div>
                 </div>
               </div>

               {/* Right side: Instructions & Response */}
               <div className="md:w-7/12 flex flex-col justify-center">
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                       <span className="px-3 py-1 bg-gray-100 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest">Tipe: {activity.type.replace('_', ' ')}</span>
                    </div>
                    <h4 className="font-black text-3xl text-gray-800 mb-4 group-hover:text-green-600 transition-colors leading-tight tracking-tighter">
                      {activity.title}
                    </h4>
                    <p className="text-xl text-gray-600 font-bold leading-relaxed bg-yellow-50/50 p-4 rounded-3xl border-l-8 border-yellow-200">
                      {activity.description}
                    </p>
                  </div>

                  <div className="mt-auto">
                    {renderAnswerArea(activity.type)}
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bonus Area */}
      <div className="mt-20 transform rotate-[-1deg]">
        <div className="bg-yellow-400 p-2 rounded-[4rem] shadow-2xl">
           <div className="bg-white rounded-[3.8rem] p-12 border-8 border-yellow-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 p-10">
                 <PenTool size={100} />
              </div>
              <div className="flex items-center gap-4 mb-8">
                 <div className="bg-yellow-400 text-yellow-900 p-4 rounded-3xl shadow-lg">
                   <Star size={28} fill="currentColor" />
                 </div>
                 <div>
                    <h4 className="font-black text-3xl text-yellow-900 uppercase italic tracking-tighter">Misi Penutup Rahasia!</h4>
                    <p className="text-xs font-black text-yellow-600/50 tracking-widest uppercase">Bonus Koin Bintang</p>
                 </div>
              </div>
              
              <p className="text-2xl text-gray-700 font-black mb-10 leading-relaxed italic border-l-8 border-yellow-200 pl-8">
                "{data.writingPrompt}"
              </p>
              
              <div className="space-y-8">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="h-12 border-b-4 border-gray-50 border-dotted w-full"></div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* Footer Feedback */}
      <div className="mt-24 pt-12 border-t-8 border-double border-gray-50 flex flex-col md:flex-row items-start justify-between gap-12">
        <div className="w-full md:w-auto">
          <h4 className="font-black text-gray-400 text-xs uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <Smile size={18} className="text-yellow-400" />
            Evaluasi Perasaanmu:
          </h4>
          <div className="flex gap-8">
            {[
              { icon: '😊', label: 'MUDAH' },
              { icon: '🤩', label: 'SERU' },
              { icon: '🤔', label: 'MENANTANG' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3 group cursor-pointer">
                <div className="w-20 h-20 rounded-[2rem] bg-gray-50 border-4 border-white shadow-sm flex items-center justify-center text-3xl transition-all group-hover:scale-110 group-hover:bg-green-50">
                  {item.icon}
                </div>
                <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-8 w-full md:w-auto">
          <div className="text-center flex-1 md:flex-none">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3">Tanda Tangan Wali</p>
            <div className="h-24 w-36 bg-gray-50 border-4 border-gray-100 rounded-[2rem] border-dashed"></div>
          </div>
          <div className="text-center flex-1 md:flex-none">
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3">Bintang Dari Guru</p>
            <div className="h-24 w-44 bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-white shadow-inner rounded-[2.5rem] flex items-center justify-center gap-2">
               <Star size={20} className="text-yellow-100" />
               <Star size={32} className="text-yellow-100" />
               <Star size={20} className="text-yellow-100" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center text-gray-200 no-print">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-4">
           Teruslah Bermimpi • Teruslah Belajar
         </p>
      </div>
    </div>
  );
};

export default VisualLkpd;
