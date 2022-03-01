import { Component, OnDestroy, OnInit } from '@angular/core';
import { EChartsOption, graphic } from 'echarts';
import { DataService } from '../../services/data.service';
import * as moment from 'moment';
import { Subscription, take } from 'rxjs';
import { ApiClientService } from '../../services/api-client.service';

@Component( {
	selector: 'app-weights-full',
	templateUrl: './weights-full.component.html',
	styleUrls: ['./weights-full.component.scss']
} )
export class WeightsFullComponent implements OnInit, OnDestroy {

	public loading = true;
	public chartOption: EChartsOption = {};
	public showInfo = false;
	public weightsInfo: any = null;

	private _erasSub: Subscription | undefined;
	private _weights: number[] = [];
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
		this.weightsInfo = null;
	}

	public chartClick( event: any ): void {
		if ( event.dataIndex !== undefined ) {
			this._dataService.selectedEra = event.dataIndex;
			this.weightsInfo = this._dataService.eras.find( era => era.id === event.dataIndex );
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
					this._weights.push( era.validatorsWeights );
					this._deploys.push( era.deploysCount );
				} );
				this._setChart();
				this.loading = false;
			} );
	}

	private _reset() {
		this._dates = [];
		this._weights = [];
		this._deploys = [];
		this.weightsInfo = null;
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
					name: 'Total Staked',
					type: 'line',
					smooth: true,
					lineStyle: {
						width: 0
					},
					emphasis: {
						focus: 'series'
					},
					data: this._weights,
					showSymbol: false,
					areaStyle: {
						opacity: 0.8,
						color: new graphic.LinearGradient( 0, 0, 0, 1, [
							{
								offset: 0,
								color: 'rgb(55, 162, 255)'
							},
							{
								offset: 1,
								color: 'rgb(116, 21, 219)'
							}
						] )
					},
				}
			]
		};
	}


}
