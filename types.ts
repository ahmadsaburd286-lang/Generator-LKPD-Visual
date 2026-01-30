
export enum LkpdMode {
  MATH = 'MATH',
  LITERACY = 'LITERACY'
}

export type Grade = 1 | 2;

export type QuestionType = 
  | 'ISIAN' 
  | 'PILIHAN_GANDA' 
  | 'MENCOCOKKAN' 
  | 'MEWARNAI' 
  | 'MENARIK_GARIS' 
  | 'BENAR_SALAH';

export interface QuestionTypeConfig {
  type: QuestionType;
  count: number;
}

export interface TeacherInput {
  grade: Grade;
  subject: string;
  topic: string;
  learningObjective: string;
  mode: LkpdMode;
  questionConfigs: QuestionTypeConfig[];
}

export interface ValidationResult {
  isValid: boolean;
  reason?: string;
}

export interface AlignmentRow {
  objective: string;
  activity: string;
  assessment: string;
}

export interface LkpdActivity {
  title: string;
  description: string;
  visualPrompt: string;
  type: QuestionType;
  imageUrl?: string;
}

export interface LkpdData {
  activities: LkpdActivity[];
  writingPrompt: string;
}
