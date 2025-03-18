import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {

  isMenuOpen = false;
  isAdmin = false;
  userName: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngDoCheck() {
    this.checkUserStatus();
  }

  checkUserStatus() {
    this.userName = sessionStorage.getItem('userName');
    this.isAdmin = this.userName === 'admin';
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {

    const ok = confirm('Are you sure you want to logout?');
    if (!ok) {
      return;
    }

    this.authService.logout().subscribe({
      next: () => {
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userId');
        this.userName = null;
        this.isAdmin = false;
        alert('Logout Successfully');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
