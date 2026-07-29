import {Routes} from '@angular/router';
import {Home} from './home/home';
import {Details} from './details/details';
import { Login } from './login/login';
import { Register } from './register/register';
import { Admin } from './admin/admin';
import { MapComponent } from './map/map.component';
import { ShopDashboard } from './shop-dashboard/shop-dashboard';

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
  },
  {
    path: 'register',
    component: Register,
    title: 'Înregistrare'
  },
  {
    path: 'superadmin',
    component: Admin,
    title: 'Super Admin'
  },
  {
    path: 'map',
    component: MapComponent,
    title: 'Map'
  },
  {
    path: 'shop-dashboard',
    component: ShopDashboard,
    title: 'Shop Dashboard'
  }
  
];

export default routeConfig;