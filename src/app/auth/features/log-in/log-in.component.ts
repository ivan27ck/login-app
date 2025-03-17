import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../../services/dashboard.service';


@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './log-in.component.html',
  template: `<button (click)="login()">Iniciar sesión</button>`,
  styles: ``
})
export default class LogInComponent {

  email: string = '';
  password: string = '';
  passwordError: string = '';

  constructor(private router: Router, private dashboardService: DashboardService) { }
  
  login() {
    if (this.email === 'transporte@dashboard.com' && this.password === 'transporte1603') {
      this.dashboardService.grantAccess();
      this.router.navigate(['/dashboard']); 
      this.passwordError = '';
    } else {
      this.passwordError = 'La contraseña es incorrecta. Inténtalo de nuevo.';
    }
  }

  togglePasswordVisibility() {
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
    } else {
      passwordInput.type = 'password';
    }
  }

}
