import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { AuthService } from '../../../services/auth.service';
import { Exam } from '../../../model/exam.model';

@Component({
  selector: 'app-exam-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './exam-detail.component.html',
  styleUrls: ['./exam-detail.component.scss']
})
export class ExamDetailComponent implements OnInit {
  private examService = inject(ExamService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  examId: string = '';
  exam: Exam | null = null;
  loading: boolean = true;
  error: string = '';
  
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
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load exam details. Please try again later.';
        this.loading = false;
        console.error('Error loading exam:', err);
      }
    });
  }
  
  startExam(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: `/exams/${this.examId}/take` } 
      });
      return;
    }
    
    this.router.navigate(['/exams', this.examId, 'take']);
  }
  
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}