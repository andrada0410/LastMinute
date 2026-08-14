import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Details } from './details/details';
import { Login } from './login/login';
import { Register } from './register/register';
import { Admin } from './admin/admin';
import { MapComponent } from './map/map.component';
import { ShopDashboard } from './shop-dashboard/shop-dashboard';
import { ShopViewComponent } from './shop-view/shop-view.component';
import { ShopOffer } from './shop-offer/shop-offer';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { UserReservations } from './user-reservations/user-reservations';

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
    title: 'Hartă',
    canActivate: [authGuard],
    data: {
      allowUnauthenticated: true,
      roles: ['USER']},
  },
  {
    path: 'shop-dashboard',
    component: ShopDashboard,
    title: 'Pagină magazin',
    canActivate: [authGuard],
    data: { roles: ['SHOPUSER'] }
  },
  {
    path: 'shop/:id',
    component: ShopViewComponent,
    title: 'Vizualizare detalii magazin',
    canActivate: [authGuard],
    data: { 
      allowUnauthenticated: true,
      roles: ['USER'] 
    }
  },
  {
    path: 'shop-offer',
    component: ShopOffer,
    title: 'Oferta Zilei',
    canActivate: [authGuard],
    data: { roles: ['SHOPUSER'] }
  },
  {
    path: 'user-reservations',
    component: UserReservations,
    title: 'Rezervări',
    data: { roles: ['USER'] }
  }
];

export default routeConfig;