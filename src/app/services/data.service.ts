import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, take } from 'rxjs';
import { ApiClientService } from './api-client.service';

@Injectable( {
    providedIn: 'root'
} )
export class DataService {

    public transfersInfo = false;

    private _lastEra: any = null;
    private _selectedEraId = 0;
    private _eras: any[] = [];
    public lastEra$ = new BehaviorSubject( null );
    public selectedEraId$ = new Subject();
    public eras$ = new BehaviorSubject( this._eras );
    public price = 0;

    set lastEra( value: any ) {
        this._lastEra = value;
        this.lastEra$.next( this._lastEra );
    }

    set selectedEra( value: number ) {
        this._selectedEraId = value;
        this.selectedEraId$.next( this._selectedEraId );
    }

    set eras( value: any ) {
        this._eras = value; // FIXME! Concat
        this.eras$.next( this._eras );
    }

    constructor(
        private _apiClientService: ApiClientService
    ) {}

    public getLastEra(): void {
        this._apiClientService.get( 'era' )
            .pipe( take( 1 ) )
            .subscribe( ( result: any ) => {
                this.lastEra = result[0];
                this.getEras( 0, this._lastEra.id ); // FIXME! concat
            } );
    }

    public getEras( start: number, end: number ): void {
        this._apiClientService.get( 'era?order=id%20ASC&skip=' + start + '&limit=' + ( end - start ) )
            .pipe( take( 1 ) )
            .subscribe( ( result: any ) => {
                this.eras = result;
            } );
    }

}
