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
  startCard = new BehaviorSubject<Location[] | null>(null);
  stopCard = new BehaviorSubject<Location[] | null>(null);
  choiceMade = new BehaviorSubject<boolean>(false);

  getStartCard() {
    return this.startCard.asObservable();
  }
  getStopCard() {
    return this.stopCard.asObservable();
  }
  getChoice() {
    return this.choiceMade.asObservable();
  }
  updateData(target: any, dataObj: any) {
    const currentValue = target.value;
    const updatedValue = [...currentValue, dataObj];
    target.next(updatedValue);
  }
}
