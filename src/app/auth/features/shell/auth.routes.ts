import {Routes} from '@angular/router';

export default [
    {
        path: 'log-in',
        loadComponent: () => import('../log-in/log-in.component'),
    },
    {
        path: '**',
        redirectTo: 'log-in'
    }
] as Routes;