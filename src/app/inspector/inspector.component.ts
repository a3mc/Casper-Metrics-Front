import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EChartsOption, graphic } from 'echarts';
import { ApiClientService } from '../services/api-client.service';
import { debounceTime, Subject, Subscription, take } from 'rxjs';
import { Options } from '@angular-slider/ngx-slider';
import * as moment from 'moment';
import { DataService } from "../services/data.service";

@Component( {
    selector: 'app-inspector',
    templateUrl: './inspector.component.html',
    styleUrls: ['./inspector.component.scss'],
} )
export class InspectorComponent implements OnInit, OnDestroy {

    public loading = true;
    public chartOption: EChartsOption = {};
    public chartOption2: EChartsOption = {};
    public lastEraId = 0;
    public showSingleSlider = false;
    public limit = 20;
    public count = 0;
    public showInfo = false;
    public eraId = 0;
    public eraStart = moment().format();
    public eraEnd = moment().format();
    public options: Options = {
        floor: 0,
        ceil: this.lastEraId,
    };
    public txInfo: any;
    public accountInfo: any;
    public showChartsLink = false;
    public searchText = 'account-hash-3f2fd443fb6bd8693f80083a3e50112e195542cbadc86598600b5aeb92535208';
    // create subject from searchText
    public searchText$ = new Subject<string>();
    public transfers: any[] = [];
    public balance: number = 0;
    public transfersToCount = 0;
    public transfersFromCount = 0;
    public transfersToSum = 0;
    public transfersFromSum = 0;
    public searchAccountHash: string = '';
    public searchAccountHex: string = '';
    public searchAccountName: string = '';
    public searchAccountComment: string = '';
    public knownAccounts: any[] = [];
    public searchPerformed = false;

    private _eraSub: Subscription | undefined;
    private _sliderSub: Subscription | undefined;
    private _searchSub: Subscription | undefined;
    private _selectedSub: Subscription | undefined;
    private _slider$: Subject<number> = new Subject();


    private _names: any[] = [];
    private _links: any[] = [];
    private _eraIds: number[] = [];
    private _lastClicked: any = null;
    private _transfersReceivedByEra: number[] = [];
    private _transfersSentByEra: number[] = [];


    constructor(
        private _apiClientService: ApiClientService,
        public dataService: DataService,
    ) {
    }

    ngOnInit(): void {
        this._reset();
        this._getLastCompletedEra();
        this.getKnownAccounts();

        if ( this._sliderSub ) this._sliderSub.unsubscribe();
        this._sliderSub = this._slider$.pipe( debounceTime( 200 ) )
            .subscribe( ( eraId: number ) => {
                this.filterTransfers( eraId );
            } );

        if ( this._searchSub ) this._searchSub.unsubscribe();
        this._searchSub = this.searchText$.pipe( debounceTime( 500 ) )
            .subscribe( () => {
                this._reset();
                this.getAccount( this.searchText );
            } );

    }

    private _reset(): void {
        this.searchPerformed = false;
        this._eraIds = [];
        this._lastClicked = null;
        this._transfersReceivedByEra = [];
        this._transfersSentByEra = [];
        this._names = [];
        this._links = [];
        this.transfers = [];
        this.txInfo = null;
        this.balance = 0;
        this.transfersToCount = 0;
        this.transfersFromCount = 0;
        this.transfersToSum = 0;
        this.transfersFromSum = 0;
        this.searchAccountHash = '';
        this.searchAccountHex = '';
        this.searchAccountName = '';
        this.searchAccountComment = '';
        this.accountInfo = null;
        this.showChartsLink = false;
        this.chartOption = {};
        this.chartOption2 = {};
    }

    public searchChanged( value: string = this.searchText ): void {
        this.searchText$.next( value );
    }

    private _getLastCompletedEra(): void {
        if ( this._eraSub ) {
            this._eraSub.unsubscribe();
        }
        this._eraSub = this.dataService.lastEra$
            .subscribe(
                ( result: any ) => {
                    if ( result ) {
                        this.options.ceil = result.id;
                        if ( !this.eraId ) {
                            this.eraId = result.id;
                            this.lastEraId = result.id;
                            this.showSingleSlider = true;
                            //this.getTransfers();
                        }
                    }
                }
            )
    }

    ngOnDestroy(): void {
        if ( this._eraSub ) this._eraSub.unsubscribe();
        if ( this._sliderSub ) this._sliderSub.unsubscribe();
        if ( this._selectedSub ) this._selectedSub.unsubscribe();
    }

    public sliderChange( eraId: number ) {
        this._slider$.next( eraId );
    }

    public filterTransfers( eraId: number ): void {
        this._links = [];
        this._names = [];
        this._setNamesLinks( this.transfers.filter( ( transfer: any ) => transfer.eraId <= eraId ) );

        this._setChart();
        if ( this._lastClicked ) {
            console.log( 'has last clicked? on filter', this._lastClicked );
            this.chartClick( this._lastClicked );
        }
    }

    public getAccount( account: string ): void {
        this._apiClientService.get(
            'account?account=' + account
        ).pipe( take( 1 ) )
            .subscribe(
                ( result: any ) => {
                    this.searchPerformed = true;
                    if ( result.statusCode && result.statusCode === 404 ) {
                        this._reset();
                        this.searchPerformed = true;
                        return;
                    }
                    this.searchAccountHash = result.hash;
                    this.searchAccountHex = result.hex;
                    this.searchAccountName = result.name;
                    this.searchAccountComment = result.comment;
                    this.getBalance( this.searchAccountHash );
                    this.getTransfers( this.searchAccountHash );
                }
            )
    }

    public getBalance( account: string ): void {
        this._apiClientService.get(
            'accountBalance?account=' + account
        ).pipe( take( 1 ) )
            .subscribe(
                ( result: any ) => {
                    this.balance = parseInt( result );
                }
            )
    }

    public getKnownAccounts(): void {
        this._apiClientService.get(
            'knownAccounts'
        ).pipe( take( 1 ) )
            .subscribe(
                ( result: any ) => {
                    this.knownAccounts = [...result];
                }
            )
    }

    public getTransfers( account: string = this.searchText ): void {
        this._apiClientService.get(
            '/transfersByAccountHash?account=' + account
        )
            .pipe(
                take( 1 )
            )
            .subscribe(
                ( result: any ) => {
                    this.count = result.count;
                    this.eraId = this.lastEraId;
                    this.transfers = Object.assign( [], result.transfers );
                    this.transfersToCount = result.countTo;
                    this.transfersFromCount = result.countFrom;
                    this.transfersToSum = parseInt( result.transfersToSum );
                    this.transfersFromSum = parseInt( result.transfersFromSum );

                    this._setNamesLinks( result.transfers );

                    // Create a range of numbers up to this.eraId
                    this._eraIds = Array.from( { length: this.eraId }, ( v, k ) => k + 1 );

                    // Count the number of transfers per era
                    this._eraIds.forEach( ( eraId: number ) => {
                        // Find all transfers for this era
                        const transfers = this.transfers.filter( ( item: any ) => item.eraId === eraId );
                        // Find transfers that toHash match searchText
                        const transfersTo = transfers.filter( ( item: any ) => item.toHash === this.searchText );
                        // Find transfers that fromHash match searchText
                        const transfersFrom = transfers.filter( ( item: any ) => item.fromHash === this.searchText );
                        // Sum the transfersTo
                        const sumTo = transfersTo.reduce( ( a: any, b: any ) => a + parseInt( b.denomAmount ), 0 );
                        // Sum the transfersFrom
                        const sumFrom = transfersFrom.reduce( ( a: any, b: any ) => a + parseInt( b.denomAmount ), 0 );
                        this._transfersReceivedByEra.push( sumTo );
                        this._transfersSentByEra.push( -sumFrom );
                    } );

                    this._setChart();
                    this._setChart2()

                    this.chartClick( {
                        data: {
                            id: this.searchAccountHash
                        }
                    } )

                    this.loading = false;
                }
            );
    }

    public chartClick( event: any ): void {

        this._lastClicked = event;

        // Filter transfers up to eraId
        const transfers = this.transfers.filter( ( item: any ) => item.eraId <= this.eraId );

        if ( event.data.id ) {
            let hex: string = '';

            const fromAccount = transfers.filter(
                transfer => transfer.fromHash === event.data.id
            );

            const fromAccountAmount = Math.round( fromAccount.reduce( ( a, b ) => {
                return a + parseInt( b.amount );
            }, 0 ) / 1000000000 );

            fromAccount.forEach( transfer => {
                if ( transfer.from && !hex ) hex = transfer.from;
            } );

            const toAccount = transfers.filter(
                transfer => transfer.toHash === event.data.id
            );

            const toAccountAmount = Math.round( toAccount.reduce( ( a, b ) => {
                return a + parseInt( b.amount );
            }, 0 ) / 1000000000 );

            toAccount.forEach( transfer => {
                if ( transfer.to && !hex ) hex = transfer.to;
            } );

            this.accountInfo = {
                accountHash: event.data.id.replace( /^dub-/, '' ),
                accountHashPure: event.data.id.replace( /^dub-/, '' ).replace( /account-hash-/, '' ),
                accountHex: hex,
                totalCount: fromAccount.length + toAccount.length,
                fromAccountCount: fromAccount.length,
                toAccountCount: toAccount.length,
                fromAmount: fromAccountAmount,
                toAmount: toAccountAmount,
                totalAmount: fromAccountAmount + toAccountAmount,
            }

            this.txInfo = null;
        } else {
            this.txInfo = event.data;
            this.txInfo.targetPure = this.txInfo.target.replace( /^dub-/, '' ).replace( /account-hash-/, '' )
            this.accountInfo = null;
        }
        this.showInfo = true;
    }

    private _setNamesLinks( transfers:any[] ): void {
        this._names = [];
        this._links = [];
        transfers.forEach( ( item: any ) => {
            if ( !this._names.some( node => node.id === item.fromHash ) ) {
                const knownName = this.knownAccounts.find( acc => acc.hash.toLowerCase() === item.fromHash.toLowerCase() );
                const nameObj: any = {
                    id: item.fromHash,
                    name: knownName?.name || this._shortenAddress( item.from || item.fromHash ),
                };
                if ( item.fromHash === this.searchAccountHash ) {
                    nameObj['itemStyle'] = { color: '#28c328', borderColor: '#fff', borderWidth: 2, shadowBlur: 10, shadowColor: '#fff'};
                }
                if ( knownName ) {
                    if ( !nameObj['itemStyle'] ) {
                        nameObj['itemStyle'] = {};
                    }
                    nameObj['itemStyle']['symbolSize'] = 50;
                    nameObj['itemStyle']['borderType'] = 'dotted';
                    nameObj['itemStyle']['borderWidth'] = 2;
                    nameObj['itemStyle']['borderColor'] = '#fe6';
                }
                this._names.push( nameObj );
            }
            if ( !this._names.some( node => node.id === item.toHash ) ) {
                const knownName = this.knownAccounts.find( acc => acc.hash.toLowerCase() === item.toHash.toLowerCase() );
                const nameObj: any = {
                    id: item.toHash,
                    name: knownName?.name || this._shortenAddress( item.to || item.toHash ),
                };
                if ( item.toHash === this.searchAccountHash ) {
                    nameObj['itemStyle'] = { color: '#28c328', borderColor: '#fff', borderWidth: 2, shadowBlur: 10, shadowColor: '#fff' };
                }
                if ( knownName ) {
                    if ( !nameObj['itemStyle'] ) {
                        nameObj['itemStyle'] = {};
                    }
                    nameObj['itemStyle']['symbolSize'] = 50;
                    nameObj['itemStyle']['borderType'] = 'dotted';
                    nameObj['itemStyle']['borderWidth'] = 2;
                    nameObj['itemStyle']['borderColor'] = '#fe6';
                }
                this._names.push( nameObj );
            }

            this._links.push(
                {
                    source: item.fromHash,
                    target: item.toHash,
                    value: parseInt( item.amount ) / 1000000000,
                    from: item.from,
                    to: item.to,
                    deployHash: item.deployHash,
                    timestamp: item.timestamp,
                    blockHeight: item.blockHeight,
                    eraId: this.eraId,
                },
            );

        } );
    }

    private _shortenAddress( address: string ): string {
        address = address.replace( /^account-hash-/, '#' );
        return address.substr( 0, 4 ) + '...' + address.substr( -4, 4 );
    }

    private _setChart(): void {
        this.chartOption = {
            tooltip: {
                formatter: ( params: any ) => {
                    if ( params.data.value ) {
                        return ( `${ Math.round( params.data.value * 100 ) / 100 } CSPR` )
                    }
                    return '';
                }
            },
            series: {
                type: 'sankey',
                layout: 'none',
                emphasis: {
                    focus: 'adjacency'
                },
                data: this._names,
                links: this._links,
                lineStyle: {
                    color: 'source'
                },
                label: {
                    formatter: '{b}'
                },
            }
        };
    }

    private _setChart2(): void {
        this.chartOption2 = {
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
                    start: 0,
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
                    data: this._eraIds
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
                }
            ],
            series: [
                {
                    name: 'Received CSPR',
                    type: 'line',
                    emphasis: {
                        focus: 'series'
                    },
                    data: this._transfersReceivedByEra,
                    lineStyle: {
                        width: 0
                    },
                    smooth: true,
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new graphic.LinearGradient( 0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgb(128, 255, 165)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(1, 191, 236)'
                            }
                        ] )
                    },
                },
                {
                    name: 'Sent CSPR',
                    type: 'line',
                    emphasis: {
                        focus: 'series'
                    },
                    data: this._transfersSentByEra,
                    lineStyle: {
                        width: 0
                    },
                    smooth: true,
                    showSymbol: false,
                    areaStyle: {
                        opacity: 0.8,
                        color: new graphic.LinearGradient( 0, 0, 0, 1, [
                            {
                                offset: 0,
                                color: 'rgb(255, 191, 0)'
                            },
                            {
                                offset: 1,
                                color: 'rgb(224, 62, 76)'
                            }
                        ] )
                    },
                }
            ]
        };
    }

}
