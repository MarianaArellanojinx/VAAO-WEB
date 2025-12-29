import { Routes } from '@angular/router';
import { LayoutComponent } from './features/layout/layout.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { AddClientComponent } from './features/admin/add-client/add-client.component';
import { UsersComponent } from './features/admin/users/users.component';
import { DealersComponent } from './features/dealers/dealers.component';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    {
        path: "",
        component:LayoutComponent,

        children: [
            {
                path: "",
                component: HomeComponent
            },
            {
                path: "dashboard",
                component: DashboardComponent,
                canActivate: [adminGuard]
            },
            {
                path: 'auth',
                component: LoginComponent
            },
            {
                path: 'clients',
                component: AddClientComponent
            },
            {
                path: 'users',
                component: UsersComponent
            },
            {
                path: 'dealers',
                component: DealersComponent
            }
        ]
    }
];
