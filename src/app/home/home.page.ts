import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AndroidFullScreen } from '@ionic-native/android-full-screen/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    private router: Router,
    private androidFullScreen: AndroidFullScreen
  ) {}
  userValid: any = '2001';
  user = '';
  password: any = '';
  passwordValid: any = 'Iakob100';
  submitForm() {
    if (this.user == this.userValid && this.password == this.passwordValid) {
      this.router.navigate(['./pagination']);
    }
  }
  enableFullscreen() {
    this.androidFullScreen.isSupported().then(() => {
      this.androidFullScreen.isImmersiveModeSupported().then(() => {
        this.androidFullScreen.immersiveMode();
      });
    });
  }

  ngOnInit(): void {
    this.enableFullscreen();
  }
}
