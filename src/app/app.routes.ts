import { Routes } from '@angular/router';
import { DashboardGuard } from './services/dashboard.guard';


export const routes: Routes = [

    {
        path: 'auth',
        loadChildren: () => import('./auth/features/shell/auth.routes'),
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component'),
        canActivate: [DashboardGuard],
    },
    {
        path: '**',
        redirectTo: 'auth'
    },
];
