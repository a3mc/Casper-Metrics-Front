import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, take } from 'rxjs';
import { ApiClientService } from './api-client.service';

@Injectable( {
    providedIn: 'root'
} )
export class DataService {

    private _lastEra: any = null;
    private _selectedEraId = 0;
    private _eras: any[] = [];
    public lastEra$ = new BehaviorSubject( null );
    public selectedEraId$ = new Subject();
    public eras$ = new BehaviorSubject( this._eras );
    public price = 0;
    public lastBlocks: any[] = [];
    public lastBlock: any = null;
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
    ) {
        this.getLastEra();

        setInterval( () => {
            this._refreshData()
        }, 5000 );
        this._refreshData();
    }

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

    private _refreshData(): void {
        this._getLastBlock();
        this._getLastPrice();
    }

    private _getLastBlock(): void {
        if ( this.lastBlocks.length === 25 ) {
            this.lastBlocks = [this.lastBlocks[23], this.lastBlocks[24]];
        }
        this._apiClientService.get( 'block' )
            .pipe( take( 1 ) )
            .subscribe(
                ( result: any ) => {
                    if ( this.lastBlocks.find( block => block.blockHeight === result.blockHeight) ) {
                        return;
                    }
                    this.lastBlock = result;
                    setTimeout( () => {
                        this.lastBlocks.push( result );
                        if ( this.lastBlocks.length === 1 ) {
                            this._getPrevBlock();
                        }
                    }, 100 )
                }
            )
    }

    private _getPrevBlock(): void {
        this._apiClientService.get( 'block?blockHeight=' + (this.lastBlocks[0].blockHeight - 1 ) )
            .pipe( take( 1 ) )
            .subscribe(
                ( result: any ) => {
                    this.lastBlocks.unshift( result );
                }
            )
    }

    private _getLastPrice(): void {
        this._apiClientService.get( 'price' )
            .pipe( take( 1 ) )
            .subscribe(
                ( result: any ) => {
                    this.price = result;
                }
            )
    }
}
