import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from './location';
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
  startCard = new BehaviorSubject<Location[]>([]);
  stopCard = new BehaviorSubject<Location[]>([]);
  choiceMade = new BehaviorSubject<boolean>(false);
  userName = new BehaviorSubject<string>('');
  userNameObservable = this.userName.asObservable();
  sendUserData(data: any) {
    this.userName.next(data);
  }
  getStartCard() {
    return this.startCard.asObservable();
  }
  getStopCard() {
    return this.stopCard.asObservable();
  }
  getChoice() {
    return this.choiceMade.asObservable();
  }
  updateData(target: any, data: any) {
    target.next(data);
  }
}
