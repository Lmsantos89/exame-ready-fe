import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { Exam, Question } from '../../../model/exam.model';

@Component({
  selector: 'app-exam-take',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exam-take.component.html',
  styleUrls: ['./exam-take.component.scss']
})
export class ExamTakeComponent implements OnInit {
  private examService = inject(ExamService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  examId: string = '';
  exam: Exam | null = null;
  questions: Question[] = [];
  currentQuestionIndex: number = 0;
  answers: Record<string, string> = {};
  timeRemaining: number = 0;
  timerInterval: any;
  
  loading: boolean = true;
  error: string = '';
  examSubmitted: boolean = false;
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.examId = params['id'];
      this.loadExam();
    });
  }
  
  loadExam(): void {
    this.loading = true;
    this.error = '';
    
    this.examService.getExamById(this.examId).subscribe({
      next: (exam) => {
        this.exam = exam;
        this.timeRemaining = exam.duration * 60; // Convert minutes to seconds
        this.startTimer();
        this.loadQuestions();
      },
      error: (err) => {
        this.error = 'Failed to load exam. Please try again later.';
        this.loading = false;
        console.error('Error loading exam:', err);
      }
    });
  }
  
  loadQuestions(): void {
    this.examService.getExamQuestions(this.examId).subscribe({
      next: (questions) => {
        this.questions = questions;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load exam questions. Please try again later.';
        this.loading = false;
        console.error('Error loading questions:', err);
      }
    });
  }
  
  startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        this.submitExam();
      }
    }, 1000);
  }
  
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
  
  getCurrentQuestion(): Question | undefined {
    return this.questions[this.currentQuestionIndex];
  }
  
  selectAnswer(questionId: string, optionId: string): void {
    this.answers[questionId] = optionId;
  }
  
  isAnswerSelected(questionId: string, optionId: string): boolean {
    return this.answers[questionId] === optionId;
  }
  
  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }
  
  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }
  
  goToQuestion(index: number): void {
    if (index >= 0 && index < this.questions.length) {
      this.currentQuestionIndex = index;
    }
  }
  
  isQuestionAnswered(questionId: string): boolean {
    return !!this.answers[questionId];
  }
  
  getAnsweredQuestionsCount(): number {
    return Object.keys(this.answers).length;
  }
  
  submitExam(): void {
    clearInterval(this.timerInterval);
    this.examSubmitted = true;
    
    this.examService.submitExamResults(this.examId, this.answers).subscribe({
      next: (result) => {
        // Navigate to results page with the result data
        this.router.navigate(['/exams', this.examId, 'results'], { 
          state: { result } 
        });
      },
      error: (err) => {
        console.error('Error submitting exam:', err);
        // Handle error but still navigate away from the exam
        this.router.navigate(['/exams', this.examId]);
      }
    });
  }
  
  confirmSubmit(): void {
    if (confirm('Are you sure you want to submit your exam? You cannot change your answers after submission.')) {
      this.submitExam();
    }
  }
  
  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}