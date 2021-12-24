import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component( {
	selector: 'app-map-full',
	templateUrl: './map-full.component.html',
	styleUrls: ['./map-full.component.scss']
} )
export class MapFullComponent implements AfterViewInit {

	private map: any;
	public showInfo = false;

	constructor() {
	}

	ngAfterViewInit(): void {
		this.initMap();
	}

	public toggleInfo(): void {
		this.showInfo = !this.showInfo;
	}

	private initMap(): void {
		this.map = L.map( 'map', {
			center: [38, 20],
			zoom: 1
		} );
		const tiles = L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 4,
			minZoom: 2,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		} );

		tiles.addTo( this.map );

		this._addMarkers();
	}

	private _addMarkers(): void {
		const markersData: L.LatLngExpression[] = [
			[51.5, -0.09],
			[55.2, -0.16],
			[50.2, 4],
			[51.5, 12],
			[55.5, 36.2],
			[55.5, 37.8],
			[53.5, 32.1],
			[50.5, -60.1],
			[40.5, -70.1],
		];

		for ( const position of markersData ) {
			L.marker( position, {
				icon: L.divIcon( {
					className: 'validator-icon',
					iconSize: [8, 8],
				} ),
				riseOnHover: true
			}, ).addTo( this.map );
		}
	}
}
