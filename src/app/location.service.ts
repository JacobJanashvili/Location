import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, retry, retryWhen, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  
}
