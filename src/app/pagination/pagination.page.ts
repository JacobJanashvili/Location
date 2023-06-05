import { Component, OnInit } from '@angular/core';
import * as geolib from 'geolib';
import {
  Observable,
  catchError,
  delay,
  retry,
  throwError,
  timeout,
} from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LocationService } from '../location.service';
import { Router } from '@angular/router';

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
  startCardArr: any = [];
  stopCardArr: any = [];
  selectedItem = '';
  startClicked = false;
  stopClicked = false;
  isActive = false;
  latitude: number;
  longitude: number;
  location: string = '';
  startLocationValid: boolean = false;
  stopLocationValid: boolean = false;
  url: any;

  constructor(
    private http: HttpClient,
    private _location: LocationService,
    private router: Router
  ) {}

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
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        const distance = geolib.getDistance(
          { latitude: this.latitude, longitude: this.longitude },
          { latitude: this.desiredLatitude, longitude: this.desiredLongitude }
        );
        console.log(distance);
        this.url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.latitude},${this.longitude}&key=${this.api_key}`;
        console.log(this.latitude, this.longitude);
        this.getFullAddress(this.url).subscribe((res) => {
          console.log(res);
          this.location = res.results[0].formatted_address;
          this.city = res.results[7].formatted_address;
          console.log(this.location, this.city);
          if (distance <= 1205 || distance == 0) {
            this.startLocationValid = true;
          } else {
            this.startLocationValid = false;
          }

          if (this.startLocationValid === true) {
            this.start_success_text = 'successfully added';
            this._location.startCardSubject.next({
              location: this.location,
              city: this.city,
              date: this.currentDate,
              time: this.currentTime,
              day: this.currentDay,
              month: this.currentMonth,
              year: this.currentYear,
            });
            this._location.startCardSubject.next(this.startCardArr);
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
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        const distance = geolib.getDistance(
          { latitude: this.latitude, longitude: this.longitude },
          { latitude: this.desiredLatitude, longitude: this.desiredLongitude }
        );
        console.log(distance);
        this.url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.latitude},${this.longitude}&key=${this.api_key}`;

        this.getFullAddress(this.url).subscribe((res) => {
          this.location = res.results[0].formatted_address;
          this.city = res.results[7].formatted_address;
          console.log(res);

          if (distance <= 1205 || distance == 0) {
            this.stopLocationValid = true;
          }
          if (this.stopLocationValid === true) {
            this.stop_success_text = 'successfully added';
            this._location.stopCardSubject.next({
              location: this.location,
              city: this.city,
              date: this.currentDate,
              time: this.currentTime,
              day: this.currentDay,
              month: this.currentMonth,
              year: this.currentYear,
            });
            this._location.stopCardSubject.next(this.stopCardArr);
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
    if (
      (this.start_error_text || this.start_success_text) &&
      (this.stop_error_text || this.stop_success_text)
    ) {
      this.choiceMade = true;
      this._location.choiceMadeSubject.next(this.choiceMade);
    }
    if (this.choiceMade == true) {
      this.router.navigate(['/location-list']);
      this.start_error_text = '';
      this.start_success_text = '';
      this.stop_error_text = '';
      this.stop_success_text = '';
    }
  }

  ngOnInit() {}
}
