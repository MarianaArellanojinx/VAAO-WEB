import { Routes } from '@angular/router';
import { LayoutComponent } from './features/layout/layout.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { AddClientComponent } from './features/admin/add-client/add-client.component';

export const routes: Routes = [
    {
        path: "",
        component:LayoutComponent,

        children: [
            {
                path: "home",
                component: HomeComponent
            },
            {
                path: "dashboard",
                component: DashboardComponent
            },
            {
                path: 'auth',
                component: LoginComponent
            },
            {
                path: 'client',
                component: AddClientComponent
            }
        ]
    }
];
