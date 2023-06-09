import { Component, OnInit } from '@angular/core';
import { LocationService } from '../location.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private router: Router, private _location: LocationService) {}
  userValid: any = '2001';
  user = '';
  password: any = '';
  passwordValid: any = 'Iakob100';

  submitForm() {
    if (this.user == this.userValid && this.password == this.passwordValid) {
      this._location.sendUserData(this.user);
      this.router.navigate(['./pagination']);
      
    }
  }

  ngOnInit(): void {}
}
