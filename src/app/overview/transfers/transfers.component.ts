import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DataService } from '../../services/data.service';
import * as moment from 'moment';
import {ApiClientService} from "../../services/api-client.service";
import {take} from "rxjs";

@Component( {
    selector: 'app-transfers',
    templateUrl: './transfers.component.html',
    styleUrls: ['./transfers.component.scss']
} )
export class TransfersComponent implements OnInit {

    private _transfers: number[] = [];
    private _deploys: number[] = [];
    private _dates: string[] = [];
    public loading = true;
    public chartOption: EChartsOption = {};

    constructor(
        private _apiClientService: ApiClientService
    ) {
    }

    ngOnInit(): void {

        this._apiClientService.get( '/era?limit=192' )
            .pipe( take( 1 ) )
            .subscribe(
            ( result: any ) => {
                result.forEach( ( era: any ) => {
                    this._dates.push( moment( era.end ).format( 'DD MMM' ) );
                    this._transfers.push( era.transfersCount );
                    this._deploys.push( era.deploysCount );
                } );


                this._setChart();
                this.loading = false;
            }
        );
    }

    private _setChart(): void {
        this.chartOption = {
            title: [
                {
                    top: '2%',
                    left: 'center',
                    text: 'Transactions',
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
            grid: {
                left: '3%',
                right: '4%',
                bottom: '12%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: this._dates
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    min: 'dataMin',
                    max: 'dataMax'
                }
            ],
            series: [
                {
                    name: 'Transfers',
                    type: 'bar',
                    stack: 'Ad',
                    emphasis: {
                        focus: 'series'
                    },
                    data: this._transfers,
                    color: '#5470C655'
                },
                {
                    name: 'Deploys',
                    type: 'bar',
                    stack: 'Ad',
                    emphasis: {
                        focus: 'series'
                    },
                    data: this._deploys,
                    color: '#3f9623'
                }
            ]
        };
    }


}
