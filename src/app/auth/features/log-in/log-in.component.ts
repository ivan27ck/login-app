import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './log-in.component.html',
  styles: ``
})
export default class LogInComponent {

  email: string = '';
  password: string = '';
  passwordError: string = '';

  constructor(private router: Router) { }

  login() {
    if (this.email === 'angel@hola' && this.password === '1234') {
      this.router.navigate(['/dashboard']); // Redirige al dashboard
      this.passwordError = '';
    } else {
      this.passwordError = 'La contraseña es incorrecta. Inténtalo de nuevo.';
    }
  }

}
