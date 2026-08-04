import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';
import { Login } from './login/login';
import { Register } from './register/register';
import { Admin } from './admin/admin';
import { MapComponent } from './map/map.component';
import { ShopDashboard } from './shop-dashboard/shop-dashboard';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';

const routeConfig: Routes = [
  {
    path: '',
    component: Home,
    title: 'Last Minute',
  },
  {
    path: 'details/:id',
    component: Details,
    title: 'Example details',
  },
  {
    path: 'login',
    component: Login,
    title: 'Conectare',
    canActivate: [noAuthGuard],
  },
  {
    path: 'register',
    component: Register,
    title: 'Înregistrare',
    canActivate: [noAuthGuard],
  },
  {
    path: 'superadmin',
    component: Admin,
    title: 'Super Admin',
    canActivate: [authGuard],
    data: { roles: ['SUPERUSER'] },
  },
  {
    path: 'map',
    component: MapComponent,
    title: 'Map',
    canActivate: [authGuard],
    data: {
      allowUnauthenticated: true,
      roles: ['USER']},
  },
  {
    path: 'shop-dashboard',
    component: ShopDashboard,
    title: 'Shop Dashboard',
    canActivate: [authGuard],
    data: { roles: ['SHOPUSER'] }
  }

];

export default routeConfig;