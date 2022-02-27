import { Component, OnInit } from '@angular/core';
import { EChartsOption } from "echarts";
import { Subscription } from "rxjs";
import { ApiClientService } from "../services/api-client.service";
import { DataService } from "../services/data.service";
import * as moment from "moment";

@Component( {
    selector: 'app-circulating',
    templateUrl: './circulating.component.html',
    styleUrls: ['./circulating.component.scss']
} )
export class CirculatingComponent implements OnInit {

    public loading = true;
    public chartOption: EChartsOption = {};
    public showInfo = false;

    private _erasSub: Subscription | undefined;
    private _circulating: number[] = [];
    private _total: number[] = [];
    private _dates: string[] = [];

    constructor(
        private _apiClientService: ApiClientService,
        private _dataService: DataService
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
    }

    public chartClick( event: any ): void {
        if ( event.dataIndex !== undefined ) {
            this._dataService.selectedEra = event.dataIndex;
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
                    this._circulating.push( era.circulatingSupply );
                    this._total.push( era.totalSupply );
                } );
                this._setChart();
                this.loading = false;
            } );
    }

    private _reset() {
        this._dates = [];
        this._circulating = [];
    }

    private _setChart(): void {
        this.chartOption = {
            legend: {
                textStyle: {
                    color: '#ccb',
                    fontFamily: "'M PLUS 1', sans-serif",
                    fontSize: '12px',
                },
                top: '20px',
                data: ['Circulating Supply', 'Total Supply'],
                selected: { 'Circulating Supply': true, 'Total Supply': false }
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
                top: '60px',
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
                    splitLine: {
                        lineStyle: {
                            color: '#444'
                        }
                    }
                }
            ],
            series: [
                {
                    name: 'Circulating Supply',
                    type: 'line',
                    smooth: true,
                    lineStyle: {
                        width: 2,
                        color: 'green'
                    },
                    data: this._circulating,
                    showSymbol: false,
                },
                {
                    name: 'Total Supply',
                    type: 'line',
                    smooth: true,
                    lineStyle: {
                        width: 2,
                        color: '#5470C699'
                    },
                    data: this._total,
                    showSymbol: false,
                }
            ]
        };
    }
}
