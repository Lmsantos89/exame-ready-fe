import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { Exam } from '../../../model/exam.model';

@Component({
  selector: 'app-exam-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.scss']
})
export class ExamListComponent implements OnInit {
  private examService = inject(ExamService);
  private route = inject(ActivatedRoute);
  
  technology: string = '';
  level: string = '';
  exams: Exam[] = [];
  loading: boolean = true;
  error: string = '';
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.technology = params['technology'];
      this.level = params['level'];
      this.loadExams();
    });
  }
  
  loadExams(): void {
    this.loading = true;
    this.error = '';
    
    this.examService.getExamsByTechnology(this.technology).subscribe({
      next: (exams) => {
        // Filter by level if provided
        if (this.level) {
          this.exams = exams.filter(exam => 
            exam.level.toLowerCase() === this.level.toLowerCase()
          );
        } else {
          this.exams = exams;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load exams. Please try again later.';
        this.loading = false;
        console.error('Error loading exams:', err);
      }
    });
  }
}