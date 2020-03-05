import { AppService } from './../../services/app.service';
import { Component, OnInit, ViewContainerRef } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public email: string;

  constructor(public appService: AppService,
              private toastr: ToastrService) { }

  ngOnInit() {
  }

  public resetPasswordLink() {
    if (!this.email) {
      this.toastr.warning('Email address is mandatory');
    } else {
      const data = {
      email : this.email
    };
      // console.log(data);

      this.appService.forgotPassword(data).subscribe((apiResponse) => {
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
