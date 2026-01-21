import { Routes } from '@angular/router';
import { LayoutComponent } from './features/layout/layout.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { AddClientComponent } from './features/admin/add-client/add-client.component';
import { UsersComponent } from './features/admin/users/users.component';
import { DealersComponent } from './features/dealers/dealers.component';
import { adminGuard } from './core/guards/admin.guard';
import { ClientsComponent } from './features/clients/clients.component';
import { OrdersComponent } from './features/orders/orders.component';
import { ConservativeComponent } from './features/conservative/conservative.component';
import { encargadoGuard } from './core/guards/encargado.guard';
import { encargadoAdminGuard } from './core/guards/encargado-admin.guard';
import { loginGuard } from './core/guards/login.guard';
import { CorteComponent } from './features/admin/corte/corte.component';
import { AddVisitComponent } from './features/add-visit/add-visit.component';
import { VisitsComponent } from './features/visits/visits.component';

export const routes: Routes = [
    {
        path: "",
        component:LayoutComponent,

        children: [
            {
                path: "",
                component: HomeComponent,
                canActivate: [loginGuard]
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
                component: ClientsComponent,
                canActivate: [encargadoAdminGuard]
            },
            {
                path: 'users',
                component: UsersComponent,
                canActivate: [encargadoAdminGuard]
            },
            {
                path: 'dealers',
                component: DealersComponent,
                canActivate: [encargadoAdminGuard]
            },
            {
                path: 'orders',
                component: OrdersComponent,
                canActivate: [loginGuard]
            },
            {
                path: 'conservadores',
                component: ConservativeComponent,
                canActivate: [encargadoAdminGuard]
            },
            {
                path: 'corte',
                component: CorteComponent
            },
            {
                path: 'visitas',
                component: VisitsComponent,
                canActivate: [encargadoAdminGuard]
            }
        ]
    }
];
