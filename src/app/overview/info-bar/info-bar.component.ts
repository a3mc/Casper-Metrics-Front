import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '../../services/api-client.service';
import { take } from 'rxjs';
import { DataService } from '../../services/data.service';

@Component( {
    selector: 'app-info-bar',
    templateUrl: './info-bar.component.html',
    styleUrls: ['./info-bar.component.scss']
} )
export class InfoBarComponent implements OnInit {

    public lastBlock: any;
    public lastEra: any;
    public price: number = 0;

    constructor(
        private _apiClientService: ApiClientService,
        private _dataService: DataService
    ) {
    }

    ngOnInit(): void {
        this._getLastBlock();
        this._getLastEra();
        this._getLastPrice();
    }

    private _getLastBlock(): void {
        this._apiClientService.get( 'block' )
            .pipe( take( 1 ) )
            .subscribe(
                ( result: any ) => {
                    console.log( result )
                    this.lastBlock = result;
                }
            )
    }

    private _getLastEra(): void {
        this._apiClientService.get( 'era?limit=192' )
            .pipe( take( 1 ) )
            .subscribe(
                ( result: any ) => {
                    console.log( result )
                    result.reverse();
                    this._dataService.eras = result;
                    this.lastEra = result[0]; // FIXME to return a single value
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
