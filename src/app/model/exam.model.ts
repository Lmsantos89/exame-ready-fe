/**
 * Exam model interfaces
 */

export interface Technology {
  id: string;
  name: string;
  description: string;
  levels: ExamLevel[];
}

export enum ExamLevel {
  JUNIOR = 'Junior',
  INTERMEDIATE = 'Intermediate',
  SENIOR = 'Senior'
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  technology: string;
  level: ExamLevel;
  duration: number; // in minutes
  totalQuestions: number;
  passingScore: number;
  createdAt: string;
  isGenAI: boolean;
}

export interface Question {
  id: string;
  examId: string;
  text: string;
  options: Option[];
  explanation?: string;
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface ExamResult {
  id: string;
  examId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  passed: boolean;
}