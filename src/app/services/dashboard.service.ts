import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private accessGranted = false;

  grantAccess() {
    this.accessGranted = true;
  }

  hasAccess(): boolean {
    return this.accessGranted;
  }
}