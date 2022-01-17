import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ApiClientService } from '../../services/api-client.service';
import { take } from 'rxjs';
import * as moment from 'moment';

@Component( {
    selector: 'app-market',
    templateUrl: './market.component.html',
    styleUrls: ['./market.component.scss'],
} )
export class MarketComponent implements OnInit {

    private _dates: string[] = [];
    private _prices: number[] = [];
    private _volumes: number[] = [];
    public loading = true;
    public chartOption: EChartsOption = {};

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
                ( result: any ) => {
                    result.reverse();
                    result.forEach( ( item: any ) => {
                        this._dates.push( moment( item.date ).format( 'DD MMM' ) );
                        this._prices.push( Math.round( item.close * 1000 ) / 1000 );
                        this._volumes.push( Math.round( item.volumeFrom / 1000 ) );
                    } );
                    this._setChart();
                    this.loading = false;
                }
            );
    }

    private _setChart(): void {
        const colors = ['#3f9623','#5470C655','#3f962333'];


        this.chartOption = {
            color: colors,

            title: [
                {
                    top: '2%',
                    left: 'center',
                    text: 'Market Price (CSPR/USD)',
                    textStyle: {
                        color: '#ccb',
                        fontFamily: "'M PLUS 1', sans-serif",
                        fontSize: '18px'
                    }

                },
            ],
            legend: {
                textStyle: {
                    color: '#ccb',
                    fontFamily: "'M PLUS 1', sans-serif",
                    fontSize: '12px',
                },
                bottom: 0
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    // prettier-ignore
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
                        formatter: '{value}M',
                        color: '#5470C6'
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
