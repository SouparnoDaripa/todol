import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private appService: AppService,
              private router: Router,
              private toastr: ToastrService) { }

  user: User;

  errMessage: any;

  countryCodeList: [];

  ngOnInit() {
    this.user = new User();
    this.errMessage = null;
    this.getCountryCodes();
  }

  public goToSignIn() {
    this.router.navigate(['/login']);
  }

  public signUpConfirmation(formData: User) {
    this.user = new User(formData);
    this.errMessage = this.user.userSignupValidator();
    if (this.errMessage != null) {
      this.toastr.warning(this.errMessage);
    } else {
      this.appService.signup(this.user).subscribe((apiResponse) => {
        // console.log(apiResponse);
        if ( apiResponse.status === 200 ) {
          this.toastr.success('You have successfullly Signed Up');
          setTimeout(() => this.goToSignIn(), 1000);
        } else {
          this.toastr.error(apiResponse.message);
        }
      }, (err) => {
        this.toastr.error('Some Error occurred');
      });
    }
  }

  public getCountryCodes() {
    this.appService.getCountryCode().subscribe(data => {
      this.countryCodeList = data;
    });
  }

  public onChange(event) {
    console.log(event.value);
  }

}
