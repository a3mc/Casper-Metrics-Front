import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { DataService } from '../../services/data.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ApiClientService } from '../../services/api-client.service';

@Component( {
    selector: 'app-transfers-full',
    templateUrl: './transfers-full.component.html',
    styleUrls: ['./transfers-full.component.scss']
} )
export class TransfersFullComponent implements OnInit, OnDestroy {

    @Input( 'mode' ) public mode: string = '';

    public loading = true;
    public chartOption: EChartsOption = {};
    public showInfo = false;
    public transfersInfo: any = null;

    private _erasSub: Subscription | undefined;
    private _transfers: number[] = [];
    private _deploys: number[] = [];
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
        this.transfersInfo = null;
    }

    public chartClick( event: any ): void {
        if ( event.dataIndex !== undefined ) {
            this._dataService.selectedEra = event.dataIndex;
            this.transfersInfo = this._dataService.eras.find( era => era.id === event.dataIndex );
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
            .subscribe( ( result: any[] ) => {
                this._reset();
                let items = Object.assign( [], result );
                if ( this.mode !== 'full' ) {
                    items.reverse();
                    items = items.slice( 0, 168 ).reverse();
                }
                items.forEach( ( era: any ) => {
                    this._dates.push( moment( era.end ).format( 'DD MMM' ) );
                    this._transfers.push( era.transfersCount );
                    this._deploys.push( era.deploysCount );
                } );
                this._setChart();
                this.loading = false;
            } );
    }

    private _reset() {
        this._dates = [];
        this._transfers = [];
        this._deploys = [];
        this.transfersInfo = null;
    }

    private _setChart(): void {
        this.chartOption = {
            legend: {
                textStyle: {
                    color: '#ccb',
                    fontFamily: "'M PLUS 1', sans-serif",
                    fontSize: '12px',
                },
                top: '20px'
            },
            dataZoom: this.mode === 'full' ? [
                {
                    start: 90,
                    end: 100
                }
            ] : [],
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
                bottom: this.mode === 'full' ? '12%' : '4%',
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
                    color: 'green'
                }
            ]
        };
    }

}
