import { Component, OnInit } from '@angular/core';
import { LocationService } from '../location.service';
import { App } from '@capacitor/app';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.page.html',
  styleUrls: ['./location-list.page.scss'],
})
export class LocationListPage implements OnInit {
  App: any;
  selectedItem: string = '';
  startCard: any = [];
  stopCard: any = [];
  choiceMade: boolean;
  filteredStartDay: any = [];
  filteredStartMonth: any = [];
  filteredStartYear: any = [];
  filteredStopDay: any = [];
  filteredStopMonth: any = [];
  filteredStopYear: any = [];
  menuDayClicked = false;
  menuMonthClicked = false;
  menuYearClicked = false;
  userName: string = '';
  constructor(private _location: LocationService) {
    this.App = App;
  }
  backButtonEvent() {
    document.addEventListener('backbutton', () => {});
  }
  dayClicked() {
    this.menuDayClicked = true;
    this.filteredStartDay = this.startCard.sort(
      (a: any, b: any) => b.day - a.day
    );

    this.filteredStopDay = this.stopCard.sort(
      (a: any, b: any) => b.day - a.day
    );
  }
  monthClicked() {
    this.menuMonthClicked = true;
    this.filteredStartMonth = this.startCard.sort(
      (a: any, b: any) => b.month - a.month
    );

    this.filteredStopMonth = this.stopCard.sort(
      (a: any, b: any) => b.month - a.month
    );
  }
  yearClicked() {
    this.menuYearClicked = true;
    this.filteredStartYear = this.startCard.sort(
      (a: any, b: any) => b.year - a.year
    );

    this.filteredStopYear = this.stopCard.sort(
      (a: any, b: any) => b.year - a.year
    );
  }
  onExit() {
    localStorage.setItem('user_name', this.userName);
    App.exitApp();
  }
  ngOnInit() {
    this._location.getStartCard().subscribe((startCard) => {
      this.startCard = startCard;
    });
    this._location.getStopCard().subscribe((stopCard) => {
      this.stopCard = stopCard;
    });
    this._location.getChoice().subscribe((res) => {
      this.choiceMade = res;
      console.log(this.choiceMade);
    });
    this._location.userNameObservable.subscribe((user) => {
      this.userName = user;
    });
  }
}
