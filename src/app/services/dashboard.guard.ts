import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DashboardService } from './dashboard.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {

  constructor(private dashboardService: DashboardService, private router: Router) {}

  canActivate(): boolean {
    if (this.dashboardService.hasAccess()) {
      return true;
    } else {
      this.router.navigate(['/auth']);
      return false;
    }
  }
}