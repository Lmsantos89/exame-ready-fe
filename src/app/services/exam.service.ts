import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Exam, Question, ExamResult, Technology } from '../model/exam.model';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  
  getTechnologies(): Observable<Technology[]> {
    return this.http.get<Technology[]>(`${this.apiUrl}/api/technologies`);
  }
  
  getExamsByTechnology(technologyId: string): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.apiUrl}/api/technologies/${technologyId}/exams`);
  }
  
  getExamById(examId: string): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/api/exams/${examId}`);
  }
  
  getExamQuestions(examId: string): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/api/exams/${examId}/questions`);
  }
  
  submitExamResults(examId: string, answers: Record<string, string>): Observable<ExamResult> {
    return this.http.post<ExamResult>(`${this.apiUrl}/api/exams/${examId}/submit`, { answers });
  }
  
  generateAIExam(technologyId: string, level: string): Observable<Exam> {
    return this.http.post<Exam>(`${this.apiUrl}/api/exams/generate`, { 
      technologyId, 
      level 
    });
  }
}