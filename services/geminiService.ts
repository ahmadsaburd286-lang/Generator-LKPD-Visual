
import { GoogleGenAI, Type } from "@google/genai";
import { LkpdMode, TeacherInput, ValidationResult, AlignmentRow, LkpdData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const validateObjective = async (objective: string, grade: number): Promise<ValidationResult> => {
  if (!objective || objective.trim() === "") {
    return { isValid: false, reason: "❗ Tujuan pembelajaran belum diisi oleh guru." };
  }

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Validasi Tujuan Pembelajaran berikut untuk siswa Kelas ${grade} SD (Fase A) di wilayah pedesaan:
    "${objective}"
    
    Kriteria:
    1. Dapat diamati dan diukur
    2. Sesuai perkembangan siswa kelas ${grade}
    3. Fokus pada satu kompetensi utama
    4. Menggunakan kata kerja operasional (KKO) yang sesuai untuk kelas ${grade}
    
    Balas dengan format JSON saja.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isValid: { type: Type.BOOLEAN },
          reason: { type: Type.STRING }
        },
        required: ["isValid", "reason"]
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return { isValid: false, reason: "Gagal memvalidasi tujuan pembelajaran." };
  }
};

export const generateAlignmentTable = async (input: TeacherInput): Promise<AlignmentRow[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Buat tabel penyelarasan untuk LKPD Kelas ${input.grade} SD.
    Tujuan Pembelajaran: "${input.learningObjective}"
    Mata Pelajaran: "${input.subject}"
    Materi: "${input.topic}"
    
    Hasilkan dalam format JSON Array of objects dengan property: objective, activity, assessment.
    INGAT: Jangan mengubah teks Tujuan Pembelajaran.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            objective: { type: Type.STRING },
            activity: { type: Type.STRING },
            assessment: { type: Type.STRING }
          },
          required: ["objective", "activity", "assessment"]
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateLkpdContent = async (input: TeacherInput): Promise<LkpdData> => {
  const configDescriptions = input.questionConfigs
    .map(c => `${c.count} soal tipe ${c.type}`)
    .join(", ");

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Anda adalah desainer LKPD kreatif untuk anak desa. Buatlah LKPD bergaya "PETUALANGAN DETEKTIF".
    
    KELAS: ${input.grade} SD (Fase A)
    TEMA: ${input.topic} (${input.subject})
    TUJUAN: ${input.learningObjective}
    DISTRIBUSI MISI: ${configDescriptions}
    
    SYARAT OUTPUT:
    1. Kelas 1: Kosakata sangat sederhana. Kelas 2: Penerapan sederhana.
    2. visualPrompt: HARUS deskripsi bahasa Inggris yang mendalam tentang SATU objek atau scene sederhana. 
       Contoh: "A happy water buffalo standing in a green rice field under the sun, simple cartoon style, thick outlines".
       HINDARI teks di dalam gambar.
    3. Hasilkan TOTAL ${input.questionConfigs.reduce((sum, c) => sum + c.count, 0)} aktivitas soal.
    4. Pastikan JUMLAH soal untuk setiap tipe TEPAT.
    
    Hasilkan dalam format JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                visualPrompt: { type: Type.STRING },
                type: { type: Type.STRING }
              },
              required: ["title", "description", "visualPrompt", "type"]
            }
          },
          writingPrompt: { type: Type.STRING }
        },
        required: ["activities", "writingPrompt"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateActivityImage = async (prompt: string): Promise<string> => {
  // Menambahkan wrapper prompt untuk estetika worksheet anak
  const enhancedPrompt = `High-quality, cute educational illustration for children. Subject: ${prompt}. Clean bold outlines, vibrant flat colors, white background, no text, no messy details, professional cartoon style.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: enhancedPrompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return "";
};
