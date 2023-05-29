import { Component, OnInit } from '@angular/core';

import {
  Observable,
  catchError,
  delay,
  retry,
  throwError,
  timeout,
} from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.page.html',
  styleUrls: ['./pagination.page.scss'],
})
export class PaginationPage implements OnInit {
  api_key: string = 'AIzaSyDHSxnbaGQzITfhphIkZpxAnhgMZY-ziZo';
  desiredLatitude: string = '41.7154';
  desiredLongitude: string = '44.7766';
  desiredPlaceId: string = 'ChIJVxFVtitzREARceFns6TUpFg';
  placeId: string = '';
  city: string;
  choiceMade = false;
  currentTime: string;
  currentDate: string;
  currentDay: string;
  currentMonth: string;
  currentYear: number;
  start_error_text: string;
  start_success_text: string;
  stop_error_text: string;
  stop_success_text: string;
  startCardArr: any = [];
  stopCardArr: any = [];
  selectedItem = '';
  startClicked = false;
  stopClicked = false;
  isActive = false;
  latitude: string;
  longitude: string;
  location: string = '';
  startLocationValid: boolean = false;
  stopLocationValid: boolean = false;
  url: any;
  filteredStartDay: any = [];
  filteredStartMonth: any = [];
  filteredStartYear: any = [];
  filteredStopDay: any = [];
  filteredStopMonth: any = [];
  filteredStopYear: any = [];
  menuDayClicked = false;
  menuMonthClicked = false;
  menuYearClicked = false;

  constructor(private http: HttpClient) {}

  getFullAddress(url: any): Observable<any> {
    return this.http.get<any>(url).pipe(
      retry(3),
      delay(1000),
      catchError((error: HttpErrorResponse) => {
        console.error('Error', error.message);
        return throwError(() => error);
      })
    );
  }
  error(err: any) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  getLocation() {}

  getCurrentDay() {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const currentDate = new Date();
    const dayIndex = currentDate.getDay();
    return daysOfWeek[dayIndex];
  }

  getCurrentMonth(): string {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const currentDate = new Date();
    const monthIndex = currentDate.getMonth();
    return months[monthIndex];
  }
  getCurrentYear(): number {
    const currentDate = new Date();
    return currentDate.getFullYear();
  }

  startBtnClicked() {
    this.startClicked = true;
    this.stopClicked = false;
    this.setCurrentTime();
    this.setCurrentDate();
    this.currentDay = this.getCurrentDay();
    this.currentMonth = this.getCurrentMonth();
    this.currentYear = this.getCurrentYear();
    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
    };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude.toString();
        this.longitude = position.coords.longitude.toString();
        // alert(
        //   `Latitude:${this.latitude},Longitude:${this.longitude} and ${
        //     this.latitude == this.desiredLatitude
        //   } also ${this.longitude == this.desiredLongitude}`
        // );
        this.url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.latitude},${this.longitude}&key=${this.api_key}`;
        console.log(this.latitude, this.longitude);
        this.getFullAddress(this.url).subscribe((res) => {
          // this.placeId = res[2].place_id;
          this.location = res.results[0].formatted_address;
          this.city = res.results[9].formatted_address;
          console.log(res);
          console.log(this.location, this.city);
          if (
            Number(this.latitude).toFixed(4) == this.desiredLatitude &&
            Number(this.longitude).toFixed(4) == this.desiredLongitude
          ) {
            this.startLocationValid = true;
          } else {
            this.startLocationValid = false;
          }

          if (this.startLocationValid === true) {
            this.start_success_text = 'successfully added';
            this.startCardArr.push({
              location: this.location,
              city: this.city,
              date: this.currentDate,
              time: this.currentTime,
              day: this.currentDay,
              month: this.currentMonth,
              year: this.currentYear,
            });
          } else {
            this.start_error_text = 'locations dont match';
          }
        });
      },

      this.error,
      options
    );
  }
  stopBtnClicked() {
    this.stopClicked = true;
    this.startClicked = false;
    this.currentDay = this.getCurrentDay();
    this.currentMonth = this.getCurrentMonth();
    this.currentYear = this.getCurrentYear();
    this.setCurrentTime();
    this.setCurrentDate();
    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude.toString();
        this.longitude = position.coords.longitude.toString();
        // alert(`Latitude:${this.latitude},Longitude:${this.longitude}`);
        this.url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.latitude},${this.longitude}&key=${this.api_key}`;

        this.getFullAddress(this.url).subscribe((res) => {
          this.location = res.results[0].formatted_address;
          this.city = res.results[9].formatted_address;
          console.log(res);
          this.location = res.results[0].formatted_address;
          this.city = res.results[0].address_components[5].long_name;
          console.log(this.location, this.city);

          if (
            Number(this.latitude).toFixed(4) == this.desiredLatitude &&
            Number(this.longitude).toFixed(4) == this.desiredLongitude
          ) {
            this.stopLocationValid = true;
          }
          if (this.stopLocationValid === true) {
            this.stop_success_text = 'successfully added';
            this.stopCardArr.push({
              location: this.location,
              city: this.city,
              date: this.currentDate,
              time: this.currentTime,
              day: this.currentDay,
              month: this.currentMonth,
              year: this.currentYear,
            });
          } else {
            this.stop_error_text = 'locations dont match';
          }
        });
      },

      this.error
    );
  }

  setCurrentTime() {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
    };
    this.currentTime = new Date().toLocaleTimeString([], options);
  }
  setCurrentDate() {
    this.currentDate = new Date().toLocaleDateString();
  }
  choiceCheck() {
    if (this.start_success_text && this.stop_success_text) {
      this.choiceMade = true;
    }
  }
  dayClicked() {
    this.menuDayClicked = true;
    this.filteredStartDay = this.startCardArr.sort(
      (a: any, b: any) => b.day - a.day
    );

    this.filteredStopDay = this.stopCardArr.sort(
      (a: any, b: any) => b.day - a.day
    );
  }
  monthClicked() {
    this.menuMonthClicked = true;
    this.filteredStartMonth = this.startCardArr.sort(
      (a: any, b: any) => b.month - a.month
    );

    this.filteredStopMonth = this.stopCardArr.sort(
      (a: any, b: any) => b.month - a.month
    );
  }
  yearClicked() {
    this.menuYearClicked = true;
    this.filteredStartYear = this.startCardArr.sort(
      (a: any, b: any) => b.year - a.year
    );

    this.filteredStopYear = this.stopCardArr.sort(
      (a: any, b: any) => b.year - a.year
    );
  }

  ngOnInit() {}
}
