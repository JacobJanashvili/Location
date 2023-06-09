import { Component, OnInit } from '@angular/core';
import { Location } from '../location';
import * as geolib from 'geolib';
import {
  BehaviorSubject,
  Observable,
  catchError,
  delay,
  retry,
  throwError,
} from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LocationService } from '../location.service';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.page.html',
  styleUrls: ['./pagination.page.scss'],
})
export class PaginationPage implements OnInit {
  api_key: string = 'AIzaSyDHSxnbaGQzITfhphIkZpxAnhgMZY-ziZo';
  desiredLatitude: number = 41.7154256457209;
  desiredLongitude: number = 44.776719421872976;
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
  startCardArr: Location[] = [];
  stopCardArr: Location[] = [];
  startDistance: number;
  stopDistance: number;
  selectedItem = '';
  startClicked = true;
  stopClicked = false;
  isActive = false;
  latitude: number;
  longitude: number;
  location: string = '';
  startLocationValid: boolean = false;
  stopLocationValid: boolean = false;
  url: any;
  App: any;
  constructor(
    private http: HttpClient,
    private _location: LocationService,
    private router: Router
  ) {
    this.App = App;
  }

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
    this.startClicked = !this.startClicked;
    this.stopClicked = !this.stopClicked;
    this.stop_error_text = '';
    this.stop_success_text = '';
    this.setCurrentTime();
    this.setCurrentDate();
    this.currentDay = this.getCurrentDay();
    this.currentMonth = this.getCurrentMonth();
    this.currentYear = this.getCurrentYear();
    if (this._location.startCard.value) {
      this._location.updateData(this._location.startCard, this.startCardArr);
    }
    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
    };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        const distance = geolib.getDistance(
          { latitude: this.latitude, longitude: this.longitude },
          { latitude: this.desiredLatitude, longitude: this.desiredLongitude }
        );

        this.getStartDistance(distance);
        if (this.startDistance <= 50) {
          this.startLocationValid = true;
        }
        this.url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.latitude},${this.longitude}&key=${this.api_key}`;
        console.log(this.latitude, this.longitude);
        this.getFullAddress(this.url).subscribe((res) => {
          this.location = res.results[0].formatted_address;
          this.city = res.results[7].formatted_address;
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
    this.startClicked = !this.startClicked;
    this.stopClicked = !this.stopClicked;
    this.start_error_text = '';
    this.start_success_text = '';
    this.currentDay = this.getCurrentDay();
    this.currentMonth = this.getCurrentMonth();
    this.currentYear = this.getCurrentYear();
    if (this._location.stopCard.value) {
      this._location.updateData(this._location.stopCard, this.stopCardArr);
    }
    this.setCurrentTime();
    this.setCurrentDate();
    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
    };
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        const distance = geolib.getDistance(
          { latitude: this.latitude, longitude: this.longitude },
          { latitude: this.desiredLatitude, longitude: this.desiredLongitude }
        );
        this.getStopDistance(distance);
        if (this.stopDistance <= 50) {
          this.stopLocationValid = true;
        }
        this.url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.latitude},${this.longitude}&key=${this.api_key}`;

        this.getFullAddress(this.url).subscribe((res) => {
          this.location = res.results[0].formatted_address;
          this.city = res.results[7].formatted_address;

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
  getStartDistance(distance: number) {
    this.startDistance = distance;
  }
  getStopDistance(distance: number) {
    this.stopDistance = distance;
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
    console.log(this.startDistance, this.stopDistance);
    if (this.startDistance <= 50 && this.stopDistance <= 50) {
      this.choiceMade = true;
    }
    if (this.choiceMade == true) {
      this._location.choiceMade.next(this.choiceMade);
      this.router.navigate(['/location-list']);
      this.start_error_text = '';
      this.start_success_text = '';
      this.stop_error_text = '';
      this.stop_success_text = '';
      this.startClicked = true;
      this.stopClicked = false;
    }
  }

  ngOnInit() {}
}
