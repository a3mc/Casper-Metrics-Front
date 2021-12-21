import { Injectable } from '@angular/core';
import { Subject, take } from 'rxjs';
import { ApiClientService } from './api-client.service';

@Injectable( {
    providedIn: 'root'
} )
export class DataService {

    public transfersInfo = false;

    public eraSubject$ = new Subject();
    private _eras: any[] = [];
    private _defaultMaxEras = 1000;

    set eras( value: any[] ) {
        this._eras = value;
        this.eraSubject$.next( this._eras );
    }

    constructor(
        private _apiClientService: ApiClientService
    ) {
    }

    public getEras( start: number, end: number ) {
        this._apiClientService.get( 'era?order=id%20ASC&skip=' + start + '&limit=' + ( end - start ) )
            .pipe( take( 1 ) )
            .subscribe( ( result: any ) => {

            } );

    }

}
