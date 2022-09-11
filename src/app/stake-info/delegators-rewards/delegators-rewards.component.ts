import { Component, OnInit } from '@angular/core';
import { ApiClientService } from "../../services/api-client.service";
import { take } from "rxjs";
import * as moment from "moment";
import { DataService } from "../../services/data.service";

@Component( {
    selector: 'app-delegators-rewards',
    templateUrl: './delegators-rewards.component.html',
    styleUrls: ['./delegators-rewards.component.scss']
} )
export class DelegatorsRewardsComponent implements OnInit {

    public loading = true;
    public showInfo = true;
    public chartOption: any;
    public chartOptionHistorical: any;
    public validators: any = [{
        name: 'ART3MIS.CLOUD',
        address: '01ba1dcfbe8dba48b88674bb007c000391c0ea36b5d80570c113a42a9823d702c2',
    }];
    // 01a60e0885f4968dd3107e088b4cb5798af665859b769bc1aa86909a5b67f66a66
    public selectedValidator: any = null;
    public selectedDelegator: any = null;
    public error: string | null = null;
    public rewardsInfo: any = null
    public data: any[] = [];
    public dates: string[] = [];
    public eras: number[] = [];
    public rewards: number[] = [];
    public rewardsEra: number[] = [];
    public rewardsUsd: number[] = [];
    public rewardsUsdEra: number[] = [];
    public rewardsUsdCurrent: number[] = [];
    public rewardsUsdEraCurrent: number[] = [];
    public price: number = 0;

    constructor(
        private _apiClientService: ApiClientService,
        private _dataService: DataService,
    ) {
    }

    ngOnInit(): void {
        this.error = null
    }

    // Open close info panel.
    public toggleInfo(): void {
        this.showInfo = !this.showInfo;
    }

    // Handle chart click.
    public chartClick( event: any ): void {
        // if ( event.dataIndex !== undefined ) {
        //     console.log( event.dataIndex, event )
        //     //this._dataService.selectedEra = event.dataIndex;
        //     this.rewardsInfo = this.data.find( era => era.eraId === this.eras[event.dataIndex] );
        //     console.log( this.rewardsInfo )
        //     this.showInfo = true;
        // }
    }

    // Get the delegators rewards for the selected validator.
    public showDelegator(): void {
        this._apiClientService.get(
            '/delegators?delegator=' + this.selectedDelegator + '&validator=' + this.selectedValidator
        )
            .pipe( take( 1 ) )
            .subscribe( ( data: any ) => {
                    this._reset();
                    if ( !data.length ) {
                        this.error = 'No data found';
                        return;
                    }
                    let rewards = 0;
                    let usdRewards = 0;
                    this.price = this._dataService.price;

                    data.sort( ( a: any, b: any ) => a.eraId - b.eraId );
                    this.data = data;
                    data.forEach( ( era: any ) => {
                        rewards += Number( era.amount );
                        if ( usdRewards === 0 && era.usdAmount !== 0 ) {
                            const firstPrice = era.usdAmount / ( era.amount / 1000000000 );
                            usdRewards = Number( era.usdAmount );
                            usdRewards = ( rewards * firstPrice ) / 1000000000;
                        } else {
                            usdRewards += Number( era.usdAmount );
                        }

                        this.eras.push( era.eraId );
                        this.dates.push( moment( era.created_at ).format( 'DD MMM YYYY' ) );

                        this.rewards.push( rewards );
                        this.rewardsEra.push( era.amount );
                        this.rewardsUsd.push( usdRewards );
                        this.rewardsUsdEra.push( era.usdAmount );
                        this.rewardsUsdCurrent.push( rewards * this.price );
                        this.rewardsUsdEraCurrent.push( era.amount * this.price );
                    } );
                    this._setChart();
                    this.loading = false;
                }, ( error: any ) => {
                    console.warn( error );
                    this.error = 'No data found';
                }
            );
    }

    // Default values for a new search.
    private _reset() {
        this.data = [];
        this.error = null;
        this.dates = [];
        this.rewards = [];
        this.rewardsUsd = [];
        this.rewardsUsdCurrent = [];
        this.rewardsEra = [];
        this.rewardsUsdEra = [];
    }

    // Set the chart options.
    private _setChart(): void {
        this.chartOption = {
            colors: ['green', 'yellow', 'blue', 'cyan'],
            legend: {
                textStyle: {
                    color: '#ccb',
                    fontFamily: "'M PLUS 1', sans-serif",
                    fontSize: '12px',
                },
                top: '20px',
            },
            data: [
                'CSPR',
                'USD (current price)',
                'CSPR (per era)',
                'USD (per era, current price)',
            ],
            selected: {
                'CSPR': true,
                'USD (current price)': true,
                'CSPR (per era)': true,
                'USD (per era, current price)': true
            },
            dataZoom: [
                {
                    start: 0,
                    end: 100
                }
            ],
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#fffc',
                formatter: ( params: any ) => {

                    const cspr = params.filter( ( param: any ) => param.seriesName === 'CSPR' );
                    const usd = params.filter( ( param: any ) => param.seriesName === 'USD (current price)' );
                    const csprEra = params.filter( ( param: any ) => param.seriesName === 'CSPR (per era)' );
                    const usdEra = params.filter( ( param: any ) => param.seriesName === 'USD (per era, current price)' );

                    let text = '';

                    if ( cspr.length ) {
                        text += `<b>CSPR:</b> ${ ( cspr[0].value / 1000000000 ).toFixed( 4 ) } <br>`;
                    }
                    if ( usd.length ) {
                        text += `<b>USD (current price):</b> $${ ( usd[0].value / 1000000000 ).toFixed( 4 ) }<br>`;
                    }
                    if ( csprEra.length ) {
                        text += `<b>CSPR (per era):</b> ${ ( csprEra[0].value / 1000000000 ).toFixed( 4 ) } <br>`;
                    }
                    if ( usdEra.length ) {
                        text += `<b>USD (per era, current price):</b> $${ (usdEra[0].value / 1000000000).toFixed( 4 )}`;
                    }

                    return text;
                }
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
                    data: this.dates
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
                    },
                    axisLabel: {
                        formatter: ( value: any ) => {
                            return Math.round( value / 1000000000 ).toFixed( 2 )
                        }
                    },
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
                    axisLabel: {
                        formatter: ( value: any ) => {
                            return '$' + ( value / 1000000000 ).toFixed( 2 )
                        }
                    },
                },
                {
                    type: 'value',
                    min: 'dataMin',
                    max: 'dataMax',
                    position: 'left',
                    splitLine: {
                        lineStyle: {
                            color: '#444'
                        }
                    },
                    axisLabel: {
                        formatter: ( value: any ) => {
                            return Math.round( value / 1000000000 ).toFixed( 2 )
                        }
                    },
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
                    axisLabel: {
                        formatter: ( value: any ) => {
                            return '$' + ( value / 1000000000 ).toFixed( 2 )
                        }
                    },
                },
            ],
            series: [
                {
                    name: 'CSPR',
                    type: 'line',
                    smooth: false,
                    color: 'yellow',
                    lineStyle: {
                        width: 2,
                        color: 'yellow',
                    },
                    data: this.rewards,
                    showSymbol: false,
                },
                {
                    name: 'USD (current price)',
                    type: 'line',
                    smooth: false,
                    color: 'green',
                    lineStyle: {
                        width: 2,
                        color: 'blue',
                    },
                    data: this.rewardsUsdCurrent,
                    showSymbol: false,
                    yAxisIndex: 1,
                },
                {
                    name: 'CSPR (per era)',
                    type: 'line',
                    smooth: false,
                    color: 'yellow',
                    lineStyle: {
                        width: 1,
                        color: 'cyan',
                    },
                    data: this.rewardsEra,
                    showSymbol: false,
                },
                {
                    name: 'USD (per era, current price)',
                    type: 'line',
                    smooth: false,
                    color: 'pink',
                    lineStyle: {
                        width: 1,
                        color: 'pink',
                    },
                    data: this.rewardsUsdEraCurrent,
                    showSymbol: false,
                    yAxisIndex: 1,
                },
            ]
        };

        this.chartOptionHistorical = {
            colors: ['cyan', 'navy', 'pink'],
            legend: {
                textStyle: {
                    color: '#ccb',
                    fontFamily: "'M PLUS 1', sans-serif",
                    fontSize: '12px',
                },
                top: '20px'
            },
            data: [
                'CSPR',
                'USD (historical)',
                'CSPR (per era)',
                'USD (per era, historical)',
            ],
            selected: {
                'CSPR': true,
                'USD (historical)': true,
                'CSPR (per era)': false,
                'USD (per era, historical)': false,
            },
            dataZoom: [
                {
                    start: 0,
                    end: 100
                }
            ],
            tooltip: {
                trigger: 'axis',
                backgroundColor: '#fffc',
                formatter: ( params: any ) => {
                    const cspr = params.filter( ( p: any ) => p.seriesName === 'CSPR' );
                    const usd = params.filter( ( p: any ) => p.seriesName === 'USD (historical)' );
                    const csprEra = params.filter( ( p: any ) => p.seriesName === 'CSPR (per era)' );
                    const usdEra = params.filter( ( p: any ) => p.seriesName === 'USD (per era, historical)' );

                    let text = '';

                    if ( cspr && cspr.length ) {
                        text += `<b>CSPR:</b> ${ ( cspr[0].value / 1000000000 ).toFixed( 4 ) } <br>`;
                    }
                    if ( usd && usd.length ) {
                        text += `<b>USD (historical):</b> $${ ( usd[0].value  ).toFixed( 4 ) } <br>`;
                    }
                    if ( csprEra && csprEra.length ) {
                        text += `<b>CSPR (per era):</b> ${ ( csprEra[0].value / 1000000000 ).toFixed( 4 ) } <br>`;
                    }
                    if ( usdEra && usdEra.length ) {
                        text += `<b>USD (per era, historical):</b> $${ ( usdEra[0].value  ).toFixed( 4 ) }`;
                    }

                    return text;
                }
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
                    data: this.dates
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
                    },
                    axisLabel: {
                        formatter: ( value: any ) => {
                            return Math.round( value / 1000000000 ).toFixed( 2 )
                        }
                    },
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
                    axisLabel: {
                        formatter: ( value: any ) => {
                            return '$' + value.toFixed( 2 )
                        }
                    },
                },
                {
                    type: 'value',
                    min: 'dataMin',
                    max: 'dataMax',
                    position: 'left',
                    splitLine: {
                        lineStyle: {
                            color: '#444'
                        }
                    },
                    axisLabel: {
                        formatter: ( value: any ) => {
                            return Math.round( value / 1000000000 ).toFixed( 2 )
                        }
                    },
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
                    axisLabel: {
                        formatter: ( value: any ) => {
                            return '$' + value.toFixed( 2 )
                        }
                    },
                },
            ],
            series: [
                {
                    name: 'CSPR',
                    type: 'line',
                    smooth: false,
                    color: 'yellow',
                    lineStyle: {
                        width: 2,
                        color: 'yellow',
                    },
                    data: this.rewards,
                    showSymbol: false,
                },
                {
                    name: 'USD (historical)',
                    type: 'line',
                    smooth: false,
                    color: 'green',
                    lineStyle: {
                        width: 2,
                        color: 'green',
                    },
                    data: this.rewardsUsd,
                    showSymbol: false,
                    yAxisIndex: 1,
                },
                {
                    name: 'CSPR (per era)',
                    type: 'line',
                    smooth: false,
                    color: 'yellow',
                    lineStyle: {
                        width: 1,
                        color: 'cyan',
                    },
                    data: this.rewardsEra,
                    showSymbol: false,
                },
                {
                    name: 'USD (per era, historical)',
                    type: 'line',
                    smooth: false,
                    color: 'navy',
                    lineStyle: {
                        width: 1,
                        color: 'navy',
                    },
                    data: this.rewardsUsdEra,
                    showSymbol: false,
                    yAxisIndex: 1,
                },
            ]
        };
    }

}
