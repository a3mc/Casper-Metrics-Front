import { Component, OnDestroy, OnInit } from '@angular/core';
import { EChartsOption, graphic  } from 'echarts';
import { DataService } from '../../services/data.service';
import * as moment from 'moment';
import { Subscription, take } from 'rxjs';
import { ApiClientService } from '../../services/api-client.service';

@Component( {
	selector: 'app-stake',
	templateUrl: './stake.component.html',
	styleUrls: ['./stake.component.scss']
} )
export class StakeComponent implements OnInit, OnDestroy {

	public loading = true;
	public chartOption: EChartsOption = {};
	public showInfo = false;

	private _erasSub: Subscription | undefined;
	private _staked: number[] = [];
	private _unbonded: number[] = [];
	private _dates: string[] = [];
	private _prices: number[] = [];
	private _volumes: number[] = [];

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

	private _loadEras() {
		if ( this._erasSub ) {
			this._erasSub.unsubscribe();
		}
		this._erasSub = this._dataService.eras$
			.subscribe( ( result: any ) => {
				this._reset();
				result.forEach( ( era: any ) => {
					this._dates.push( moment( era.end ).format( 'DD MMM' ) );
					this._staked.push( era.stakedThisEra );
					this._unbonded.push( - era.undelegatedThisEra );
				} );
				this._setChart();
				this.loading = false;
			} );
	}

	private _reset() {
		this._dates = [];
		this._staked = [];
		this._unbonded = [];
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
				top: '50px',
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
				}
			],
			series: [
				{
					name: 'Delegated',
					type: 'line',
					emphasis: {
						focus: 'series'
					},
					data: this._staked,
					lineStyle: {
						width: 0
					},
					smooth: true,
					areaStyle: {
						opacity: 0.8,
						color: new graphic.LinearGradient(0, 0, 0, 1, [
							{
								offset: 0,
								color: 'rgb(128, 255, 165)'
							},
							{
								offset: 1,
								color: 'rgb(1, 191, 236)'
							}
						])
					},
				},
				{
					name: 'Unbonded',
					type: 'line',
					emphasis: {
						focus: 'series'
					},
					data: this._unbonded,
					lineStyle: {
						width: 0
					},
					smooth: true,
					areaStyle: {
						opacity: 0.8,
						color: new graphic.LinearGradient(0, 0, 0, 1, [
							{
								offset: 0,
								color: 'rgb(255, 191, 0)'
							},
							{
								offset: 1,
								color: 'rgb(224, 62, 76)'
							}
						])
					},
				}
			]
		};
	}


}
