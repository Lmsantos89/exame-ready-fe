import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  authService = inject(AuthService);
  isMenuOpen = false;
  isTechDropdownOpen = false;
  
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  toggleTechDropdown(): void {
    this.isTechDropdownOpen = !this.isTechDropdownOpen;
  }
  
  signOut(): void {
    this.authService.signOut();
  }
}