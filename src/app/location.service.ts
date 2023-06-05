import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  delay,
  retry,
  retryWhen,
  throwError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  startCardSubject = new BehaviorSubject([]);
  stopCardSubject = new BehaviorSubject([]);
  choiceMadeSubject = new BehaviorSubject<boolean>(false);
  startCard = this.startCardSubject.asObservable();
  stopCard = this.stopCardSubject.asObservable();
  choiceMade = this.choiceMadeSubject.asObservable();
}
