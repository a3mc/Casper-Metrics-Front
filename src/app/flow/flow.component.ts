import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ApiClientService } from '../services/api-client.service';
import { debounceTime, Subject, Subscription, take } from 'rxjs';
import { Options } from '@angular-slider/ngx-slider';
import * as moment from 'moment';
import { DataService } from "../services/data.service";

@Component( {
    selector: 'app-flow',
    templateUrl: './flow.component.html',
    styleUrls: ['./flow.component.scss'],
} )
export class FlowComponent implements OnInit, OnDestroy {

    @Input( 'mode' ) public mode: string = '';


    public loading = true;
    public chartOption: EChartsOption = {};
    public lastEraId = 0;
    public showSingleSlider = false;
    public limit = 20;
    public count = 0;
    public showInfo = false;
    public eraId = 0;
    public eraStart = moment().format();
    public eraEnd = moment().format();
    public options: Options = {
        floor: 0,
        ceil: 0
    };

    private _eraSub: Subscription | undefined;
    private _sliderSub: Subscription | undefined;
    private _selectedSub: Subscription | undefined;
    private _slider$: Subject<number> = new Subject();
    private _names: any[] = [];
    private _links: any[] = [];

    constructor(
        private _apiClientService: ApiClientService,
        private _dataService: DataService,
    ) {
    }

    ngOnInit(): void {
        this._getLastCompletedEra();

        if ( this._sliderSub ) this._sliderSub.unsubscribe();
        this._sliderSub = this._slider$.pipe( debounceTime( 200 ) )
            .subscribe( ( eraId: number ) => this.getTransfers( eraId ) );

        if ( this._selectedSub ) this._selectedSub.unsubscribe();
        this._selectedSub = this._dataService.selectedEraId$
            .subscribe( ( eraId: any ) => {
                this.eraId = eraId;
            } );
    }

    ngOnDestroy(): void {
        if ( this._eraSub ) this._eraSub.unsubscribe();
        if ( this._sliderSub ) this._sliderSub.unsubscribe();
        if ( this._selectedSub ) this._selectedSub.unsubscribe();
    }

    public sliderChange( eraId: number ) {
        this._slider$.next( eraId );
    }

    public getTransfers( eraId: number ): void {
        this._apiClientService.get(
            '/transfersByEraId?eraId=' + eraId + '&limit=' + this.limit
        )
            .pipe(
                take( 1 )
            )
            .subscribe(
                ( result: any ) => {
                    this._names = [];
                    this._links = [];
                    this.eraStart = result.eraStart;
                    this.eraEnd = result.eraEnd;
                    this.count = result.count;

                    result.transfers.forEach( ( item: any ) => {
                        if( !this._names.some( node => node.id === item.fromHash ) ) {
                            this._names.push( {
                                id: item.fromHash,
                                name: this._shortenAddress( item.from || item.fromHash )
                            } );
                        }
                        if( !this._names.some( node => node.id === item.toHash ) ) {
                            this._names.push( {
                                id: item.toHash,
                                name: this._shortenAddress( item.to || item.toHash )
                            } );
                        }

                        this._links.push(
                            {
                                source: item.fromHash,
                                target: item.toHash,
                                value: parseInt( item.amount ) / 1000000000
                            },
                        );

                    } );
                    this._setChart();
                    this.loading = false;
                }
            );
    }

    public toggleInfo(): void {
        this.showInfo = !this.showInfo;
    }

    private _getLastCompletedEra(): void {
        if ( this._eraSub ) {
            this._eraSub.unsubscribe();
        }
        this._eraSub = this._dataService.lastEra$
            .subscribe(
                ( result: any ) => {
                    if ( result ) {
                        this.options.ceil = result.id;
                        if ( !this.eraId ) {
                            this.eraId = result.id;
                            this.showSingleSlider = true;
                            this.getTransfers( this.eraId );
                        }
                    }
                }
            )
    }


    private _shortenAddress( address: string ): string {
        address = address.replace( /^account-hash-/, '#' );
        return address.substr( 0, 4 ) + '...' + address.substr( -4, 4 );
    }

    private _setChart(): void {
        this.chartOption = {
            series: {
                type: 'sankey',
                layout: 'none',
                emphasis: {
                    focus: 'adjacency'
                },
                data: this._names,
                links: this._links,
                lineStyle: {
                    color: 'source'
                },
                label: {
                    formatter: '{b}'
                }
            }
        };
    }

    public chartClick( event: any ): void {
        console.log( event );
    }

}
