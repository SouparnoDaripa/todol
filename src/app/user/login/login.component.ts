import { AppService } from './../../services/app.service';
import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User;
  errMessage: any;

  constructor(public appService: AppService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.user = new User();
    this.errMessage = null;
  }

  public goToSignUp() {
    this.router.navigate(['/signup']);
  }

  public goToDashboard(id?: string) {
    if (id) {
      this.router.navigate([`/dashboard/${id}`]);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  public forgotPassword() {
    this.router.navigate(['/forgotPassword']);
  }

  public signInConfirmation(formData: User) {
    this.user = new User(formData);
    this.errMessage = this.user.userLoginValidator();
    if (this.errMessage != null) {
      this.toastr.warning(this.errMessage);
    } else {
      const data = {
        email : this.user.email,
        password: this.user.password
      };
      // console.log(data);

      this.appService.login(data).subscribe((apiResponse) => {
        if ( apiResponse.status === 200 ) {
          Cookie.set('authToken', apiResponse.data.authToken);
          Cookie.set('receiverId', apiResponse.data.userDetails.userId);
          Cookie.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
          Cookie.set('role', apiResponse.data.userDetails.role);
          this.appService.setUserInfoFromLocalStorage(apiResponse.data.userDetails);
          this.toastr.success('You have successfullly Signed In');
          if (Cookie.get('role') === '2') {
            setTimeout(() => this.goToDashboard(), 1000);
          } else {
            setTimeout(() => this.goToDashboard(Cookie.get('receiverId')), 1000);
          }
        } else {
          this.toastr.error(apiResponse.message);
        }
      }, (err) => {
        this.toastr.error(err.error.message);
      });
    }
  }
}
