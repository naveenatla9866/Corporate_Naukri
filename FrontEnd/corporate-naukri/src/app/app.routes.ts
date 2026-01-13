import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { LandingComponent } from './components/landing/landing.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ProgressComponent } from './components/progress/progress.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'landing', component: LandingComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'progress', component: ProgressComponent },
  { path: '**', redirectTo: '/login' },
];
