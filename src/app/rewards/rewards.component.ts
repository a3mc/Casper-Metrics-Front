import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DataService } from '../services/data.service';
import * as moment from 'moment';

@Component( {
    selector: 'app-rewards',
    templateUrl: './rewards.component.html',
    styleUrls: ['./rewards.component.scss']
} )
export class RewardsComponent implements OnInit {

    public loading = true;
    public chartOption: EChartsOption = {};
    private _totalStaked: number[] = [];
    private _eraDates: string[] = [];
    private _rewards: number[] = []

    constructor(
        private _dataService: DataService
    ) {
    }

    ngOnInit(): void {
        this._dataService.eraSubject$.subscribe(
            ( result: any ) => {
                this._eraDates = result.map( ( era: any ) => moment( era.start ).format( 'D MMM') );
                this._totalStaked = result.map( ( era: any ) => era.validatorsWeights );
                this._rewards = result.map( ( era: any ) => era.rewards );
                this._setChart();
                this.loading = false;
            }
        );
    }

    private _setChart(): void {
        this.chartOption = {
            // Make gradient line here
            visualMap: [
                {
                    show: false,
                    type: 'continuous',
                    seriesIndex: 0,
                    dimension: 0,
                },
                {
                    show: false,
                    type: 'continuous',
                    seriesIndex: 1,
                    dimension: 2,
                }
            ],

            title: [
                {
                    top: '2%',
                    left: 'center',
                    text: 'Rewards last 14 days',
                    textStyle: {
                        color: '#ccb',
                        fontFamily: "'M PLUS 1', sans-serif",
                        fontSize: '18px'
                    }

                },
                {
                    top: '50%',
                    left: 'center',
                    text: 'Total stake bonded last 14 days',
                    textStyle: {
                        color: '#ccb',
                        fontFamily: "'M PLUS 1', sans-serif",
                        fontSize: '18px'
                    }
                }
            ],
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#ddc',
                shadowColor: '#0006',
                shadowBlur: 5,
                shadowOffsetX: 5,
                shadowOffsetY: 5,
                showDelay: 1000,
            },
            xAxis: [
                {
                    data: this._eraDates
                },
                {
                    data: this._eraDates,
                    gridIndex: 1
                }
            ],
            yAxis: [
                {
                    min: Math.min( ... this._rewards ),
                    max: Math.max( ... this._rewards ),
                },
                {
                    gridIndex: 1,
                    min: Math.min( ... this._totalStaked ),
                    max: Math.max( ... this._totalStaked ),
                    scale: true
                }
            ],
            grid: [
                {
                    bottom: '60%'
                },
                {
                    top: '60%'
                }
            ],
            series: [
                {
                    type: 'line',
                    showSymbol: false,
                    data: this._rewards,
                },
                {
                    type: 'line',
                    showSymbol: false,
                    data: this._totalStaked,
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                }
            ]
        };

    }

}
