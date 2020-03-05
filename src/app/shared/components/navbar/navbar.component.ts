import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from 'src/app/services/app.service';
import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private appService: AppService,
              private toastr: ToastrService,
              private router: Router) { }

  goToHome() {
    Cookie.deleteAll('/');
    this.router.navigate(['/']);
  }

  logout(): void {
    this.appService.logout().subscribe((apiResponse) => {
      if  (apiResponse.status === 200) {
        Cookie.deleteAll(this.router.url);
        localStorage.clear();
        this.toastr.success('You have successfullly Signed Out');
        setTimeout(() => this.goToHome(), 1000);
      } else {
        this.toastr.error(apiResponse.message);
      }
    }, (err) => {
      this.toastr.error(err.error.message);
    });
  }

  ngOnInit() {
  }

}
