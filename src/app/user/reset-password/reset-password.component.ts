import { AppService } from './../../services/app.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public email: string;
  public password: string;
  public confirmPassword: string;

  constructor(public appService: AppService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit() {
  }

  public goToSignIn() {
    this.router.navigate(['/signup']);
  }

  public resetPassword() {
    if (!this.password) {
      this.toastr.warning('Password cannot be empty');
    } else if (!this.confirmPassword) {
      this.toastr.warning('Confirm Password cannot be empty');
    } else if (this.password !== this.confirmPassword) {
      this.toastr.error('Password and Confirm Password doesnot match');
    } else {
      const data = {
        email : this.email,
        password: this.password
      };
      // console.log(data);

      this.appService.login(data).subscribe((apiResponse) => {
        if ( apiResponse.status === 200 ) {
          this.toastr.success(apiResponse.message);
        } else {
          this.toastr.error(apiResponse.message);
        }
      }, (err) => {
        this.toastr.error(err.error.message);
      });
    }
  }
}
