import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/landing-page/landing-page.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
      }
    ]
  },
  {
    path: 'exams',
    children: [
      {
        path: ':technology/:level',
        loadComponent: () => import('./components/exams/exam-list/exam-list.component').then(m => m.ExamListComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./components/exams/exam-detail/exam-detail.component').then(m => m.ExamDetailComponent)
      },
      {
        path: ':id/take',
        loadComponent: () => import('./components/exams/exam-take/exam-take.component').then(m => m.ExamTakeComponent),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];