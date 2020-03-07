import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthFilter } from '../auth/auth-filter.service';

const routes: Routes = [{path: 'signup', component: SignupComponent, canActivate: [AuthFilter]},
                        {path: 'forgotPassword', component: ForgotPasswordComponent, canActivate: [AuthFilter]},
                        {path: 'resetPassword', component: ResetPasswordComponent, canActivate: [AuthFilter]}];
@NgModule({
  declarations: [SignupComponent, LoginComponent, ForgotPasswordComponent, ResetPasswordComponent],
  imports: [
    ToastrModule.forRoot({
      timeOut: 1000,
      positionClass: 'toast-top-right'
    }),
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    BrowserAnimationsModule
  ],
  providers: [AuthFilter]
})
export class UserModule { }
