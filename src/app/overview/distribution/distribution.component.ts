import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { EChartsOption } from 'echarts';
import {take} from "rxjs";
import {ApiClientService} from "../../services/api-client.service";

@Component( {
    selector: 'app-distribution',
    templateUrl: './distribution.component.html',
    styleUrls: ['./distribution.component.scss']
} )
export class DistributionComponent implements OnInit {

    private _circulating = 0;
    private _circulatingPercent = 0;
    private _lockedPercent = 0;
    private _total = 0;
    public loading = true;
    public chartOption: EChartsOption = {};

    constructor(
        private _apiClientService: ApiClientService
    ) {
    }

    ngOnInit(): void {
        this._apiClientService.get( '/era' )
            .pipe( take( 1 ) )
            .subscribe(
            ( result: any ) => {
                this._circulating = result[0].circulatingSupply;
                this._total = result[0].totalSupply;
                this._circulatingPercent = (this._circulating / this._total ) * 100;
                this._lockedPercent = ( this._total - this._circulating ) / this._total * 100;
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
                    text: 'Token Distribution',
                    textStyle: {
                        color: '#ccb',
                        fontFamily: "'M PLUS 1', sans-serif",
                        fontSize: '18px'
                    }

                },
            ],
            legend: {
                bottom: '0%',
                left: 'center',
                textStyle: {
                    color: '#ccb',
                    fontFamily: "'M PLUS 1', sans-serif",
                    fontSize: '12px',
                }
            },
            series: [
                {
                    name: 'CSPR Distribution',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: true,
                    color: ['green', '#707054'],
                    label: {
                        show: false,
                        position: 'center',
                        fontSize: '20px'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '24',
                            fontWeight: 'bold',
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        {
                            value: Math.round( this._circulatingPercent ),
                            name: 'Circulating Supply ' + Math.round( this._circulatingPercent ) + '%',
                        },
                        {
                            value:Math.round( this._lockedPercent ),
                            name: 'Locked ' + Math.round( this._lockedPercent ) + '%',
                        },

                    ]
                }
            ]
        };
    }

}
