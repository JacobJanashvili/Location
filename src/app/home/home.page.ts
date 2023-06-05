import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(private router: Router) {}
  userValid: any = '2001';
  user = '';
  password: any = '';
  passwordValid: any = 'Iakob100';
  submitForm() {
    if (this.user == this.userValid && this.password == this.passwordValid) {
      this.router.navigate(['./pagination']);
    }
  }

  ngOnInit(): void {}
}
