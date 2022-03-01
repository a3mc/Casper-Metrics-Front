import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ApiClientService } from '../services/api-client.service';
import { take } from 'rxjs';
import * as moment from 'moment';

@Component( {
    selector: 'app-market',
    templateUrl: './market.component.html',
    styleUrls: ['./market.component.scss'],
} )
export class MarketComponent implements OnInit {

    @Input( 'mode' ) public mode: string = '';

    public loading = true;
    public chartOption: EChartsOption = {};
    public showInfo = false;

    private _dates: string[] = [];
    private _prices: number[] = [];
    private _volumes: number[] = [];

    constructor(
        private _apiClientService: ApiClientService
    ) {
    }

    ngOnInit(): void {
        this._apiClientService.get(
            '/prices'
        )
            .pipe( take( 1 ) )
            .subscribe(
                ( result: any[] ) => {
                    let items = Object.assign( [], result );
                    if ( this.mode !== 'full' ) {
                        items.reverse();
                        items = items.slice( 0, 336 ).reverse();
                    }
                    items.forEach( ( item: any ) => {
                        this._dates.push( moment( item.date ).format( 'DD MMM' ) );
                        this._prices.push( Math.round( ( ( item.close + item.open ) / 2 ) * 1000 ) / 1000 );
                        this._volumes.push( Math.round( item.volumeFrom / 1000 ) );
                    } );
                    this._setChart();
                    this.loading = false;
                }
            );
    }

    public toggleInfo(): void {
        this.showInfo = !this.showInfo;
    }

    private _setChart(): void {
        const colors = ['green','#5470C655','#3f962333'];

        this.chartOption = {
            color: colors,
            legend: {
                textStyle: {
                    color: '#ccb',
                    fontFamily: "'M PLUS 1', sans-serif",
                    fontSize: '12px',
                },
                top: '20px'
            },
            grid: {
                top: '60px',
                left: '3%',
                right: '4%',
                bottom: this.mode === 'full' ? '12%' : '4%',
                containLabel: true,
            },
            dataZoom: this.mode === 'full' ? [
                {
                    start: 90,
                    end: 100
                }
            ] : [],
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true,
                    },
                    data: this._dates,
                },

            ],
            yAxis: [
                {
                    type: 'value',
                    min: 'dataMin',
                    max: 'dataMax',
                    position: 'left',
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: colors[2]
                        },
                    },
                    axisLabel: {
                        formatter: '${value}',
                        color: colors[0]
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#444'
                        }
                    }
                },
                {
                    type: 'value',
                    min: 'dataMin',
                    max: 'dataMax',
                    position: 'right',
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: colors[1]
                        },
                    },
                    axisLabel: {
                        formatter: '{value}K',
                        color: '#5470C6'
                    },
                    splitLine: {
                        show: false,
                    }
                }
            ],
            series: [
                {
                    name: 'Price',
                    type: 'line',
                    smooth: true,
                    data: this._prices
                },
                {
                    name: 'Volume',
                    type: 'bar',
                    yAxisIndex: 1,
                    data: this._volumes
                },
            ]
        };
    }
}
