import { Component, OnInit } from '@angular/core';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.page.html',
  styleUrls: ['./location-list.page.scss'],
})
export class LocationListPage implements OnInit {
  selectedItem: string = '';
  startCard: any[] = [];
  stopCard: any[] = [];
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
  constructor(private _location: LocationService) {}
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
  ngOnInit() {
    this._location.getStartCard().subscribe((res) => {
      if (res) {
        this.startCard = res;
      }
    });
    this._location.getStopCard().subscribe((res) => {
      if(res){
        this.stopCard=res
      }
    });
    this._location.getChoice().subscribe((res) => {
      if(res){
        this.choiceMade=res
        console.log(this.choiceMade)
      }
    });
  }
}
