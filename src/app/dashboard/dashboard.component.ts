import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styles: ``
})
export default class DashboardComponent {

}
