import {Routes} from '@angular/router';
import {Home} from './home/home';
import {Details} from './details/details';

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
];

export default routeConfig;