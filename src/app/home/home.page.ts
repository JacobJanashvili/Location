import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userValid: any = '2001';
  user = '';
  password: any = '';
  passwordValid: any = 'Iakob100';
  submitForm() {
    if (this.user == this.userValid && this.password == this.passwordValid) {
      this.router.navigate(['./pagination']);
    }
  }
  constructor(private router: Router) {}
}
