import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SignUpRequest } from '../../../model/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  
  // Password validator functions
  uppercaseValidator(control: any) {
    if (!control.value) return null;
    const value = control.value;
    if (!/[A-Z]/.test(value)) {
      return { uppercase: true };
    }
    return null;
  }
  
  numberValidator(control: any) {
    if (!control.value) return null;
    const value = control.value;
    if (!/[0-9]/.test(value)) {
      return { number: true };
    }
    return null;
  }
  
  specialCharValidator(control: any) {
    if (!control.value) return null;
    const value = control.value;
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return { specialChar: true };
    }
    return null;
  }
  
  registerForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required, 
      Validators.minLength(8),
      this.uppercaseValidator,
      this.numberValidator,
      this.specialCharValidator
    ]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });
  
  isSubmitting = false;
  errorMessage = '';
  
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }
  
  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    
    const { username, email, password } = this.registerForm.value;
    const userData: SignUpRequest = { username, email, password };
    
    this.authService.signUp(userData).subscribe({
      next: () => {
        // After successful registration, redirect to login
        this.router.navigate(['/auth/login'], { 
          queryParams: { registered: 'true' } 
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}