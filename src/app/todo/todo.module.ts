import { FormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth-guard';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [{path: 'dashboard/:id', component: DashboardComponent, canActivate: [AuthGuard]}];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    NgbModalModule,
    SharedModule,
    FormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthGuard
  ]
})
export class TodoModule { }
