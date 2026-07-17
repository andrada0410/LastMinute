import {Routes} from '@angular/router';
import {Home} from './home/home';
import {Details} from './details/details';
import { Register } from './register/register';

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
    path: 'register',
    component: Register,
    title: 'Înregistrare'
  }
];

export default routeConfig;