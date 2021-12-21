import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ApiClientService } from '../../services/api-client.service';
import { take } from 'rxjs';

@Component( {
    selector: 'app-flow',
    templateUrl: './flow.component.html',
    styleUrls: ['./flow.component.scss'],
} )
export class FlowComponent implements OnInit {

    private _names: any[] = [];
    private _links: any[] = [];
    private _volumes: number[] = [];
    public loading = true;
    public chartOption: EChartsOption = {};

    constructor(
        private _apiClientService: ApiClientService
    ) {
    }

    ngOnInit(): void {
        this._apiClientService.get(
            '/transfers'
        )
            .pipe( take( 1 ) )
            .subscribe(
                ( result: any ) => {
                    console.log( result )
                    result.data.forEach( ( item: any ) => {
                        if( ( parseInt( item.amount ) / 1000000000 ) > 80000000 ) {
                            // if ( ! this._names.includes( item.from ) ) {
                            //     this._names.push( item.from );
                            // }
                            // if ( ! this._names.includes( item.to ) ) {
                            //     this._names.push( item.to );
                            // }
                            if( !this._names.includes( this._shortenAddress( item.fromHash ) ) ) {
                                this._names.push( this._shortenAddress( item.fromHash ) );
                            }
                            if( !this._names.includes( this._shortenAddress( item.toHash ) ) ) {
                                this._names.push( this._shortenAddress( item.toHash ) );
                            }

                            this._links.push(
                                {
                                    source: this._shortenAddress( item.fromHash ),
                                    target: this._shortenAddress( item.toHash ),
                                    value: parseInt( item.amount ) / 1000000000
                                },
                            );
                        }

                    } );
                    console.log( this._names )
                    this._setChart();
                    this.loading = false;
                }
            );
    }

    private _shortenAddress( address: string ): string {
        address = address.replace( /^account-hash-/, '#' );
        return address.substr( 0, 4 ) + '...' + address.substr( -4, 4 );
    }

    private _setChart(): void {
        this.chartOption = {
            title: [
                {
                    top: '0',
                    left: 'center',
                    text: 'Transfers (Last Era)',
                    textStyle: {
                        color: '#ccb',
                        fontFamily: "'M PLUS 1', sans-serif",
                        fontSize: '18px'
                    }

                },
            ],
            series: {
                type: 'sankey',
                layout: 'none',
                emphasis: {
                    focus: 'adjacency'
                },
                data: this._names.map(
                    ( item: string ) => {
                        return { id: item }
                    }
                ),
                links: this._links,
                lineStyle: {
                    color: 'source'
                }
            }
        };
    }


}
