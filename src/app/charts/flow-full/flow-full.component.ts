import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ApiClientService } from '../../services/api-client.service';
import { take } from 'rxjs';
import { Options } from '@angular-slider/ngx-slider';
import * as moment from 'moment';

@Component( {
    selector: 'app-flow-full',
    templateUrl: './flow-full.component.html',
    styleUrls: ['./flow-full.component.scss'],
} )
export class FlowFullComponent implements OnInit {

    private _names: any[] = [];
    private _links: any[] = [];
    public loading = true;
    public chartOption: EChartsOption = {};
    public lastEraId = 0;
    public showSingleSlider = false;

    public showInfo = false;
    public eraId = 1;
    public eraEnd = moment().format();
    public options: Options = {
        floor: 1,
        ceil: 1
    };

    constructor(
        private _apiClientService: ApiClientService
    ) {
    }

    ngOnInit(): void {
        this._getLastBlock();
    }

    public sliderChange( eraId: number ) {
        this._getTransfers( eraId );
    }

    private _getTransfers( eraId: number ): void {
        this._apiClientService.get(
            '/transfersByEraId?eraId=' + eraId
        )
            .pipe(
                take( 1 )
            )
            .subscribe(
                ( result: any ) => {
                    this._names = [];
                    this._links = [];
                    this.eraEnd = result.eraEnd;

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

    private _getLastBlock(): void {
        this._apiClientService.get( 'block' )
            .pipe( take( 1 ) )
            .subscribe(
                ( result: any ) => {
                    this.options.ceil = result.eraId;
                    this.eraId = result.eraId;
                    this.showSingleSlider = true;
                    //this._getTransfers( result.eraId ); 1038 Cycle!
                    this._getTransfers( 546 );
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

    public clickHandler( event: MouseEvent ) {
        console.log( event );
    }

}
