import { Component, OnInit } from '@angular/core';
import { ApiClientService } from '../services/api-client.service';
import { take } from 'rxjs/operators';
import { DataService } from '../services/data.service';

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
    ) {
    }

    ngOnInit(): void {
        setInterval( () => {
            this._refreshData()
        }, 5000 );

        this._refreshData();
    }

    private _refreshData(): void {
        this._getLastBlock();
        this._getLastPrice();
    }

    private _getLastBlock(): void {
        this._apiClientService.get( 'block' )
            .pipe( take( 1 ) )
            .subscribe(
                ( result: any ) => {
                    this.lastBlock = result;
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
