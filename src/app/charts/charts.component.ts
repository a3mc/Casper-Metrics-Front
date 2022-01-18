import { Component, ViewEncapsulation } from '@angular/core';
import { fromEvent, Subscription, tap, throttleTime } from "rxjs";
import { DataService } from "../services/data.service";

@Component( {
	selector: 'app-charts',
	templateUrl: './charts.component.html',
	styleUrls: ['./charts.component.scss'],
	encapsulation: ViewEncapsulation.None
} )
export class ChartsComponent {

	public showMenu = false;
	private _eventSub: Subscription | undefined;

	constructor(
		private _dataService: DataService
	) {
	}

	ngOnInit(): void {
		this._dataService.getLastEra();

		this._eventSub = fromEvent( window, 'scroll' ).pipe(
			throttleTime( 50 ),
			tap( event => this._scroll() )
		).subscribe();

		setTimeout( () => { this._scroll(); }, 1000 );
	}

	ngOnDestroy(): void {
		this._eventSub?.unsubscribe();
	}

	private _scroll(): void {
		const verticalOffset = document.documentElement.scrollTop || document.body.scrollTop || 0;
		this.showMenu = verticalOffset > 300;
	}
}
