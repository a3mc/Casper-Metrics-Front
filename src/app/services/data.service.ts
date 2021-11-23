import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public eraSubject$ = new Subject();
  private _eras: any[] = [];

  set eras( value: any[] ) {
    this._eras = value;
    this.eraSubject$.next( this._eras );
  }

  constructor() { }
}
