import {Routes} from '@angular/router';
import {Home} from './home/home';
import {Details} from './details/details';
import { Login } from './login/login';
import { Register } from './register/register';
import { SuperAdminPage } from './admin-create-shop/admin-create-shop';

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
    component: SuperAdminPage,
    title: 'Super Admin'
  }
];

export default routeConfig;