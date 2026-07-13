import { Routes } from '@angular/router';
import { ContactListComponent } from './components/contact-list/contact-list.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ContactDetailComponent } from './components/contact-detail/contact-detail.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: ContactListComponent, canActivate: [AuthGuard] },
  { path: 'add', component: ContactFormComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: ContactFormComponent, canActivate: [AuthGuard] },
  { path: 'detail/:id', component: ContactDetailComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];