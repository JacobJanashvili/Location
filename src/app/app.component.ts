import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { App } from '@capacitor/app';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private _location: Location) {
    App.addListener('backButton', () => {
      if (this._location.isCurrentPathEqualTo('/home')) {
        App.exitApp();
      } else {
        this._location.back();
      }
    });
  }
}
