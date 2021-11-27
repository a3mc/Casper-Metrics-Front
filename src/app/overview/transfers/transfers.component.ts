import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DataService } from '../../services/data.service';

@Component( {
    selector: 'app-transfers',
    templateUrl: './transfers.component.html',
    styleUrls: ['./transfers.component.scss']
} )
export class TransfersComponent implements OnInit {

    private _transfers: number[] = [];
    private _deploys: number[] = [];
    public loading = true;
    public chartOption: EChartsOption = {};

    constructor(
        private _dataService: DataService
    ) {
    }

    ngOnInit(): void {
        this._dataService.eraSubject$.subscribe(
            ( result: any ) => {
                this._transfers = result.map( ( era: any ) => era.transfersCount );
                this._deploys = result.map( ( era: any ) => era.deploysCount );
                this._setChart();
                this.loading = false;
            }
        );
    }

    private _setChart(): void {
        this.chartOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                textStyle: {
                    color: '#ccb',
                    fontFamily: "'M PLUS 1', sans-serif",
                    fontSize: '12px',
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                }
            ],
            yAxis: [
                {
                    type: 'value'
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
                    data: this._transfers
                },
                {
                    name: 'Deploys',
                    type: 'bar',
                    stack: 'Ad',
                    emphasis: {
                        focus: 'series'
                    },
                    data: this._deploys
                }
            ]
        };
    }


}
