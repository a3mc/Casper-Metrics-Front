import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DataService } from '../services/data.service';
import * as moment from 'moment';
import {take} from "rxjs";
import {ApiClientService} from "../services/api-client.service";

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
        private _apiClientService: ApiClientService
    ) {
    }

    ngOnInit(): void {
        this._apiClientService.get( '/era?limit=192' )
            .pipe( take( 1 ) )
            .subscribe(
            ( result: any ) => {
                result.reverse();
                this._eraDates = result.map( ( era: any ) => moment( era.start ).format( 'D MMM') );
                this._totalStaked = result.map(
                    ( era: any ) => Math.round( era.validatorsWeights / 1000000 )
                );
                this._rewards = result.map(
                    ( era: any ) => Math.round( era.rewards / 1000 )
                );
                this._setChart();
                this.loading = false;
            }
        );
    }

    private _setChart(): void {
        this.chartOption = {
            title: [
                {
                    top: '0%',
                    left: 'center',
                    text: 'Rewards per Era',
                    textStyle: {
                        color: '#ccb',
                        fontFamily: "'M PLUS 1', sans-serif",
                        fontSize: '18px'
                    }

                },
                {
                    top: '53%',
                    left: 'center',
                    text: 'Total Stake Bonded',
                    textStyle: {
                        color: '#ccb',
                        fontFamily: "'M PLUS 1', sans-serif",
                        fontSize: '18px'
                    }
                }
            ],
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
                    min: 'dataMin',
                    max: 'dataMax',
                    axisLabel: {
                        formatter: '{value}K'
                    },
                },
                {
                    gridIndex: 1,
                    min: 'dataMin',
                    max: 'dataMax',
                    axisLabel: {
                        formatter: '{value}M'
                    },
                }
            ],
            grid: [
                {
                    top: '11%',
                    bottom: '55%',
                    left: '3%',
                    right: '4%',
                    containLabel: true
                },
                {
                    top: '64%',
                    bottom: '5%',
                    left: '3%',
                    right: '4%',
                    containLabel: true
                }
            ],
            series: [
                {
                    type: 'line',
                    showSymbol: false,
                    data: this._rewards,
                    //color: '#3f9623'
                },
                {
                    type: 'line',
                    showSymbol: false,
                    data: this._totalStaked,
                    xAxisIndex: 1,
                    yAxisIndex: 1,
                    color: '#3f9623'
                }
            ]
        };

    }

}
