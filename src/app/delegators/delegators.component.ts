import { Component, OnDestroy, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ApiClientService } from "../services/api-client.service";
import { DataService } from "../services/data.service";

@Component( {
    selector: 'app-delegators',
    templateUrl: './delegators.component.html',
    styleUrls: ['./delegators.component.scss']
} )
export class DelegatorsComponent implements OnInit, OnDestroy {

    public loading = true;
    public chartOption: EChartsOption = {};
    public showInfo = false;
    public eraInfo: any = null;

    private _erasSub: Subscription | undefined;
    private _delegators: number[] = [];
    private _validators: number[] = [];
    private _dates: string[] = [];

    constructor(
        private _apiClientService: ApiClientService,
        private _dataService: DataService,
    ) {
    }

    ngOnInit(): void {
        this._loadEras();
    }

    ngOnDestroy(): void {
        if ( this._erasSub ) {
            this._erasSub.unsubscribe();
        }
    }

    public toggleInfo(): void {
        this.showInfo = !this.showInfo;
        this.eraInfo = null;
    }

    public chartClick( event: any ): void {
        if ( event.dataIndex !== undefined ) {
            this._dataService.selectedEra = event.dataIndex;
            this.eraInfo = this._dataService.eras.find( era => era.id === event.dataIndex );
            this.showInfo = true;
        }
    }

    public sliderChange() {
        this._loadEras();
    }

    private _loadEras() {
        if ( this._erasSub ) {
            this._erasSub.unsubscribe();
        }
        this._erasSub = this._dataService.eras$
            .subscribe( ( result: any ) => {
                this._reset();
                result.forEach( ( era: any ) => {
                    this._dates.push( moment( era.end ).format( 'DD MMM' ) );
                    this._delegators.push( era.delegatorsCount );
                    this._validators.push( era.validatorsCount );
                } );
                this._setChart();
                this.loading = false;
            } );
    }

    private _reset() {
        this._dates = [];
        this._delegators = [];
        this._validators = [];
        this.eraInfo = null;
    }

    private _setChart(): void {
        this.chartOption = {
            colors: ['green', 'blue'],
            legend: {
                textStyle: {
                    color: '#ccb',
                    fontFamily: "'M PLUS 1', sans-serif",
                    fontSize: '12px',
                },
                top: '20px'
            },
            data: [
                'Delegators',
                'Validators',
            ],
            selected: {
                'Delegators': true,
                'Validators': false,
            },
            dataZoom: [
                {
                    start: 90,
                    end: 100
                }
            ],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a798533'
                    }
                },
                backgroundColor: '#fffc'
            },
            grid: {
                top: window.innerWidth < 800 ? '90px' : '60px',
                left: '3%',
                right: '4%',
                bottom: '12%',
                containLabel: true,
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
                    max: 'dataMax',
                    position: 'left',
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
                    splitLine: {
                        lineStyle: {
                            color: '#444'
                        }
                    },
                }
            ],
            series: [
                {
                    name: 'Delegators',
                    type: 'line',
                    smooth: true,
                    color: 'yellow',
                    lineStyle: {
                        width: 2,
                        color: 'yellow',
                    },
                    data: this._delegators,
                    showSymbol: false,
                },
                {
                    name: 'Validators',
                    type: 'line',
                    smooth: false,
                    color: 'green',
                    lineStyle: {
                        width: 2,
                        color: 'green',
                    },
                    data: this._validators,
                    showSymbol: false,
                    yAxisIndex: 1,
                },
            ]
        };
    }


}
