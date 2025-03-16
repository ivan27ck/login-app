import { Component} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})


export class HeaderComponent {
  
  constructor(private router: Router) { }

  LogOut() {
    this.router.navigate(['/auth/log-in']); // Redirige al log-in
  }


}

