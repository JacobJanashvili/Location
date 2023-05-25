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
  desiredLatitude: number = 41.71546;
  desiredLongitude: number = 44.7767;
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
  location: any = '';
  startLocationValid = this.location ? true : false;
  stopLocationValid = this.location ? true : false;
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

  getLocation() {
    const options = {
      enableHighAccuracy: true,
      maximumAge: 0,
    };
    // this.geolocation.getCurrentPosition((position: any) => {
    //   this.latitude = position.coords.latitude;
    //   this.longitude = position.coords.longitude;
    //   console.log(position);
    // });
    // this.geolocation.getCurrentPosition(options).then((position) => {
    //   this.latitude = position.coords.latitude;
    //   this.longitude = position.coords.longitude;
    //   console.log(this.latitude, this.longitude);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log(this.latitude, this.longitude);
        this.url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.latitude},${this.longitude}&key=${this.api_key}`;

        this.getFullAddress(this.url).subscribe((res) => {
          // this.location = res.results[0].formatted_address;
          // this.city = res.results[9].formatted_address;
          console.log(res);
          this.location = res.results[0].formatted_address;
          this.city = res.results[0].address_components[5].long_name;
          console.log(this.location, this.city);
          if (
            // this.latitude === this.desiredLatitude &&
            // this.longitude === this.desiredLongitude &&
            this.startClicked
          ) {
            this.startLocationValid = true;
          }
          if (
            // this.latitude === this.desiredLatitude &&
            // this.longitude === this.desiredLongitude &&
            this.stopClicked
          ) {
            this.stopLocationValid = true;
          }
        });
      },
      this.error,
      options
    );
    // this.geocoder
    //   .reverseGeocode(this.latitude, this.longitude)
    //   .then((result: NativeGeocoderResult[]) =>
    //     console.log(JSON.stringify(result))
    //   )
    //   .catch((error: any) => console.log(error));
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
    this.currentDay = this.getCurrentDay();
    this.currentMonth = this.getCurrentMonth();
    this.currentYear = this.getCurrentYear();
    this.getLocation();

    // if (
    //   this.latitude &&
    //   this.longitude == this.desiredLatitude &&
    //   this.desiredLongitude
    // ) {
    //   this.start_success_text = 'successfully added';

    //   this.startCardArr.push({
    //     location: this.location,
    //     city: this.city,
    //     date: this.currentDate,
    //     time: this.currentTime,
    //   });
    // } else {
    //   this.start_error_text = 'locations dont match';
    // }
    this.setCurrentTime();
    this.setCurrentDate();

    if (this.startLocationValid == true) {
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
  }
  stopBtnClicked() {
    this.stopClicked = true;
    this.startClicked = false;
    this.currentDay = this.getCurrentDay();
    this.currentMonth = this.getCurrentMonth();
    this.currentYear = this.getCurrentYear();
    this.setCurrentTime();
    this.setCurrentDate();
    this.getLocation();
    if (this.stopLocationValid == true) {
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
      (a: any, b: any) => b.day - a.day
    );

    this.filteredStopMonth = this.stopCardArr.sort(
      (a: any, b: any) => b.day - a.day
    );
  }
  yearClicked() {
    this.menuYearClicked = true;
    this.filteredStartYear = this.startCardArr.sort(
      (a: any, b: any) => b.day - a.day
    );

    this.filteredStopYear = this.stopCardArr.sort(
      (a: any, b: any) => b.day - a.day
    );
  }

  ngOnInit() {}
}
